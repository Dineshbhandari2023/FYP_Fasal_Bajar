const Features = () => {
  return (
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
              dolores rebum. Magna sea eos sit dolor, ipsum amet no tempor ipsum
              eirmod lorem eirmod diam tempor dolor eos diam et et diam dolor
              ea. Clita est rebum amet dolore sit. Dolor stet dolor duo clita,
              vero dolor ipsum amet dolore magna lorem erat stet sed vero dolor
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
  );
};
export default Features;
