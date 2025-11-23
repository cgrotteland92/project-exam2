import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Manager from "./pages/Manager";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import VenueDetails from "./pages/VenueDetails";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manager" element={<Manager />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
