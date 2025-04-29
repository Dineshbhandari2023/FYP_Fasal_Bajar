import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import logo from "../Assets/images/auth_logo.png";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    resetCode: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");
    setSuccessMessage("");

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
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
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
