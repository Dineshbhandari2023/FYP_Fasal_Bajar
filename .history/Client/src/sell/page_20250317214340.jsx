"use client";

import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";
import { Upload, IndianRupee, Calendar } from "lucide-react";
import { useState } from "react";

export default function SellPage() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex border-b">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "new"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("new")}
              >
                List New Crop
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "listings"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("listings")}
              >
                My Listings
              </button>
            </div>
          </div>

          {activeTab === "new" && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">List a New Crop</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Crop Name</label>
                  <input
                    type="text"
                    placeholder="Enter crop name"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    placeholder="Describe your crop..."
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Select category</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="spices">Spices</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Unit</label>
                    <select className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select unit</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="g">Gram (g)</option>
                      <option value="dozen">Dozen</option>
                      <option value="piece">Piece</option>
                      <option value="bunch">Bunch</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Available Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Harvest Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Upload Crop Images
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Drag and drop your crop images here, or click to browse
                    </p>
                    <input type="file" className="hidden" multiple />
                  </div>
                </div>

                <button className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  List Crop
                </button>
              </div>
            </div>
          )}

          {activeTab === "listings" && (
            <div className="grid gap-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-5 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Organic Tomatoes</h3>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt="Organic Tomatoes"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <div>
                      <p className="text-sm text-gray-600">
                        Freshly harvested organic tomatoes grown without
                        pesticides.
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-medium">Stock:</span> 50 kg
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Listed on:</span>{" "}
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">₹80/kg</span>
                    <div className="space-x-2">
                      <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
