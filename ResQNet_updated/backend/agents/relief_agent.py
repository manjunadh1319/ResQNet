"""
Relief Resource Agent: allocates relief resources (water, food, medical
kits, shelters) proportionate to the number of victims.
"""
from datetime import datetime

from agents.state import EmergencyState
from services.llm_service import call_llm_json

SYSTEM_PROMPT = """You are the Relief Resource Agent inside ResQNet.
Given available relief resources, candidate shelters, and emergency
details, allocate resources for the affected population. Respond with
STRICT JSON only, matching:

{
  "allocated_resources": [
    {"resource": "name", "quantity_allocated": <integer>, "unit": "unit"}
  ],
  "recommended_shelters": [
    {"name": "shelter name", "location": "location", "capacity": <int>}
  ],
  "allocation_notes": "2-3 sentence explanation of the allocation plan"
}
"""


def relief_node(state: EmergencyState) -> EmergencyState:
    log = state.get("execution_log", [])

    user_prompt = f"""
Emergency: {state['disaster_type']} at {state['location']}
Victims: {state['victims']}
Severity: {state['severity']}
Available relief resources (JSON): {state.get('relief_resources', [])}
Candidate shelters (JSON): {state.get('candidate_shelters', [])}
"""
    result = call_llm_json(SYSTEM_PROMPT, user_prompt)
    state["relief_resources_plan"] = result

    log.append(f"[{datetime.utcnow().isoformat()}] Relief Resource Agent: "
               f"allocated {len(result.get('allocated_resources', []))} resource type(s). "
               f"Dispatching to Communication Agent.")
    state["execution_log"] = log
    return state
