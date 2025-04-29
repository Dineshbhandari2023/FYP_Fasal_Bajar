const express = require("express");
const router = express.Router();
const {
  getActiveSuppliers,
  getSupplierLocation,
  updateSupplierLocation,
} = require("../Controllers/supplierLocationController");

router.get("/active", getActiveSuppliers);
router.get("/:supplierId", getSupplierLocation);
router.put("/:supplierId", updateSupplierLocation);

module.exports = router;
