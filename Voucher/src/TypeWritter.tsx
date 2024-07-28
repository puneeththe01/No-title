import React, { useState, useEffect } from "react";

const Typewriter: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, 100); // Adjust the speed of typing by changing the interval duration
    return () => clearInterval(intervalId);
  }, [text]);

  return <div className="text-xl font-mono">{displayedText}</div>;
};

export default Typewriter;
