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
};

export default ApiLink;
