const axios = require("axios"); const crypto = require("crypto"); const { v4: uuidv4 } = require("uuid"); const PaymentTransaction = require("../Models/paymentTransaction");

// Helper function to generate HMAC SHA256 hash
function generateHmacSha256Hash(data, secret) { return crypto.createHmac("sha256", secret).update(data).digest("hex"); }

// Helper function to safely stringify objects (avoids circular references)
function safeStringify(obj) { let cache = []; const str = JSON.stringify(obj, function (key, value) { if (typeof value === "object" && value !== null) { if (cache.indexOf(value) !== -1) { // Circular reference found, discard key return; } cache.push(value); } return value; }); cache = null; return str; }

// Controller function to initiate a payment via eSewa
async function initiatePayment(req, res) { // Extract payment details from request body
const { amount, orderId } = req.body; // Build the paymentData object as required by eSewa
let paymentData = { amount, failure_url: process.env.FAILURE_URL, product_delivery_charge: "0", product_service_charge: "0", product_code: process.env.MERCHANT_ID, signed_field_names: "total_amount,transaction_uuid,product_code", success_url: process.env.SUCCESS_URL, tax_amount: "0", total_amount: amount, transaction_uuid: orderId, };

// Concatenate fields in the same order as signed_field_names
const data = total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}; // Generate the HMAC-SHA256 signature using your secret key
const signature = generateHmacSha256Hash(data, process.env.SECRET); paymentData = { ...paymentData, signature };

try { // Send a POST request to eSewa's payment endpoint with paymentData as query parameters
const paymentResponse = await axios.post(process.env.ESEWAPAYMENT_URL, null, { params: paymentData, }); const reqPayment = JSON.parse(safeStringify(paymentResponse)); if (reqPayment.status === 200) { // Create and save a new PaymentTransaction record
const transaction = new PaymentTransaction({ orderId: orderId, amount: amount, transactionId: uuidv4(), paymentMethod: "Online Payment", }); await transaction.save(); // Return the URL to redirect the user to eSewa’s payment gateway
return res.send({ url: reqPayment.request.res.responseUrl, }); } else { return res.status(reqPayment.status).send(reqPayment); } } catch (error) { return res.status(500).send(error.toString()); } }

// Controller function to check payment status from eSewa
async function checkPaymentStatus(req, res) { // Extract orderId from request body to look up the transaction
const { orderId } = req.body; try { // Find the PaymentTransaction using Sequelize
const transaction = await PaymentTransaction.findOne({ where: { orderId: orderId }, }); if (!transaction) { return res.status(400).json({ message: "Transaction not found" }); } // Build paymentData for the status check call using the saved transactionId
const paymentData = { product_code: process.env.MERCHANT_ID, // Use your merchant code (e.g., EPAYTEST)
total_amount: transaction.amount, transaction_uuid: transaction.transactionId, }; // Send a GET request to the eSewa status-check endpoint
const response = await axios.get(process.env.ESEWAPAYMENT_STATUS_CHECK_URL, { params: paymentData, }); const paymentStatusCheck = JSON.parse(safeStringify(response)); if (paymentStatusCheck.status === 200) { // Update the transaction status based on eSewa's response
transaction.status = paymentStatusCheck.data.status; await transaction.save(); return res.status(200).json({ message: "Transaction status updated successfully" }); } else { return res.status(paymentStatusCheck.status).json(paymentStatusCheck.data); } } catch (error) { console.error("Error updating transaction status:", error); return res.status(500).json({ message: "Server error", error: error.message }); } }

module.exports = { initiatePayment, checkPaymentStatus, };