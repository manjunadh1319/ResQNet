"""
ResQNet — Streamlit edition.

Runs the same LangGraph multi-agent workflow and SQLite database as the
FastAPI backend, but through a single-file Streamlit UI so the whole app
can be deployed on Streamlit Community Cloud (which only hosts one Python
app, not a separate React + FastAPI pair).

Run locally with:
    streamlit run streamlit_app.py
(from inside the backend/ folder, so the existing config/database/services/
agents packages resolve the same way they do for main.py)
"""
import os
from datetime import datetime, timedelta
from collections import Counter

import streamlit as st

st.set_page_config(
    page_title="ResQNet — AI Disaster Response System",
    page_icon="🛰️",
    layout="wide",
)

import pandas as pd
import plotly.express as px

# --- Secrets → environment, before importing settings (which reads env vars) ---
try:
    if "GROQ_API_KEY" in st.secrets:
        os.environ.setdefault("GROQ_API_KEY", st.secrets["GROQ_API_KEY"])
    if "GROQ_MODEL" in st.secrets:
        os.environ.setdefault("GROQ_MODEL", st.secrets["GROQ_MODEL"])
except Exception:
    pass  # no secrets.toml locally — fine if backend/.env is used instead

from database.db import init_db, SessionLocal
from database.models import Emergency
from schemas.emergency import EmergencyCreate
from services import emergency_service, dataset_service
from utils.severity import SEVERITY_COLORS, severity_badge_html, DISASTER_TYPES, SEVERITY_LEVELS

# ---------------------------------------------------------------------------
# One-time setup
# ---------------------------------------------------------------------------
@st.cache_resource
def _ensure_db():
    init_db()
    return True


_ensure_db()

