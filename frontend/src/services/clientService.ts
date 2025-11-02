const API_BASE_URL = "http://localhost:3000";

export interface Client {
  _id?: string;
  nome: string;
  email: string;
  telefone: string;
  createdAt?: string;
  updatedAt?: string;
}

export const clientService = {
  async getClients(): Promise<Client[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`);
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  },

  // Create a new client
  async createClient(
    client: Omit<Client, "_id" | "createdAt" | "updatedAt">
  ): Promise<Client> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create client");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  },

  async getClientById(id: string): Promise<Client> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch client");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching client:", error);
      throw error;
    }
  },

  async updateClient(
    id: string,
    client: Partial<Omit<Client, "_id" | "createdAt" | "updatedAt">>
  ): Promise<Client> {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update client");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  },
};
