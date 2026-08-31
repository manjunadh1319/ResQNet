"""
API routes for the /emergency and /history endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database.db import get_db
from schemas.emergency import EmergencyCreate, EmergencyResponse, EmergencyListItem
from services import emergency_service

router = APIRouter(tags=["Emergency"])


@router.post("/emergency", response_model=EmergencyResponse, status_code=201)
def create_emergency(payload: EmergencyCreate, db: Session = Depends(get_db)):
    """Submit a new emergency report. Triggers the full AI agent workflow."""
    try:
        record = emergency_service.create_emergency(db, payload)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process emergency: {e}")
    return emergency_service.serialize_emergency(record)


@router.get("/history", response_model=list[EmergencyListItem])
def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """Return a paginated list of previously reported emergencies."""
    records = emergency_service.list_emergencies(db, skip, limit)
    return records


@router.get("/emergency/{emergency_id}", response_model=EmergencyResponse)
def get_emergency(emergency_id: str, db: Session = Depends(get_db)):
    """Return the full stored report for a single emergency."""
    record = emergency_service.get_emergency(db, emergency_id)
    if not record:
        raise HTTPException(status_code=404, detail="Emergency not found")
    return emergency_service.serialize_emergency(record)


@router.delete("/emergency/{emergency_id}", status_code=200)
def delete_emergency(emergency_id: str, db: Session = Depends(get_db)):
    """Delete a stored emergency report."""
    success = emergency_service.delete_emergency(db, emergency_id)
    if not success:
        raise HTTPException(status_code=404, detail="Emergency not found")
    return {"message": "Emergency deleted successfully", "id": emergency_id}
