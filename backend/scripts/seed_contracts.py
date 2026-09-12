import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

from supabase import create_client, Client
from app.core.config import settings
from app.schemas.contract import ContractCreate, ContractStatusUpdate, ContractVersionCreate
from app.services.contract_service import ContractService

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Missing SUPABASE credentials")
    sys.exit(1)

supabase: Client = create_client(url, key)
service = ContractService(supabase)

def seed():
    # Find an active order
    res = supabase.table("orders").select("*").limit(1).execute()
    if not res.data:
        print("No orders found to seed a contract.")
        return

    order = res.data[0]
    buyer_id = order["buyer_id"]
    
    print(f"Creating contract for order {order['id']}")
    
    payload = ContractCreate(order_id=order["id"])
    
    # This acts as user_id for the service
    try:
        contract = service.create_contract(buyer_id, payload)
        print(f"Contract created: {contract['contract_id']}")
    except ValueError as e:
        if "already exists" in str(e):
            print("Contract already exists, fetching existing...")
            contract_ref = f"CF-CTR-2026-{str(order['id']).split('-')[0]}"
            c_res = supabase.table("audit_contracts").select("id").eq("contract_id", contract_ref).execute()
            if c_res.data:
                contract = service.get_contract(buyer_id, c_res.data[0]["id"])
            else:
                print("Failed to fetch existing")
                return
        else:
            print(f"Error: {e}")
            return

    c_id = contract["id"]

    # Transition to pending review
    print("Transitioning to Pending Review...")
    service.update_status(buyer_id, c_id, ContractStatusUpdate(status="Pending Review"))
    
    # Create an amendment
    print("Amending Contract...")
    service.create_version(buyer_id, c_id, ContractVersionCreate(
        price_per_ton="₹4,600/t",
        changes=["Adjusted price due to transport costs", "Added late fee clause"]
    ))

    # Transition to Active
    print("Transitioning to Approved...")
    service.update_status(buyer_id, c_id, ContractStatusUpdate(status="Approved"))
    
    print("Transitioning to Active...")
    service.update_status(buyer_id, c_id, ContractStatusUpdate(status="Active"))

    print("Seed complete. Testing compliance summary...")
    print(service.get_compliance_summary(buyer_id))

if __name__ == "__main__":
    seed()
