// import axios from "axios";

// export const makeRequest = axios.create({
//     baseURL: "",
//     withCredentials: true,
    
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//     },
//   });

  import axios from "axios";
// const baseURL = "http://localhost:3002/";
 const  baseURL  = "https://seyda-estate.onrender.com/api/"

export const privateAxios = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});


export const publicAxios = axios.create({
  baseURL: baseURL,
});