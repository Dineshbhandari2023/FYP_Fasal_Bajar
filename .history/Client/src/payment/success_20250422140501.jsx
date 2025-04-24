import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base64Decode } from "esewajs";
import axios from "axios";
import { toast } from "react-toastify";

const Success = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("data");
        if (!token) {
          throw new Error("Invalid payment data");
        }

        const decoded = base64Decode(token);
        const productId = decoded.transaction_uuid;

        const token = localStorage.getItem("accessToken");
        const response = await axios.post(
          "/payment/status",
          { productId },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data.status === "Completed") {
          setIsSuccess(true);
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        toast.error(`Payment verification failed: ${error.message}`);
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            Payment Verification Failed
          </h1>
          <p className="mb-4">
            An error occurred while verifying your payment.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="mb-4">
          Thank you for your payment. Your order is being processed.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default Success;
