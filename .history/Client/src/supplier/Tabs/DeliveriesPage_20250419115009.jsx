import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveDeliveries,
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
} from "../../Redux/slice/supplierSlice";
import { SupplierLayout } from "../../components/supplier-layout";
import { Truck, Package, Clock, MapPin, Calendar } from "lucide-react";

const DeliveriesPage = () => {
  const dispatch = useDispatch();
  const { activeDeliveries, availableDeliveries, loading, error } = useSelector(
    (state) => state.supplier
  );
  const [selectedTab, setSelectedTab] = useState("active");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState({});
  const [acceptLoading, setAcceptLoading] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(getActiveDeliveries());
    dispatch(getAvailableDeliveries());
  }, [dispatch]);

  const handleAcceptDelivery = async (orderItemId) => {
    setErrorMessage("");
    setSuccessMessage("");
    setAcceptLoading((prev) => ({ ...prev, [orderItemId]: true }));

    try {
      await dispatch(acceptDelivery(orderItemId)).unwrap();
      setSuccessMessage("Delivery accepted successfully!");

      // Refresh both lists
      dispatch(getActiveDeliveries());
      dispatch(getAvailableDeliveries());
    } catch (error) {
      setErrorMessage(error || "Failed to accept delivery");
    } finally {
      setAcceptLoading((prev) => ({ ...prev, [orderItemId]: false }));
    }
  };

  const handleUpdateStatus = async (deliveryId, newStatus) => {
    setErrorMessage("");
    setSuccessMessage("");
    setStatusUpdateLoading((prev) => ({ ...prev, [deliveryId]: true }));

    try {
      await dispatch(
        updateDeliveryStatus({ deliveryId, status: newStatus })
      ).unwrap();
      setSuccessMessage(
        `Delivery status updated to ${newStatus.replace(/_/g, " ")}!`
      );

      // Refresh active deliveries
      dispatch(getActiveDeliveries());
    } catch (error) {
      setErrorMessage(error || "Failed to update delivery status");
    } finally {
      setStatusUpdateLoading((prev) => ({ ...prev, [deliveryId]: false }));
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      Assigned: "Pickup_In_Progress",
      Pickup_In_Progress: "Picked_Up",
      Picked_Up: "In_Transit",
      In_Transit: "Delivered",
    };
    return statusFlow[currentStatus] || null;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "Pickup_In_Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Picked_Up":
        return "bg-indigo-100 text-indigo-800";
      case "In_Transit":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SupplierLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Deliveries</h1>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab("active")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "active"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Active Deliveries
              </button>
              <button
                onClick={() => setSelectedTab("available")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "available"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Available Deliveries
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : selectedTab === "active" ? (
          <div className="space-y-4">
            {activeDeliveries.length > 0 ? (
              activeDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-medium">Delivery #{delivery.id}</h3>
                      <span
                        className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                          delivery.status
                        )}`}
                      >
                        {delivery.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getNextStatus(delivery.status) && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              delivery.id,
                              getNextStatus(delivery.status)
                            )
                          }
                          disabled={statusUpdateLoading[delivery.id]}
                          className={`px-3 py-1 rounded-md text-sm font-medium text-white ${
                            statusUpdateLoading[delivery.id]
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {statusUpdateLoading[delivery.id] ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Updating...
                            </span>
                          ) : (
                            `Mark as ${getNextStatus(delivery.status).replace(
                              /_/g,
                              " "
                            )}`
                          )}
                        </button>
                      )}
                      {delivery.status !== "Delivered" &&
                        delivery.status !== "Failed" &&
                        delivery.status !== "Cancelled" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(delivery.id, "Failed")
                            }
                            disabled={statusUpdateLoading[delivery.id]}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200"
                          >
                            Mark Failed
                          </button>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" /> Pickup Location
                      </div>
                      <p className="text-sm">
                        {delivery.pickupLocation?.address ||
                          "Address not available"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Contact: {delivery.pickupLocation?.contactName || "N/A"}{" "}
                        ({delivery.pickupLocation?.contactPhone || "N/A"})
                      </p>
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" /> Delivery Location
                      </div>
                      <p className="text-sm">
                        {delivery.deliveryLocation?.address ||
                          "Address not available"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Contact:{" "}
                        {delivery.deliveryLocation?.contactName || "N/A"} (
                        {delivery.deliveryLocation?.contactPhone || "N/A"})
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-500 mr-1" />
                        <span>
                          {delivery.items
                            ?.map(
                              (item) =>
                                `${item.name} (${item.quantity} ${item.unit})`
                            )
                            .join(", ") || "Items not specified"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-1" />
                        <span>
                          {delivery.estimatedDeliveryTime
                            ? new Date(
                                delivery.estimatedDeliveryTime
                              ).toLocaleString()
                            : "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No active deliveries
                </h3>
                <p className="text-gray-500">
                  You don't have any active deliveries at the moment.
                </p>
                <button
                  onClick={() => setSelectedTab("available")}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  View Available Deliveries
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {availableDeliveries.length > 0 ? (
              availableDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-medium">Order #{delivery.id}</h3>
                    </div>
                    <button
                      onClick={() => handleAcceptDelivery(delivery.id)}
                      disabled={acceptLoading[delivery.id]}
                      className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                        acceptLoading[delivery.id]
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {acceptLoading[delivery.id] ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Accepting...
                        </span>
                      ) : (
                        "Accept Delivery"
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" /> Pickup Location
                        (Farmer)
                      </div>
                      <p className="text-sm">
                        {delivery.Product?.location || "Address not available"}
                      </p>
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="flex items-center text-sm font-medium text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" /> Delivery Location
                        (Buyer)
                      </div>
                      <p className="text-sm">
                        {delivery.Order?.shippingAddress ||
                          "Address not available"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-500 mr-1" />
                        <span>
                          {delivery.Product?.productName} ({delivery.quantity}{" "}
                          {delivery.Product?.unit})
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span>
                          {delivery.createdAt
                            ? `Created: ${new Date(
                                delivery.createdAt
                              ).toLocaleDateString()}`
                            : "Date not available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No available deliveries
                </h3>
                <p className="text-gray-500">
                  There are no deliveries available in your service area at the
                  moment.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </SupplierLayout>
  );
};

export default DeliveriesPage;
