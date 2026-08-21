import axios from "axios";

const userApi = axios.create({
    baseURL: ["localhost", "127.0.0.1"].includes(window.location.hostname) ? "http://localhost:8081/api/v1" : "/api/v1"
});

userApi.interceptors.request.use((config) => {

    const token =
        localStorage.getItem("token");

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

export default userApi;
