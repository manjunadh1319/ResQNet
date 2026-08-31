"""
Small UI helpers shared by streamlit_app.py — kept separate from the
FastAPI-facing services so this file has no dependency on Streamlit itself
being importable from the API side.
"""

SEVERITY_COLORS = {
    "Low": "#22c55e",
    "Medium": "#f5b93d",
    "High": "#fb7a3c",
    "Critical": "#ff4757",
}

DISASTER_TYPES = [
    "Flood",
    "Earthquake",
    "Cyclone",
    "Fire",
    "Landslide",
    "Building Collapse",
    "Industrial Accident",
    "Drought",
    "Other",
]

SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"]


def severity_badge_html(severity: str, color: str) -> str:
    return (
        f"<span class='rq-badge' style='background:{color}22; color:{color}; "
        f"border:1px solid {color}55;'>● {severity}</span>"
    )
