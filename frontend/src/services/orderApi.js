import axios from "axios";

const orderApi = axios.create({
    baseURL: "http://localhost:3003/api/v1"
});

orderApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default orderApi;