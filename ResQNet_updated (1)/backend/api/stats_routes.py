"""
API routes for dashboard statistics, charts, and map data.
"""
from datetime import datetime, timedelta
from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from database.models import Emergency
from services.dataset_service import get_hospitals, get_rescue_teams

router = APIRouter(tags=["Statistics"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Aggregate statistics used by the dashboard cards and charts."""
    records = db.query(Emergency).all()

    total = len(records)
    high_priority = len([r for r in records if r.severity in ("High", "Critical")])

    today = datetime.utcnow().date()
    today_reports = len([r for r in records if r.created_at.date() == today])

    by_type = Counter(r.disaster_type for r in records)
    by_severity = Counter(r.severity for r in records)

    # Last 7 days timeline
    timeline = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        count = len([r for r in records if r.created_at.date() == day])
        timeline.append({"date": day.isoformat(), "count": count})

    return {
        "total_emergencies": total,
        "high_priority": high_priority,
        "total_hospitals": len(get_hospitals()),
        "total_rescue_teams": len(get_rescue_teams()),
        "today_reports": today_reports,
        "by_type": dict(by_type),
        "by_severity": dict(by_severity),
        "timeline": timeline,
    }


@router.get("/map-data")
def get_map_data(db: Session = Depends(get_db)):
    """Location data for the React Leaflet map: disasters, hospitals, rescue teams."""
    records = db.query(Emergency).order_by(Emergency.created_at.desc()).limit(50).all()

    disasters = [
        {
            "id": r.id,
            "type": r.disaster_type,
            "location": r.location,
            "severity": r.severity,
        }
        for r in records
    ]

    return {
        "disasters": disasters,
        "hospitals": get_hospitals(),
        "rescue_teams": get_rescue_teams(),
    }
