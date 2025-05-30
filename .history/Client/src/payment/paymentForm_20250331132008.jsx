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
import { generateUniqueId } from "esewajs";

const PaymentComponent = () => {
  // Get default amount from query parameter
  const query = new URLSearchParams(window.location.search);
  const defaultAmount = query.get("amount") || "";
  const [amount, setAmount] = useState(defaultAmount);

  const handlePayment = async () => {
    const transactionId = generateUniqueId();

    try {
      const paymentResponse = await axios.post(
        `${process.env.SERVER_URL}/initiate-payment`,
        { amount: totalAmount, transactionId } // Pass transactionId here
      );

      window.location.href = paymentResponse.data.url;
    } catch (error) {
      console.error("Payment initiation error:", error.response.data);
    }
  };
  //   const handlePayment = async (e) => {
  //     e.preventDefault();
  //     try {
  //       // Generate a unique transactionId using esewajs helper
  //       const transactionId = generateUniqueId();
  //       const response = await axios.post(
  //         "http://localhost:8000/initiate-payment", // server payment route
  //         {
  //           amount,
  //           transactionId, // now sending transactionId instead of productId
  //         }
  //       );
  //       window.location.href = response.data.url;
  //     } catch (error) {
  //       console.error("Error initiating payment:", error);
  //     }
  //   };

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
