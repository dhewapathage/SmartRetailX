import { jwtDecode } from "jwt-decode";


export const getCurrentUser = () => {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {

        return jwtDecode(token);

    } catch (error) {

        return null;
    }
};


export const isAdmin = () => {

    const user =
        getCurrentUser();

    return user?.role === "ADMIN";
};


export const logout = () => {

    localStorage.removeItem("token");
};