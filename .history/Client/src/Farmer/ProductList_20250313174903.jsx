import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyProducts,
  deleteProduct,
  updateProduct,
} from "../Redux/slice/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  // Fetch products for the logged-in user on component mount
  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  // Handle delete
  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  // Handle update (placeholder)
  const handleUpdate = (product) => {
    // For a real update, show a modal or navigate to a separate update page
    // Example: dispatch(updateProduct({ productId: product._id, formData }))
    console.log("Update clicked for:", product._id);
  };

  return (
    <div className="p-4 md:ml-64">
      <h2 className="text-2xl font-bold mb-4">My Products</h2>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && products?.length === 0 && <p>No products found.</p>}

      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Quantity (kg)</th>
            <th className="px-4 py-2 border">Price (per kg)</th>
            <th className="px-4 py-2 border">Location</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product._id} className="text-center">
              {/* Display product image */}
              <td className="px-4 py-2 border">
                {product.image ? (
                  <img
                    src={product.image} // or product.imageUrl
                    alt={product.productName}
                    className="w-16 h-16 object-cover mx-auto"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="px-4 py-2 border">{product.productName}</td>
              <td className="px-4 py-2 border">{product.productType}</td>
              <td className="px-4 py-2 border">{product.quantity}</td>
              <td className="px-4 py-2 border">{product.price}</td>
              <td className="px-4 py-2 border">{product.location}</td>
              <td className="px-4 py-2 border">
                {/* Update Button */}
                <button
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded hover:bg-blue-600"
                  onClick={() => handleUpdate(product)}
                >
                  Update
                </button>
                {/* Delete Button */}
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
