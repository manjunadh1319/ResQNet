"""
Hospital Recommendation Agent: picks and ranks the best hospitals from the
candidate list pulled by the Supervisor Agent, using the LLM to reason
about capacity vs. reported victims.
"""
from datetime import datetime

from agents.state import EmergencyState
from services.llm_service import call_llm_json

SYSTEM_PROMPT = """You are the Hospital Recommendation Agent inside ResQNet.
Given a list of candidate hospitals and emergency details, select and rank
the most suitable hospitals. Respond with STRICT JSON only, matching:

{
  "recommended_hospitals": [
    {
      "hospital": "name",
      "location": "location",
      "beds": <int>,
      "icu": <int>,
      "contact": "contact",
      "reason": "short reason this hospital was chosen"
    }
  ],
  "notes": "1-2 sentence note on hospital capacity vs demand"
}
"""


def hospital_node(state: EmergencyState) -> EmergencyState:
    log = state.get("execution_log", [])

    user_prompt = f"""
Emergency: {state['disaster_type']} at {state['location']}
Victims: {state['victims']}
Severity: {state['severity']}
Candidate hospitals (JSON): {state.get('candidate_hospitals', [])}
"""
    result = call_llm_json(SYSTEM_PROMPT, user_prompt)
    if "recommended_hospitals" not in result:
        result["recommended_hospitals"] = state.get("candidate_hospitals", [])
    state["hospital"] = result

    log.append(f"[{datetime.utcnow().isoformat()}] Hospital Recommendation Agent: "
               f"recommended {len(result.get('recommended_hospitals', []))} hospital(s). "
               f"Dispatching to Rescue Planning Agent.")
    state["execution_log"] = log
    return state
