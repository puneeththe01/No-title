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
import { buySquare } from "./buySquare"; // Adjust the path to where buySquare is defined
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
      setSelectedSquares([]);
    } else {
      console.error("No squares selected or user not logged in.");
      setSelectedSquares([]);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Router>
        <Navbar
          onModeChange={handleModeChange}
          onConfirm={handleBuySquare} // Pass handleBuySquare to Navbar
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
