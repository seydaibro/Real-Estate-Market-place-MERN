import axios from "axios";

export const makeRequest = axios.create({
    baseURL: "https://seyda-estate.onrender.com/api/",
    withCredentials: true,
    
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  });