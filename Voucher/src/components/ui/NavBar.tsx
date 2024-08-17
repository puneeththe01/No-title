import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaGlobe,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaDollarSign,
  FaShoppingCart,
  FaTools,
} from "react-icons/fa";

interface NavbarProps {
  onModeChange: (mode: "buy" | "sell" | "none") => void;
  onConfirm?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onModeChange, onConfirm }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeButton, setActiveButton] = useState<"buy" | "sell" | "none">(
    "none"
  );

  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleButtonClick = (mode: "buy" | "sell" | "none") => {
    const newMode = activeButton === mode ? "none" : mode;
    setActiveButton(newMode);
    onModeChange(newMode);
    setIsSidebarOpen(false); // Close sidebar when a button is clicked
  };

  const handleConfirmClick = () => {
    if (onConfirm && activeButton === "buy") {
      onConfirm();
    }
    handleButtonClick("none");
  };

  const isHomePage = location.pathname === "/";
  const isVirtualWorldPage = location.pathname === "/virtual-world";

  return (
    <div>
      <nav
        className={`fixed bottom-0 w-full p-2 flex justify-around items-center z-50 ${
          isHomePage ? "bg-black" : "bg-black"
        }`}
      >
        {!isVirtualWorldPage ? (
          <>
            <Link
              to="/"
              className="text-white text-2xl flex flex-col items-center font-lato"
              onClick={() => setIsSidebarOpen(false)} // Close sidebar when link is clicked
            >
              <FaHome />
              <span className="text-xs">Home</span>
            </Link>
            <Link
              to="/about"
              className="text-white text-2xl flex flex-col items-center"
              onClick={() => setIsSidebarOpen(false)} // Close sidebar when link is clicked
            >
              <FaUser />
              <span className="text-xs">Profile</span>
            </Link>
            <Link
              to="/virtual-world"
              className="text-white text-2xl flex flex-col items-center"
              onClick={() => setIsSidebarOpen(false)} // Close sidebar when link is clicked
            >
              <FaGlobe />
              <span className="text-xs">Virtual World</span>
            </Link>
          </>
        ) : activeButton === "none" ? (
          <>
            <button
              className="text-white text-2xl flex flex-col items-center focus:outline-none"
              onClick={() => handleButtonClick("buy")}
            >
              <FaDollarSign />
              <span className="text-xs">Buy</span>
            </button>
            <button
              className="text-white text-2xl flex flex-col items-center focus:outline-none"
              onClick={() => handleButtonClick("sell")}
            >
              <FaShoppingCart />
              <span className="text-xs">Sell</span>
            </button>
            <button
              className="text-white text-2xl flex flex-col items-center focus:outline-none"
              onClick={() => handleButtonClick("none")}
            >
              <FaTools />
              <span className="text-xs">Build</span>
            </button>
          </>
        ) : (
          <>
            <button
              className="text-white text-2xl flex flex-col items-center focus:outline-none"
              onClick={handleConfirmClick}
            >
              <FaDollarSign />
              <span className="text-xs">Confirm</span>
            </button>
            <button
              className="text-white text-2xl flex flex-col items-center focus:outline-none"
              onClick={() => handleButtonClick("none")}
            >
              <FaTimes />
              <span className="text-xs">Cancel</span>
            </button>
          </>
        )}
        <Link
          to="/contact"
          className="text-white text-2xl flex flex-col items-center"
          onClick={() => setIsSidebarOpen(false)} // Close sidebar when link is clicked
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
        className={`fixed bottom-0 left-0 w-full transition-transform duration-300 ${
          isSidebarOpen
            ? "transform translate-y-0"
            : "transform translate-y-full"
        } z-40 ${isHomePage ? "bg-black" : "bg-darkcolor"} ${
          isVirtualWorldPage ? "h-64" : "h-40"
        }`}
      >
        <ul className="text-white p-4">
          {isVirtualWorldPage ? (
            <>
              <li className="p-2 border-b border-gray-700">
                <Link to="/" onClick={toggleSidebar}>
                  Home
                </Link>
              </li>
              <li className="p-2 border-b border-gray-700">
                <Link to="/about" onClick={toggleSidebar}>
                  Profile
                </Link>
              </li>
              <li className="p-2 border-b border-gray-700">
                <Link to="/login" onClick={toggleSidebar}>
                  Login/Signup
                </Link>
              </li>
              <li className="p-2 border-b border-gray-700">
                <Link to="/contact" onClick={toggleSidebar}>
                  Contact Us
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="p-2 border-b border-gray-700">
                <Link to="/login" onClick={toggleSidebar}>
                  Login/Signup
                </Link>
              </li>
              <li className="p-2 border-b border-gray-700">
                <Link to="/contact" onClick={toggleSidebar}>
                  Contact Us
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
