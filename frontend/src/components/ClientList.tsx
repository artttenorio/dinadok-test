import { useEffect, useState } from "react";
import { type Client, clientService } from "../services/clientService";
import "../styles/ClientList.css";

interface ClientListProps {
  refreshTrigger: number;
  onSelectClient: (clientId: string) => void;
}

export function ClientList({ refreshTrigger, onSelectClient }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, [refreshTrigger]);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="client-list">
        <p>Loading clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-list">
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="client-list">
      <h2>Clients List ({clients.length})</h2>
      {clients.length === 0 ? (
        <p className="no-clients">No clients yet. Add one to get started!</p>
      ) : (
        <div className="clients-grid">
          {clients.map((client) => (
            <div key={client._id} className="client-card">
              <h3>{client.nome}</h3>
              <p>
                <strong>Email:</strong> {client.email}
              </p>
              <p>
                <strong>Phone:</strong> {client.telefone}
              </p>
              <p className="timestamp">
                Created: {new Date(client.createdAt || "").toLocaleDateString()}
              </p>
              <div className="client-card-actions">
                <button
                  onClick={() => onSelectClient(client._id || "")}
                  className="btn btn-view"
                >
                  View & Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
