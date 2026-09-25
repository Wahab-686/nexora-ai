import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { apiGet } from "../services/api";

function Home() {
  const navigate = useNavigate();
  const { user, getIdToken } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "there";

  useEffect(() => {
    async function loadDashboard() {
      try {
        setDashboardLoading(true);
        setDashboardError("");

        const data = await apiGet(
          "/api/v1/dashboard/summary",
          getIdToken
        );

        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard API error:", error);
        setDashboardError(
          error.message || "Unable to load dashboard data."
        );
      } finally {
        setDashboardLoading(false);
      }
    }

    if (user) {
      loadDashboard();
    }
  }, [user, getIdToken]);

  const metrics = [
    {
      label: "Total Leads",
      value: dashboardLoading
        ? "..."
        : dashboardData?.metrics?.total_leads ?? 0,
      description: "Potential customers",
    },
    {
      label: "Active Bookings",
      value: dashboardLoading
        ? "..."
        : dashboardData?.metrics?.active_bookings ?? 0,
      description: "Upcoming appointments",
    },
    {
      label: "Messages",
      value: dashboardLoading
        ? "..."
        : dashboardData?.metrics?.messages ?? 0,
      description: "AI-assisted conversations",
    },
    {
      label: "Automations",
      value: dashboardLoading
        ? "..."
        : dashboardData?.metrics?.automations ?? 0,
      description: "Active workflows",
    },
  ];

  const agents = [
    { name: "Lead Generation Agent", status: "Ready" },
    { name: "Gmail Communication Agent", status: "Ready" },
    { name: "Booking AI Agent", status: "Ready" },
    { name: "Support AI Agent", status: "Ready" },
  ];

  const activities = [
    "Nexora AI workspace initialized",
    "AI agents are ready",
    "No recent business activity yet",
  ];

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-eyebrow">
            AI BUSINESS AUTOMATION
          </span>

          <h1>Welcome back, {displayName} 👋</h1>

          <p>
            Your central command center for AI-powered business
            automation.
          </p>
        </div>

        <div className="dashboard-status">
          <span className="status-dot" />
          All systems ready
        </div>
      </section>

      {dashboardError && (
        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">DASHBOARD</span>
              <h2>Unable to load live data</h2>
            </div>
          </div>

          <p>{dashboardError}</p>
        </section>
      )}

      <section className="dashboard-metrics">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span>{metric.label}</span>

            <strong>{metric.value}</strong>

            <p>{metric.description}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">AI AGENTS</span>
              <h2>Agent Status</h2>
            </div>
          </div>

          <div className="agent-list">
            {agents.map((agent) => (
              <div className="agent-row" key={agent.name}>
                <div>
                  <strong>{agent.name}</strong>
                  <span>AI agent</span>
                </div>

                <span className="agent-status">
                  <span className="status-dot" />
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">ACTIVITY</span>
              <h2>Recent Activity</h2>
            </div>
          </div>

          <div className="activity-list">
            {activities.map((activity) => (
              <div className="activity-row" key={activity}>
                <span className="activity-dot" />
                <p>{activity}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-panel quick-actions-panel">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">SHORTCUTS</span>
            <h2>Quick Actions</h2>
          </div>
        </div>

        <div className="quick-actions">
          <button
            type="button"
            onClick={() => navigate("/lead-generator")}
          >
            Generate Leads
          </button>

          <button
            type="button"
            onClick={() => navigate("/bookings")}
          >
            Create Booking
          </button>

          <button
            type="button"
            onClick={() => navigate("/ai-support")}
          >
            Open AI Support
          </button>

          <button
            type="button"
            onClick={() => navigate("/integrations")}
          >
            Connect Integration
          </button>
        </div>
      </section>

      <section className="dashboard-panel getting-started-panel">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">GETTING STARTED</span>
            <h2>Build your Nexora workspace</h2>
          </div>

          <span className="getting-started-progress-text">
            0 / 3 completed
          </span>
        </div>

        <div className="getting-started-progress">
          <div className="getting-started-progress-bar" />
        </div>

        <div className="getting-started-list">
          <div className="getting-started-item">
            <div className="getting-started-number">1</div>

            <div>
              <strong>Generate your first leads</strong>

              <p>
                Use the Lead Generation Agent to discover and qualify
                potential customers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/lead-generator")}
            >
              Start
            </button>
          </div>

          <div className="getting-started-item">
            <div className="getting-started-number">2</div>

            <div>
              <strong>Connect your integrations</strong>

              <p>
                Connect the services Nexora AI will use to automate
                your business.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/integrations")}
            >
              Connect
            </button>
          </div>

          <div className="getting-started-item">
            <div className="getting-started-number">3</div>

            <div>
              <strong>Explore AI Support</strong>

              <p>
                Test the AI support agent and start interacting with
                your business knowledge.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/ai-support")}
            >
              Explore
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;