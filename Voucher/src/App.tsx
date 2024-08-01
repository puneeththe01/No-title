import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/ui/NavBar";
import ProfilePage from "./ProfilePage";
import VirtualWorldPage from "./VirtualWorld";
import Contact from "./Contact";
import ThreeScene from "./HomePageThree";
import Login from "./Login";
import Signup from "./Signup";

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ThreeScene />} />
          <Route path="/about" element={<ProfilePage />} />
          <Route path="/services" element={<VirtualWorldPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sigup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
