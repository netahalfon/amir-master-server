import axios from "axios";

export const REQUESTS = {
    LOGIN: "/user/login",
    SIGNUP: "/user/signUp",
    FORGOT_PASSWORD: "/user/forgotPassword",
    REFRESH_TOKEN: "/user/refresh-token",
}

const BASE_URL = "http://localhost:3001/api";

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});
