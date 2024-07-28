// src/components/HomePage.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./components/ui/model";

const HomePage: React.FC = () => {
  return (
    <div className="h-screen w-full bg-gray-900">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[100, 100, 2]} />
          <meshStandardMaterial color="grey" />
        </mesh>
        <Model path="/road_free.glb" postion={[0, 0, 1]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default HomePage;
