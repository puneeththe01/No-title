import React, { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

extend({ OrbitControls });

const CameraControl: React.FC = () => {
  const controlsRef = useRef<any>();
  const minHeight = 1; // Minimum height above the plane
  const maxHeight = 50; // Maximum height above the plane
  const maxX = 50; // Maximum x boundary
  const maxZ = 50; // Maximum z boundary

  useFrame(() => {
    if (controlsRef.current) {
      const { x, y, z } = controlsRef.current.object.position;

      // Ensure the camera stays within the specified height range
      if (y < minHeight) {
        controlsRef.current.object.position.y = minHeight;
      } else if (y > maxHeight) {
        controlsRef.current.object.position.y = maxHeight;
      }

      // Ensure the camera stays within the specified x and z boundaries
      if (x > maxX) controlsRef.current.object.position.x = maxX;
      if (x < -maxX) controlsRef.current.object.position.x = -maxX;
      if (z > maxZ) controlsRef.current.object.position.z = maxZ;
      if (z < -maxZ) controlsRef.current.object.position.z = -maxZ;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      minPolarAngle={0} // Allow looking straight down
      maxPolarAngle={Math.PI / 2 - 0.1} // Prevent looking below the plane with a small margin
      minDistance={1} // Allow the camera to get very close to the plane without intersecting it
      maxDistance={100} // Optional: Prevent the camera from zooming out too far
    />
  );
};

export default CameraControl;
