import axios from "axios";

const productApi = axios.create({
    baseURL: "http://localhost:3002/api/v1"
});

productApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default productApi;