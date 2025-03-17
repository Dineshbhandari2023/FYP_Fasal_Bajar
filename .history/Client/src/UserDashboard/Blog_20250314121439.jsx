function Blog() {
  return (
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
  );
}
export default Blog;
