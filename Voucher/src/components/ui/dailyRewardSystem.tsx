import { doc, getDoc, updateDoc } from "firebase/firestore";
import { authent, db } from "@/FirebaseCred";

interface UserData {
  streak: number;
  signInLog: string[];
  coins: number;
}

export const checkDailyReward = async (): Promise<{
  rewardGiven: boolean;
  rewardAmount: number;
}> => {
  try {
    const user = authent.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userID = user.uid;
    const userDocRef = doc(db, "userData", userID);
    const userDocSnapshot = await getDoc(userDocRef);

    const baseDailyReward = 500;
    const weeklyBonusIncrement = 50;
    const weeklyBonusThreshold = 7;

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data() as UserData;
      const { streak, signInLog, coins } = userData;
      const today = new Date().toDateString();

      // Check if the user logged in today already
      const lastLoginDate = signInLog[signInLog.length - 1];
      if (lastLoginDate !== today) {
        // User has logged in for the first time today
        const newStreak = checkStreak(streak, lastLoginDate);

        // Calculate the daily reward with potential weekly bonus
        let currentDailyReward = baseDailyReward;
        if (newStreak >= weeklyBonusThreshold) {
          currentDailyReward +=
            weeklyBonusIncrement * Math.floor(newStreak / weeklyBonusThreshold);
        }

        // Apply additional bonus if streak is a multiple of the weekly threshold
        const bonus =
          newStreak % weeklyBonusThreshold === 0 ? currentDailyReward * 3 : 0;
        const newCoins = coins + currentDailyReward + bonus;

        // Update Firestore with new streak, today's login date, and new coin balance
        const updatedSignInLog = [...signInLog, today];
        await updateDoc(userDocRef, {
          streak: newStreak,
          signInLog: updatedSignInLog,
          coins: newCoins,
        });

        return { rewardGiven: true, rewardAmount: currentDailyReward + bonus };
      } else {
        return { rewardGiven: false, rewardAmount: 0 };
      }
    } else {
      console.log("No user data found for this user.");
      return { rewardGiven: false, rewardAmount: 0 };
    }
  } catch (error) {
    console.error("Error checking daily reward:", error);
    return { rewardGiven: false, rewardAmount: 0 };
  }
};

const checkStreak = (streak: number, lastLoginDate: string): number => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();

  if (streak === 0) {
    return 1; // Start a new streak
  } else if (lastLoginDate === yesterdayString) {
    return streak + 1; // Continue the streak
  } else {
    return 1; // Reset streak to 1
  }
};
