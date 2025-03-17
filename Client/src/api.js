const backEndDomain = "http://localhost:8000";

const ApiLink = {
  // User-related endpoints (note the /users prefix)
  register: {
    url: `${backEndDomain}/users/register`,
    method: "post",
  },
  login: {
    url: `${backEndDomain}/users/login`,
    method: "post",
  },
  forgotPassword: {
    url: `${backEndDomain}/users/forgot-password`,
    method: "post",
  },
  verifyResetCode: {
    url: `${backEndDomain}/users/verify-reset-code`,
    method: "post",
  },
  resetPassword: {
    url: `${backEndDomain}/users/reset-password`,
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
    url: `${backEndDomain}/users/logout`,
    method: "post",
  },

  // Product-related endpoints (assumed to be mounted without prefix changes)
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
