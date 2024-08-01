import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaGlobe,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Determine if the current route is the homepage
  const isHomePage = location.pathname === "/";

  return (
    <div>
      <nav
        className={`fixed bottom-0 w-full p-2 flex justify-around items-center z-50 ${
          isHomePage ? "bg-black" : "bg-darkcolor"
        }`}
      >
        <Link
          to="/"
          className="text-white text-2xl flex flex-col items-center font-lato"
        >
          <FaHome />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/about"
          className="text-white text-2xl flex flex-col items-center"
        >
          <FaUser />
          <span className="text-xs">Profile</span>
        </Link>
        <Link
          to="/services"
          className="text-white text-2xl flex flex-col items-center"
        >
          <FaGlobe />
          <span className="text-xs">Virtual World</span>
        </Link>
        <Link
          to="/contact"
          className="text-white text-2xl flex flex-col items-center"
        >
          <FaEnvelope />
          <span className="text-xs">Contact</span>
        </Link>
        <button
          className="text-white text-2xl flex flex-col items-center focus:outline-none z-50"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
          <span className="text-xs">Menu</span>
        </button>
      </nav>
      <div
        className={`fixed bottom-0 left-0 w-full bg-darkcolor transition-transform duration-300 ${
          isSidebarOpen
            ? "transform translate-y-0"
            : "transform translate-y-full"
        } h-64 z-40`}
      >
        <ul className="text-white p-4">
          <li className="p-2 border-b border-gray-700">
            <Link to="/login" onClick={toggleSidebar}>
              Login/Sigup
            </Link>
          </li>
          <li className="p-2 border-b border-gray-700">
            <Link to="/about" onClick={toggleSidebar}>
              Profile
            </Link>
          </li>
          <li className="p-2 border-b border-gray-700">
            <Link to="/services" onClick={toggleSidebar}>
              Virtual World
            </Link>
          </li>
          <li className="p-2 border-b border-gray-700">
            <Link to="/contact" onClick={toggleSidebar}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
