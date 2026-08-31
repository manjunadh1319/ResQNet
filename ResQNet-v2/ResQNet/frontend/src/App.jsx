import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import EmergencyDetails from "./pages/EmergencyDetails";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/emergency/:id" element={<EmergencyDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
