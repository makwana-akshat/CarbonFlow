from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from app.api.dependencies import get_current_user_id
from app.services.contract_service import ContractService
from app.schemas.contracts import AuditContractResponse, ComplianceSummaryResponse

router = APIRouter()
contract_service = ContractService()

@router.get("", response_model=List[AuditContractResponse])
def get_contracts(clerk_user_id: str = Depends(get_current_user_id)):
    """Returns all audit contracts for the current user."""
    try:
        return contract_service.get_all_contracts(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/compliance-summary", response_model=ComplianceSummaryResponse)
def get_compliance_summary(clerk_user_id: str = Depends(get_current_user_id)):
    """Returns compliance summary counts."""
    try:
        return contract_service.get_compliance_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
