import { useState } from "react";
import type { Client } from "./services/clientService";
import { ClientForm } from "./components/ClientForm";
import { ClientList } from "./components/ClientList";
import { ClientDetail } from "./components/ClientDetail";
import "./App.css";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleClientAdded = (client: Client) => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleBackToList = () => {
    setSelectedClientId(null);
  };

  const handleClientUpdated = (client: Client) => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Client Management System</h1>
        <p>Add and manage your clients efficiently</p>
      </header>

      <main className="app-main">
        <div className="app-content">
          {selectedClientId ? (
            <ClientDetail
              clientId={selectedClientId}
              onBack={handleBackToList}
              onClientUpdated={handleClientUpdated}
            />
          ) : (
            <>
              <ClientForm onClientAdded={handleClientAdded} />
              <ClientList
                refreshTrigger={refreshTrigger}
                onSelectClient={handleSelectClient}
              />
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Client Management. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
