import { db } from "./FirebaseCred";
import {
  collection,
  getDoc,
  doc,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";

export const buySquare = async (selectedSquares: string[], userId: string) => {
  const userDoc = doc(db, "userData", userId); // User document reference
  const userSnapshot = await getDoc(userDoc);

  if (!userSnapshot.exists()) {
    alert("User not found!");
    return;
  }

  const userData = userSnapshot.data();
  const userBalance = userData?.coins || 0;

  const squareDocs = selectedSquares.map((index) =>
    getDoc(doc(db, "virtualWorldGrid", index))
  );

  const squareSnapshots = await Promise.all(squareDocs);

  let totalCost = 0;
  let allForSale = true;

  squareSnapshots.forEach((snapshot) => {
    const squareData = snapshot.data();
    if (squareData) {
      if (!squareData.isForSale) {
        allForSale = false;
      }
      totalCost += squareData.value;
    }
  });

  if (!allForSale) {
    alert("Some of the squares you selected are owned by another user.");
    return;
  }

  if (userBalance < totalCost) {
    alert("Insufficient balance!");
    return;
  }

  const batch = writeBatch(db);

  selectedSquares.forEach((index) => {
    const squareRef = doc(db, "virtualWorldGrid", index);
    batch.update(squareRef, {
      ownerId: userId, // Set the ownerId to the current user's ID
      isForSale: false,
    });
  });

  batch.update(userDoc, {
    coins: userBalance - totalCost,
    ownedSquares: arrayUnion(...selectedSquares), // Add selectedSquares to the ownedSquares array
  });

  await batch.commit();
  alert("Purchase successful!");
};
