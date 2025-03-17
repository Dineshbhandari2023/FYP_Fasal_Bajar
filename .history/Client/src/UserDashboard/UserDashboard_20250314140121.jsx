import React from "react";
// import TopBar from "./TopBar";
import Navbar from "./NavBar";
import Carousel from "./Crousel";
import Banner from "./Banner";
import About from "./About";
import Facts from "./Facts";
import Services from "./Services";
import Features from "./Features";
import Products from "./Products";
import Testimonials from "./Testimonials";
import Footer from "./Footer";

const UserDashboard = () => {
  return (
    <div className="font-sans text-gray-700 w-full overflow-hidden">
      {/* <TopBar /> */}
      <Navbar />
      <Carousel />
      <Banner />
      <About />
      <Facts />
      <Services />
      <Features />
      <Products />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default UserDashboard;
