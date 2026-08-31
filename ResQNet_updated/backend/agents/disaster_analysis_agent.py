"""
Disaster Analysis Agent: uses the LLM to assess the disaster situation,
estimate risk, and recommend an immediate response priority.
"""
from datetime import datetime

from agents.state import EmergencyState
from services.llm_service import call_llm_json

SYSTEM_PROMPT = """You are the Disaster Analysis Agent inside ResQNet, an AI
disaster response system. Analyze the reported emergency and produce a
structured risk assessment. Always respond with STRICT JSON only, no markdown,
no commentary, matching exactly this schema:

{
  "risk_level": "Low | Medium | High | Critical",
  "summary": "2-3 sentence plain-language summary of the situation",
  "key_risks": ["risk1", "risk2", "risk3"],
  "affected_population_estimate": "short estimate string",
  "immediate_priorities": ["priority1", "priority2", "priority3"],
  "estimated_response_time_minutes": <integer>
}
"""


def disaster_analysis_node(state: EmergencyState) -> EmergencyState:
    log = state.get("execution_log", [])

    user_prompt = f"""
Disaster type: {state['disaster_type']}
Location: {state['location']}
Reported victims: {state['victims']}
Reported severity: {state['severity']}
Description: {state['description']}
"""
    result = call_llm_json(SYSTEM_PROMPT, user_prompt)
    state["disaster_analysis"] = result

    log.append(f"[{datetime.utcnow().isoformat()}] Disaster Analysis Agent: "
               f"assessed risk level as '{result.get('risk_level', 'Unknown')}'. "
               f"Dispatching to Hospital Recommendation Agent.")
    state["execution_log"] = log
    return state
