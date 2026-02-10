import axios from "axios";

const API_BASE_URL = "https://qn83jg9dc5.execute-api.us-east-1.amazonaws.com/dev";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (typeof window !== "undefined") {
            if (status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            } else if (status === 403) {
                localStorage.removeItem("token");
                window.location.href = "/forbidden";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };
