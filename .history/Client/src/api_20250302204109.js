const url = "http://localhost:3000";

const Api = {
  signup: {
    url: `${url}/api/signup`,
    method: "post",
  },
  login: {
    url: `${url}/api/login`,
    method: "post",
  },
  logout: {
    url: `${url}/api/logout`,
    method: "post",
  },
};

export default Api;
