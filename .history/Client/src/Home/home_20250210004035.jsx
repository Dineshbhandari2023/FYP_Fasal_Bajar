import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import WelcomeSection from "./components/WelcomeSection";
import ActionButtons from "./components/ActionButtons";
import FeaturedProducts from "./components/FeaturedProducts";
import OrderOverview from "./components/OrderOverview";
import RecentUpdates from "./components/RecentUpdates";

export default function Dashboard() {
  const [user] = useState({
    name: "John Smith",
    role: "Buyer",
  });

  const [orderStats] = useState({
    pending: 5,
    inTransit: 3,
    delivered: 12,
  });

  const [updates] = useState([
    {
      id: 1,
      type: "delivery",
      message: "Order #12345 has been delivered",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "product",
      message: "New products available from Organic Farms",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "message",
      message: "New message from Green Valley Farms",
      time: "1 day ago",
    },
  ]);

  const [featuredProducts] = useState([
    {
      id: 1,
      name: "Organic Tomatoes",
      price: 2.5,
      unit: "kg",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mMIepkSWnLecsqycqPubdPDNwDzOMS.png",
    },
    {
      id: 2,
      name: "Fresh Carrots",
      price: 1.9,
      unit: "kg",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mMIepkSWnLecsqycqPubdPDNwDzOMS.png",
    },
    {
      id: 3,
      name: "Premium Potatoes",
      price: 3.4,
      unit: "kg",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mMIepkSWnLecsqycqPubdPDNwDzOMS.png",
    },
    {
      id: 4,
      name: "Fresh Lettuce",
      price: 2.4,
      unit: "piece",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mMIepkSWnLecsqycqPubdPDNwDzOMS.png",
    },
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <Header user={user} />
        <div className="p-6">
          <WelcomeSection userName={user.name} />
          <ActionButtons />
          <FeaturedProducts products={featuredProducts} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <OrderOverview stats={orderStats} />
            <RecentUpdates updates={updates} />
          </div>
        </div>
      </main>
    </div>
  );
}
