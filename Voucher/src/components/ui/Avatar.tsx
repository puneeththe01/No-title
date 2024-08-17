import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const AvatarModel: React.FC = () => {
  const { scene } = useGLTF("/stumble.glb");
  return <primitive object={scene} scale={[1, 1, 1]} />;
};

const AvatarCanvas: React.FC = () => {
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [initialPosition] = useState({
    position: new THREE.Vector3(0, 0, 5),
    rotation: new THREE.Euler(0, 0, 0),
  });
  const [returning, setReturning] = useState(false);

  useFrame(() => {
    if (returning && controlsRef.current && cameraRef.current) {
      const { position, rotation } = initialPosition;
      controlsRef.current.target.lerp(position, 0.1);
      cameraRef.current.position.lerp(position, 0.1);
      cameraRef.current.rotation.x = THREE.MathUtils.lerp(
        cameraRef.current.rotation.x,
        rotation.x,
        0.1
      );
      cameraRef.current.rotation.y = THREE.MathUtils.lerp(
        cameraRef.current.rotation.y,
        rotation.y,
        0.1
      );
      cameraRef.current.rotation.z = THREE.MathUtils.lerp(
        cameraRef.current.rotation.z,
        rotation.z,
        0.1
      );

      // Stop returning when the position and rotation are close to the initial values
      if (
        cameraRef.current.position.distanceTo(position) < 0.01 &&
        Math.abs(cameraRef.current.rotation.x - rotation.x) < 0.01 &&
        Math.abs(cameraRef.current.rotation.y - rotation.y) < 0.01 &&
        Math.abs(cameraRef.current.rotation.z - rotation.z) < 0.01
      ) {
        setReturning(false);
      }
    }
  });

  const handleControlEnd = () => {
    setReturning(true);
  };

  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <AvatarModel />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        onEnd={handleControlEnd}
      />
    </>
  );
};

const Avatar: React.FC = () => {
  return (
    <div
      className="avatar-container z-0"
      style={{ width: "200px", height: "275px" }}
    >
      <Canvas
        style={{ background: "transparent" }}
        camera={{ position: [0, 0, 5] }}
      >
        <AvatarCanvas />
      </Canvas>
    </div>
  );
};

export default Avatar;
