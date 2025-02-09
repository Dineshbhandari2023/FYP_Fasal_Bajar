import React, { useState } from "react";
import { Card, CardContent, CardHeader, Button } from "@/components/ui";
import Sidebar from "./sideBar";

const Home = ({ user, featuredProducts, orders, updates }) => {
  const [orderOverview, setOrderOverview] = useState(orders);
  const [recentUpdates, setRecentUpdates] = useState(updates);

  return (
    <div className="flex">
      <Sidebar user={user} />
      <main className="flex-1 flex flex-col gap-6 p-6">
        <header className="bg-green-700 text-white p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-2xl">Welcome back, {user.name}!</h1>
          <p className="text-lg">
            Ready to explore today’s fresh products from our trusted farmers?
          </p>
        </header>
        x
        <section className="flex gap-4">
          <Button variant="primary">Browse Products</Button>
          <Button variant="secondary">View Orders</Button>
          <Button variant="secondary">Contact Supplier</Button>
        </section>
        <section className="grid grid-cols-4 gap-6 mt-6">
          <h2 className="col-span-4 text-xl font-bold">Featured Products</h2>
          {featuredProducts.map((product, index) => (
            <Card key={index} className="rounded-lg shadow">
              <CardHeader>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-32 w-full object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">From {product.price}</p>
              </CardContent>
            </Card>
          ))}
        </section>
        <section className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold">Order Overview</h2>
            <div className="flex gap-4 mt-4">
              {orderOverview.map((order, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center bg-white shadow rounded-lg p-4"
                >
                  <h3 className="text-lg font-bold text-green-700">
                    {order.count}
                  </h3>
                  <p className="text-sm text-gray-500">{order.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold">Recent Updates</h2>
            <ul className="mt-4 space-y-2">
              {recentUpdates.map((update, index) => (
                <li key={index} className="flex gap-2 items-center">
                  <span className="bg-green-200 p-2 rounded-full"></span>
                  <div>
                    <p className="text-sm text-gray-700">{update.message}</p>
                    <p className="text-xs text-gray-500">{update.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
