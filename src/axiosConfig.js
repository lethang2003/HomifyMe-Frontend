// src/axiosConfig.js
import axios from "axios";
const instance = axios.create({
  baseURL: "https://homifyme-backend-oreg.onrender.com/", //backend

  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
