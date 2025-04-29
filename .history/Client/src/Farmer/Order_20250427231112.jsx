import React, { useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Check, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../pages/Sidebar";
import {
  fetchFarmerOrderItems,
  updateOrderItemStatus,
} from "../Redux/slice/orderSlice";
import { toast } from "react-toastify";

const Order = () => {
  const dispatch = useDispatch();
  const {
    farmerItems = [],
    loading,
    error,
  } = useSelector((state) => state.orders || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [productFilter, setProductFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Pagination configuration
  const resultsPerPage = 10;

  useEffect(() => {
    dispatch(fetchFarmerOrderItems());
  }, [dispatch]);

  // Filter orders based on status, date, product, and price
  let filteredItems = farmerItems;

  if (statusFilter !== "All Status") {
    filteredItems = filteredItems.filter(
      (item) => item.status === statusFilter
    );
  }

  if (dateFilter) {
    filteredItems = filteredItems.filter((item) =>
      new Date(item.createdAt).toLocaleDateString().includes(dateFilter)
    );
  }

  if (productFilter) {
    filteredItems = filteredItems.filter((item) =>
      item.Product?.productName
        ?.toLowerCase()
        .includes(productFilter.toLowerCase())
    );
  }

  if (minPrice) {
    filteredItems = filteredItems.filter(
      (item) => item.price >= parseFloat(minPrice)
    );
  }

  if (maxPrice) {
    filteredItems = filteredItems.filter(
      (item) => item.price <= parseFloat(maxPrice)
    );
  }

  const totalResults = filteredItems.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle status update for an order item (Accept or Decline)
  const handleUpdateStatus = (itemId, newStatus) => {
    dispatch(
      updateOrderItemStatus({ itemId, status: newStatus, farmerNotes: "" })
    ).then((result) => {
      if (updateOrderItemStatus.fulfilled.match(result)) {
        toast.success(`Order item ${newStatus.toLowerCase()} successfully`);
      } else {
        toast.error(result.payload || "Failed to update order status");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />

      <div className="flex-1 md:ml-64">
        {/* Mobile menu button */}
        <div className="md:hidden p-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              My Order History
            </h1>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Declined</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <input
                  type="text"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="dd/mm/yyyy"
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Calendar size={16} />
                </div>
              </div>

              {/* Product Filter */}
              <div className="relative">
                <input
                  type="text"
                  value={productFilter}
                  onChange={(e) => {
                    setProductFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by product name"
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Min Price Filter */}
              <div className="relative">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Min price"
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Max Price Filter */}
              <div className="relative">
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Max price"
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && <div className="text-center">Loading orders...</div>}
            {error && (
              <div className="text-center text-red-600">Error: {error}</div>
            )}

            {/* Orders Table */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Order ID
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Product Name
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Quantity
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Price
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Date
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 text-sm font-medium text-blue-600">
                          {order.Order?.orderNumber || order.id}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {order.Product?.productName || "N/A"}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {order.quantity} {order.Product?.unit || ""}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          NPR {order.price}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {order.status === "Pending" ? (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Pending
                            </span>
                          ) : order.status === "Accepted" ? (
                            <span className="flex items-center text-green-600 text-sm">
                              <Check size={16} className="mr-1" />
                              Accepted
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Declined
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-sm space-x-2">
                          {order.status === "Pending" ? (
                            <>
                              <button
                                className="px-3 py-1 rounded text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100"
                                onClick={() =>
                                  handleUpdateStatus(order.id, "Accepted")
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="px-3 py-1 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100"
                                onClick={() =>
                                  handleUpdateStatus(order.id, "Declined")
                                }
                              >
                                Decline
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">
                              No actions
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && paginatedItems.length === 0 && (
              <div className="text-center py-6 text-gray-600">
                No orders found.
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-center mt-6">
                <div className="text-sm text-gray-600 mb-4 md:mb-0">
                  Showing {(currentPage - 1) * resultsPerPage + 1} to{" "}
                  {Math.min(currentPage * resultsPerPage, totalResults)} of{" "}
                  {totalResults} results
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`px-3 py-1 border ${
                          currentPage === page
                            ? "bg-blue-50 border-blue-500 text-blue-600"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                        } rounded-md`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
