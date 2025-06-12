import { useEffect } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, login } from "../Redux/slice/userSlice";
import { toast } from "react-toastify";
import axios from "axios";
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  // Get Redux state
  const reduxError = useSelector((state) => state.user.error);
  const reduxLoading = useSelector((state) => state.user.loading);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Monitor Redux error state
  useEffect(() => {
    if (reduxError) {
      handleLoginError(reduxError);
    }
  }, [reduxError]);

  // Function to handle different types of login errors
  const handleLoginError = (error) => {
    let errorMessage = "";

    // Check if error is an array (from API response)
    if (Array.isArray(error)) {
      errorMessage = error[0] || "Login failed. Please try again.";
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = "Login failed. Please try again.";
    }

    // Handle specific error messages
    if (errorMessage.toLowerCase().includes("user not found")) {
      toast.error("Account not found. Please check your email or sign up.", {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: "#f8d7da",
          color: "#721c24",
          borderRadius: "8px",
          border: "1px solid #f5c6cb",
        },
      });
    } else if (
      errorMessage.toLowerCase().includes("incorrect email or password")
    ) {
      toast.error(
        "Invalid password. Please check your password and try again.",
        {
          position: "top-right",
          autoClose: 5000,
          style: {
            background: "#f8d7da",
            color: "#721c24",
            borderRadius: "8px",
            border: "1px solid #f5c6cb",
          },
        }
      );
    } else if (errorMessage.toLowerCase().includes("all fields are required")) {
      toast.error("Email and password are required.", {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: "#f8d7da",
          color: "#721c24",
          borderRadius: "8px",
          border: "1px solid #f5c6cb",
        },
      });
    } else if (errorMessage.toLowerCase().includes("server error")) {
      toast.error("Server error. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: "#f8d7da",
          color: "#721c24",
          borderRadius: "8px",
          border: "1px solid #f5c6cb",
        },
      });
    } else {
      // For any other errors
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: "#f8d7da",
          color: "#721c24",
          borderRadius: "8px",
          border: "1px solid #f5c6cb",
        },
      });
    }

    setApiError(errorMessage);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    try {
      setLoading(true);

      // Use the Redux thunk to login
      const resultAction = await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      );

      // Check if the action was fulfilled or rejected
      if (loginUser.fulfilled.match(resultAction)) {
        const result = resultAction.payload;
        const user = result.user_data;
        const accessToken = result.accessToken;

        if (formData.rememberMe) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("user", JSON.stringify(user));
        }

        dispatch(login({ token: accessToken, user }));

        // Navigate based on user role
        if (user.role === "Farmer") {
          navigate("/farmer-dashboard");
        } else if (user.role === "Supplier") {
          locationService.connect();

          locationService.socket?.emit("supplier:register", {
            supplierId: result.user.id,
            username: result.user.username || "Unknown Supplier",
            serviceArea:
              result.user.SupplierDetail?.serviceArea || "Not specified",
          });
          navigate("/supplier/dashboard");
        } else if (user.role === "Buyer") {
          navigate("/user-dashboard");
        } else {
          navigate("/");
        }

        toast.success(`Welcome back, ${user.username}!`, {
          position: "top-right",
          autoClose: 3000,
          style: {
            background: "#d4edda",
            color: "#155724",
            borderRadius: "8px",
            border: "1px solid #c3e6cb",
          },
        });
      }
      // Note: Error handling is done via the useEffect that watches reduxError
    } catch (error) {
      console.error("Login failed:", error);
      // This catch block is for any unexpected errors not handled by Redux
      const errorMessage = "An unexpected error occurred. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: "#f8d7da",
          color: "#721c24",
          borderRadius: "8px",
          border: "1px solid #f5c6cb",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordMessage("");
    setApiError("");

    try {
      // Validate email
      if (!forgotEmail || !forgotEmail.includes("@")) {
        throw new Error("Please enter a valid email address");
      }

      const response = await axios.post(
        "http://localhost:8000/users/forgot-password",
        {
          email: forgotEmail,
        }
      );

      if (response.data.IsSuccess) {
        setForgotPasswordMessage(response.data.Result.message);
        toast.success("Password reset email sent successfully!", {
          position: "top-right",
          autoClose: 5000,
          style: {
            background: "#d4edda",
            color: "#155724",
            borderRadius: "8px",
            border: "1px solid #c3e6cb",
          },
        });

        // Store the email in localStorage to potentially pre-fill it on the reset page
        localStorage.setItem("resetEmail", forgotEmail);

        // Navigate to reset password page after a short delay
        setTimeout(() => {
          navigate("/reset-password");
        }, 1500);
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      const errorMessage =
        error.response?.data?.ErrorMessage ||
        error.response?.data?.message ||
        error.message ||
        "Failed to send password reset email. Please try again.";

      setApiError(errorMessage);

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        style: {
          background: "#f8d7da",
          color: "#721c24",
          borderRadius: "8px",
          border: "1px solid #f5c6cb",
        },
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="text-green-600 mb-3 h-32 w-32">
            <img
              src={logo || "/placeholder.svg"}
              alt="Fasal Bajar logo"
              className="object-contain"
            />
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

        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-6 relative">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
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
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || reduxLoading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading || reduxLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6 relative">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {forgotPasswordMessage && (
              <p className="text-green-500 text-center font-semibold mb-4">
                {forgotPasswordMessage}
              </p>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full bg-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={forgotPasswordLoading}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {forgotPasswordLoading ? "Sending..." : "Send Reset Email"}
              </button>
            </div>
          </form>
        )}

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
