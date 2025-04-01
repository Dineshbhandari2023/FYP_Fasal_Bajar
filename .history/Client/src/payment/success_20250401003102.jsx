import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encodedData = queryParams.get("data");
  const decodedData = JSON.parse(atob(encodedData));

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        console.log("Decoded data: " + JSON.stringify(decodedData));

        const response = await axios.post(
          "http://localhost:8000/payment-status",
          {
            productId: decodedData.orderNumber,
          }
        );

        if (response.data.status === "Completed") {
          alert("Payment successful!");
        } else {
          alert("Payment pending or failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };
    verifyPayment();
  }, [decodedData.orderNumber]);

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">Payment Successful!</h1>
      <button
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded"
        onClick={() => navigate("/user-dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default Success;
