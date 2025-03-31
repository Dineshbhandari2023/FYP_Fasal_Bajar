import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const Success = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // Create a new URLSearchParams object using the search string from location
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("data");
  // Decode the JWT without verifying the signature
  const decoded = base64Decode(token);
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/payment-status",
          {
            productId: decoded.transaction_uuid,
          }
        );

        if (response.status === 200 && response.data.status === "Completed") {
          alert("Payment successful!");
        } else {
          alert("Payment verification failed or is pending.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment. Your transaction was successful.</p>
      <button
        onClick={() => navigate("/user-dashboard")}
        className="go-home-button"
      >
        Go to Homepage
      </button>
    </div>
  );
};
export default Success;
//using the utility fucntion in the same page for simplicity
//you can create a separate directory and serve it
function base64Decode(base64) {
  // Convert Base64Url to standard Base64
  const standardBase64 = base64.replace(/-/g, "+").replace(/_/g, "/");
  // Decode Base64 to UTF-8 string
  const decoded = atob(standardBase64);
  return JSON.parse(decoded);
}
