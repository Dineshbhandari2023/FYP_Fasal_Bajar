import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveDeliveries,
  getDeliveryHistory,
  updateDeliveryStatus,
  updateCurrentLocation,
} from "../../Redux/slice/supplierSlice";
import { SupplierLayout } from "../SupplierLayout";
import {
  Truck,
  Package,
  MapPin,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Phone,
  Navigation,
  Camera,
  Loader,
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Map,
} from "lucide-react";

export default function DeliveriesPage() {
  const dispatch = useDispatch();
  const { activeDeliveries, deliveryHistory, loading, error, pagination } =
    useSelector((state) => state.supplier);

  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [statusUpdateModal, setStatusUpdateModal] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    deliveryId: null,
    status: "",
    notes: "",
    proofOfDelivery: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, [dispatch, page]);

  const loadDeliveries = () => {
    setRefreshing(true);
    Promise.all([
      dispatch(getActiveDeliveries()),
      dispatch(getDeliveryHistory({ page, limit: 20 })),
    ]).finally(() => {
      setRefreshing(false);
    });
  };

  const statusConfig = {
    Assigned: {
      label: "Assigned",
      color: "bg-blue-100 text-blue-800",
      icon: Package,
    },
    Pickup_In_Progress: {
      label: "Pickup In Progress",
      color: "bg-purple-100 text-purple-800",
      icon: Navigation,
    },
    Picked_Up: {
      label: "Picked Up",
      color: "bg-yellow-100 text-yellow-800",
      icon: Package,
    },
    In_Transit: {
      label: "In Transit",
      color: "bg-amber-100 text-amber-800",
      icon: Truck,
    },
    Delivered: {
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    Failed: {
      label: "Failed",
      color: "bg-red-100 text-red-800",
      icon: AlertCircle,
    },
    Cancelled: {
      label: "Cancelled",
      color: "bg-gray-100 text-gray-800",
      icon: AlertCircle,
    },
  };

  // Combine both active and completed deliveries
  const allDeliveries = [...activeDeliveries, ...deliveryHistory];

  const filteredDeliveries = allDeliveries.filter((delivery) => {
    const status = delivery.status;

    if (
      activeTab === "active" &&
      ["Delivered", "Failed", "Cancelled"].includes(status)
    ) {
      return false;
    }
    if (
      activeTab === "completed" &&
      !["Delivered", "Failed", "Cancelled"].includes(status)
    ) {
      return false;
    }

    if (filterStatus !== "all" && status !== filterStatus) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        delivery.deliveryNumber?.toLowerCase().includes(query) ||
        delivery.Order?.orderNumber?.toLowerCase().includes(query) ||
        delivery.Order?.buyer?.username?.toLowerCase().includes(query) ||
        delivery.OrderItem?.farmer?.username?.toLowerCase().includes(query) ||
        delivery.Order?.buyer?.location?.toLowerCase().includes(query) ||
        delivery.OrderItem?.Product?.productName?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = (delivery) => {
    setSelectedDelivery(delivery);
    setStatusUpdateModal(true);

    // Set initial status based on current delivery status
    let nextStatus = "In_Transit";
    if (delivery.status === "Assigned") nextStatus = "Pickup_In_Progress";
    else if (delivery.status === "Pickup_In_Progress") nextStatus = "Picked_Up";
    else if (delivery.status === "Picked_Up") nextStatus = "In_Transit";
    else if (delivery.status === "In_Transit") nextStatus = "Delivered";

    setStatusUpdateData({
      deliveryId: delivery.id,
      status: nextStatus,
      notes: "",
      proofOfDelivery: null,
    });
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();

    dispatch(updateDeliveryStatus(statusUpdateData))
      .unwrap()
      .then(() => {
        setStatusUpdateModal(false);
        setStatusUpdateData({
          deliveryId: null,
          status: "",
          notes: "",
          proofOfDelivery: null,
        });
        // Refresh deliveries after status update
        loadDeliveries();
      })
      .catch((error) => {
        console.error("Failed to update status:", error);
        alert("Failed to update delivery status. Please try again.");
      });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setStatusUpdateData({
        ...statusUpdateData,
        proofOfDelivery: e.target.files[0],
      });
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case "Assigned":
        return ["Pickup_In_Progress", "Cancelled"];
      case "Pickup_In_Progress":
        return ["Picked_Up", "Failed", "Cancelled"];
      case "Picked_Up":
        return ["In_Transit", "Failed", "Cancelled"];
      case "In_Transit":
        return ["Delivered", "Failed", "Cancelled"];
      default:
        return [];
    }
  };

  const handleRefresh = () => {
    loadDeliveries();
  };

  const handleUpdateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(updateCurrentLocation({ latitude, longitude }))
            .unwrap()
            .then(() => {
              alert("Location updated successfully");
            })
            .catch((error) => {
              console.error("Error updating location:", error);
              alert("Failed to update location. Please try again.");
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Failed to get your current location. Please check your device settings."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
            <p className="text-gray-500 mt-1">
              Manage your pickup and delivery tasks
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 inline-flex items-center gap-2"
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  <span>Refresh</span>
                </>
              )}
            </button>
            <button
              onClick={handleUpdateLocation}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              <span>Update Location</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "active"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active Deliveries
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "completed"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed Deliveries
            </button>
          </div>

          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search deliveries..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 border rounded-md bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  {Object.keys(statusConfig).map((status) => (
                    <option key={status} value={status}>
                      {statusConfig[status].label}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading && !refreshing ? (
              <div className="text-center py-8">
                <Loader className="h-12 w-12 mx-auto text-gray-300 animate-spin" />
                <h3 className="mt-2 text-lg font-medium text-gray-500">
                  Loading deliveries...
                </h3>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-red-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-500">
                  Error loading deliveries
                </h3>
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredDeliveries.length > 0 ? (
              <div className="space-y-6">
                {/* {filteredDeliveries.map((delivery) => { */}
                {filteredDeliveries.map((delivery) => {
                  const { OrderItem } = delivery;
                  const { Order, Product, farmer } = OrderItem;
                  const buyer = Order?.buyer;
                  const StatusIcon =
                    statusConfig[delivery.status]?.icon || Package;

                  return (
                    <div
                      key={delivery.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              statusConfig[delivery.status]?.color.split(
                                " "
                              )[0] || "bg-gray-100"
                            } bg-opacity-20`}
                          >
                            <StatusIcon
                              className={`h-5 w-5 ${
                                statusConfig[delivery.status]?.color.split(
                                  " "
                                )[1] || "text-gray-800"
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {delivery.deliveryNumber}
                              </h4>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  statusConfig[delivery.status]?.color ||
                                  "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {statusConfig[delivery.status]?.label ||
                                  delivery.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Order: {Order?.orderNumber || "-"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">Pickup:</span>{" "}
                            {formatDate(delivery.estimatedPickupTime)}
                          </div>
                          <div className="ml-4 flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">
                              Delivery:
                            </span>{" "}
                            {formatDate(delivery.estimatedDeliveryTime)}
                          </div>
                          {!["Delivered", "Failed", "Cancelled"].includes(
                            delivery.status
                          ) && (
                            <button
                              onClick={() => handleStatusUpdate(delivery)}
                              className="ml-4 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                            >
                              Update Status
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-3">
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-green-600" />
                            Farmer
                          </h5>
                          <p className="text-sm font-medium">
                            {delivery.OrderItem?.farmer?.username || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {delivery.OrderItem?.farmer?.location || "N/A"}
                          </p>
                          {delivery.OrderItem?.farmer?.contact_number && (
                            <a
                              href={`tel:${delivery.OrderItem.farmer.contact_number}`}
                              className="mt-2 inline-flex items-center text-xs text-blue-600"
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              {delivery.OrderItem.farmer.contact_number}
                            </a>
                          )}
                        </div>

                        <div className="border rounded-md p-3">
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            Buyer
                          </h5>
                          <p className="text-sm font-medium">
                            {buyer?.username || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {buyer?.location || "N/A"}
                          </p>
                          {buyer?.contact_number && (
                            <a
                              href={`tel:${buyer.contact_number}`}
                              className="mt-2 inline-flex items-center text-xs text-blue-600"
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              {buyer.contact_number}
                            </a>
                          )}
                        </div>
                      </div>

                      {delivery.OrderItem?.Product && (
                        <div className="p-4 border-t">
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Package className="h-4 w-4 text-gray-600" />
                            Product Details
                          </h5>
                          <div className="flex items-center gap-3">
                            {delivery.OrderItem.Product.image && (
                              <img
                                // src={
                                //   delivery.OrderItem.Product.image ||
                                //   "/placeholder.svg"
                                // }
                                // alt={delivery.OrderItem.Product.productName}
                                // className="h-12 w-12 object-cover rounded-md"
                                src={`http://localhost:8000/${Product.image}`}
                                alt={Product.productName}
                                className="h-12 w-12 object-cover rounded-md"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium">
                                {delivery.OrderItem.Product.productName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Quantity: {delivery.OrderItem.quantity} × Rs
                                {delivery.OrderItem.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {delivery.notes && (
                        <div className="p-4 border-t bg-gray-50">
                          <h5 className="text-sm font-medium mb-1">Notes</h5>
                          <p className="text-sm text-gray-600">
                            {delivery.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-500">
                  No deliveries found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>

          {filteredDeliveries.length > 0 && activeTab === "completed" && (
            <div className="p-6 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {filteredDeliveries.length} deliveries
                {pagination && ` of ${pagination.totalDeliveries} total`}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 border rounded-md text-sm flex items-center ${
                    page === 1
                      ? "text-gray-400 border-gray-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={pagination && page >= pagination.totalPages}
                  className={`px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center ${
                    pagination && page >= pagination.totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {statusUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Update Delivery Status</h3>
            <form onSubmit={handleStatusSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery
                </label>
                <div className="text-sm">
                  {selectedDelivery?.deliveryNumber}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={statusUpdateData.status}
                  onChange={(e) =>
                    setStatusUpdateData({
                      ...statusUpdateData,
                      status: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select status</option>
                  {getNextStatusOptions(selectedDelivery?.status).map(
                    (status) => (
                      <option key={status} value={status}>
                        {statusConfig[status]?.label || status}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={statusUpdateData.notes}
                  onChange={(e) =>
                    setStatusUpdateData({
                      ...statusUpdateData,
                      notes: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                  placeholder="Add any notes about this delivery status update"
                ></textarea>
              </div>

              {statusUpdateData.status === "Delivered" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proof of Delivery (Optional)
                  </label>
                  <div className="flex items-center">
                    <label
                      htmlFor="proof-upload"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      <span>Upload photo</span>
                      <input
                        id="proof-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <span className="ml-3 text-sm text-gray-500">
                      {statusUpdateData.proofOfDelivery
                        ? statusUpdateData.proofOfDelivery.name
                        : "No file selected"}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setStatusUpdateModal(false)}
                  className="px-4 py-2 border rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SupplierLayout>
  );
}
