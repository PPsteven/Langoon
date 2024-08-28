"use client";

import axios from "axios";
import { log as debugLog } from "./log";

const host = "https://lang.majutsushi.world";
// const host = "http://pp:5266";

// Import axios module for HTTP requests and log function from the current directory index file.
const instance = axios.create({
  baseURL: host + "/api",
  // baseURL: "/api",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  withCredentials: false,
});

// Add request interceptors to the Axios instance.
instance.interceptors.request.use(
  (config) => {
    // This function is called before the request is sent. You can perform actions here.
    return config; // Return the modified config to proceed with the request.
  },
  (error) => {
    // do something before request is send
    console.log("Error:" + error.message); // for debug
    return Promise.reject(error);
  }
);

// Add request interceptors to the Axios instance.
instance.interceptors.response.use(
  (response) => {
    const resp = response.data;
    debugLog(resp);
    return resp;
  },
  (error) => {
    console.log("Error:" + error.message); // for debug
    return {
      code: error.response ? error.response.status : 500,
      message: error.message,
    };
  }
);

instance.defaults.headers.common["Authorization"] =
  localStorage.getItem("token") || "";

export { instance as r };
