import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/ui/NavBar";
import ProfilePage from "./pages/ProfilePage";
import VirtualWorldPage from "./pages/VirtualWorld";
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
import housePlacement from "./components/ui/housePlacement";
import { Vector3 } from "three";

const App: React.FC = () => {
  const [mode, setMode] = useState<"buy" | "sell" | "build" | "none">("none");
  const [selectedSquares, setSelectedSquares] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [housePosition, setHousePosition] = useState<Vector3 | null>(null);
  const [rotationValue, setRotationValue] = useState<number>(0);
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
      setSelectedSquares([]);
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

  const handleConfirmBuild = async () => {
    if (!selectedHouseType) {
      alert("Please select a house type.");
      return;
    }

    const isCompatible = checkBuildCompatibility(
      selectedSquares,
      selectedHouseType
    );

    if (isCompatible) {
      const housePlacementData = {
        squares: selectedSquares,
        houseType: selectedHouseType,
        rotationValue: setRotationValue,
      };
      const position = housePlacement(housePlacementData, 48);
      setHousePosition(await position); // Set the position for rendering

      // Delay resetting mode and selected house type
      setTimeout(() => {
        setMode("none"); // Exit build mode after confirming
        setSelectedHouseType(null); // Reset house type only after rendering
      }, 100000); // Give a slight delay to ensure rendering occurs

      alert("Building successfully built.");
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
  };

  const handleCancelBuild = () => {
    handleModeChange("none"); // Reset mode and clear selections
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
              housePosition={housePosition}
              rotationValue={rotationValue}
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
