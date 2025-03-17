import react, { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <>
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
    </>
  );
};

export default Footer;
