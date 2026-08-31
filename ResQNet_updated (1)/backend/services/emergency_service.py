"""
Business logic layer: runs the AI agent workflow and persists / retrieves
Emergency records.
"""
import json
from sqlalchemy.orm import Session

from database.models import Emergency
from schemas.emergency import EmergencyCreate
from agents.graph import run_emergency_workflow


def _dump(obj) -> str:
    try:
        return json.dumps(obj)
    except Exception:
        return json.dumps({})


def _load(text: str, default=None):
    if default is None:
        default = {}
    if not text:
        return default
    try:
        return json.loads(text)
    except Exception:
        return default


def create_emergency(db: Session, payload: EmergencyCreate) -> Emergency:
    result_state = run_emergency_workflow(payload.model_dump())

    record = Emergency(
        disaster_type=payload.disaster_type,
        location=payload.location,
        victims=payload.victims,
        severity=payload.severity,
        description=payload.description,
        contact=payload.contact,
        disaster_analysis=_dump(result_state.get("disaster_analysis", {})),
        hospital=_dump(result_state.get("hospital", {})),
        rescue_team=_dump(result_state.get("rescue_team", {})),
        relief_resources=_dump(result_state.get("relief_resources_plan", {})),
        communication_report=_dump(result_state.get("communication_report", {})),
        execution_log=_dump(result_state.get("execution_log", [])),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_emergency(db: Session, emergency_id: str) -> Emergency | None:
    return db.query(Emergency).filter(Emergency.id == emergency_id).first()


def list_emergencies(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(Emergency)
        .order_by(Emergency.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def count_emergencies(db: Session) -> int:
    return db.query(Emergency).count()


def delete_emergency(db: Session, emergency_id: str) -> bool:
    record = get_emergency(db, emergency_id)
    if not record:
        return False
    db.delete(record)
    db.commit()
    return True


def serialize_emergency(record: Emergency) -> dict:
    return {
        "id": record.id,
        "disaster_type": record.disaster_type,
        "location": record.location,
        "victims": record.victims,
        "severity": record.severity,
        "description": record.description,
        "contact": record.contact,
        "disaster_analysis": _load(record.disaster_analysis),
        "hospital": _load(record.hospital),
        "rescue_team": _load(record.rescue_team),
        "relief_resources": _load(record.relief_resources),
        "communication_report": _load(record.communication_report),
        "execution_log": _load(record.execution_log, default=[]),
        "created_at": record.created_at,
    }
