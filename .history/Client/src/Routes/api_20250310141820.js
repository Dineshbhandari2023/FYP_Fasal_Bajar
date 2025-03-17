const backEndDomain = "http://localhost:8000";

const ApiLink = {
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
  refreshToken: {
    url: `${backEndDomain}/refresh-token`,
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

  getAllProducts: {
    url: `${backEndDomain}/products`, // Or /api/products if that's your server route
    method: "get",
  },
  createProduct: {
    url: `${backEndDomain}/products`,
    method: "post",
  },
  updateProduct: {
    url: (id) => `${backEndDomain}/products/${id}`,
    method: "put",
  },
  deleteProduct: {
    url: (id) => `${backEndDomain}/products/${id}`,
    method: "delete",
  },
};

export default ApiLink;
