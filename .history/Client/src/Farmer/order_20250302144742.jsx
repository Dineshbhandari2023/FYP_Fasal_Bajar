import React, { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Check } from "lucide-react";

const Order = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");

  // Sample data
  const orders = [
    {
      id: "#ORD-001",
      productName: "Wireless Headphones",
      quantity: 2,
      price: "$299.99",
      status: "Pending",
      date: "Jan 15, 2025",
    },
    {
      id: "#ORD-002",
      productName: "Smart Watch",
      quantity: 1,
      price: "$199.99",
      status: "Accepted",
      date: "Jan 14, 2025",
    },
  ];

  const totalResults = 20;
  const resultsPerPage = 10;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full md:w-48 bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Declined</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="dd/mm/yyyy"
            className="w-full md:w-48 bg-white border border-gray-300 rounded-md py-2 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <Calendar size={16} />
          </div>
        </div>
      </div>

      {/* Table */}
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-4 text-sm font-medium text-blue-600">
                  {order.id}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {order.productName}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {order.quantity}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {order.price}
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
                  {order.date}
                </td>
                <td className="py-4 px-4 text-sm space-x-2">
                  <button
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      order.status === "Accepted"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                    disabled={order.status === "Accepted"}
                  >
                    Accept
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      order.status === "Accepted"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                    disabled={order.status === "Accepted"}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        <div className="text-sm text-gray-600 mb-4 md:mb-0">
          Showing 1 to 10 of {totalResults} results
        </div>
        <div className="flex items-center space-x-1">
          <button
            className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>

          {[1, 2, 3].map((page) => (
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
          ))}

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
    </div>
  );
};

export default Order;
