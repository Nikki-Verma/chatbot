import axios from "axios";
import { X_DEVICE_ID, X_PRODUCT_NAME } from "../../constant";

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  (request) => {
    request.headers[X_DEVICE_ID] = "armaze-web";
    request.headers[X_PRODUCT_NAME] = "ATLAS";
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
