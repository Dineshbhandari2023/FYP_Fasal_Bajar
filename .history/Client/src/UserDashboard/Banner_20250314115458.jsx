const Banner = () => {
  return (
    <div className="container mx-auto my-5 px-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-green-600 p-5 flex flex-col justify-center text-white h-64 mb-4 md:mb-0 md:mr-2">
          <h3 className="text-2xl mb-3">Organic Vegetables</h3>
          <p className="mb-3">
            Dolor magna ipsum elitr sea erat elitr amet ipsum stet justo dolor,
            amet lorem diam no duo sed dolore amet diam
          </p>
          <a href="#" className="font-bold hover:underline">
            Read More <i className="bi bi-arrow-right ml-2"></i>
          </a>
        </div>
        <div className="md:w-1/2 bg-orange-500 p-5 flex flex-col justify-center text-white h-64 md:ml-2">
          <h3 className="text-2xl mb-3">Organic Fruits</h3>
          <p className="mb-3">
            Dolor magna ipsum elitr sea erat elitr amet ipsum stet justo dolor,
            amet lorem diam no duo sed dolore amet diam
          </p>
          <a href="#" className="font-bold hover:underline">
            Read More <i className="bi bi-arrow-right ml-2"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;
