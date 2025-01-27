import React, { useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Submitted: ", contactForm);
    alert("Thank you for your message!");
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-gray-100 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">AgriConnect Nepal</h1>
          <div>
            <Link to={"/login"}>
              <button className="px-4 py-2 mr-4 border rounded-md hover:bg-gray-200">
                Log in
              </button>
            </Link>
            <Link to={"/register"}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Connecting Farmers and Buyers in Nepal
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Empowering local farmers and protecting Nepal’s agricultural
            heritage through digital innovation.
          </p>
          <div>
            <Link to={"/register"}></Link>
            <button className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 mr-4">
              Get Started
            </button>
            <button className="px-6 py-3 bg-gray-300 rounded-md hover:bg-gray-400">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="shadow-md p-6 rounded-md bg-gray-50">
              <h4 className="font-bold mb-4">Farmer Listings</h4>
              <p>Post your details and listings to reach buyers directly.</p>
            </div>
            <div className="shadow-md p-6 rounded-md bg-gray-50">
              <h4 className="font-bold mb-4">Advanced Search</h4>
              <p>Find the right products with easy-to-use search options.</p>
            </div>
            <div className="shadow-md p-6 rounded-md bg-gray-50">
              <h4 className="font-bold mb-4">Integrated Shipping</h4>
              <p>Seamless logistics for your agricultural needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-md bg-white shadow-md">
              <h4 className="font-bold mb-4">Farmers List Crops</h4>
              <p>Upload your crops and get matched with buyers.</p>
            </div>
            <div className="p-6 rounded-md bg-white shadow-md">
              <h4 className="font-bold mb-4">Buyers Search and Filter</h4>
              <p>Find the best products that suit your needs.</p>
            </div>
            <div className="p-6 rounded-md bg-white shadow-md">
              <h4 className="font-bold mb-4">Place Orders</h4>
              <p>Order directly and manage logistics with ease.</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-8">What Our Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-md bg-gray-50 shadow-md">
              <p className="italic mb-4">
                “AgriConnect has revolutionized how I sell my crops. It’s
                amazing to connect directly with buyers!”
              </p>
              <h4 className="font-bold">— Farmer Sunita</h4>
            </div>
            <div className="p-6 rounded-md bg-gray-50 shadow-md">
              <p className="italic mb-4">
                “Finding fresh produce has never been easier. The shipping
                feature is a lifesaver!”
              </p>
              <h4 className="font-bold">— Consumer Amar</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <footer className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Ready to Transform Nepal’s Agriculture?
          </h3>
          <p className="mb-6">
            Join our platform and be part of the digital agricultural
            revolution.
          </p>
          <button className="px-6 py-3 bg-blue-500 rounded-md hover:bg-blue-600 mr-4">
            Sign up
          </button>
          <button className="px-6 py-3 bg-gray-300 text-black rounded-md hover:bg-gray-400">
            Contact Us
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
