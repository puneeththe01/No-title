import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/ui/NavBar";
import ProfilePage from "./pages/ProfilePage";
import VirtualWorldPage from "./pages/VirtualWorld";
import Contact from "./Contact";
import ThreeScene from "./pages/HomePageThree";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import SearchBar from "./components/ui/SearchBar";
import ChatPartnersPage from "./pages/ChatPartnersPage";

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ThreeScene />} />
          <Route path="/about" element={<ProfilePage />} />
          <Route path="/services" element={<VirtualWorldPage />} />
          <Route path="/contact" element={<ChatPartnersPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sigup" element={<Signup />} />
          <Route path="/chatpage" element={<ChatPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
