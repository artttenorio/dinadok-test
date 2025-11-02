import { useState } from "react";
import { clientService } from "../services/clientService";
import type { Client } from "../services/clientService";
import "../styles/ClientForm.css";

interface ClientFormProps {
  onClientAdded: (client: Client) => void;
}

export function ClientForm({ onClientAdded }: ClientFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const newClient = await clientService.createClient(formData);
      setSuccess(true);
      setFormData({ nome: "", email: "", telefone: "" });
      onClientAdded(newClient);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <h2>Add New Client</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && (
        <div className="alert alert-success">Client added successfully!</div>
      )}

      <div className="form-group">
        <label htmlFor="nome">Name</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          placeholder="Enter client name"
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
          placeholder="Enter client email"
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
          placeholder="Enter client phone"
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Creating..." : "Add Client"}
      </button>
    </form>
  );
}
