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
  FaBuilding,
  FaCheck,
} from "react-icons/fa";

interface NavbarProps {
  onModeChange: (mode: "buy" | "sell" | "build" | "none") => void;
  onConfirm?: () => void;
  onBuildTypeChange?: (type: "small" | "medium" | "large" | null) => void;
  onConfirmBuild?: () => void;
  onCancelBuild?: () => void;
  setSelectedHouseType: React.Dispatch<
    React.SetStateAction<"small" | "medium" | "large" | null>
  >;
}

const Navbar: React.FC<NavbarProps> = ({
  onModeChange,
  onConfirm,
  onBuildTypeChange,
  onConfirmBuild,
  onCancelBuild,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeButton, setActiveButton] = useState<
    "buy" | "sell" | "build" | "none"
  >("none");
  const [selectedBuildType, setSelectedBuildType] = useState<
    "small" | "medium" | "large" | null
  >(null);

  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleButtonClick = (mode: "buy" | "sell" | "build" | "none") => {
    const newMode = activeButton === mode ? "none" : mode;
    setActiveButton(newMode);
    onModeChange(newMode);
    setIsSidebarOpen(false); // Close sidebar when a button is clicked
  };

  const handleBuildTypeClick = (type: "small" | "medium" | "large") => {
    setSelectedBuildType(type);
    if (onBuildTypeChange) onBuildTypeChange(type);
  };

  const handleConfirmClick = () => {
    if (activeButton === "build" && onConfirmBuild) {
      onConfirmBuild();
    } else if (
      onConfirm &&
      (activeButton === "buy" || activeButton === "sell")
    ) {
      onConfirm();
    }
    handleButtonClick("none");
  };

  const handleCancelClick = () => {
    if (onCancelBuild && activeButton === "build") {
      onCancelBuild();
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
              onClick={() => handleButtonClick("build")}
            >
              <FaTools />
              <span className="text-xs">Build</span>
            </button>
          </>
        ) : activeButton === "build" ? (
          <>
            <button
              className={`text-white text-2xl flex flex-col items-center focus:outline-none ${
                selectedBuildType === "small" ? "text-green-500" : ""
              }`}
              onClick={() => handleBuildTypeClick("small")}
            >
              <FaBuilding />
              <span className="text-xs">Small</span>
            </button>
            <button
              className={`text-white text-2xl flex flex-col items-center focus:outline-none ${
                selectedBuildType === "medium" ? "text-green-500" : ""
              }`}
              onClick={() => handleBuildTypeClick("medium")}
            >
              <FaBuilding />
              <span className="text-xs">Medium</span>
            </button>
            <button
              className={`text-white text-2xl flex flex-col items-center focus:outline-none ${
                selectedBuildType === "large" ? "text-green-500" : ""
              }`}
              onClick={() => handleBuildTypeClick("large")}
            >
              <FaBuilding />
              <span className="text-xs">Large</span>
            </button>
            <button
              className="text-white text-2xl flex flex-col items-center focus:outline-none"
              onClick={handleConfirmClick}
            >
              <FaCheck />
              <span className="text-xs">Confirm</span>
            </button>
            <button
              className="text-white text-2xl flex flex-col items-center focus:outline-none"
              onClick={handleCancelClick}
            >
              <FaTimes />
              <span className="text-xs">Cancel</span>
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
              onClick={handleCancelClick}
            >
              <FaTimes />
              <span className="text-xs">Cancel</span>
            </button>
          </>
        )}

        {/* Conditionally render Contact and Menu buttons only if not in "build" mode */}
        {activeButton !== "build" && (
          <>
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
          </>
        )}
      </nav>
      <div
        className={`fixed bottom-0 left-0 w-full transition-transform duration-300 ${
          isSidebarOpen
            ? "transform translate-y-0"
            : "transform translate-y-full"
        } z-40 bg-black ${isVirtualWorldPage ? "h-64" : "h-40"}`}
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
                <Link to="/" onClick={toggleSidebar}>
                  Home
                </Link>
              </li>
              <li className="p-2 border-b border-gray-700">
                <Link to="/about" onClick={toggleSidebar}>
                  About
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
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
