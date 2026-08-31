"""
Supervisor Agent: entry point of the workflow. Validates the incoming
request, pulls candidate reference data (hospitals, rescue teams, shelters,
relief resources) from the datasets, and initializes the execution log.
"""
from datetime import datetime

from agents.state import EmergencyState
from services.dataset_service import (
    find_nearest_hospitals,
    find_available_rescue_teams,
    find_nearest_shelters,
    get_relief_resources,
)


def supervisor_node(state: EmergencyState) -> EmergencyState:
    log = state.get("execution_log", [])
    log.append(f"[{datetime.utcnow().isoformat()}] Supervisor Agent: request received "
               f"for '{state['disaster_type']}' at '{state['location']}' "
               f"(severity: {state['severity']}, victims: {state['victims']})")

    state["candidate_hospitals"] = find_nearest_hospitals(state["location"])
    state["candidate_rescue_teams"] = find_available_rescue_teams(state["location"])
    state["candidate_shelters"] = find_nearest_shelters(state["location"])
    state["relief_resources"] = get_relief_resources()

    log.append(f"[{datetime.utcnow().isoformat()}] Supervisor Agent: gathered "
               f"{len(state['candidate_hospitals'])} hospitals, "
               f"{len(state['candidate_rescue_teams'])} rescue teams, "
               f"{len(state['candidate_shelters'])} shelters as candidates. "
               f"Dispatching to Disaster Analysis Agent.")

    state["execution_log"] = log
    return state
