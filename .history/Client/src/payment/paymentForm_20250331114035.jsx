import React, { useState } from "react";
import axios from "axios";
import { generateUniqueId } from "esewajs";

const PaymentComponent = () => {
  // Get default amount from query parameter
  const query = new URLSearchParams(window.location.search);
  const defaultAmount = query.get("amount") || "";
  const [amount, setAmount] = useState(defaultAmount);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/initiate-payment", // server payment route
        {
          amount,
          productId: generateUniqueId(),
        }
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  return (
    <div>
      <h1>eSewa Payment Integration</h1>
      <div className="form-container">
        <form className="styled-form" onSubmit={handlePayment}>
          <div className="form-group">
            <label htmlFor="Amount">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
            />
          </div>
          <button type="submit" className="submit-button">
            Pay with eSewa
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentComponent;
