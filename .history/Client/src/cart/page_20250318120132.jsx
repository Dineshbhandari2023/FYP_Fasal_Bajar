import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";
import { Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useState } from "react";
import { createOrder } from "../Redux/slice/orderSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState(initialCartItems);
  // New states for shipping and payment info
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [notes, setNotes] = useState("");

  // Function to calculate subtotal remains the same...

  const handleCheckout = () => {
    // Map your cart items to the format expected by your API.
    // Make sure each item contains a productId and quantity.
    const items = cartItems.map((item) => ({
      productId: item.id, // Ensure item.id is the product ID used by your API
      quantity: item.quantity,
    }));

    // Build the order data payload
    const orderData = {
      items,
      shippingAddress,
      city,
      state: stateName,
      pinCode,
      paymentMethod,
      notes,
    };

    // Dispatch the createOrder action
    dispatch(createOrder(orderData))
      .unwrap()
      .then((order) => {
        // Optionally, clear the cart after successful order creation.
        setCartItems([]);
        alert(`Order ${order.orderNumber} created successfully!`);
      })
      .catch((error) => {
        alert(`Order creation failed: ${error}`);
      });
  };

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
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
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
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        placeholder="PIN Code"
                        className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="payment" defaultChecked />
                        <span>Cash on Delivery</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="payment" />
                        <span>Online Payment</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t">
                  <button className="w-full flex items-center justify-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
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
