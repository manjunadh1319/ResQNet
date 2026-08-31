"""
Builds the LangGraph state machine that chains all ResQNet agents:

Supervisor -> Disaster Analysis -> Hospital -> Rescue -> Relief -> Communication
"""
from langgraph.graph import StateGraph, END

from agents.state import EmergencyState
from agents.supervisor_agent import supervisor_node
from agents.disaster_analysis_agent import disaster_analysis_node
from agents.hospital_agent import hospital_node
from agents.rescue_agent import rescue_node
from agents.relief_agent import relief_node
from agents.communication_agent import communication_node

_compiled_graph = None


def build_graph():
    graph = StateGraph(EmergencyState)

    graph.add_node("supervisor_agent", supervisor_node)
    graph.add_node("disaster_analysis_agent", disaster_analysis_node)
    graph.add_node("hospital_agent", hospital_node)
    graph.add_node("rescue_agent", rescue_node)
    graph.add_node("relief_agent", relief_node)
    graph.add_node("communication_agent", communication_node)

    graph.set_entry_point("supervisor_agent")
    graph.add_edge("supervisor_agent", "disaster_analysis_agent")
    graph.add_edge("disaster_analysis_agent", "hospital_agent")
    graph.add_edge("hospital_agent", "rescue_agent")
    graph.add_edge("rescue_agent", "relief_agent")
    graph.add_edge("relief_agent", "communication_agent")
    graph.add_edge("communication_agent", END)

    return graph.compile()


def get_graph():
    """Return a cached compiled LangGraph workflow."""
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_graph()
    return _compiled_graph


def run_emergency_workflow(payload: dict) -> EmergencyState:
    """Run the full multi-agent workflow for a single emergency report."""
    graph = get_graph()
    initial_state: EmergencyState = {
        "disaster_type": payload["disaster_type"],
        "location": payload["location"],
        "victims": payload["victims"],
        "severity": payload["severity"],
        "description": payload.get("description", ""),
        "contact": payload["contact"],
        "execution_log": [],
    }
    final_state = graph.invoke(initial_state)
    return final_state
