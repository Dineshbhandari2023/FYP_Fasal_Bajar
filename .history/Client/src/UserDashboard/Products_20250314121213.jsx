function Products() {
  return (
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
  );
}
export default Products;
