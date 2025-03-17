import React, { useState } from "react";

const Carousel = () => {
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

  return (
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
  );
};

export default Carousel;
