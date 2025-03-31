// import React, { useState } from "react";
// import axios from "axios";
// import { generateUniqueId } from "esewajs";

// const PaymentComponent = () => {
//   // Get default amount from query parameter
//   const query = new URLSearchParams(window.location.search);
//   const defaultAmount = query.get("amount") || "";
//   const [amount, setAmount] = useState(defaultAmount);

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/initiate-payment", // server payment route
//         {
//           amount,
//           productId: generateUniqueId(),
//         }
//       );
//       window.location.href = response.data.url;
//     } catch (error) {
//       console.error("Error initiating payment:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>eSewa Payment Integration</h1>
//       <div className="form-container">
//         <form className="styled-form" onSubmit={handlePayment}>
//           <div className="form-group">
//             <label htmlFor="Amount">Amount:</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//               placeholder="Enter amount"
//             />
//           </div>
//           <button type="submit" className="submit-button">
//             Pay with eSewa
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PaymentComponent;

import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import esewa from "../Assets/images/esewa.png";

const PaymentComponent = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const defaultAmount = query.get("amount") || "";

  const [amount, setAmount] = useState(defaultAmount);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const productId = uuidv4();
    try {
      const response = await axios.post(
        "http://localhost:8000/initiate-payment",
        { amount, productId }
      );

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert("Error initiating payment");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Payment initiation failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition-transform duration-300 hover:translate-y-1">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={esewa} alt="eSewa Logo" className="h-16 w-auto" />
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Welcome Back!
        </h2>

        {/* Subtitle */}
        <h3 className="text-lg font-medium text-center text-green-600 mb-8">
          Make a Payment
        </h3>

        {/* Form */}
        <form className="space-y-6" onSubmit={handlePayment}>
          <div className="space-y-2">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (NPR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                Rs.
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="Enter amount"
                min="1"
                className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Pay with eSewa"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Secure payment powered by eSewa
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
