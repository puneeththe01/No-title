import { doc, setDoc } from "firebase/firestore";
import { db } from "./FirebaseCred";

interface UserData {
  userName: string;
  email: string;
  age: number;
  coins: number;
  assets: number;
  ownedSquares: string[];
  streak: number;
  signInLog: string[];
}

const saveUserData = async (userId: string, userData: UserData) => {
  try {
    await setDoc(doc(db, "userData", userId), userData);
    console.log("Document written with ID: ", userId);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export { saveUserData };
