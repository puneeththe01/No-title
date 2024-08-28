import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { checkBuildCompatibility } from "@/checkBuildCompatibility"; // Import the compatibility function

interface GridProps {
  mode: "buy" | "sell" | "build" | "none";
  userId: string | null;
  selectedSquareStrings: string[];
  setSelectedSquareStrings: React.Dispatch<React.SetStateAction<string[]>>;
  selectedHouseType: "small" | "medium" | "large"; // Add this prop for house type
}

const Grid: React.FC<GridProps> = ({
  mode,
  userId,
  selectedSquareStrings,
  setSelectedSquareStrings,
  selectedHouseType, // Use the selected house type
}) => {
  const gridSize = 48; // Total size of the grid
  const smallSquareSize = 1; // Size of each small square
  const bigSquareSize = 6; // 6x6 grid inside each big square
  const reservedSquares = new Set<number>(); // Add reserved squares if needed
  const [selectedSquares, setSelectedSquares] = useState<Set<number>>(
    new Set()
  );
  const [ownedSquares, setOwnedSquares] = useState<string[]>([]);
  const db = getFirestore();

  const calculateCoordinates = (index: number): { x: number; z: number } => {
    const x = Math.floor(index / gridSize);
    const z = index % gridSize;
    return { x, z };
  };

  useEffect(() => {
    const fetchOwnedSquares = async () => {
      if ((mode === "sell" || mode === "build") && userId) {
        const userDocRef = doc(db, "userData", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setOwnedSquares(userData.ownedSquares || []);
        }
      }
    };
    fetchOwnedSquares();
  }, [mode, userId, db]);

  useEffect(() => {
    const updatedSquareStrings = Array.from(selectedSquares).map((index) => {
      const coordinates = calculateCoordinates(index);
      return `square${coordinates.x}_${coordinates.z}`;
    });
    setSelectedSquareStrings(updatedSquareStrings);
  }, [selectedSquares, setSelectedSquareStrings]);

  useEffect(() => {
    if (mode === "none") {
      const greyOutSquares = () => {
        setSelectedSquares((prevSelected) => {
          const newSet = new Set(prevSelected);
          return newSet;
        });
        setOwnedSquares((prevOwned) => [...prevOwned]);
      };

      greyOutSquares();

      setTimeout(() => {
        setSelectedSquares(new Set());
        setOwnedSquares([]);
      }, 500); // 500ms delay
    }
  }, [mode]);

  const handleSquareClick = (index: number) => {
    if (mode === "none") return;
    if (reservedSquares.has(index)) return;

    const coordinates = calculateCoordinates(index);
    const squareName = `square${coordinates.x}_${coordinates.z}`;

    const isBorderX =
      coordinates.x % bigSquareSize === 0 ||
      coordinates.x % bigSquareSize === bigSquareSize - 1;
    const isBorderZ =
      coordinates.z % bigSquareSize === 0 ||
      coordinates.z % bigSquareSize === bigSquareSize - 1;
    const isRoad = isBorderX || isBorderZ;

    if (isRoad) return; // Do not allow selecting roads

    if (
      (mode === "sell" || mode === "build") &&
      !ownedSquares.includes(squareName)
    )
      return;

    setSelectedSquares((prev) => {
      const newSet = new Set(prev);

      // Add or remove square from the selection
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }

      return newSet;
    });
  };

  const createSquare = (
    x: number,
    z: number,
    index: number,
    isRoad: boolean
  ) => {
    const coordinates = calculateCoordinates(index);
    const squareName = `square${coordinates.x}_${coordinates.z}`;
    const isOwned = ownedSquares.includes(squareName);
    const isSelected = selectedSquares.has(index);

    return (
      <mesh
        key={index}
        position={[x, 0, z]} // Ensures an array of exactly three numbers
        onClick={() => handleSquareClick(index)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[smallSquareSize, 0.1, smallSquareSize]} />
        <meshStandardMaterial
          color={
            isSelected
              ? "green"
              : isOwned
              ? "blue"
              : isRoad
              ? "gray"
              : reservedSquares.has(index)
              ? "red"
              : "white"
          }
        />
      </mesh>
    );
  };

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
