import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../Redux/slice/userSlice";
import ApiLink from "../api";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact_number: "",
    location: "", // will be updated with device coordinates
    password: "",
    confirmPassword: "",
    role: "Farmer",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Automatically get the user's device location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Store the coordinates as a comma-separated string
          setFormData((prev) => ({
            ...prev,
            location: `${latitude},${longitude}`,
          }));
        },
        (error) => {
          console.error("Error fetching location:", error);
          // Optionally, set a default location or error message here
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.contact_number.trim()) {
      newErrors.contact_number = "Contact number is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        contact_number: formData.contact_number,
        location: formData.location, // sending the coordinates
        password: formData.password,
        role: formData.role,
      };

      // Dispatch the registerUser thunk and unwrap the result
      const result = await dispatch(registerUser(userData)).unwrap();

      console.log("Registration Successful:", result);
      setSuccessMessage("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration failed:", err);
      setErrors({
        general: err || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Register</h1>

        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errors.general && <p className="text-red-500">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block">Contact Number</label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter contact number"
            />
            {errors.contact_number && (
              <p className="text-red-500">{errors.contact_number}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block">Location (Latitude, Longitude)</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Location will be auto-detected"
              readOnly
            />
            {errors.location && (
              <p className="text-red-500">{errors.location}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select role</option>
              <option value="Farmer">Farmer</option>
              <option value="Buyer">Buyer</option>
            </select>
            {errors.role && <p className="text-red-500">{errors.role}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
