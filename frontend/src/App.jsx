import "./App.css";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router";
import Journals from "./components/pages/journals/Journals";
function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/journals" element={<Journals />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
