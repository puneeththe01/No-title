import React from "react";

interface PopupProps {
  rewardAmount: number;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ rewardAmount, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
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
      <button
        onClick={onClose}
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
        You have logged in successfully and earned {rewardAmount} coins today!
      </p>
    </div>
  );
};

export default Popup;
