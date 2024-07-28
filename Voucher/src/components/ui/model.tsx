import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model: React.FC<{ path: string; postion: [number, number, number] }> = ({
  path,
  postion,
}) => {
  const glft = useLoader(GLTFLoader, path);

  return <primitive object={glft.scene} position={postion} />;
};

export default Model;
