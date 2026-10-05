import { useEffect, useState } from "react";

import PageContainer from "../components/PageContainer";
import { useAuth } from "../context/AuthContext";
import { apiGet } from "../services/api";

function Leads() {
  const { getIdToken } = useAuth();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        setLoading(true);
        setError("");

        const data = await apiGet(
          "/api/v1/leads",
          getIdToken
        );

        setLeads(data.leads || []);
      } catch (error) {
        console.error("Load leads error:", error);
        setError(error.message || "Failed to load leads.");
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, [getIdToken]);

  return (
    <PageContainer
      title="Leads"
      description="Manage and review your AI-qualified business leads."
    >
      {loading && <p>Loading leads...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && leads.length === 0 && (
        <p>No leads found yet.</p>
      )}

      {!loading && !error && leads.length > 0 && (
        <div>
          {leads.map((lead) => (
            <div key={lead.id}>
              <h3>{lead.name}</h3>
              <p>{lead.email}</p>
              {lead.company && <p>{lead.company}</p>}
              <p>Status: {lead.status}</p>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

export default Leads;