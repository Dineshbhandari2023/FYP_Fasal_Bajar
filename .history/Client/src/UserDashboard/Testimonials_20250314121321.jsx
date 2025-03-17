const Testimonials = () => {
  return (
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
              Dolores sed duo clita justo dolor et stet lorem kasd dolore lorem
              ipsum. At lorem lorem magna ut et, nonumy labore diam erat. Erat
              dolor rebum sit ipsum.
            </p>
            <hr className="my-3 w-1/4 mx-auto border-gray-200" />
            <h4 className="text-xl font-semibold">Client Name</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Testimonials;
