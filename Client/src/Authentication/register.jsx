import { useState } from "react";
import Video from "../Assets/Farmer.mp4";
import axios from "axios"; // Corrected import for axios
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact_number: "",
    role: "Buyer",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.contact_number)
      newErrors.contact_number = "Contact number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          contact_number: parseInt(formData.contact_number, 10), // Ensure this is an integer
          location: formData.location,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("User registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Failed to register user. Please try again later.");
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            location: `Lat: ${latitude}, Long: ${longitude}`,
          }));
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
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
      <div className="relative z-10 w-full max-w-lg bg-white px-10 py-3 rounded-md shadow-md">
        <h1 className="text-5xl font-sans font-bold text-center text-gray-800 mb-3">
          Fasal Bajar
        </h1>
        <h2 className="text-2xl font-medium text-center text-gray-700 mb-5">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div className="flex justify-center mb-3">
            <label className="mr-4 text-gray-700">
              <input
                type="radio"
                name="role"
                value="Buyer"
                checked={formData.role === "Buyer"}
                onChange={handleInputChange}
                className="mr-2"
              />
              Buyer
            </label>
            <label className="mr-4 text-gray-700">
              <input
                type="radio"
                name="role"
                value="Farmer"
                checked={formData.role === "Farmer"}
                onChange={handleInputChange}
                className="mr-2"
              />
              Farmer
            </label>
            <label className="text-gray-700">
              <input
                type="radio"
                name="role"
                value="Supplier"
                checked={formData.role === "Supplier"}
                onChange={handleInputChange}
                className="mr-2"
              />
              Supplier
            </label>
          </div>

          {/* Contact Number */}
          <div className="mb-3">
            <label
              htmlFor="contact_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Number
            </label>
            <input
              type="text"
              id="contact_number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleInputChange}
              placeholder="Enter your contact number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.contact_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact_number}
              </p>
            )}
          </div>

          {/* Get Location */}
          <div className="mb-3">
            <button
              type="button"
              onClick={getLocation}
              className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition"
            >
              Get Location
            </button>
            {formData.location && (
              <p className="text-gray-700 mt-2">
                Your Location: {formData.location}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
