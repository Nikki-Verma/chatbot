import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosHeaders } from "axios";
import {
  A_ID,
  PIM_SID,
  X_CLIENT_ID,
  X_DEVICE_ID,
  X_SELLER_ID,
  X_SELLER_PROFILE_ID,
  X_TENANT_ID,
  X_USER_ID,
} from "../../constant";
import { useChatStore } from "@/store/chatStore";

// Create an Axios instance
const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  async (request: InternalAxiosRequestConfig) => {
    const {userSessionConfig} = useChatStore.getState();
    console.log("🚀 ~ userSessionConfig:", userSessionConfig);

    // Ensure request.headers is of type AxiosHeaders
    const headers = request.headers as InstanceType<typeof AxiosHeaders>;

    headers.set(X_USER_ID, headers.get(X_USER_ID) ?? userSessionConfig?.userId);
    headers.set(X_TENANT_ID, headers.get(X_TENANT_ID) ?? userSessionConfig?.TENANT_ID);
    headers.set(PIM_SID, headers.get(PIM_SID) ?? userSessionConfig?.PIM_SID);
    headers.set(A_ID, headers.get(A_ID) ?? userSessionConfig?.A_ID);
    headers.set(X_DEVICE_ID, "armaze-web");
    headers.set(X_CLIENT_ID, headers.get(X_CLIENT_ID) ?? userSessionConfig?.userId);
    headers.set(X_SELLER_ID, headers.get(X_SELLER_ID) ?? userSessionConfig?.userId);
    headers.set(X_SELLER_PROFILE_ID, headers.get(X_SELLER_PROFILE_ID) ?? userSessionConfig?.userId);

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (typeof response?.data?.ok === "boolean") {
      if (response.data?.ok) {
        return response;
      } else {
        return Promise.reject(response);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // This means that session token has expired and needs to generate a new access token using create session API
    if (error?.response?.status === 511) {
      // TODO: Implement logic to update state PIM_SID or refresh the session token
    }

    return Promise.reject(error);
  }
);

export const axiosInstanceWithoutWarehouse = axios.create();

export default axiosInstance;