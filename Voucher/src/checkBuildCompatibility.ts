export type BuildType = "small" | "medium" | "large" | null;

export function checkBuildCompatibility(
  selectedSquares: string[], // square names like "squareX_Z"
  buildType: BuildType
): boolean {
  const extractCoordinates = (squareName: string) => {
    const [xStr, zStr] = squareName.replace("square", "").split("_");
    return { x: parseInt(xStr), z: parseInt(zStr) };
  };

  const squares = selectedSquares.map(extractCoordinates);

  const tempX: number[] = [];
  const tempZ: number[] = [];

  squares.forEach((square) => {
    if (!tempX.includes(square.x)) {
      tempX.push(square.x);
    }
    if (!tempZ.includes(square.z)) {
      tempZ.push(square.z);
    }
  });

  const is2x2Grid = tempX.length === 2 && tempZ.length === 2;

  switch (buildType) {
    case "small":
      return squares.length === 1;
    case "medium":
      return squares.length === 2 && isAdjacent(squares[0], squares[1]);
    case "large":
      return squares.length === 4 && is2x2Grid;
    default:
      return false;
  }
}

function isAdjacent(a: { x: number; z: number }, b: { x: number; z: number }): boolean {
  return (
    (a.x === b.x && Math.abs(a.z - b.z) === 1) ||
    (a.z === b.z && Math.abs(a.x - b.x) === 1)
  );
}
