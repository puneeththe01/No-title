import { authent, db } from "@/FirebaseCred";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const fetchUsername = async (): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(authent, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "userData", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            resolve(userDoc.data()?.userName || null);
          } else {
            console.error("No such user document!");
            resolve(null);
          }
        } catch (error) {
          console.error("Error fetching user document: ", error);
          reject(error);
        }
      } else {
        resolve(null);
      }
    });

    return () => unsubscribe();
  });
};

export const pushBuildingData = async (documentId: string, data: any) => {
  try {
    const docRef = doc(db, "buildingPosition", documentId);
    await setDoc(docRef, data);
    console.log("Document successfully written!");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
};
