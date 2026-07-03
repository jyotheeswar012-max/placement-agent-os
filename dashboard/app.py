import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import random

st.set_page_config(
    page_title="Placement Agent OS — Analytics",
    page_icon="🎯",
    layout="wide"
)

st.markdown("""
<style>
    .metric-card { background: #1e1e2e; border-radius: 12px; padding: 20px; }
    .stMetric { background: #262640; border-radius: 8px; padding: 10px; }
</style>
""", unsafe_allow_html=True)

st.title("🎯 Placement Agent OS")
st.caption("University Placement Analytics Dashboard")

# --- KPI Row ---
col1, col2, col3, col4 = st.columns(4)
col1.metric("🎓 Total Students", "1,240", "+32")
col2.metric("✅ Placed", "968", "+48")
col3.metric("📊 Placement %", "78.1%", "+3.2%")
col4.metric("💰 Avg Package", "₹6.5 LPA", "+₹0.8 LPA")

st.markdown("---")

col_left, col_right = st.columns(2)

with col_left:
    st.subheader("📈 Placement Trend (Year-wise)")
    years = [2021, 2022, 2023, 2024, 2025, 2026]
    rates = [65, 68, 71, 74, 76, 78]
    fig = px.line(x=years, y=rates, markers=True, labels={"x": "Year", "y": "Placement %"})
    fig.update_traces(line_color="#7c3aed")
    st.plotly_chart(fig, use_container_width=True)

with col_right:
    st.subheader("🏢 Top Recruiters")
    companies = ["TCS", "Infosys", "Wipro", "Google", "Amazon", "Microsoft"]
    hires = [180, 160, 140, 45, 40, 35]
    fig2 = px.bar(x=companies, y=hires, color=hires, color_continuous_scale="Viridis")
    st.plotly_chart(fig2, use_container_width=True)

st.markdown("---")
col3a, col3b = st.columns(2)

with col3a:
    st.subheader("🧠 Top In-Demand Skills")
    skills = ["Python", "ML", "React", "SQL", "AWS", "Docker"]
    scores = [98, 95, 90, 88, 85, 80]
    fig3 = px.bar(x=scores, y=skills, orientation='h', color=scores, color_continuous_scale="Teal")
    st.plotly_chart(fig3, use_container_width=True)

with col3b:
    st.subheader("📊 Department-wise Placement")
    depts = ["CSE", "Data Science", "ECE", "Mech", "Civil"]
    placed = [92, 85, 70, 60, 50]
    fig4 = px.pie(names=depts, values=placed, hole=0.4)
    st.plotly_chart(fig4, use_container_width=True)

st.markdown("---")
st.subheader("📋 Recent Applications")
df = pd.DataFrame({
    "Student": ["Arjun S", "Priya M", "Rahul K", "Sneha R", "Vikram T"],
    "Job": ["SDE @ TCS", "Data Analyst @ Infosys", "ML Engineer @ Google", "Backend Dev @ Wipro", "DevOps @ Amazon"],
    "Match Score": ["92%", "87%", "95%", "80%", "83%"],
    "Status": ["✅ Shortlisted", "🔄 Applied", "✅ Shortlisted", "❌ Rejected", "🔄 Applied"]
})
st.dataframe(df, use_container_width=True)
