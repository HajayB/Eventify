import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL; //http://localhost:4000/api

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: Array<(success: boolean) => void> = [];

function drainQueue(success: boolean) {
  refreshQueue.forEach((cb) => cb(success));
  refreshQueue = [];
}

//RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a refresh is already in progress, wait for it then retry
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((success) => {
            if (success) {
              resolve(axiosInstance(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        await axios.post(
          `${baseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        drainQueue(true);
        return axiosInstance(originalRequest);
      } catch (err) {
        drainQueue(false);
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;