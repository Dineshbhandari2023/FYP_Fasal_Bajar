const asyncHandler = require("../Middlewares/asyncHandler");
const { Supplier, SupplierDetail } = require("../Models/index");

// Get all active suppliers with their current locations
exports.getActiveSuppliers = asyncHandler(async (req, res) => {
  const locationSocket = req.app.get("locationSocket");

  if (!locationSocket) {
    return res.status(500).json({
      success: false,
      message: "Location tracking service is not available",
    });
  }

  const activeSuppliers = locationSocket.getActiveSuppliers();

  res.status(200).json({
    success: true,
    count: activeSuppliers.length,
    data: activeSuppliers,
  });
});

// Get a specific supplier's current location
exports.getSupplierLocation = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  const locationSocket = req.app.get("locationSocket");

  if (!locationSocket) {
    return res.status(500).json({
      success: false,
      message: "Location tracking service is not available",
    });
  }

  const supplierLocation = locationSocket.getSupplierLocation(supplierId);

  if (!supplierLocation) {
    return res.status(404).json({
      success: false,
      message: "Supplier not found or not actively sharing location",
    });
  }

  res.status(200).json({
    success: true,
    data: supplierLocation,
  });
});

// Update supplier's location in the database (for persistence)
exports.updateSupplierLocation = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required",
    });
  }

  const [supplierDetail, created] = await SupplierDetail.findOrCreate({
    where: { supplierId },
    defaults: {
      currentLocation: { latitude, longitude },
      lastLocationUpdate: new Date(),
    },
  });

  if (!created) {
    await supplierDetail.update({
      currentLocation: { latitude, longitude },
      lastLocationUpdate: new Date(),
    });
  }

  res.status(200).json({
    success: true,
    message: "Supplier location updated in database",
    data: {
      supplierId,
      latitude,
      longitude,
      updatedAt: new Date(),
    },
  });
});
