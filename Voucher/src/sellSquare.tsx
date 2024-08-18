import { db } from "./FirebaseCred"; // Import the Firestore instance from your FirebaseCred.tsx
import { doc, getDoc, writeBatch } from "firebase/firestore";

interface SellSquareProps {
  selectedSquares: string[];
  userId: string;
}

export const sellSquare = async ({
  selectedSquares,
  userId,
}: SellSquareProps) => {
  try {
    const userRef = doc(db, "userData", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      alert("User data not found.");
      return;
    }

    const userData = userDoc.data();
    const userSquares: string[] = userData?.ownedSquares || [];
    let totalValue = 0;

    // Filter squares to be sold and calculate their total value
    const squaresToSell = await Promise.all(
      selectedSquares.map(async (square) => {
        if (userSquares.includes(square)) {
          const squareRef = doc(db, "virtualWorldGrid", square);
          const squareDoc = await getDoc(squareRef);
          if (squareDoc.exists()) {
            const squareData = squareDoc.data();
            totalValue += squareData.value; // Add square value to totalValue
            return square;
          }
        }
        return null;
      })
    );

    // Filter out null values
    const validSquaresToSell = squaresToSell.filter(
      (square) => square !== null
    ) as string[];

    if (validSquaresToSell.length === 0) {
      alert("You do not own any of the selected squares.");
      return;
    }

    const batch = writeBatch(db);

    // Update each square in the virtualWorldGrid collection
    validSquaresToSell.forEach((square: string) => {
      const squareRef = doc(db, "virtualWorldGrid", square);
      batch.update(squareRef, {
        isForSale: true,
        ownerId: null,
      });
    });

    // Update the user's ownedSquares array
    const updatedOwnedSquares = userSquares.filter(
      (square: string) => !validSquaresToSell.includes(square)
    );
    batch.update(userRef, {
      ownedSquares: updatedOwnedSquares,
      coins: userData.coins + totalValue, // Add the totalValue to the user's coins
    });

    // Commit the batch
    await batch.commit();

    alert(
      `Sale successful! The selected squares are now for sale. You earned ${totalValue} coins.`
    );
  } catch (error) {
    console.error("Error selling squares: ", error);
    alert("There was an error processing your sale. Please try again.");
  }
};
