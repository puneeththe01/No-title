import React from "react";
import { Canvas } from "@react-three/fiber";
import Grid from "@/components/ui/Grid";
import CameraControl from "@/components/ui/CameraControl";

interface VirtualWorldPageProps {
  mode: "buy" | "sell" | "build" | "none";
  selectedSquares: string[];
  setSelectedSquares: React.Dispatch<React.SetStateAction<string[]>>;
  userId: string | null;
  selectedHouseType: "small" | "medium" | "large" | null; // New prop for selected house type
}

const VirtualWorldPage: React.FC<VirtualWorldPageProps> = ({
  mode,
  selectedSquares,
  setSelectedSquares,
  userId,
  selectedHouseType, // Accept the selected house type
}) => {
  const effectiveHouseType = selectedHouseType || "small"; // Provide a default value

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
          selectedHouseType={effectiveHouseType} // Pass the effective house type
        />
        <CameraControl />
      </Canvas>
    </div>
  );
};

export default VirtualWorldPage;
