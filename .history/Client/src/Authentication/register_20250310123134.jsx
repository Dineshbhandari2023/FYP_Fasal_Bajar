import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/images/auth_logo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    contact_number: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!/^[a-zA-Z0-9 ._-]{3,20}$/.test(formData.username)) {
      newErrors.username =
        "Username must be alphanumeric and between 3 to 20 characters long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.role) newErrors.role = "Please select a role";
    if (!formData.contact_number.trim())
      newErrors.contact_number = "Please enter a valid contact number";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 200) {
        alert("User registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      setErrors({
        apiError:
          error.response?.data?.message ||
          "Registration failed. Try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        <div className="flex flex-col items-center mb-2">
          <div className="text-green-600 mb-2 h-32 w-32">
            <img src={logo} alt="fasal_Bajar logo" />
          </div>
          <p className="text-gray-600 text-2xl font-semibold text-center mb-2">
            Create your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="username" className="block text-sm font-medium">
            Full Name:
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-2 border rounded-md"
          />
          {errors.username && (
            <p className="text-red-500 text-xs">{errors.username}</p>
          )}
          <label htmlFor="email" className="block text-sm font-medium">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded-md"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium">
              Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 border rounded-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium">
              Confirm Password:
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-2 border rounded-md"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
          )}
          <label htmlFor="role" className="block text-sm font-medium">
            Role:
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select your role</option>
            <option value="Farmer">Farmer</option>
            <option value="Buyer">Buyer</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}

          <label htmlFor="contact_number" className="block text-sm font-medium">
            Contact Number
          </label>
          <input
            type="text"
            id="contact_number"
            name="contact_number"
            placeholder="Enter your contact number"
            value={formData.contact_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
          {errors.contact_number && (
            <p className="text-red-500">{errors.contact_number}</p>
          )}
          <label htmlFor="location" className="block text-sm font-medium">
            Location:
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 border rounded-md"
          />
          {errors.location && (
            <p className="text-red-500 text-xs">{errors.location}</p>
          )}
          {errors.apiError && (
            <p className="text-red-500 text-xs">{errors.apiError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 hover:text-green-700">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
