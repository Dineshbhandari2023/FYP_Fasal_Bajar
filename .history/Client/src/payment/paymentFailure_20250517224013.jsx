import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Failure = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("pid");

    if (productId) {
      const updatePaymentStatus = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          await axios.post(
            "http://localhost:8000/api/payments/check-status",
            { productId, status: "Failed" },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          toast.error("Payment failed. Please try again.");
        } catch (error) {
          toast.error(
            error.response?.data?.ErrorMessage ||
              "Failed to update payment status"
          );
        }
      };
      updatePaymentStatus();
    } else {
      toast.error("Invalid payment data");
    }
  }, [location]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Payment Failed</h1>
      <p>Sorry, your payment could not be processed. Please try again.</p>
      <Link to="/orders" className="text-blue-500 underline">
        Back to Orders
      </Link>
    </div>
  );
};

export default Failure;
