import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";
import { Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../Redux/slice/orderSlice";
import { io } from "socket.io-client";

// Sample initial cart data
const initialCartItems = [
  {
    id: 1,
    name: "Organic Tomatoes",
    price: 80,
    quantity: 2,
    unit: "kg",
    image: "/placeholder.svg?height=80&width=80",
    farmer: "Rajesh Farms",
  },
  {
    id: 2,
    name: "Premium Basmati Rice",
    price: 120,
    quantity: 1,
    unit: "kg",
    image: "/placeholder.svg?height=80&width=80",
    farmer: "Singh Agro",
  },
];

export default function CartPage() {
  const dispatch = useDispatch();
  // Local cart state
  const [cartItems, setCartItems] = useState(initialCartItems);
  // Order address & payment details
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateAddr, setStateAddr] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Redux order state (if you want to show order loading/error)
  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.orders
  );

  // Connect to Socket.IO server
  useEffect(() => {
    // Replace with your actual API URL and pass the user token if required.
    const socket = io("http://localhost:8000", {
      auth: { token: localStorage.getItem("accessToken") },
    });

    socket.on("order:created", (data) => {
      console.log("Socket event - Order created:", data);
    });

    socket.on("order:updated", (data) => {
      console.log("Socket event - Order updated:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const deliveryFee = 50;
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryFee;

  // Handle order checkout: prepare order data and dispatch createOrder
  const handleCheckout = () => {
    if (!deliveryAddress || !city || !stateAddr || !pinCode) {
      alert("Please fill in your complete delivery address.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    // Prepare order items in the expected format
    const items = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      items,
      shippingAddress: deliveryAddress,
      city,
      state: stateAddr,
      pinCode,
      paymentMethod,
      notes: "", // Add any order notes if needed
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then((order) => {
        alert("Order placed successfully! Order Number: " + order.orderNumber);
        // Clear cart after successful order
        setCartItems([]);
      })
      .catch((err) => {
        alert("Order failed: " + err);
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <a
              href="/browse"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Browse Crops
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-5 border-b">
                  <h2 className="text-lg font-semibold">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 py-4 border-b"
                    >
                      <div className="h-20 w-20 rounded-md overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Farmer: {item.farmer}
                        </p>
                        <p className="text-sm font-medium">
                          ₹{item.price}/{item.unit}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{item.price * item.quantity}
                        </p>
                        <button
                          className="text-red-500 hover:text-red-700 text-sm flex items-center mt-1"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-5 border-b">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="border-t pt-4"></div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Delivery Address</h3>
                    <input
                      placeholder="Enter your delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        placeholder="State"
                        value={stateAddr}
                        onChange={(e) => setStateAddr(e.target.value)}
                        className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        placeholder="PIN Code"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment"
                          value="Cash on Delivery"
                          checked={paymentMethod === "Cash on Delivery"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>Cash on Delivery</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="payment"
                          value="Online Payment"
                          checked={paymentMethod === "Online Payment"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>Online Payment</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t">
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    disabled={orderLoading}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {orderLoading ? "Placing Order..." : "Proceed to Checkout"}
                  </button>
                  {orderError && (
                    <p className="text-red-500 text-center mt-2">
                      {orderError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
