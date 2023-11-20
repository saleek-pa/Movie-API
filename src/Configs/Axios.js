import axios from "axios";

const instance = axios.create({
   baseURL: process.env.REACT_APP_BASE_URL,
   headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN_AUTH}`,
   },
});

export default instance;
