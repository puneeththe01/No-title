import React, { useEffect, useState } from "react";
import { buySquare } from "@/buySquare";

interface GridProps {
  mode: "buy" | "sell" | "none";
  userId: string | null;
  selectedSquareStrings: string[];
  setSelectedSquareStrings: React.Dispatch<React.SetStateAction<string[]>>;
}

const Grid: React.FC<GridProps> = ({
  mode,
  userId,
  selectedSquareStrings,
  setSelectedSquareStrings,
}) => {
  const gridSize = 48; // Total size of the grid
  const smallSquareSize = 1; // Size of each small square
  const bigSquareSize = 6; // 6x6 grid inside each big square
  const reservedSquares = new Set<number>(); // Add reserved squares if needed
  const [selectedSquares, setSelectedSquares] = useState<Set<number>>(
    new Set()
  );

  const calculateCoordinates = (index: number): { x: number; z: number } => {
    const x = Math.floor(index / gridSize);
    const z = index % gridSize;
    return { x, z };
  };

  useEffect(() => {
    // Update selectedSquareStrings based on selectedSquares
    const updatedSquareStrings = Array.from(selectedSquares).map((index) => {
      const coordinates = calculateCoordinates(index);
      return `square${coordinates.x}_${coordinates.z}`;
    });
    setSelectedSquareStrings(updatedSquareStrings);
  }, [selectedSquares, calculateCoordinates, setSelectedSquareStrings]);

  const handleSquareClick = (index: number) => {
    if (mode === "none") return; // Only allow selection in buy or sell mode
    if (reservedSquares.has(index)) return; // Cannot select reserved squares

    setSelectedSquares((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });

    console.log(
      `Square selected: square${calculateCoordinates(index).x}_${
        calculateCoordinates(index).z
      }`
    );
  };

  const createSquare = (
    x: number,
    z: number,
    index: number,
    isRoad: boolean
  ) => (
    <mesh
      key={index}
      position={[x, 0, z]} // Position square
      onClick={() => handleSquareClick(index)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[smallSquareSize, 0.1, smallSquareSize]} />
      <meshStandardMaterial
        color={
          isRoad
            ? "gray"
            : reservedSquares.has(index)
            ? "red"
            : selectedSquares.has(index)
            ? "green"
            : "white"
        }
      />
    </mesh>
  );

  const squares = [];
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const index = x * gridSize + z;
      const isBorderX =
        x % bigSquareSize === 0 || x % bigSquareSize === bigSquareSize - 1;
      const isBorderZ =
        z % bigSquareSize === 0 || z % bigSquareSize === bigSquareSize - 1;
      const isRoad = isBorderX || isBorderZ;

      squares.push(
        createSquare(x - gridSize / 2, z - gridSize / 2, index, isRoad)
      );
    }
  }

  return <group>{squares}</group>;
};

export default Grid;
