const backEndDomain = "http://localhost:8000";

const ApiLink = {
  // User-related endpoints
  register: {
    url: `${backEndDomain}/register`,
    method: "post",
  },
  login: {
    url: `${backEndDomain}/login`,
    method: "post",
  },
  forgotPassword: {
    url: `${backEndDomain}/forgot-password`,
    method: "post",
  },
  verifyResetCode: {
    url: `${backEndDomain}/verify-reset-code`,
    method: "post",
  },
  resetPassword: {
    url: `${backEndDomain}/reset-password`,
    method: "post",
  },
  getAllUsers: {
    url: `${backEndDomain}/users`,
    method: "get",
  },
  getUserById: {
    url: (id) => `${backEndDomain}/users/${id}`,
    method: "get",
  },
  logout: {
    url: `${backEndDomain}/logout`,
    method: "post",
  },

  // Product-related endpoints
  getAllProducts: {
    url: `${backEndDomain}/product`,
    method: "get",
  },
  getProductById: {
    url: (id) => `${backEndDomain}/product/${id}`,
    method: "get",
  },
  createProduct: {
    url: `${backEndDomain}/product`,
    method: "post",
  },
  updateProduct: {
    url: (id) => `${backEndDomain}/product/${id}`,
    method: "put",
  },
  deleteProduct: {
    url: (id) => `${backEndDomain}/product/${id}`,
    method: "delete",
  },
};

export default ApiLink;
