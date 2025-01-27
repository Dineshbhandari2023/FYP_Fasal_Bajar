import { useState } from "react";
import Video from "../Assets/Farmer.mp4";
import axios from "Axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact_number: "",
    role: "Buyer", // Default to "Buyer"
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

    const newErrors = {};
    if (!formData.name) newErrors.name = "User name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.role) newErrors.role = "User role is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  };
  const createUser = () => {
    axios
      .post("http://localhost:3001/register", {
        Name: formData.name,
        Email: formData.email,
        Password: formData.password,
        Role: formData.role,
        ContactNumber: formData.contact_number,
        Location: formData.location,
      })
      .then(() => {
        console.log("User created");
      });
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
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
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
      <div className="relative z-10  w-full max-w-lg bg-white px-10 py-3 rounded-md shadow-md">
        <h1 className="text-5xl font-sans font-bold text-center text-gray-800 mb-3">
          Fasal Bajar
        </h1>
        <h2 className="text-2xl font-medium text-center text-gray-700 mb-5">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              User Name
            </label>
            <input
              type="text"
              id="name"
              name="name" // Correct name attribute
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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
              name="contact_number" // Correct name attribute
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

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email" // Correct name attribute
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
              name="password" // Correct name attribute
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
              name="confirmPassword" // Correct name attribute
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            onClick={createUser}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
