import { Vector3 } from "three";
import { fetchUsername, pushBuildingData } from "@/firebaseUtils"; // Adjust path as needed

interface HousePlacement {
  squares: string[];
  houseType: "small" | "medium" | "large" | null;
  rotationValue: React.Dispatch<React.SetStateAction<number>>;
}

const calculateCoordinates = (squareName: string, gridSize: number) => {
  const [x, z] = squareName.replace("square", "").split("_").map(Number);

  const centerX = Math.floor(gridSize / 2);
  const centerZ = Math.floor(gridSize / 2);

  const positionX = x - centerX;
  const positionZ = z - centerZ;

  return new Vector3(positionX, 0.5, positionZ);
};

const convertVector3ToPlainObject = (vector: Vector3) => {
  return { x: vector.x, y: vector.y, z: vector.z };
};

const housePlacement = async (
  housePlacement: HousePlacement,
  gridSize: number
): Promise<Vector3> => {
  const { squares, houseType, rotationValue } = housePlacement;

  const username = await fetchUsername(); // Fetch username using the utility function

  const positions = squares.map((square) =>
    calculateCoordinates(square, gridSize)
  );

  let finalPosition = new Vector3(0, 0.5, 0); // Default value

  if (houseType === "small") {
    const pos = positions[0];
    finalPosition = new Vector3(pos.x, 0.5, pos.z);
  } else if (houseType === "medium") {
    const [pos1, pos2] = positions;
    finalPosition = new Vector3(
      (pos1.x + pos2.x) / 2,
      0.5,
      (pos1.z + pos2.z) / 2
    );
    if (pos1.x === pos2.x) {
      rotationValue(90);
    }
  } else if (houseType === "large") {
    const [pos1, pos2, pos3, pos4] = positions;
    finalPosition = new Vector3(
      (pos1.x + pos2.x + pos3.x + pos4.x) / 4,
      0.5,
      (pos1.z + pos2.z + pos3.z + pos4.z) / 4
    );
  }

  if (username) {
    let angel = 0;
    if (houseType == "medium") {
      const [pos1, pos2] = positions;
      if (pos1.x === pos2.x) {
        angel = 90;
      }
    }
    const buildingData = {
      userName: username,
      centerPosition: convertVector3ToPlainObject(finalPosition), // Convert Vector3 to plain object
      houseType: houseType,
      pairedSquares: squares,
      angel: angel,
    };

    await Promise.all(
      squares.map((square) => pushBuildingData(square, buildingData)) // Push data using the utility function
    );

    console.log(finalPosition);
  }

  return finalPosition;
};

export default housePlacement;
