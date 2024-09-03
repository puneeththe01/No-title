import React, { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { authent } from "../FirebaseCred";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = () => {
    signInWithEmailAndPassword(authent, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        setError("");
        navigate("/"); // Redirect to home page on successful login
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        console.error("Error logging in:", errorMessage);
      });
  };

  const createAccount = () => {
    navigate("/signup");
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center font-lato">
      <div className="flex flex-col w-96 min-h-72 bg-white items-center p-6 rounded-xl shadow-md">
        <div className="text-4xl font-extrabold text-blue-600 mb-2">Login</div>
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
            <FiLock className="text-gray-600" size={24} />
            <input
              type="password"
              placeholder="Password"
              className="flex-1 bg-gray-200 outline-none pl-3 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-2 self-start pl-3">
          <a href="#" className="text-blue-600">
            Forgot your password?
          </a>
        </div>
        <div className="flex justify-center w-full mt-6">
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-lg text-white bg-blue-600"
          >
            Login
          </button>
        </div>
        <div>
          <a href="" onClick={createAccount} className="text-blue-600">
            I don't have account? Create an account
          </a>
        </div>
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
