import { useEffect, useState } from "react";
import { type Client, clientService } from "../services/clientService";
import "../styles/ClientDetail.css";

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
  onClientUpdated: (client: Client) => void;
}

export function ClientDetail({ clientId, onBack, onClientUpdated }: ClientDetailProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadClient();
  }, [clientId]);

  const loadClient = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getClientById(clientId);
      setClient(data);
      setFormData({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load client");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      const updatedClient = await clientService.updateClient(clientId, formData);
      setClient(updatedClient);
      setIsEditing(false);
      onClientUpdated(updatedClient);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update client");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="client-detail">
        <button onClick={onBack} className="btn btn-secondary">
          Back to List
        </button>
        <p>Loading client details...</p>
      </div>
    );
  }

  if (error && !client) {
    return (
      <div className="client-detail">
        <button onClick={onBack} className="btn btn-secondary">
          Back to List
        </button>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="client-detail">
        <button onClick={onBack} className="btn btn-secondary">
          Back to List
        </button>
        <p className="error">Client not found</p>
      </div>
    );
  }

  return (
    <div className="client-detail">
      <button onClick={onBack} className="btn btn-secondary">
        ← Back to List
      </button>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="client-detail-card">
        <h2>{client.nome}</h2>

        {!isEditing ? (
          <>
            <div className="detail-section">
              <p>
                <strong>Email:</strong> {client.email}
              </p>
              <p>
                <strong>Phone:</strong> {client.telefone}
              </p>
              <p className="timestamp">
                <strong>Created:</strong> {new Date(client.createdAt || "").toLocaleDateString()} at{" "}
                {new Date(client.createdAt || "").toLocaleTimeString()}
              </p>
              {client.updatedAt && (
                <p className="timestamp">
                  <strong>Updated:</strong> {new Date(client.updatedAt).toLocaleDateString()} at{" "}
                  {new Date(client.updatedAt).toLocaleTimeString()}
                </p>
              )}
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
              style={{ marginTop: "20px" }}
            >
              Edit Client
            </button>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="edit-form">
            <div className="form-group">
              <label htmlFor="nome">Name</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Phone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={updating} className="btn btn-primary">
                {updating ? "Updating..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
