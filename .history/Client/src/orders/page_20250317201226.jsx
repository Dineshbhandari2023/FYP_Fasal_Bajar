"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Truck, Package, CheckCircle } from "lucide-react"
import { useState } from "react"

const orders = [
  {
    id: "ORD12345",
    date: "2023-06-15",
    status: "Delivered",
    total: 560,
    items: [
      {
        id: 1,
        name: "Organic Tomatoes",
        quantity: 3,
        unit: "kg",
        price: 80,
        subtotal: 240,
      },
      {
        id: 2,
        name: "Premium Basmati Rice",
        quantity: 2,
        unit: "kg",
        price: 120,
        subtotal: 240,
      },
      {
        id: 3,
        name: "Fresh Spinach",
        quantity: 2,
        unit: "bunch",
        price: 40,
        subtotal: 80,
      },
    ],
    address: "123 Main St, Bangalore, Karnataka",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "ORD12346",
    date: "2023-06-18",
    status: "Processing",
    total: 350,
    items: [
      {
        id: 3,
        name: "Fresh Alphonso Mangoes",
        quantity: 1,
        unit: "dozen",
        price: 350,
        subtotal: 350,
      },
    ],
    address: "456 Park Ave, Mumbai, Maharashtra",
    paymentMethod: "Online Payment",
  },
  {
    id: "ORD12347",
    date: "2023-06-10",
    status: "Shipped",
    total: 200,
    items: [
      {
        id: 6,
        name: "Organic Wheat Flour",
        quantity: 2,
        unit: "kg",
        price: 60,
        subtotal: 120,
      },
      {
        id: 5,
        name: "Fresh Coconuts",
        quantity: 2,
        unit: "piece",
        price: 35,
        subtotal: 70,
      },
    ],
    address: "789 Rural Road, Kochi, Kerala",
    paymentMethod: "Online Payment",
  },
]

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((order) => order.status.toLowerCase() === activeTab)

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>

          <div className="mb-6">
            <div className="flex border-b overflow-x-auto">
              <button
                className={`py-2 px-4 font-medium whitespace-nowrap ${
                  activeTab === "all"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Orders
              </button>
              <button
                className={`py-2 px-4 font-medium whitespace-nowrap ${
                  activeTab === "processing"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("processing")}
              >
                Processing
              </button>
              <button
                className={`py-2 px-4 font-medium whitespace-nowrap ${
                  activeTab === "shipped"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("shipped")}
              >
                Shipped
              </button>
              <button
                className={`py-2 px-4 font-medium whitespace-nowrap ${
                  activeTab === "delivered"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("delivered")}
              >
                Delivered
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-5 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status === "Delivered" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {order.status === "Shipped" && <Truck className="mr-1 h-3 w-3" />}
                      {order.status === "Processing" && <Package className="mr-1 h-3 w-3" />}
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} {item.unit} × ₹{item.price}/{item.unit}
                                </p>
                              </div>
                            </div>
                            <span>₹{item.subtotal}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-medium">Total</span>
                      <span className="text-lg font-bold">₹{order.total}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div>
                        <h4 className="font-medium mb-1">Shipping Address</h4>
                        <p className="text-sm text-gray-500">{order.address}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Payment Method</h4>
                        <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

