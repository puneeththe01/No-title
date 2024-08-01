import React, { useState } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { authent } from "./FirebaseCred";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { saveUserData } from "./SaveUserData";
import { FaChild } from "react-icons/fa";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Initialize navigate

  const handleSignup = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(authent, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed up:", user);
        setError("");

        saveUserData(user.uid, {
          userName: username,
          email: email,
          age: age,
          coins: 0,
          assets: 0,
        });

        navigate("/login"); // Redirect
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        console.error("Error signing up:", errorMessage);
      });
  };

  const loginToAccount = () => {
    navigate("/login");
  };

  const handleAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setAge(value ? parseInt(value) : 0);
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center font-lato">
      <div className="flex flex-col w-96 min-h-72 bg-white items-center p-6 rounded-xl shadow-md">
        <div className="text-4xl font-extrabold text-blue-600 mb-2">
          Sign up
        </div>
        <div className="h-1 w-16 bg-blue-600 rounded mb-6"></div>
        <div className="space-y-6 w-full">
          <div className="flex items-center bg-gray-200 rounded-md p-3">
            <FiMail className="text-gray-600" size={24} />
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-gray-200 outline-none pl-3 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-gray-200 rounded-md p-3">
            <FiUser className="text-gray-600" size={24} />
            <input
              type="text"
              placeholder="Username"
              className="flex-1 bg-gray-200 outline-none pl-3 text-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-gray-200 rounded-md p-3">
            <FaChild className="text-gray-600" size={24} />
            <input
              type="text"
              placeholder="Age"
              className="flex-1 bg-gray-200 outline-none pl-3 text-lg"
              value={age}
              onChange={handleAge}
            />
          </div>
          <div className="flex items-center bg-gray-200 rounded-md p-3">
            <FiLock className="text-gray-600" size={24} />
            <input
              type="password"
              placeholder="Password"
              className="flex-1 bg-gray-200 outline-none pl-3 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-gray-200 rounded-md p-3">
            <FiLock className="text-gray-600" size={24} />
            <input
              type="password"
              placeholder="Confirm Password"
              className="flex-1 bg-gray-200 outline-none pl-3 text-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center w-full mt-6">
          <button
            onClick={handleSignup}
            className="px-4 py-2 rounded-lg text-white bg-blue-600"
          >
            Sign up
          </button>
        </div>
        <div>
          <a href="#" onClick={loginToAccount} className="text-blue-600">
            I already have an account
          </a>
        </div>
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default Signup;
