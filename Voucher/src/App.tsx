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
import { sellSquare } from "./sellSquare"; // Import sellSquare function
import { onAuthStateChanged } from "firebase/auth";
import { authent } from "./FirebaseCred";

const App: React.FC = () => {
  const [mode, setMode] = useState<"buy" | "sell" | "none">("none");
  const [selectedSquares, setSelectedSquares] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authent, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleModeChange = (newMode: "buy" | "sell" | "none") => {
    setMode(newMode);
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

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Router>
        <Navbar
          onModeChange={handleModeChange}
          onConfirm={handleConfirmAction} // Pass the handleConfirmAction to Navbar
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
              />
            }
          />
          <Route path="/contact" element={<ChatPartnersPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chatpage" element={<ChatPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
