import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../Redux/slice/userSlice";
import ApiLink from "../api";
import { toast } from "react-toastify";
import logo from "../Assets/images/auth_logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Show toast error whenever apiError changes
  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
    }
  }, [apiError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setApiError("Email and Password are required");
      return false;
    }
    setApiError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
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
            user: user,
            rememberMe: formData.rememberMe,
          })
        );

        // Role-based navigation
        if (user.role === "Farmer") {
          navigate("/farmer-dashboard");
        } else if (user.role === "Buyer") {
          navigate("/user-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setApiError(data.Result?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setApiError(
        error.response?.data?.Result?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="text-green-600 mb-3 h-32 w-32">
            <img src={logo} alt="Fasal Bajar logo" className="object-contain" />
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
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 hover:text-green-700">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
