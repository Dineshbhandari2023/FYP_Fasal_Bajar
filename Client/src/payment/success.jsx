import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("pid");

    if (productId) {
      const verifyPayment = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.post(
            "http://localhost:8000/api/payments/check-status",
            { productId },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          toast.success(
            response.data.Result.message || "Payment completed successfully!"
          );
        } catch (error) {
          toast.error(
            error.response?.data?.ErrorMessage || "Failed to verify payment"
          );
        }
        navigate("/orders", { replace: true });
      };
      verifyPayment();
    } else {
      toast.error("Invalid payment data");
      navigate("/orders", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Payment Successful</h1>
      <p>Verifying your payment... You will be redirected shortly.</p>
    </div>
  );
};

export default Success;
