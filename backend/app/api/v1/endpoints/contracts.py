from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.dependencies import get_current_user_id, get_supabase_client
from app.schemas.contract import (
    ContractCreate,
    ContractResponse,
    ContractStatusUpdate,
    ContractVersionCreate,
    ComplianceSummaryResponse
)
from app.services.contract_service import ContractService

router = APIRouter()

@router.post("", response_model=ContractResponse)
def create_contract(
    payload: ContractCreate,
    user_id: str = Depends(get_current_user_id),
    supabase = Depends(get_supabase_client)
):
    service = ContractService(supabase)
    try:
        return service.create_contract(user_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.get("", response_model=List[ContractResponse])
def get_contracts(
    user_id: str = Depends(get_current_user_id),
    supabase = Depends(get_supabase_client)
):
    service = ContractService(supabase)
    return service.get_all_contracts(user_id)

@router.get("/compliance-summary", response_model=ComplianceSummaryResponse)
def get_compliance_summary(
    user_id: str = Depends(get_current_user_id),
    supabase = Depends(get_supabase_client)
):
    service = ContractService(supabase)
    return service.get_compliance_summary(user_id)

@router.get("/{contract_id}", response_model=ContractResponse)
def get_contract(
    contract_id: str,
    user_id: str = Depends(get_current_user_id),
    supabase = Depends(get_supabase_client)
):
    service = ContractService(supabase)
    try:
        c = service.get_contract(user_id, contract_id)
        if not c:
            raise HTTPException(status_code=404, detail="Contract not found")
        return c
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.patch("/{contract_id}/status", response_model=ContractResponse)
def update_contract_status(
    contract_id: str,
    payload: ContractStatusUpdate,
    user_id: str = Depends(get_current_user_id),
    supabase = Depends(get_supabase_client)
):
    service = ContractService(supabase)
    try:
        return service.update_status(user_id, contract_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.post("/{contract_id}/version", response_model=ContractResponse)
def create_contract_version(
    contract_id: str,
    payload: ContractVersionCreate,
    user_id: str = Depends(get_current_user_id),
    supabase = Depends(get_supabase_client)
):
    service = ContractService(supabase)
    try:
        return service.create_version(user_id, contract_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
