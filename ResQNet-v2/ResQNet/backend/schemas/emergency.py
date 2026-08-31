"""
Pydantic schemas used for request validation and response serialization.
"""
from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel, Field, field_validator


class EmergencyCreate(BaseModel):
    disaster_type: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=200)
    victims: int = Field(..., ge=0, le=1_000_000)
    severity: str = Field(..., min_length=2, max_length=20)
    description: str = Field(default="", max_length=2000)
    contact: str = Field(..., min_length=5, max_length=20)

    @field_validator("severity")
    @classmethod
    def validate_severity(cls, v: str) -> str:
        allowed = {"low", "medium", "high", "critical"}
        if v.lower() not in allowed:
            raise ValueError(f"severity must be one of {allowed}")
        return v.capitalize()

    @field_validator("contact")
    @classmethod
    def validate_contact(cls, v: str) -> str:
        cleaned = v.replace(" ", "").replace("-", "")
        if not cleaned.replace("+", "").isdigit():
            raise ValueError("contact must be a valid phone number")
        return v


class EmergencyResponse(BaseModel):
    id: str
    disaster_type: str
    location: str
    victims: int
    severity: str
    description: str
    contact: str

    disaster_analysis: Dict[str, Any] = {}
    hospital: Dict[str, Any] = {}
    rescue_team: Dict[str, Any] = {}
    relief_resources: Dict[str, Any] = {}
    communication_report: Dict[str, Any] = {}
    execution_log: list = []

    created_at: datetime

    class Config:
        from_attributes = True


class EmergencyListItem(BaseModel):
    id: str
    disaster_type: str
    location: str
    victims: int
    severity: str
    contact: str
    created_at: datetime

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_emergencies: int
    high_priority: int
    total_hospitals: int
    total_rescue_teams: int
    today_reports: int
    by_type: Dict[str, int]
    by_severity: Dict[str, int]
    timeline: list
