const About = () => {
  return (
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
            <h6 className="text-green-600 uppercase font-semibold">About Us</h6>
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
                Labore justo vero ipsum sit clita erat lorem magna clita nonumy
                dolor magna dolor vero
              </p>
            </div>
            <div className="flex flex-col items-start">
              <i className="fa fa-award text-4xl text-orange-500 mb-2"></i>
              <h4 className="text-xl font-semibold mb-1">Award Winning</h4>
              <p>
                Labore justo vero ipsum sit clita erat lorem magna clita nonumy
                dolor magna dolor vero
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
