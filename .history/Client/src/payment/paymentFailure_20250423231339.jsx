import React from "react";
import { Link } from "react-router-dom";

const Failure = () => {
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
