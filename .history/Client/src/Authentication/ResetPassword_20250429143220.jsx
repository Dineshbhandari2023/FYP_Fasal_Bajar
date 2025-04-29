import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import logo from "../Assets/images/auth_logo.png";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
  });

  const navigate = useNavigate();

  // Check for stored email from forgot password flow
  useEffect(() => {
    const resetEmail = localStorage.getItem("resetEmail");
    if (resetEmail) {
      toast.info(`Please check your email (${resetEmail}) for the reset code`, {
        position: "top-right",
        autoClose: 8000,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Check password strength when password field changes
    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = "";

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score === 0) message = "";
    else if (score <= 2) message = "Weak";
    else if (score <= 4) message = "Medium";
    else message = "Strong";

    setPasswordStrength({ score, message });
  };

  const getStrengthColor = () => {
    if (passwordStrength.score === 0) return "";
    if (passwordStrength.score <= 2) return "text-red-500";
    if (passwordStrength.score <= 4) return "text-yellow-500";
    return "text-green-500";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");
    setSuccessMessage("");

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setApiError("Passwords do not match");
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // First, verify the reset code
      await axios.post("http://localhost:8000/users/verify-reset-code", {
        resetCode: formData.resetCode,
      });

      // If verification is successful, proceed to reset the password
      const response = await axios.post(
        "http://localhost:8000/users/reset-password",
        {
          resetCode: formData.resetCode,
          newPassword: formData.newPassword,
        }
      );

      if (response.data.IsSuccess) {
        setSuccessMessage(response.data.Result.message);
        toast.success(
          "Password reset successfully! Please login with your new password."
        );

        // Clear the stored email
        localStorage.removeItem("resetEmail");

        // Redirect to login after 2 seconds
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Reset password error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.ErrorMessage ||
        "Failed to reset password. Please try again.";

      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
            Reset Your Password
          </h2>
        </div>

        {apiError && (
          <p className="text-red-500 text-center font-semibold mb-4">
            {apiError}
          </p>
        )}

        {successMessage && (
          <p className="text-green-500 text-center font-semibold mb-4">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {/* Reset Code Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reset Code
            </label>
            <input
              type="text"
              name="resetCode"
              value={formData.resetCode}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              placeholder="Enter the reset code"
              required
            />
          </div>

          {/* New Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
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
            {passwordStrength.message && (
              <p className={`text-xs mt-1 ${getStrengthColor()}`}>
                Password strength: {passwordStrength.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-green-600 hover:text-green-700">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
