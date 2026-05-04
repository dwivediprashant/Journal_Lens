import "./App.css";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router";
import Journals from "./components/pages/journals/Journals";
import Detail from "./components/pages/Detail/Detail";
import MoreDetail from "./components/pages/More_detail/MoreDetail";
import CustomJournal from "./components/pages/Custom_journals/CustomJournal";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <div>
      <Navbar />

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
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
