import hashlib
import json
from datetime import datetime, date
from uuid import UUID
from app.schemas.contract import ContractCreate, ContractStatusUpdate, ContractVersionCreate

VALID_STATUSES = ['Draft', 'Pending Review', 'Approved', 'Active', 'Completed', 'Expired', 'Cancelled']

def generate_audit_hash(contract_data: dict) -> str:
    # Deterministic canonical serialization
    canonical = {
        "contract_id": contract_data.get("contract_id"),
        "supplier_id": str(contract_data.get("supplier_user_id")),
        "buyer_id": str(contract_data.get("buyer_user_id")),
        "volume": contract_data.get("volume"),
        "price_per_ton": contract_data.get("price_per_ton"),
        "purity": contract_data.get("purity"),
        "iso_standard": contract_data.get("iso_standard"),
        "version": contract_data.get("version")
    }
    serialized = json.dumps(canonical, sort_keys=True)
    return hashlib.sha256(serialized.encode('utf-8')).hexdigest()

class ContractService:
    def __init__(self, supabase):
        self.supabase = supabase

    def create_contract(self, user_id: str, payload: ContractCreate):
        # Verify order
        order_res = self.supabase.table("orders").select("*, buyer:users!buyer_id(id, first_name, last_name), supplier:users!supplier_id(id, first_name, last_name)").eq("id", str(payload.order_id)).execute()
        if not order_res.data:
            raise ValueError("Order not found")
        order = order_res.data[0]

        # Verify access
        if str(order["buyer_id"]) != user_id and str(order["supplier_id"]) != user_id:
            raise PermissionError("Not authorized to create a contract for this order")
            
        if order["status"] == "cancelled":
            raise ValueError("Cannot create contract for cancelled order")

        # Generate unique reference
        contract_ref = f"CF-CTR-{datetime.now().year}-{str(payload.order_id).split('-')[0]}"
        
        # Check if exists
        existing = self.supabase.table("audit_contracts").select("id").eq("contract_id", contract_ref).execute()
        if existing.data:
            raise ValueError("Contract already exists for this order")

        # Get listing to get grade if needed
        listing = {}
        if order.get("listing_id"):
            listing_res = self.supabase.table("co2_listings").select("co2_grade, purity_percentage").eq("id", order["listing_id"]).execute()
            listing = listing_res.data[0] if listing_res.data else {}

        volume_str = f"{order['volume']:,.0f} t"
        price_str = f"₹{float(order['total_value']) / float(order['volume']):,.0f}/t"
        
        # Format contract value
        val_inr = float(order['total_value'])
        if val_inr >= 10000000:
            val_str = f"₹{val_inr/10000000:.2f} Cr"
        elif val_inr >= 100000:
            val_str = f"₹{val_inr/100000:.2f} L"
        else:
            val_str = f"₹{val_inr:,.0f}"

        supplier_name = f"{order['supplier'].get('first_name', '')} {order['supplier'].get('last_name', '')}".strip() or "Supplier"
        buyer_name = f"{order['buyer'].get('first_name', '')} {order['buyer'].get('last_name', '')}".strip() or "Buyer"

        contract_data = {
            "contract_id": contract_ref,
            "supplier_user_id": order["supplier_id"],
            "buyer_user_id": order["buyer_id"],
            "supplier_name": supplier_name,
            "buyer_name": buyer_name,
            "volume": volume_str,
            "volume_tonnes": float(order["volume"]),
            "contract_value": val_str,
            "contract_value_inr": val_inr,
            "status": "Draft",
            "version": "v1",
            "purity": f"≥{listing.get('purity_percentage', 99.0)}%",
            "price_per_ton": price_str,
            "delivery_date": datetime.now().strftime("%Y-%m-%d"),
            "transportation_terms": f"{order['transport_mode']} terms apply",
            "payment_terms": "Standard escrow net 30",
            "iso_standard": "ISO 14064-2 Pipeline Custody Transfer",
        }
        
        contract_data["audit_hash"] = generate_audit_hash(contract_data)
        
        # Insert Contract
        c_res = self.supabase.table("audit_contracts").insert(contract_data).execute()
        contract = c_res.data[0]
        
        # Insert Version 1
        self.supabase.table("contract_versions").insert({
            "contract_id": contract["id"],
            "version": "v1",
            "is_current": True,
            "summary": "Initial draft generated from marketplace order",
            "effective_date": contract_data["delivery_date"],
            "author": "CarbonFlow Clearing Engine",
            "changes": ["Initial baseline execution."]
        }).execute()

        # Insert Timeline Event
        self.supabase.table("contract_timeline_events").insert({
            "contract_id": contract["id"],
            "step": 1,
            "label": "Contract Created",
            "timestamp_str": datetime.now().strftime("%d %b %Y, %H:%M"),
            "actor": "System",
            "role": "Clearing Engine",
            "action": "Drafted from marketplace order confirmation",
            "status": "completed"
        }).execute()

        return self.get_contract(user_id, contract["id"])

    def get_contract(self, user_id: str, contract_uuid: str):
        c_res = self.supabase.table("audit_contracts").select("*").eq("id", contract_uuid).execute()
        if not c_res.data:
            return None
        c = c_res.data[0]
        
        if c["buyer_user_id"] != user_id and c["supplier_user_id"] != user_id:
            raise PermissionError("Not authorized to view this contract")

        v_res = self.supabase.table("contract_versions").select("*").eq("contract_id", c["id"]).order("created_at", desc=True).execute()
        t_res = self.supabase.table("contract_timeline_events").select("*").eq("contract_id", c["id"]).order("step").execute()

        expected_hash = generate_audit_hash(c)
        if expected_hash != c.get("audit_hash"):
            c["audit_hash_warning"] = "Hash mismatch detected!"

        c["timeline"] = t_res.data
        c["version_history"] = v_res.data
        return c

    def get_all_contracts(self, user_id: str):
        c_res = self.supabase.table("audit_contracts").select("*").or_(f"buyer_user_id.eq.{user_id},supplier_user_id.eq.{user_id}").order("created_at", desc=True).execute()
        
        results = []
        for c in c_res.data:
            v_res = self.supabase.table("contract_versions").select("*").eq("contract_id", c["id"]).order("created_at", desc=True).execute()
            t_res = self.supabase.table("contract_timeline_events").select("*").eq("contract_id", c["id"]).order("step").execute()
            c["timeline"] = t_res.data
            c["version_history"] = v_res.data
            results.append(c)
            
        return results

    def update_status(self, user_id: str, contract_uuid: str, payload: ContractStatusUpdate):
        c = self.get_contract(user_id, contract_uuid)
        if not c:
            raise ValueError("Contract not found")
            
        if payload.status not in VALID_STATUSES:
            raise ValueError("Invalid status")
            
        curr = c["status"]
        if curr in ["Completed", "Cancelled", "Expired"]:
            raise ValueError(f"Cannot transition from terminal state {curr}")
            
        if curr == "Draft" and payload.status not in ["Pending Review", "Cancelled"]:
            raise ValueError("Draft can only transition to Pending Review or Cancelled")
            
        self.supabase.table("audit_contracts").update({"status": payload.status}).eq("id", contract_uuid).execute()

        steps = len(c["timeline"])
        self.supabase.table("contract_timeline_events").insert({
            "contract_id": contract_uuid,
            "step": steps + 1,
            "label": f"Status updated to {payload.status}",
            "timestamp_str": datetime.now().strftime("%d %b %Y, %H:%M"),
            "actor": "User",
            "role": "Authorized Party",
            "action": f"Transitioned from {curr} to {payload.status}",
            "status": "completed"
        }).execute()
        
        return self.get_contract(user_id, contract_uuid)

    def create_version(self, user_id: str, contract_uuid: str, payload: ContractVersionCreate):
        c = self.get_contract(user_id, contract_uuid)
        if not c:
            raise ValueError("Contract not found")
            
        if c["status"] in ["Completed", "Cancelled", "Expired"]:
            raise ValueError("Cannot amend a closed contract")

        curr_v_num = int(c["version"].replace("v", ""))
        new_v = f"v{curr_v_num + 1}"

        update_data = {"version": new_v}
        if payload.volume: update_data["volume"] = payload.volume
        if payload.price_per_ton: update_data["price_per_ton"] = payload.price_per_ton
        if payload.purity: update_data["purity"] = payload.purity
        if payload.delivery_date: update_data["delivery_date"] = str(payload.delivery_date)
        if payload.transportation_terms: update_data["transportation_terms"] = payload.transportation_terms
        if payload.payment_terms: update_data["payment_terms"] = payload.payment_terms

        temp_c = {**c, **update_data}
        update_data["audit_hash"] = generate_audit_hash(temp_c)

        self.supabase.table("contract_versions").update({"is_current": False}).eq("contract_id", contract_uuid).execute()
        
        self.supabase.table("contract_versions").insert({
            "contract_id": contract_uuid,
            "version": new_v,
            "is_current": True,
            "summary": f"Amendment to {new_v}",
            "effective_date": update_data.get("delivery_date", c["delivery_date"]),
            "author": "Authorized Party",
            "changes": payload.changes
        }).execute()

        self.supabase.table("audit_contracts").update(update_data).eq("id", contract_uuid).execute()

        steps = len(c["timeline"])
        self.supabase.table("contract_timeline_events").insert({
            "contract_id": contract_uuid,
            "step": steps + 1,
            "label": "Version Created",
            "timestamp_str": datetime.now().strftime("%d %b %Y, %H:%M"),
            "actor": "User",
            "role": "Authorized Party",
            "action": f"Amended to {new_v}",
            "status": "completed"
        }).execute()

        return self.get_contract(user_id, contract_uuid)

    def get_compliance_summary(self, user_id: str):
        contracts = self.get_all_contracts(user_id)
        active = sum(1 for c in contracts if c["status"] == "Active")
        pending = sum(1 for c in contracts if c["status"] == "Pending Review")
        completed = sum(1 for c in contracts if c["status"] == "Completed")
        amended = sum(1 for c in contracts if c["version"] != "v1")
        
        return {
            "active_contracts": active,
            "pending_approval": pending,
            "completed": completed,
            "with_amendments": amended
        }
