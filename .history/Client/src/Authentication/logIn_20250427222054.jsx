// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { loginUser } from "../Redux/slice/userSlice";
// import { toast } from "react-toastify";
// import logo from "../Assets/images/auth_logo.png";
// import { login } from "../Redux/slice/userSlice";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       setApiError(""); // Clear any previous errors

//       const result = await dispatch(
//         loginUser({ email: formData.email, password: formData.password })
//       ).unwrap();

//       const user = result.user_data;
//       const accessToken = result.accessToken;

//       // Store token & user in localStorage if rememberMe is checked
//       if (formData.rememberMe) {
//         localStorage.setItem("accessToken", accessToken);
//         localStorage.setItem("user", JSON.stringify(user));
//       }

//       dispatch(login({ token: accessToken, user }));

//       // Debug log to check user role
//       console.log("User role:", user.role);

//       // Redirect based on role
//       if (user.role === "Farmer") {
//         navigate("/farmer-dashboard");
//       } else if (user.role === "Supplier") {
//         // Make sure this exact path matches what's in your App.jsx
//         navigate("/supplier/dashboard");
//       } else if (user.role === "Buyer") {
//         navigate("/user-dashboard");
//       } else {
//         navigate("/");
//       }

//       toast.success(`Welcome back, ${user.username}!`);
//     } catch (error) {
//       console.error("Login failed:", error);
//       setApiError(error?.message || "Login failed. Please try again.");
//       toast.error(error?.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
//         <div className="flex flex-col items-center mb-8">
//           <div className="text-green-600 mb-3 h-32 w-32">
//             <img
//               src={logo || "/placeholder.svg"}
//               alt="Fasal Bajar logo"
//               className="object-contain"
//             />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-600 mt-2">
//             Welcome Back
//           </h2>
//         </div>

//         {apiError && (
//           <p className="text-red-500 text-center font-semibold mb-4">
//             {apiError}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6 relative">
//           {/* Email Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           {/* Password Field */}
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {/* Remember Me */}
//           <div className="flex items-center">
//             <input
//               id="rememberMe"
//               type="checkbox"
//               name="rememberMe"
//               checked={formData.rememberMe}
//               onChange={handleChange}
//               className="mr-2"
//             />
//             <label htmlFor="rememberMe" className="text-sm text-gray-700">
//               Remember me
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-center mt-4 text-sm text-gray-600">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-green-600 hover:text-green-700">
//             Signup
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setApiError("");

      const result = await dispatch(
        loginUser({ email: formData.email, password: formData.password })
      ).unwrap();

      const user = result.user_data;
      const accessToken = result.accessToken;

      if (formData.rememberMe) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      dispatch(login({ token: accessToken, user }));

      console.log("User role:", user.role);

      if (user.role === "Farmer") {
        navigate("/farmer-dashboard");
      } else if (user.role === "Supplier") {
        navigate("/supplier/dashboard");
      } else if (user.role === "Buyer") {
        navigate("/user-dashboard");
      } else {
        navigate("/");
      }

      toast.success(`Welcome back, ${user.username}!`);
    } catch (error) {
      console.error("Login failed:", error);
      setApiError(error?.message || "Login failed. Please try again.");
      toast.error(error?.message || "Login failed. Please try again.");
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
      const response = await axios.post("/api/forgot-password", {
        email: forgotEmail,
      });

      if (response.data.IsSuccess) {
        setForgotPasswordMessage(response.data.Result.message);
        toast.success("Password reset email sent successfully!");
        setShowForgotPassword(false);
        setForgotEmail("");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send password reset email. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="text-green-600 mb-3 h-32 w-32">
            thận
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
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
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