st.markdown(
    """
    <style>
    .rq-card {
        background: rgba(17, 26, 46, 0.65);
        border: 1px solid rgba(139, 180, 255, 0.14);
        border-radius: 16px;
        padding: 18px 20px;
        margin-bottom: 14px;
    }
    .rq-badge {
        display: inline-flex; align-items: center; gap: 6px;
        border-radius: 999px; padding: 3px 12px; font-size: 12px;
        font-weight: 600; font-family: monospace;
    }
    .rq-footer {
        text-align: center; color: #90a0be; font-size: 12px;
        margin-top: 40px; padding-top: 16px;
        border-top: 1px solid rgba(139,180,255,0.1);
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# ---------------------------------------------------------------------------
# Header
# ---------------------------------------------------------------------------
st.markdown(
    "<h1 style='margin-bottom:0;'>🛰️ ResQ<span style='color:#2f6fed;'>Net</span></h1>"
    "<p style='color:#90a0be; margin-top:4px;'>AI-powered disaster response coordination — "
    "6 agents, one report, minutes not hours.</p>",
    unsafe_allow_html=True,
)

tab_report, tab_dashboard, tab_history = st.tabs(["🚨 Report Emergency", "📊 Dashboard", "🕘 History"])

# ---------------------------------------------------------------------------
# Tab 1 — Report Emergency
# ---------------------------------------------------------------------------
with tab_report:
    col_form, col_result = st.columns([1, 1.3], gap="large")

    with col_form:
        st.subheader("Report an Emergency")
        with st.form("emergency_form", clear_on_submit=False):
            disaster_type = st.selectbox("Disaster Type", [""] + DISASTER_TYPES)
            severity = st.selectbox("Severity", [""] + SEVERITY_LEVELS)
            location = st.text_input("Location", placeholder="e.g. Vijayawada")
            victims = st.number_input("Estimated Victims", min_value=0, step=1)
            contact = st.text_input("Emergency Contact", placeholder="+91-9876543210")
            description = st.text_area("Description (optional)", placeholder="Additional details…")
            submitted = st.form_submit_button("🚀 Submit Emergency Report", use_container_width=True)

        if submitted:
            errors = []
            if not disaster_type:
                errors.append("Select a disaster type.")
            if not severity:
                errors.append("Select a severity level.")
            if not location or len(location.strip()) < 2:
                errors.append("Enter a valid location.")
            if not contact or len(contact.strip()) < 5:
                errors.append("Enter a valid contact number.")

            if errors:
                for e in errors:
                    st.error(e)
            else:
                try:
                    payload = EmergencyCreate(
                        disaster_type=disaster_type,
                        location=location,
                        victims=int(victims),
                        severity=severity,
                        description=description,
                        contact=contact,
                    )
                except Exception as e:
                    st.error(f"Invalid input: {e}")
                    payload = None

                if payload:
                    with st.spinner("Dispatching AI response agents — analyzing, matching hospitals, planning rescue…"):
                        db = SessionLocal()
                        try:
                            record = emergency_service.create_emergency(db, payload)
                            result = emergency_service.serialize_emergency(record)
                            st.session_state["last_result"] = result
                        except RuntimeError as e:
                            st.error(str(e))
                        except Exception as e:
                            st.error(f"Failed to process emergency: {e}")
                        finally:
                            db.close()

    with col_result:
        result = st.session_state.get("last_result")
        if not result:
            st.info("Submit a report to see the AI response plan here.")
        else:
            st.subheader("AI Response Plan")

            analysis = result.get("disaster_analysis") or {}
            risk = analysis.get("risk_level", "Medium")
            color = SEVERITY_COLORS.get(risk, "#f5b93d")
            st.markdown(
                f"<div class='rq-card'>"
                f"<h4>🔺 Disaster Analysis</h4>"
                f"{severity_badge_html(risk, color)}"
                f"<p style='margin-top:10px;'>{analysis.get('summary', '')}</p>"
                f"<p style='color:#90a0be; font-size:12px;'>Affected population estimate: "
                f"{analysis.get('affected_population_estimate', 'n/a')}</p>"
                f"</div>",
                unsafe_allow_html=True,
            )
            if analysis.get("key_risks"):
                st.markdown("**Key risks:** " + ", ".join(analysis["key_risks"]))
            if analysis.get("immediate_priorities"):
                st.markdown("**Immediate priorities:**")
                for p in analysis["immediate_priorities"]:
                    st.markdown(f"- {p}")

            hospital = result.get("hospital") or {}
            st.markdown("<div class='rq-card'><h4>💚 Hospital Recommendation</h4>", unsafe_allow_html=True)
            for h in hospital.get("recommended_hospitals", []):
                st.markdown(
                    f"**{h.get('hospital','')}** — {h.get('location','')}  \n"
                    f"Beds: {h.get('beds','?')} · ICU: {h.get('icu','?')} · 📞 {h.get('contact','')}"
                )
                if h.get("reason"):
                    st.caption(h["reason"])
            st.markdown("</div>", unsafe_allow_html=True)

            rescue = result.get("rescue_team") or {}
            st.markdown("<div class='rq-card'><h4>🛡️ Rescue Planning</h4>", unsafe_allow_html=True)
            for t in rescue.get("deployed_teams", []):
                st.markdown(
                    f"**{t.get('team','')}** — {t.get('location','')}  \n"
                    f"🚚 {t.get('vehicles','')} · 📞 {t.get('contact','')}"
                )
                if t.get("role"):
                    st.caption(t["role"])
            if rescue.get("rescue_strategy"):
                st.info(rescue["rescue_strategy"])
            st.markdown("</div>", unsafe_allow_html=True)

            relief = result.get("relief_resources") or {}
            st.markdown("<div class='rq-card'><h4>📦 Relief Resources</h4>", unsafe_allow_html=True)
            resources = relief.get("allocated_resources", [])
            if resources:
                cols = st.columns(min(3, len(resources)))
                for i, r in enumerate(resources):
                    with cols[i % len(cols)]:
                        st.metric(r.get("resource", ""), f"{r.get('quantity_allocated','')} {r.get('unit','')}")
            for s in relief.get("recommended_shelters", []):
                st.markdown(f"🏠 **{s.get('name','')}** — {s.get('location','')} · cap. {s.get('capacity','')}")
            st.markdown("</div>", unsafe_allow_html=True)

            comm = result.get("communication_report") or {}
            st.markdown(
                f"<div class='rq-card'><h4>💬 Communication Report</h4>"
                f"<h5>{comm.get('title','')}</h5>",
                unsafe_allow_html=True,
            )
            if comm.get("status"):
                st.success(f"Status: {comm['status']}")
            if comm.get("public_alert"):
                st.warning(f"**Public alert:** {comm['public_alert']}")
            if comm.get("responder_briefing"):
                st.markdown(f"**Responder briefing:** {comm['responder_briefing']}")
            if comm.get("next_steps"):
                st.markdown("**Next steps:**")
                for i, step in enumerate(comm["next_steps"], 1):
                    st.markdown(f"{i}. {step}")
            st.markdown("</div>", unsafe_allow_html=True)

# ---------------------------------------------------------------------------
# Tab 2 — Dashboard
# ---------------------------------------------------------------------------
with tab_dashboard:
    db = SessionLocal()
    try:
        records = db.query(Emergency).all()
    finally:
        db.close()

    total = len(records)
    high_priority = len([r for r in records if r.severity in ("High", "Critical")])
    today = datetime.utcnow().date()
    today_reports = len([r for r in records if r.created_at.date() == today])
    hospitals = dataset_service.get_hospitals()
    rescue_teams = dataset_service.get_rescue_teams()

    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("Total Emergencies", total)
    c2.metric("High Priority", high_priority)
    c3.metric("Hospitals", len(hospitals))
    c4.metric("Rescue Teams", len(rescue_teams))
    c5.metric("Today's Reports", today_reports)

    st.divider()

    col_a, col_b = st.columns(2)
    with col_a:
        st.markdown("**Emergencies by Severity**")
        by_severity = Counter(r.severity for r in records)
        if by_severity:
            df = pd.DataFrame({"severity": list(by_severity.keys()), "count": list(by_severity.values())})
            fig = px.pie(
                df, names="severity", values="count", hole=0.5,
                color="severity", color_discrete_map=SEVERITY_COLORS,
            )
            fig.update_layout(template="plotly_dark", paper_bgcolor="rgba(0,0,0,0)", height=280,
                               margin=dict(l=10, r=10, t=10, b=10))
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.caption("No data yet.")

    with col_b:
        st.markdown("**Emergencies by Type**")
        by_type = Counter(r.disaster_type for r in records)
        if by_type:
            df = pd.DataFrame({"type": list(by_type.keys()), "count": list(by_type.values())})
            fig = px.bar(df, x="type", y="count", color_discrete_sequence=["#2f6fed"])
            fig.update_layout(template="plotly_dark", paper_bgcolor="rgba(0,0,0,0)", height=280,
                               margin=dict(l=10, r=10, t=10, b=10))
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.caption("No data yet.")

    st.markdown("**Reports — Last 7 Days**")
    timeline = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        count = len([r for r in records if r.created_at.date() == day])
        timeline.append({"date": day.isoformat(), "count": count})
    df_line = pd.DataFrame(timeline)
    fig_line = px.line(df_line, x="date", y="count", markers=True, color_discrete_sequence=["#22d3ee"])
    fig_line.update_layout(template="plotly_dark", paper_bgcolor="rgba(0,0,0,0)", height=220,
                            margin=dict(l=10, r=10, t=10, b=10))
    st.plotly_chart(fig_line, use_container_width=True)

    st.markdown("**Live Situation Map**")
    map_rows = []
    for h in hospitals:
        if h.get("latitude") and h.get("longitude"):
            map_rows.append({"lat": float(h["latitude"]), "lon": float(h["longitude"]),
                              "label": f"Hospital: {h['hospital']}", "color": "#22c55e"})
    for t in rescue_teams:
        if t.get("latitude") and t.get("longitude"):
            map_rows.append({"lat": float(t["latitude"]), "lon": float(t["longitude"]),
                              "label": f"Rescue team: {t['team']}", "color": "#2f6fed"})
    if map_rows:
        df_map = pd.DataFrame(map_rows)
        st.map(df_map, latitude="lat", longitude="lon", size=20, color="color")
        st.caption("🟢 Hospitals · 🔵 Rescue teams")
    else:
        st.caption("No map data available.")

# ---------------------------------------------------------------------------
# Tab 3 — History
# ---------------------------------------------------------------------------
with tab_history:
    db = SessionLocal()
    try:
        records = db.query(Emergency).order_by(Emergency.created_at.desc()).all()
    finally:
        db.close()

    col_search, col_filter = st.columns([2, 1])
    search = col_search.text_input("Search by disaster type or location…", key="hist_search")
    sev_filter = col_filter.selectbox("Severity", ["All"] + SEVERITY_LEVELS, key="hist_sev")

    filtered = [
        r for r in records
        if (not search or search.lower() in r.disaster_type.lower() or search.lower() in r.location.lower())
        and (sev_filter == "All" or r.severity == sev_filter)
    ]

    if not filtered:
        st.info("No emergencies found." if records else "No emergencies reported yet.")
    else:
        for r in filtered:
            color = SEVERITY_COLORS.get(r.severity, "#f5b93d")
            with st.expander(f"{r.disaster_type} — {r.location}  ·  {r.severity}  ·  {r.created_at.strftime('%d %b %Y, %H:%M')}"):
                st.markdown(severity_badge_html(r.severity, color), unsafe_allow_html=True)
                st.markdown(f"**Victims:** {r.victims}  ·  **Contact:** {r.contact}")
                if r.description:
                    st.markdown(f"**Description:** {r.description}")

                detail = emergency_service.serialize_emergency(r)
                comm = detail.get("communication_report") or {}
                if comm.get("public_alert"):
                    st.warning(comm["public_alert"])

                if st.button("🗑️ Delete this report", key=f"delete_{r.id}"):
                    db2 = SessionLocal()
                    try:
                        emergency_service.delete_emergency(db2, r.id)
                        st.success("Deleted.")
                        st.rerun()
                    finally:
                        db2.close()

st.markdown(
    "<div class='rq-footer'>ResQNet — AI Disaster Response System · "
    "Built for rapid, coordinated emergency response · B.Tech Final Year Project · "
    "Made by <b style='color:#2f6fed;'>Manjunadh</b></div>",
    unsafe_allow_html=True,
)
