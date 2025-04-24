import { useNavigate } from "react-router-dom";

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="mb-4">
          There was an issue with your payment. Please try again.
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
};

export default Failure;
