import React, { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import { authent, db } from "@/FirebaseCred";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ProfilePage: React.FC = () => {
  const [assets, setAssets] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [username, setUsername] = useState<string>("");

  const signOutUser = async () => {
    try {
      await signOut(authent);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getUserData = async () => {
    onAuthStateChanged(authent, async (user) => {
      if (user) {
        try {
          const userID = user.uid;
          const userDoc = doc(db, "userData", userID);
          const docSnap = await getDoc(userDoc);

          if (!docSnap.exists()) {
            console.log("No such document!");
            return;
          }

          const data = docSnap.data();
          Object.entries(data).map(([key, value]) => {
            if (key == "userName") {
              setUsername(value);
            } else if (key == "coins") {
              setCoins(value);
            } else if (key == "assets") {
              setAssets(value);
            }
          });
        } catch (error) {
          console.error("Error getting document:", error);
        }
      } else {
        console.error("No user is signed in.");
      }
    });
  };

  getUserData();

  return (
    <div className="bg-lightcolor h-screen p-4 mb-10">
      <div className="flex justify-between p-2">
        <p className="inline-flex text-lg font-lato">Assets: {assets}</p>
        <p className="inline-flex text-lg font-lato">Coins: {coins}</p>
      </div>
      <div className="flex justify-center items-center p-4">
        <Avatar />
      </div>
      <div className="p-4 pb-3">
        <p className="text-lg font-lato">Username: {username}</p>
      </div>
      <div className="p-4 pb-2">
        <p className="text-lg font-lato">Achievements</p>
      </div>
      <div className="flex justify-between p-4">
        <img src="/test-achieve.jpg" alt="no-image" />
        <img src="/test-achieve.jpg" alt="no-image" />
        <img src="/test-achieve.jpg" alt="no-image" />
      </div>
      <div className="p-4 pb-2">
        <p className="text-lg font-lato">Badge</p>
      </div>
      <div className="flex justify-between p-4">
        <img src="/test-badge-2.jpg" alt="no-badges" />
        <img src="/test-badge-2.jpg" alt="no-badges" />
        <img src="/test-badge-2.jpg" alt="no-badges" />
      </div>
      <div className="flex justify-center w-full mt-6 font-lato">
        <button
          onClick={signOutUser}
          className="px-4 py-2 rounded-lg text-white bg-blue-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
