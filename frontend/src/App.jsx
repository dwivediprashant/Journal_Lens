import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/Navbar";
import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { useLocation } from "react-router";
import Journals from "./components/pages/journals/Journals";
import Detail from "./components/pages/Detail/Detail";
import MoreDetail from "./components/pages/More_detail/MoreDetail";
import CustomJournal from "./components/pages/Custom_journals/CustomJournal";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ScrollIndicator } from "react-scroll-progress-tracker";
import ProvidersJournals from "./components/pages/Providers_journals/ProvidersJournals";
import ProvidersJournalFromHome from "./components/pages/Providers_journals/providers_journal_from_home/ProvidersJournalFromHome";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div>
      <Navbar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/journals" element={<Journals />} />
        <Route
          path="/journals/:id"
          element={
            <ProtectedRoute>
              <Detail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journals/:id/details"
          element={
            <ProtectedRoute>
              <MoreDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journals/:id/custom"
          element={
            <ProtectedRoute>
              <CustomJournal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/providers"
          element={
            <ProtectedRoute>
              <ProvidersJournals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/providers/:id"
          element={
            <ProtectedRoute>
              <ProvidersJournalFromHome />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
      <Analytics />
      <SpeedInsights />
      <ScrollIndicator />
    </div>
  );
}

export default App;
