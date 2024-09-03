import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles

const RewardSystem: React.FC = () => {
  const [coins, setCoins] = useState<number>(0); // Total coins earned
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(null); // Last check-in date
  const [weeklyIncrement, setWeeklyIncrement] = useState<number>(50); // Initial weekly increment
  const [showPopup, setShowPopup] = useState<boolean>(false); // Control the display of the popup
  const [streak, setStreak] = useState<number>(0); // Track login streak
  const [loginDates, setLoginDates] = useState<string[]>([]); // Track all login dates for calendar view

  useEffect(() => {
    // Retrieve stored data from local storage
    const storedCheckInDate = localStorage.getItem("lastCheckInDate");
    const storedStreak = localStorage.getItem("streak");
    const storedLoginDates = JSON.parse(
      localStorage.getItem("loginDates") || "[]"
    ) as string[];
    const today = new Date().toDateString();

    if (storedCheckInDate !== today) {
      handleLogin();
    } else {
      setShowPopup(false);
    }

    if (storedStreak) {
      setStreak(parseInt(storedStreak, 10)); // Initialize streak from local storage
    }

    setLoginDates(storedLoginDates); // Initialize login dates from local storage
  }, []);

  // Function to simulate user login and reward check-in
  const handleLogin = () => {
    const today = new Date().toDateString();

    // Reward the user and set the last check-in date
    setCoins((prevCoins) => prevCoins + weeklyIncrement);
    setLastCheckInDate(today);

    // Calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    if (lastCheckInDate === yesterdayString) {
      // Increase streak if login is consecutive
      setStreak((prevStreak) => {
        const newStreak = prevStreak + 1;
        localStorage.setItem("streak", newStreak.toString()); // Update streak in local storage
        return newStreak;
      });
    } else {
      // Reset streak if not consecutive
      setStreak(1);
      localStorage.setItem("streak", "1"); // Reset streak in local storage
    }

    // Update login dates for calendar
    const updatedLoginDates = [...loginDates, today];
    setLoginDates(updatedLoginDates);
    localStorage.setItem("loginDates", JSON.stringify(updatedLoginDates)); // Store login dates in local storage

    // Store the last check-in date in local storage
    localStorage.setItem("lastCheckInDate", today);

    // Show the popup notification
    setShowPopup(true);

    // Automatically hide the popup after a few seconds
    setTimeout(() => setShowPopup(false), 3000); // Hide after 3 seconds
  };

  // Function to handle hiding the popup when "Cancel" is clicked
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Effect to handle weekly increment increase every 7 days
  useEffect(() => {
    const checkWeeklyIncrease = () => {
      const startDate = new Date(); // Date when the reward system started
      const today = new Date();

      // Calculate the number of weeks passed
      const weeksPassed = Math.floor(
        (today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );

      // Increment weekly coins by 5 for each week passed
      setWeeklyIncrement(50 + weeksPassed * 5);
    };

    checkWeeklyIncrease();

    // Set an interval to check weekly increments every day
    const intervalId = setInterval(checkWeeklyIncrease, 24 * 60 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to determine if a date should be highlighted on the calendar
  const tileClassName = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }): string | null => {
    if (view === "month") {
      const dateString = date.toDateString();
      if (loginDates.includes(dateString)) {
        return "highlight";
      }
    }
    return null;
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Reward System</h1>
      <p>Total Coins: {coins}</p>
      <p>Login Streak: {streak} days</p>
      <button onClick={handleLogin}>Daily Check-In</button>
      <p>Current Weekly Increment: {weeklyIncrement} coins/day</p>

      {/* Calendar View */}
      <div style={{ margin: "20px auto", width: "300px" }}>
        <Calendar tileClassName={tileClassName} />
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid black",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            width: "300px",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          {/* Close (Cancel) Button */}
          <button
            onClick={handleClosePopup}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
          <p>
            You have logged in successfully and earned {weeklyIncrement} coins
            today!
          </p>
        </div>
      )}
    </div>
  );
};

export default RewardSystem;
