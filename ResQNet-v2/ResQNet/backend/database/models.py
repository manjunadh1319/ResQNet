"""
SQLAlchemy ORM models.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, Text, DateTime
from database.db import Base


def generate_id() -> str:
    return str(uuid.uuid4())


class Emergency(Base):
    __tablename__ = "emergencies"

    id = Column(String, primary_key=True, default=generate_id, index=True)

    # Submitted by user
    disaster_type = Column(String, nullable=False)
    location = Column(String, nullable=False)
    victims = Column(Integer, default=0)
    severity = Column(String, nullable=False)  # Low / Medium / High / Critical
    description = Column(Text, default="")
    contact = Column(String, nullable=False)

    # AI generated (stored as JSON strings)
    disaster_analysis = Column(Text, default="")
    hospital = Column(Text, default="")
    rescue_team = Column(Text, default="")
    relief_resources = Column(Text, default="")
    communication_report = Column(Text, default="")
    execution_log = Column(Text, default="")

    created_at = Column(DateTime, default=datetime.utcnow)
