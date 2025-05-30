import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Buyer"); // Default to "Buyer"
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    console.log({
      email,
      password,
      userType,
      rememberMe,
    });
    // Add logic for sign-in API integration here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-[#E3E7E0] p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">
          <span className="text-blue-600">Fasal Bajar</span>
        </h1>
        <h2 className="text-2xl font-medium text-center mb-6">Welcome back</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Please sign in to your account
        </p>

        <form onSubmit={handleSignIn}>
          {/* User Type Selection */}
          <div className="flex justify-center mb-4">
            <label className="mr-4">
              <input
                type="radio"
                value="Buyer"
                checked={userType === "Buyer"}
                onChange={(e) => setUserType(e.target.value)}
                className="mr-2"
              />
              Buyer
            </label>
            <label>
              <input
                type="radio"
                value="Seller"
                checked={userType === "Seller"}
                onChange={(e) => setUserType(e.target.value)}
                className="mr-2"
              />
              Seller
            </label>
          </div>

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
            <div className="text-sm text-right text-blue-600 mt-1">
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
            className="w-full bg-black text-xl text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign in
          </button>
        </form>

        {/* Create Account Link */}
        <div className="text-center mt-6 text-sm">
          <p>
            Don’t have an account?{" "}
            <a href="/create-account" className="text-blue-600">
              Create new account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
