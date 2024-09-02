export type BuildType = "small" | "medium" | "large" | null;

export function checkBuildCompatibility(
  selectedSquares: string[], // square names like "squareX_Z"
  buildType: BuildType,
): boolean {
  const extractCoordinates = (squareName: string) => {
    const [xStr, zStr] = squareName.replace("square", "").split("_");
    return { x: parseInt(xStr), z: parseInt(zStr) };
  };

  const squares: { x: number; z: number }[] = selectedSquares.map(extractCoordinates);
  console.log(squares)

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

  let isCompatible = false;

  switch (buildType) {
    case "small":
      isCompatible = squares.length === 1;
      break;
    case "medium":
      isCompatible = squares.length === 2 && isAdjacent(squares[0], squares[1]);
      break;
    case "large":
      isCompatible = squares.length === 4 && is2x2Grid;
      break;
    default:
      isCompatible = false;
  }

  return isCompatible;
}

function isAdjacent(a: { x: number; z: number }, b: { x: number; z: number }): boolean {
  return (
    (a.x === b.x && Math.abs(a.z - b.z) === 1) ||
    (a.z === b.z && Math.abs(a.x - b.x) === 1)
  );
}
