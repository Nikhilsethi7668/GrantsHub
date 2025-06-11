import axios from "axios";
import { create } from "zustand";

const Axios = axios.create({
  baseURL:
    // "http://localhost:5000/api",
    // "http://localhost:4040/api",
  "https://grant-app-api.amiigo.in/api",
  withCredentials: true,
  timeout: 100000, // Add timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export default Axios;
