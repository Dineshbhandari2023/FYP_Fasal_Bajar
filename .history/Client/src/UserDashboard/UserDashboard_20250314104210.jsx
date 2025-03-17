import React, { useState } from "react";
import "./index.css"; // Ensure Tailwind is imported
// If you store images in /public/img, you can reference them directly as "/img/..."

const UserDashboard = () => {
  // ---------------------------
  // Navbar toggle state (mobile)
  // ---------------------------
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  // ---------------------------
  // Carousel state & handlers
  // ---------------------------
  const slides = [
    {
      id: 1,
      title: "Organic Vegetables",
      subtitle: "Organic Vegetables For Healthy Life",
      img: "/img/carousel-1.jpg",
    },
    {
      id: 2,
      title: "Organic Fruits",
      subtitle: "Organic Fruits For Better Health",
      img: "/img/carousel-2.jpg",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // ---------------------------
  // Newsletter form state
  // ---------------------------
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Basic validation example
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    // Reset and handle subscription
    setError("");
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <div className="font-sans text-gray-700 w-full overflow-hidden">
      {/* -------------------------- */}
      {/* Top Bar */}
      {/* -------------------------- */}
      <div className="hidden lg:block w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
          {/* Left: phone number */}
          <div className="flex items-center space-x-2">
            <i className="bi bi-phone-vibrate text-green-600 text-2xl"></i>
            <h2 className="text-lg font-semibold">+012 345 6789</h2>
          </div>

          {/* Center: brand name */}
          <div className="flex items-center justify-center">
            <a href="/" className="text-4xl font-bold text-green-700">
              <span className="text-orange-600">Farm</span>Fresh
            </a>
          </div>

          {/* Right: social icons */}
          <div className="flex items-center space-x-2">
            <a
              href="#"
              className="bg-green-600 text-white w-9 h-9 flex items-center justify-center rounded-full"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="bg-green-600 text-white w-9 h-9 flex items-center justify-center rounded-full"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="bg-green-600 text-white w-9 h-9 flex items-center justify-center rounded-full"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              href="#"
              className="bg-green-600 text-white w-9 h-9 flex items-center justify-center rounded-full"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* -------------------------- */}
      {/* Navbar */}
      {/* -------------------------- */}
      <nav className="w-full bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between lg:justify-start">
          {/* Mobile brand (only visible on smaller screens) */}
          <div className="flex lg:hidden">
            <a href="/" className="text-3xl font-bold">
              <span className="text-orange-400">Farm</span>Fresh
            </a>
          </div>

          {/* Toggle button (mobile) */}
          <button onClick={toggleNav} className="text-white text-2xl lg:hidden">
            <i className="bi bi-list"></i>
          </button>

          {/* Navbar links */}
          <div
            className={`flex-col lg:flex-row lg:flex items-center space-x-0 lg:space-x-4 absolute lg:static top-[60px] left-0 w-full lg:w-auto bg-green-600 lg:bg-transparent transition-all duration-300 ${
              navOpen ? "flex" : "hidden"
            }`}
          >
            <a
              href="#"
              className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
            >
              Home
            </a>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
            >
              About
            </a>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
            >
              Service
            </a>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
            >
              Product
            </a>

            {/* Dropdown (Pages) */}
            <div className="group relative block">
              <button className="w-full text-left px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent">
                Pages <i className="bi bi-caret-down-fill"></i>
              </button>
              <div className="hidden group-hover:block absolute left-0 top-full bg-white text-gray-700 w-40 shadow-md z-10">
                <a
                  href="#"
                  className="block px-3 py-2 hover:bg-gray-200 text-sm"
                >
                  Blog Grid
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 hover:bg-gray-200 text-sm"
                >
                  Blog Detail
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 hover:bg-gray-200 text-sm"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 hover:bg-gray-200 text-sm"
                >
                  The Team
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 hover:bg-gray-200 text-sm"
                >
                  Testimonial
                </a>
              </div>
            </div>

            <a
              href="#"
              className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
            >
              Contact
            </a>

            {/* If user is logged in - add "View Profile" */}
            <a
              href="#"
              className="block px-4 py-2 hover:bg-green-500 lg:hover:bg-transparent"
            >
              View Profile
            </a>
          </div>
        </div>
      </nav>

      {/* -------------------------- */}
      {/* Carousel */}
      {/* -------------------------- */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-white max-w-2xl text-center px-5">
                <h3 className="text-lg mb-2">{slide.title}</h3>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {slide.subtitle}
                </h1>
                <div className="space-x-3">
                  <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md">
                    Explore
                  </button>
                  <button className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-md">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-700 p-2 rounded-full hover:bg-opacity-100 transition"
        >
          <i className="bi bi-chevron-left text-2xl"></i>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-700 p-2 rounded-full hover:bg-opacity-100 transition"
        >
          <i className="bi bi-chevron-right text-2xl"></i>
        </button>
      </div>

      {/* -------------------------- */}
      {/* Banner (2-column) */}
      {/* -------------------------- */}
      <div className="container mx-auto my-5 px-4">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-green-600 p-5 flex flex-col justify-center text-white h-64 mb-4 md:mb-0 md:mr-2">
            <h3 className="text-2xl mb-3">Organic Vegetables</h3>
            <p className="mb-3">
              Dolor magna ipsum elitr sea erat elitr amet ipsum stet justo
              dolor, amet lorem diam no duo sed dolore amet diam
            </p>
            <a href="#" className="font-bold hover:underline">
              Read More <i className="bi bi-arrow-right ml-2"></i>
            </a>
          </div>
          <div className="md:w-1/2 bg-orange-500 p-5 flex flex-col justify-center text-white h-64 md:ml-2">
            <h3 className="text-2xl mb-3">Organic Fruits</h3>
            <p className="mb-3">
              Dolor magna ipsum elitr sea erat elitr amet ipsum stet justo
              dolor, amet lorem diam no duo sed dolore amet diam
            </p>
            <a href="#" className="font-bold hover:underline">
              Read More <i className="bi bi-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </div>

      {/* -------------------------- */}
      {/* About */}
      {/* -------------------------- */}
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col lg:flex-row lg:space-x-5">
          <div className="lg:w-1/2 mb-5 lg:mb-0 flex items-center justify-center border-4 border-green-600">
            <img
              src="/img/about.png"
              alt="About"
              className="object-contain w-auto h-auto"
            />
          </div>
          <div className="lg:w-1/2">
            <div className="mb-5">
              <h6 className="text-green-600 uppercase font-semibold">
                About Us
              </h6>
              <h1 className="text-3xl font-bold">
                We Produce Organic Food For Your Family
              </h1>
            </div>
            <p className="mb-4">
              Tempor erat elitr at rebum at at clita. Diam dolor diam ipsum et
              tempor sit. Clita erat ipsum et lorem et sit, sed stet no labore
              lorem sit. Sanctus clita duo justo et tempor eirmod magna dolore
              erat amet magna
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-start">
                <i className="fa fa-seedling text-4xl text-orange-500 mb-2"></i>
                <h4 className="text-xl font-semibold mb-1">100% Organic</h4>
                <p>
                  Labore justo vero ipsum sit clita erat lorem magna clita
                  nonumy dolor magna dolor vero
                </p>
              </div>
              <div className="flex flex-col items-start">
                <i className="fa fa-award text-4xl text-orange-500 mb-2"></i>
                <h4 className="text-xl font-semibold mb-1">Award Winning</h4>
                <p>
                  Labore justo vero ipsum sit clita erat lorem magna clita
                  nonumy dolor magna dolor vero
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------- */}
      {/* Facts */}
      {/* -------------------------- */}
      <div className="w-full bg-green-600 py-5 mb-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between text-white">
            {/* Fact item */}
            <div className="w-full md:w-1/2 lg:w-1/4 flex items-center mb-4">
              <div className="bg-orange-500 w-14 h-14 flex items-center justify-center rounded-full mr-3">
                <i className="fa fa-star text-white text-xl"></i>
              </div>
              <div>
                <h5 className="text-white text-sm">Our Experience</h5>
                <h1 className="text-3xl font-bold">12345</h1>
              </div>
            </div>
            {/* Fact item */}
            <div className="w-full md:w-1/2 lg:w-1/4 flex items-center mb-4">
              <div className="bg-orange-500 w-14 h-14 flex items-center justify-center rounded-full mr-3">
                <i className="fa fa-users text-white text-xl"></i>
              </div>
              <div>
                <h5 className="text-white text-sm">Farm Specialist</h5>
                <h1 className="text-3xl font-bold">12345</h1>
              </div>
            </div>
            {/* Fact item */}
            <div className="w-full md:w-1/2 lg:w-1/4 flex items-center mb-4">
              <div className="bg-orange-500 w-14 h-14 flex items-center justify-center rounded-full mr-3">
                <i className="fa fa-check text-white text-xl"></i>
              </div>
              <div>
                <h5 className="text-white text-sm">Complete Project</h5>
                <h1 className="text-3xl font-bold">12345</h1>
              </div>
            </div>
            {/* Fact item */}
            <div className="w-full md:w-1/2 lg:w-1/4 flex items-center mb-4">
              <div className="bg-orange-500 w-14 h-14 flex items-center justify-center rounded-full mr-3">
                <i className="fa fa-mug-hot text-white text-xl"></i>
              </div>
              <div>
                <h5 className="text-white text-sm">Happy Clients</h5>
                <h1 className="text-3xl font-bold">12345</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------- */}
      {/* Services */}
      {/* -------------------------- */}
      <div className="container mx-auto py-5 px-4">
        <div className="flex flex-wrap">
          {/* Intro column */}
          <div className="w-full lg:w-1/3 mb-5">
            <h6 className="text-green-600 uppercase">Services</h6>
            <h1 className="text-3xl font-bold">Organic Farm Services</h1>
            <p className="my-4">
              Tempor erat elitr at rebum at at clita. Diam dolor diam ipsum et
              tempor sit. Clita erat ipsum et lorem et sit sed stet labore
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded">
              Contact Us
            </button>
          </div>
          {/* Service items */}
          <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="bg-gray-100 text-center p-5 h-full">
              <i className="fa fa-carrot text-green-600 text-4xl mb-3"></i>
              <h4 className="text-xl font-semibold mb-2">Fresh Vegetables</h4>
              <p>
                Labore justo vero ipsum sit clita erat lorem magna clita nonumy
                dolor magna dolor vero
              </p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="bg-gray-100 text-center p-5 h-full">
              <i className="fa fa-apple-alt text-green-600 text-4xl mb-3"></i>
              <h4 className="text-xl font-semibold mb-2">Fresh Fruits</h4>
              <p>
                Labore justo vero ipsum sit clita erat lorem magna clita nonumy
                dolor magna dolor vero
              </p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="bg-gray-100 text-center p-5 h-full">
              <i className="fa fa-dog text-green-600 text-4xl mb-3"></i>
              <h4 className="text-xl font-semibold mb-2">Healthy Cattle</h4>
              <p>
                Labore justo vero ipsum sit clita erat lorem magna clita nonumy
                dolor magna dolor vero
              </p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="bg-gray-100 text-center p-5 h-full">
              <i className="fa fa-tractor text-green-600 text-4xl mb-3"></i>
              <h4 className="text-xl font-semibold mb-2">Modern Truck</h4>
              <p>
                Labore justo vero ipsum sit clita erat lorem magna clita nonumy
                dolor magna dolor vero
              </p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="bg-gray-100 text-center p-5 h-full">
              <i className="fa fa-seedling text-green-600 text-4xl mb-3"></i>
              <h4 className="text-xl font-semibold mb-2">Farming Plans</h4>
              <p>
                Labore justo vero ipsum sit clita erat lorem magna clita nonumy
                dolor magna dolor vero
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------- */}
      {/* Features */}
      {/* -------------------------- */}
      <div className="w-full bg-green-600 py-5 mb-5">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-5">
            <h6 className="uppercase text-orange-400">Features</h6>
            <h1 className="text-3xl font-bold">Why Choose Us!!!</h1>
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-5">
            <div className="lg:w-1/4 mb-5 lg:mb-0 flex flex-col justify-center text-white">
              <div className="mb-5">
                <div className="bg-orange-500 w-14 h-14 flex items-center justify-center rounded-full mb-3">
                  <i className="fa fa-seedling text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold">100% Organic</h4>
                <p>Labore justo vero ipsum sit clita erat lorem magna clita</p>
              </div>
              <div>
                <div className="bg-orange-500 w-14 h-14 flex items-center justify-center rounded-full mb-3">
                  <i className="fa fa-award text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold">Award Winning</h4>
                <p>Labore justo vero ipsum sit clita erat lorem magna clita</p>
              </div>
            </div>
            <div className="lg:w-1/2 bg-white text-center p-5">
              <p className="mb-4 text-gray-700">
                At et justo elitr amet sea at. Magna et sit vero at ipsum sit et
                dolores rebum. Magna sea eos sit dolor, ipsum amet no tempor
                ipsum eirmod lorem eirmod diam tempor dolor eos diam et et diam
                dolor ea. Clita est rebum amet dolore sit. Dolor stet dolor duo
                clita, vero dolor ipsum amet dolore magna lorem erat stet sed
                vero dolor
              </p>
              <img className="mx-auto" src="/img/feature.png" alt="Feature" />
            </div>
            <div className="lg:w-1/4 mb-5 lg:mb-0 flex flex-col justify-center text-white">
              <div className="mb-5">
                <div className="bg-orange-500 w-14 h-14 flex items-center justify-center rounded-full mb-3">
                  <i className="fa fa-tractor text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold">Modern Farming</h4>
                <p>Labore justo vero ipsum sit clita erat lorem magna clita</p>
              </div>
              <div>
                <div className="bg-orange-500 w-14 h-14 flex items-center justify-center rounded-full mb-3">
                  <i className="fa fa-phone-alt text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-semibold">24/7 Support</h4>
                <p>Labore justo vero ipsum sit clita erat lorem magna clita</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------- */}
      {/* Products (example carousel) */}
      {/* -------------------------- */}
      <div className="container mx-auto px-4 py-5">
        <div className="text-center mb-5">
          <h6 className="text-green-600 uppercase">Products</h6>
          <h1 className="text-3xl font-bold">Our Fresh & Organic Products</h1>
        </div>

        {/* Simple product grid (instead of owl-carousel) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className="bg-white flex flex-col items-center p-5 text-center shadow"
            >
              <img
                className="mb-4 max-h-40 object-contain"
                src={`/img/product-${num % 2 === 0 ? 2 : 1}.png`}
                alt="Product"
              />
              <h6 className="mb-3">Organic Vegetable</h6>
              <h5 className="text-green-600 mb-3">$19.00</h5>
              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-3 py-2 rounded">
                  <i className="bi bi-cart"></i>
                </button>
                <button className="bg-orange-500 text-white px-3 py-2 rounded">
                  <i className="bi bi-eye"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------- */}
      {/* Testimonial */}
      {/* -------------------------- */}
      <div
        className="w-full bg-cover bg-no-repeat bg-center py-5"
        style={{
          backgroundImage: "url(/img/testimonial-2.jpg)",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <div className="bg-black bg-opacity-60 py-5">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-2xl mb-5">Testimonials</h2>
            {/* A simple static testimonial, or map over array of testimonials */}
            <div className="max-w-xl mx-auto bg-black bg-opacity-30 p-5 rounded">
              <img
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-orange-500"
                src="/img/testimonial-2.jpg"
                alt="Client"
              />
              <p className="text-lg italic">
                Dolores sed duo clita justo dolor et stet lorem kasd dolore
                lorem ipsum. At lorem lorem magna ut et, nonumy labore diam
                erat. Erat dolor rebum sit ipsum.
              </p>
              <hr className="my-3 w-1/4 mx-auto border-gray-200" />
              <h4 className="text-xl font-semibold">Client Name</h4>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------- */}
      {/* Team */}
      {/* -------------------------- */}
      <div className="container mx-auto px-4 py-5">
        <div className="text-center mb-5">
          <h6 className="text-green-600 uppercase">The Team</h6>
          <h1 className="text-3xl font-bold">
            We Are Professional Organic Farmers
          </h1>
        </div>
        <div className="flex flex-wrap -mx-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-5">
              <div className="flex">
                <div className="flex-1 relative">
                  <img
                    className="w-full h-auto"
                    src={`/img/team-${item}.jpg`}
                    alt="Team"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-green-700 bg-opacity-90 text-white py-2 px-4">
                    <h4 className="font-semibold">Farmer Name</h4>
                    <span>Designation</span>
                  </div>
                </div>
                <div className="w-14 bg-orange-500 flex flex-col items-center justify-around py-5">
                  <a
                    className="bg-white w-8 h-8 flex items-center justify-center rounded-full mb-2"
                    href="#"
                  >
                    <i className="fab fa-twitter text-orange-500"></i>
                  </a>
                  <a
                    className="bg-white w-8 h-8 flex items-center justify-center rounded-full mb-2"
                    href="#"
                  >
                    <i className="fab fa-facebook-f text-orange-500"></i>
                  </a>
                  <a
                    className="bg-white w-8 h-8 flex items-center justify-center rounded-full mb-2"
                    href="#"
                  >
                    <i className="fab fa-linkedin-in text-orange-500"></i>
                  </a>
                  <a
                    className="bg-white w-8 h-8 flex items-center justify-center rounded-full"
                    href="#"
                  >
                    <i className="fab fa-instagram text-orange-500"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------- */}
      {/* Blog */}
      {/* -------------------------- */}
      <div className="container mx-auto px-4 py-5">
        <div className="text-center mb-5">
          <h6 className="text-green-600 uppercase">Our Blog</h6>
          <h1 className="text-3xl font-bold">
            Latest Articles From Our Blog Post
          </h1>
        </div>
        <div className="flex flex-wrap -mx-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="w-full md:w-1/3 px-2 mb-4">
              <div className="relative overflow-hidden">
                <img
                  className="w-full h-auto"
                  src={`/img/blog-${item}.jpg`}
                  alt="Blog"
                />
                <a
                  href="#"
                  className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition"
                >
                  <h4 className="text-xl font-semibold mb-2">
                    Lorem elitr magna stet eirmod labore amet
                  </h4>
                  <span className="font-bold">Jan 01, 2050</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------- */}
      {/* Footer */}
      {/* -------------------------- */}
      <div className="w-full bg-green-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-2/3 lg:w-3/4 px-4">
              <div className="flex flex-wrap -mx-4">
                {/* Contact Info */}
                <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-5">
                  <h4 className="text-white mb-4">Get In Touch</h4>
                  <div className="flex items-start mb-2">
                    <i className="bi bi-geo-alt text-white mr-2"></i>
                    <p>123 Street, New York, USA</p>
                  </div>
                  <div className="flex items-start mb-2">
                    <i className="bi bi-envelope-open text-white mr-2"></i>
                    <p>info@example.com</p>
                  </div>
                  <div className="flex items-start mb-2">
                    <i className="bi bi-telephone text-white mr-2"></i>
                    <p>+012 345 67890</p>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <a
                      className="bg-orange-500 w-9 h-9 flex items-center justify-center rounded-full"
                      href="#"
                    >
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a
                      className="bg-orange-500 w-9 h-9 flex items-center justify-center rounded-full"
                      href="#"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a
                      className="bg-orange-500 w-9 h-9 flex items-center justify-center rounded-full"
                      href="#"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a
                      className="bg-orange-500 w-9 h-9 flex items-center justify-center rounded-full"
                      href="#"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-5">
                  <h4 className="text-white mb-4">Quick Links</h4>
                  <div className="flex flex-col">
                    <a href="#" className="mb-2 hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>Home
                    </a>
                    <a href="#" className="mb-2 hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>About Us
                    </a>
                    <a href="#" className="mb-2 hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>Our Services
                    </a>
                    <a href="#" className="mb-2 hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>Meet The Team
                    </a>
                    <a href="#" className="mb-2 hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>Latest Blog
                    </a>
                    <a href="#" className="hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>Contact Us
                    </a>
                  </div>
                </div>

                {/* Popular Links */}
                <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-5">
                  <h4 className="text-white mb-4">Popular Links</h4>
                  <div className="flex flex-col">
                    <a href="#" className="mb-2 hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>Home
                    </a>
                    <a href="#" className="mb-2 hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>About Us
                    </a>
                    <a href="#" className="mb-2 hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>Our Services
                    </a>
                    <a href="#" className="mb-2 hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>Meet The Team
                    </a>
                    <a href="#" className="mb-2 hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>Latest Blog
                    </a>
                    <a href="#" className="hover:underline">
                      <i className="bi bi-arrow-right mr-2"></i>Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="w-full md:w-1/3 lg:w-1/4 px-4 mt-4 md:mt-0">
              <div className="bg-orange-500 h-full p-5 text-center flex flex-col items-center justify-center">
                <h4 className="text-white text-xl mb-2">Newsletter</h4>
                <h6 className="text-white mb-2">Subscribe Our Newsletter</h6>
                <p className="text-white mb-3">
                  Amet justo diam dolor rebum lorem sit stet sea justo kasd
                </p>
                <form onSubmit={handleSubscribe} className="w-full">
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 p-2 rounded-l outline-none"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-green-700 text-white px-4 py-2 rounded-r"
                    >
                      Sign Up
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-200 text-sm mt-2">{error}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-black text-white py-4 text-center">
        <p className="mb-0">
          &copy;{" "}
          <a className="text-orange-500 font-bold" href="#">
            Your Site Name
          </a>
          . All Rights Reserved. Designed by{" "}
          <a className="text-orange-500 font-bold" href="https://htmlcodex.com">
            HTML Codex
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
