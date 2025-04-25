const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { authMiddleWare } = require("../Util/jwt");

const {
  getSupplierProfile,
  registerSupplier,
  updateSupplierDetails,
  updateCurrentLocation,
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getActiveDeliveries,
  getDeliveryHistory,
  getAllSuppliers,
} = require("../Controllers/supplierController");

router.get("/", getAllSuppliers);

// All routes require authentication
router.use(authMiddleWare);

// Supplier registration and profile management
router.get("/profile", getSupplierProfile);
router.post("/register", upload.single("licenseDocument"), registerSupplier);
router.put("/update", upload.single("licenseDocument"), updateSupplierDetails);
router.put("/location", updateCurrentLocation);

// Delivery management
router.get("/deliveries/available", getAvailableDeliveries);
router.post("/deliveries/accept", acceptDelivery);
router.put(
  "/deliveries/status",
  upload.single("proofOfDelivery"),
  updateDeliveryStatus
);
router.get("/deliveries/active", getActiveDeliveries);
router.get("/deliveries/history", getDeliveryHistory);

module.exports = router;
