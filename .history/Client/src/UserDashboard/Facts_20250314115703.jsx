const Facts = () => {
  return (
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
  );
};

export default Facts;
