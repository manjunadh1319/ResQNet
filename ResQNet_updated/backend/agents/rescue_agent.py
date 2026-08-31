"""
Rescue Planning Agent: builds a rescue operation plan from the candidate
rescue teams, including deployment order and equipment needed.
"""
from datetime import datetime

from agents.state import EmergencyState
from services.llm_service import call_llm_json

SYSTEM_PROMPT = """You are the Rescue Planning Agent inside ResQNet.
Given candidate rescue teams and emergency details, build a rescue
deployment plan. Respond with STRICT JSON only, matching:

{
  "deployed_teams": [
    {
      "team": "name",
      "location": "location",
      "vehicles": "vehicles",
      "contact": "contact",
      "role": "what this team should do"
    }
  ],
  "rescue_strategy": "3-4 sentence rescue operation strategy",
  "equipment_needed": ["item1", "item2"],
  "estimated_personnel_required": <integer>
}
"""


def rescue_node(state: EmergencyState) -> EmergencyState:
    log = state.get("execution_log", [])

    user_prompt = f"""
Emergency: {state['disaster_type']} at {state['location']}
Victims: {state['victims']}
Severity: {state['severity']}
Disaster analysis (JSON): {state.get('disaster_analysis', {})}
Candidate rescue teams (JSON): {state.get('candidate_rescue_teams', [])}
"""
    result = call_llm_json(SYSTEM_PROMPT, user_prompt)
    if "deployed_teams" not in result:
        result["deployed_teams"] = state.get("candidate_rescue_teams", [])
    state["rescue_team"] = result

    log.append(f"[{datetime.utcnow().isoformat()}] Rescue Planning Agent: "
               f"deployed {len(result.get('deployed_teams', []))} team(s). "
               f"Dispatching to Relief Resource Agent.")
    state["execution_log"] = log
    return state
