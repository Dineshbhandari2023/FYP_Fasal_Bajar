const url = "http://localhost:3000";

const ApiUrl = {
  signup: {
    url: `${url}/register`,
    method: "post",
  },
  login: {
    url: `${url}/login`,
    method: "post",
  },
  logout: {
    url: `${url}/logout`,
    method: "post",
  },
};

export default ApiUrl;
