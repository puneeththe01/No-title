import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/ui/NavBar";
import ProfilePage from "./pages/ProfilePage";
import VirtualWorldPage from "./pages/VirtualWorld";
import Contact from "./Contact";
import ThreeScene from "./pages/HomePageThree";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import ChatPartnersPage from "./pages/ChatPartnersPage";
import { buySquare } from "./buySquare";
import { sellSquare } from "./sellSquare";
import { onAuthStateChanged } from "firebase/auth";
import { authent } from "./FirebaseCred";
import { checkBuildCompatibility } from "./checkBuildCompatibility"; // Ensure this import is correct

const App: React.FC = () => {
  const [mode, setMode] = useState<"buy" | "sell" | "build" | "none">("none");
  const [selectedSquares, setSelectedSquares] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedHouseType, setSelectedHouseType] = useState<
    "small" | "medium" | "large" | null
  >(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authent, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleModeChange = (newMode: "buy" | "sell" | "build" | "none") => {
    setMode(newMode);
    if (newMode === "none") {
      setSelectedHouseType(null);
    }
  };

  const handleBuySquare = async () => {
    if (selectedSquares.length && userId) {
      await buySquare(selectedSquares, userId);
      setSelectedSquares([]); // Clear selected squares after the purchase
    } else {
      console.error("No squares selected or user not logged in.");
      setSelectedSquares([]);
    }
  };

  const handleSellSquare = async () => {
    if (selectedSquares.length && userId) {
      await sellSquare({ selectedSquares, userId }); // Handle the selling of squares
      setSelectedSquares([]); // Clear selected squares after the sale
    } else {
      console.error("No squares selected or user not logged in.");
      setSelectedSquares([]);
    }
  };

  const handleConfirmAction = async () => {
    if (mode === "buy") {
      await handleBuySquare();
    } else if (mode === "sell") {
      await handleSellSquare();
    }
    setMode("none"); // Reset mode after the action is confirmed
  };

  const handleBuildTypeChange = (type: "small" | "medium" | "large" | null) => {
    setSelectedHouseType(type);
  };

  const handleConfirmBuild = () => {
    const isCompatible = checkBuildCompatibility(
      selectedSquares,
      selectedHouseType
    );

    if (isCompatible) {
      // Proceed with the build process
      alert("building is succesfully built");
    } else {
      alert(
        `Invalid selection for ${selectedHouseType} house. Please select ${
          selectedHouseType === "small"
            ? "one"
            : selectedHouseType === "medium"
            ? "two adjacent"
            : "four adjacent"
        } squares.`
      );
    }
    setMode("none"); // Exit build mode after confirming
  };

  const handleCancelBuild = () => {
    setMode("none");
    setSelectedHouseType(null);
    setSelectedSquares([]);
  };

  return (
    <Router>
      <Navbar
        onModeChange={handleModeChange}
        onBuildTypeChange={handleBuildTypeChange}
        onConfirmBuild={handleConfirmBuild}
        onCancelBuild={handleCancelBuild}
        setSelectedHouseType={setSelectedHouseType}
        onConfirm={handleConfirmAction}
      />
      <Routes>
        <Route path="/" element={<ThreeScene />} />
        <Route path="/about" element={<ProfilePage />} />
        <Route
          path="/virtual-world"
          element={
            <VirtualWorldPage
              mode={mode}
              selectedSquares={selectedSquares}
              setSelectedSquares={setSelectedSquares}
              userId={userId}
              selectedHouseType={selectedHouseType} // Pass the selected house type
            />
          }
        />
        <Route path="/contact" element={<ChatPartnersPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatpage" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;
