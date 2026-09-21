import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LeadGenerator from "./pages/LeadGenerator";
import Leads from "./pages/Leads";
import Tickets from "./pages/Tickets";
import Conversations from "./pages/Conversations";
import Documents from "./pages/Documents";
import AISupport from "./pages/AISupport";
import Bookings from "./pages/Bookings";
import GmailAutomation from "./pages/GmailAutomation";
import Automations from "./pages/Automations";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth.jsx";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function DashboardRoutes() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lead-generator" element={<LeadGenerator />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/ai-support" element={<AISupport />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/gmail-automation" element={<GmailAutomation />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<DashboardRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;