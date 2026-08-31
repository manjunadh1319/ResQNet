"""
Communication Agent: synthesizes all prior agent outputs into a final
human-readable communication report for responders and the public.
"""
from datetime import datetime

from agents.state import EmergencyState
from services.llm_service import call_llm_json

SYSTEM_PROMPT = """You are the Communication Agent inside ResQNet, the final
agent in the workflow. Summarize the full emergency response plan into a
clear communication report suitable for dispatchers, responders, and
affected families. Respond with STRICT JSON only, matching:

{
  "title": "short headline for this emergency",
  "public_alert": "2-3 sentence public-facing alert message",
  "responder_briefing": "3-5 sentence briefing for field responders covering hospitals, rescue teams and relief plan",
  "next_steps": ["step1", "step2", "step3"],
  "status": "Dispatched | In Progress | Resolved"
}
"""


def communication_node(state: EmergencyState) -> EmergencyState:
    log = state.get("execution_log", [])

    user_prompt = f"""
Emergency: {state['disaster_type']} at {state['location']}
Victims: {state['victims']}
Severity: {state['severity']}
Disaster analysis (JSON): {state.get('disaster_analysis', {})}
Hospital plan (JSON): {state.get('hospital', {})}
Rescue plan (JSON): {state.get('rescue_team', {})}
Relief plan (JSON): {state.get('relief_resources_plan', {})}
"""
    result = call_llm_json(SYSTEM_PROMPT, user_prompt)
    state["communication_report"] = result

    log.append(f"[{datetime.utcnow().isoformat()}] Communication Agent: "
               f"final report generated. Status: '{result.get('status', 'Dispatched')}'. "
               f"Workflow complete.")
    state["execution_log"] = log
    return state
