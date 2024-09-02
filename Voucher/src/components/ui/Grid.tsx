import React, { useEffect, useState, useMemo } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { Vector3 } from "three";
import { useGLTF } from "@react-three/drei";

interface GridProps {
  mode: "buy" | "sell" | "build" | "none";
  userId: string | null;
  selectedSquareStrings: string[];
  setSelectedSquareStrings: React.Dispatch<React.SetStateAction<string[]>>;
  selectedHouseType: "small" | "medium" | "large" | null;
  housePosition: Vector3 | null;
  rotationValue: number;
}

const Grid: React.FC<GridProps> = ({
  mode,
  userId,
  setSelectedSquareStrings,
  selectedHouseType,
  housePosition,
}) => {
  const gridSize = 48;
  const smallSquareSize = 1;
  const bigSquareSize = 6;
  const reservedSquares = useMemo(() => new Set<number>(), []);
  const [selectedSquares, setSelectedSquares] = useState<Set<number>>(
    new Set()
  );
  const [ownedSquares, setOwnedSquares] = useState<string[]>([]);
  const [occupiedSquares, setOccupiedSquares] = useState<Set<string>>(
    new Set()
  );
  const [housesToRender, setHousesToRender] = useState<any[]>([]); // New state for houses to render
  const db = getFirestore();

  // Load the 3D models based on the selected house type
  const { scene: smallHouseModel } = useGLTF("./cube.glb");
  const { scene: mediumHouseModel } = useGLTF("./cubeMedium.glb");
  const { scene: largeHouseModel } = useGLTF("./cubeLarge.glb");

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

    const fetchOccupiedSquares = async () => {
      if (mode === "build") {
        const occupiedSquaresSet = new Set<string>();
        const querySnapshot = await getDocs(collection(db, "buildingPosition"));
        querySnapshot.forEach((doc) => {
          occupiedSquaresSet.add(doc.id); // doc.id is the square name
        });
        setOccupiedSquares(occupiedSquaresSet);
      } else {
        setOccupiedSquares(new Set());
      }
    };

    fetchOwnedSquares();
    fetchOccupiedSquares();
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
        setSelectedSquares(new Set());
        setOwnedSquares([]);
      };

      greyOutSquares();

      setTimeout(() => {
        setSelectedSquares(new Set());
        setOwnedSquares([]);
      }, 500); // 500ms delay
    }
  }, [mode]);

  useEffect(() => {
    const fetchHouseData = async () => {
      if (mode === "build") {
        const occupiedSquaresSet = new Set<string>();
        const houseToRenderSet = new Set<string>();

        const querySnapshot = await getDocs(collection(db, "buildingPosition"));
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          const squareName = doc.id;
          const centerPosition = docData.centerPosition;
          const houseType = docData.houseType;
          const rotateValue = docData.angel;

          occupiedSquaresSet.add(squareName);

          // Normalize centerPosition to a consistent string representation
          const normalizedCenterPosition = JSON.stringify({
            x: centerPosition.x,
            y: centerPosition.y,
            z: centerPosition.z,
          });

          // Create an object with necessary data
          const houseData = {
            centerPosition: normalizedCenterPosition,
            houseType,
            rotateValue,
          };

          // Add the object to the set to avoid duplicates
          houseToRenderSet.add(JSON.stringify(houseData));
        });

        console.log(houseToRenderSet);

        // Convert back to array of objects (optional, depending on your use case)
        const uniqueHousesToRender = Array.from(houseToRenderSet).map(
          (item) => {
            // Parse the JSON safely
            const parsedItem = JSON.parse(item) as {
              centerPosition: string; // Center position is a normalized string
              houseType: string;
              rotateValue: number;
            };

            // Parse centerPosition back to an object
            const parsedCenterPosition = JSON.parse(
              parsedItem.centerPosition
            ) as {
              x: number;
              y: number;
              z: number;
            };

            // Parse rotateValue as a number
            parsedItem.rotateValue = Number(parsedItem.rotateValue);

            return {
              centerPosition: parsedCenterPosition,
              houseType: parsedItem.houseType,
              rotateValue: parsedItem.rotateValue,
            };
          }
        );

        // Do something with uniqueHousesToRender, e.g., store it in state
        setHousesToRender(uniqueHousesToRender); // Store houses to render
      } else {
        setOccupiedSquares(new Set());
      }
    };

    fetchHouseData();
  }, [mode, db]);

  const handleSquareClick = (index: number) => {
    if (mode === "none") return; // Exits if the mode is "none"
    if (reservedSquares.has(index)) return; // Exits if the square is reserved

    const coordinates = calculateCoordinates(index);
    const squareName = `square${coordinates.x}_${coordinates.z}`;

    // Determine if the square is part of a road (border squares)
    const isBorderX =
      coordinates.x % bigSquareSize === 0 ||
      coordinates.x % bigSquareSize === bigSquareSize - 1;
    const isBorderZ =
      coordinates.z % bigSquareSize === 0 ||
      coordinates.z % bigSquareSize === bigSquareSize - 1;
    const isRoad = isBorderX || isBorderZ;

    if (isRoad) return; // Exits if the square is a road

    if (reservedSquares.has(index) || occupiedSquares.has(squareName)) return;

    // Exits if in "sell" or "build" mode and the square is not owned
    if (
      (mode === "sell" || mode === "build") &&
      !ownedSquares.includes(squareName)
    )
      return;

    // Toggle selection of the square
    setSelectedSquares((prev) => {
      const newSet = new Set(prev);
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
    const isOccupied = occupiedSquares.has(squareName);

    return (
      <mesh
        key={index}
        position={[x, 0, z]}
        onClick={() => handleSquareClick(index)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[smallSquareSize, 0.1, smallSquareSize]} />
        <meshStandardMaterial
          color={
            mode === "build" && isOccupied
              ? "red"
              : isSelected
              ? "green"
              : isOwned
              ? "blue"
              : isRoad
              ? "gray"
              : "white"
          }
        />
      </mesh>
    );
  };

  const squares = useMemo(() => {
    const tempSquares = [];
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const index = x * gridSize + z;
        const isBorderX =
          x % bigSquareSize === 0 || x % bigSquareSize === bigSquareSize - 1;
        const isBorderZ =
          z % bigSquareSize === 0 || z % bigSquareSize === bigSquareSize - 1;
        const isRoad = isBorderX || isBorderZ;

        tempSquares.push(
          createSquare(x - gridSize / 2, z - gridSize / 2, index, isRoad)
        );
      }
    }
    return tempSquares;
  }, [gridSize, bigSquareSize, createSquare]);

  const getHouseModel = (houseType: string) => {
    switch (houseType) {
      case "medium":
        return mediumHouseModel;
      case "large":
        return largeHouseModel;
      default:
        return smallHouseModel;
    }
  };

  // Add console logs to verify selectedHouseType
  useEffect(() => {
    console.log("Selected House Type:", selectedHouseType);
    console.log(housesToRender);
  }, [selectedHouseType]);

  return (
    <>
      {squares}
      {housesToRender.map((house, index) => {
        const { centerPosition, houseType, rotateValue } = house;
        const houseModel = getHouseModel(houseType)?.clone();
        const rotationArray =
          rotateValue === 90 ? [0, Math.PI / 2, 0] : [0, 0, 0];

        return houseModel ? (
          <primitive
            key={index}
            object={houseModel}
            position={
              new Vector3(centerPosition.x, centerPosition.y, centerPosition.z)
            }
            rotation={rotationArray} // Rotation applied to all houses
          />
        ) : null;
      })}
    </>
  );
};

export default Grid;
