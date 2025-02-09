import React, { useState } from "react";
import Video from "../Assets/Farmer.mp4";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Input validation
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      // Send a POST request to the backend login endpoint
      const response = await axios.post(
        "/login", // Replace with your backend login endpoint
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // To include cookies if needed
        }
      );

      if (response.status === 200) {
        // Store token or user information in localStorage or state management
        const { token, user } = response.data;
        if (rememberMe) {
          localStorage.setItem("userToken", token); // Store token for persistent login
          localStorage.setItem("userDetails", JSON.stringify(user));
        } else {
          sessionStorage.setItem("userToken", token);
          sessionStorage.setItem("userDetails", JSON.stringify(user));
        }

        alert("Login successful!");
        navigate("/dashboard"); // Redirect to the dashboard or any protected route
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to log in. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={Video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 w-full max-w-md bg-green-100 p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">
          <span className="text-black font-semibold tracking-wide text-4xl">
            Fasal Bajar
          </span>
        </h1>
        <h2 className="text-3xl font-medium text-center mb-6">Welcome back</h2>
        <p className="text-md text-gray-600 text-center mb-6">
          Please sign in to your account
        </p>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-center font-semibold mb-4">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSignIn}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-sm text-right text-black font-semibold mt-1.5">
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-green-500 font-semibold text-xl text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Create Account Link */}
        <div className="text-center mt-6 text-sm">
          <p>
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600">
              Create new account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
