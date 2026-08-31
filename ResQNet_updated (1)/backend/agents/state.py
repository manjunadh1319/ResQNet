"""
Shared state object passed between all nodes in the LangGraph workflow.
"""
from typing import TypedDict, List, Dict, Any


class EmergencyState(TypedDict, total=False):
    # Input
    disaster_type: str
    location: str
    victims: int
    severity: str
    description: str
    contact: str

    # Reference data pulled from datasets
    candidate_hospitals: List[Dict]
    candidate_rescue_teams: List[Dict]
    candidate_shelters: List[Dict]
    relief_resources: List[Dict]

    # Agent outputs
    disaster_analysis: Dict[str, Any]
    hospital: Dict[str, Any]
    rescue_team: Dict[str, Any]
    relief_resources_plan: Dict[str, Any]
    communication_report: Dict[str, Any]

    # Bookkeeping
    execution_log: List[str]
