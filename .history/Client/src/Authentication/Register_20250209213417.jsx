import { useState } from "react";
import Video from "../Assets/Farmer.mp4";
import axios from "axios";
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

    // Validate form before sending request
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
        "http://localhost:8000/api/users/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          contact_number: parseInt(formData.contact_number, 10),
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
      if (error.response && error.response.data) {
        setErrors({ apiError: error.response.data.message });
      } else {
        setErrors({ apiError: "Registration failed. Try again later." });
      }
    }
  };

  // const getLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setFormData((prev) => ({
  //           ...prev,
  //           location: `Lat: ${latitude}, Long: ${longitude}`,
  //         }));
  //       },
  //       (error) => {
  //         console.error("Error fetching location:", error);
  //         alert("Unable to fetch location.");
  //       }
  //     );
  //   } else {
  //     alert("Geolocation is not supported by your browser.");
  //   }
  // };

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
          <div className="mb-3">
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.username && (
              <p className="text-red-500">{errors.username}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-3">
            <label
              htmlFor="contact_number"
              className="block text-sm font-medium"
            >
              Contact Number
            </label>
            <input
              type="text"
              id="contact_number"
              name="contact_number"
              placeholder="Enter your contact number"
              value={formData.contact_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.contact_number && (
              <p className="text-red-500">{errors.contact_number}</p>
            )}
          </div>

          {/* <div className="mb-3">
            <button
              type="button"
              onClick={getLocation}
              className="w-full bg-gray-800 text-white py-2 rounded-md"
            >
              Get Location
            </button>
            {formData.location && (
              <p className="text-gray-700 mt-2">{formData.location}</p>
            )}
          </div> */}
          <div className="mb-3">
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your location"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="mb-3">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Register
          </button>
          {errors.apiError && (
            <p className="text-red-500 mt-3 text-center">{errors.apiError}</p>
          )}
          {/* Already have an account? */}
          <div className="text-center mt-3">
            <p className="text-gray-700">Already have an account?</p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
