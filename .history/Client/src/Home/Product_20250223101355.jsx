import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import CreateProduct from "./CreateProduct";

const Product = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6">
          <CreateProduct />
        </main>
      </div>
    </div>
  );
};

export default Product;
