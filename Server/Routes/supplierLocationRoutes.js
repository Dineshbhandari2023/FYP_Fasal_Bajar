/**
 * Routes for supplier location tracking
 */

const express = require("express");
const router = express.Router();
// const { protect, authorize } = require("../Middlewares/authMiddleware")
const {
  getActiveSuppliers,
  getSupplierLocation,
  updateSupplierLocation,
} = require("../Controllers/supplierLocationController");

// Get all active suppliers with their locations
router.get("/active", getActiveSuppliers);

// Get a specific supplier's location
router.get("/:supplierId", getSupplierLocation);

// Update a supplier's location in the database (protected route)
router.put("/:supplierId", updateSupplierLocation);

module.exports = router;
