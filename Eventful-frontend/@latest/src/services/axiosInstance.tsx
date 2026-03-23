import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL; //http://localhost:4000/api

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

//RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // call refresh endpoint
        await axios.post(
          `${baseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // retry original request
        return axiosInstance(originalRequest);
      } catch (err) {
        // if refresh fails → logout
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;