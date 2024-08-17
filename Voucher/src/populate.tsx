// import React from "react";
// import { getFirestore, doc, setDoc } from "firebase/firestore";
// import { useEffect } from "react";
// import { app } from "@/FirebaseCred"; // Make sure this path points to your Firebase initialization file

// const PopulateGrid: React.FC = () => {
//   const gridSize = 48; // 48x48 grid
//   const bigSquareSize = 6; // 6x6 grid inside each big square
//   const db = getFirestore(app);

//   const isRoad = (x: number, z: number): boolean => {
//     // Calculate if the square is a road
//     const isBorderX =
//       x % bigSquareSize === 0 || x % bigSquareSize === bigSquareSize - 1;
//     const isBorderZ =
//       z % bigSquareSize === 0 || z % bigSquareSize === bigSquareSize - 1;
//     return isBorderX || isBorderZ;
//   };

//   const populateGrid = async () => {
//     for (let x = 0; x < gridSize; x++) {
//       for (let z = 0; z < gridSize; z++) {
//         const squareName = `square${x}_${z}`;
//         const squareData = {
//           isRoad: isRoad(x, z),
//           isForSale: !isRoad(x, z),
//           ownerId: null,
//           value: 5000,
//         };

//         try {
//           await setDoc(doc(db, "virtualWorldGrid", squareName), squareData);
//           console.log(`Square ${squareName} added successfully.`);
//         } catch (error) {
//           console.error(`Error adding square ${squareName}:`, error);
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     populateGrid();
//   }, []);

//   return (
//     <div>
//       <h1>Populating the Grid...</h1>
//     </div>
//   );
// };

// export default PopulateGrid;
