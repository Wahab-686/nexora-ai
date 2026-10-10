
import { useEffect, useState } from "react";

import PageContainer from "../components/PageContainer";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPost } from "../services/api";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const initialForm = {
  name: "",
  email: "",
  company: "",
  score: "",
  status: "new",
};

const statuses = [
  "new",
  "qualified",
  "contacted",
  "converted",
  "rejected",
];

function Leads() {
  const { getIdToken } = useAuth();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLeads() {
      try {
        setLoading(true);
        setError("");

        const data = await apiGet("/api/v1/leads", getIdToken);

        if (!cancelled) {
          setLeads(data.leads || []);
        }
      } catch (err) {
        console.error("Load leads error:", err);

        if (!cancelled) {
          setError(err.message || "Failed to load leads.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeads();

    return () => {
      cancelled = true;
    };
  }, [getIdToken]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCreate(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim();
    const company = form.company.trim();

    if (!name || !email) {
      setError("Please enter the lead's name and email.");
      return;
    }

    const score =
      form.score.trim() === "" ? null : Number(form.score);

    if (
      score !== null &&
      (!Number.isInteger(score) || score < 0 || score > 100)
    ) {
      setError("Score must be a whole number between 0 and 100.");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        name,
        email,
        company: company || null,
        score,
        status: form.status,
      };

      const data = await apiPost(
        "/api/v1/leads",
        payload,
        getIdToken
      );

      if (data.lead) {
        setLeads((current) => [data.lead, ...current]);
      }

      setForm(initialForm);
      setSuccess("Lead created successfully.");
    } catch (err) {
      console.error("Create lead error:", err);
      setError(err.message || "Failed to create lead.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(leadId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      setDeletingId(leadId);

      const token = await getIdToken();

      const response = await fetch(
        `${API_URL}/api/v1/leads/${leadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let detail = `Delete failed: ${response.status}`;

        try {
          const data = await response.json();

          if (data?.detail) {
            detail = data.detail;
          }
        } catch {
          // Keep the default error message.
        }

        throw new Error(detail);
      }

      setLeads((current) =>
        current.filter((lead) => lead.id !== leadId)
      );

      setSuccess("Lead deleted successfully.");
    } catch (err) {
      console.error("Delete lead error:", err);
      setError(err.message || "Failed to delete lead.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <PageContainer
      title="Leads"
      description="Create, manage, and review your AI-qualified business leads."
    >
      <section>
        <h2>Create a lead</h2>

        <form onSubmit={handleCreate}>
          <div>
            <label htmlFor="lead-name">Name *</label>
            <input
              id="lead-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              autoComplete="name"
              required
              disabled={creating}
            />
          </div>

          <div>
            <label htmlFor="lead-email">Email *</label>
            <input
              id="lead-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. alex@example.com"
              autoComplete="email"
              required
              disabled={creating}
            />
          </div>

          <div>
            <label htmlFor="lead-company">Company</label>
            <input
              id="lead-company"
              name="company"
              type="text"
              value={form.company}
              onChange={handleChange}
              placeholder="Company name"
              autoComplete="organization"
              disabled={creating}
            />
          </div>

          <div>
            <label htmlFor="lead-score">Lead score (0–100)</label>
            <input
              id="lead-score"
              name="score"
              type="number"
              min="0"
              max="100"
              step="1"
              value={form.score}
              onChange={handleChange}
              placeholder="Optional"
              disabled={creating}
            />
          </div>

          <div>
            <label htmlFor="lead-status">Status</label>
            <select
              id="lead-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={creating}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={creating}>
            {creating ? "Creating lead..." : "Create lead"}
          </button>
        </form>
      </section>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {success && (
        <p role="status">
          {success}
        </p>
      )}

      <section>
        <h2>Your leads</h2>

        {loading && <p>Loading leads...</p>}

        {!loading && leads.length === 0 && (
          <p>No leads found yet. Create your first lead above.</p>
        )}

        {!loading && leads.length > 0 && (
          <div>
            {leads.map((lead) => (
              <article key={lead.id}>
                <h3>{lead.name}</h3>

                <p>{lead.email}</p>

                {lead.company && <p>{lead.company}</p>}

                <p>
                  Status: {lead.status || "new"}
                </p>

                {lead.score != null && (
                  <p>Score: {lead.score}/100</p>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(lead.id)}
                  disabled={deletingId === lead.id}
                >
                  {deletingId === lead.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}

export default Leads;
