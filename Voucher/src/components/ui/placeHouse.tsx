import { Vector3 } from "three";

interface HousePlacement {
  squares: string[];
  houseType: "small" | "medium" | "large";
}

const calculateCoordinates = (squareName: string, gridSize: number) => {
  const [x, z] = squareName.replace("square", "").split("_").map(Number);

  const centerX = Math.floor(gridSize / 2);
  const centerZ = Math.floor(gridSize / 2);

  const positionX = x - centerX;
  const positionZ = z - centerZ;

  return new Vector3(positionX, 0.5, positionZ);
};

const placeHouse = (
  housePlacement: HousePlacement,
  gridSize: number,
  setHousePlacement: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const { squares, houseType } = housePlacement;

  const positions = squares.map((square) =>
    calculateCoordinates(square, gridSize)
  );

  let finalPosition: Vector3;

  if (houseType === "small") {
    finalPosition = positions[0];
  } else if (houseType === "medium") {
    const [pos1, pos2] = positions;
    finalPosition = new Vector3(
      (pos1.x + pos2.x) / 2,
      0.5,
      (pos1.z + pos2.z) / 2
    );
  } else if (houseType === "large") {
    const [pos1, , , pos4] = positions;
    finalPosition = new Vector3(
      (pos1.x + pos4.x) / 2,
      0.5,
      (pos1.z + pos4.z) / 2
    );
  }

  setHousePlacement((prev) => [
    ...prev,
    { squares, houseType, position: finalPosition },
  ]);
};

export default placeHouse;
