import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Grid from "@/components/ui/Grid";
import CameraControl from "@/components/ui/CameraControl";
import { onAuthStateChanged } from "firebase/auth";
import { authent } from "@/FirebaseCred";

interface VirtualWorldPageProps {
  mode: "buy" | "sell" | "none";
  selectedSquares: string[];
  setSelectedSquares: React.Dispatch<React.SetStateAction<string[]>>;
  userId: string | null;
}

const VirtualWorldPage: React.FC<VirtualWorldPageProps> = ({
  mode,
  selectedSquares,
  setSelectedSquares,
  userId,
}) => {
  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Canvas shadows camera={{ position: [0, 20, 20], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Grid
          mode={mode}
          userId={userId}
          selectedSquareStrings={selectedSquares}
          setSelectedSquareStrings={setSelectedSquares}
        />
        <CameraControl />
      </Canvas>
    </div>
  );
};

export default VirtualWorldPage;
