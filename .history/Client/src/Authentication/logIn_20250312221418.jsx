import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/images/auth_logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(ApiLink.login.url, payload, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.IsSuccess) {
        const user = data.Result.user_data;
        const accessToken = data.Result.accessToken;

        dispatch(
          login({
            token: accessToken,
            user,
            rememberMe: formData.rememberMe,
          })
        );

        // Role-based navigation
        if (user.role === "Farmer") {
          navigate("/farmer-dashboard");
        } else if (user.role === "Buyer") {
          navigate("/buyer-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setErrors({
          submit: data.Result?.message || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.Result?.message ||
          "Login failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="text-green-600 mb-3 h-32 w-32">
            <img src={logo} alt="fasal_Bajar logo" />
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mt-2">
            Welcome Back
          </h2>
        </div>

        {apiError && (
          <p className="text-red-500 text-center font-semibold mb-4">
            {apiError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 border rounded-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="ml-2">Remember me</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-green-600 hover:text-green-700">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
