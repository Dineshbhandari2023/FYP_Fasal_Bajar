import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";
import { Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useState } from "react";
import { createOrder } from "../Redux/slice/orderSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [notes, setNotes] = useState("");

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const deliveryFee = 100;
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    // Validate input
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }
    if (!shippingAddress || !city || !stateName || !pinCode) {
      toast.error("Please fill in all delivery address fields");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      items,
      shippingAddress,
      city,
      state: stateName,
      pinCode,
      paymentMethod,
      notes,
    };

    try {
      const response = await dispatch(createOrder(orderData)).unwrap();
      const { order } = response;
      setCartItems([]);
      localStorage.removeItem("cart");
      toast.success(
        paymentMethod === "Online Payment"
          ? `Order ${order.orderNumber} created successfully! Please wait for farmer acceptance to proceed with payment on the Orders page.`
          : `Order ${order.orderNumber} created successfully!`
      );
      navigate("/orders");
    } catch (error) {
      toast.error(
        `Order creation failed: ${
          error.message || "An unexpected error occurred"
        }`
      );
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
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
                  {cartItems.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="flex items-center space-x-4 py-4 border-b"
                    >
                      <div className="h-20 w-20 rounded-md overflow-hidden">
                        <img
                          src={`http://localhost:8000/${item.image}`}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productName}</h3>
                        <p className="text-sm text-gray-500">
                          Farmer: {item.farmer}
                        </p>
                        <p className="text-sm font-medium">
                          NPR:{item.price}/{item.unit}
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
                          NPR:{item.price * item.quantity}
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
                    <span>NPR:{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>NPR:{deliveryFee}</span>
                  </div>
                  <div className="border-t pt-4"></div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>NPR{total}</span>
                  </div>
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Delivery Address</h3>
                    <input
                      placeholder="Enter your delivery address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 mb-2"
                    />
                    <input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 mb-2"
                    />
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        placeholder="State"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="rounded-md border border-gray-300 py-2 px-3"
                      />
                      <input
                        placeholder="PIN Code"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="rounded-md border border-gray-300 py-2 px-3"
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
                    className="w-full flex items-center justify-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Place Order
                  </button>
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
