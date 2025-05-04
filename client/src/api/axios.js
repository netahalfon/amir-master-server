import axios from "axios";

export const REQUESTS = {
    LOGIN: "/user/login",
    SIGNUP: "/user/signUp",
    FORGOT_PASSWORD: "/user/forgotPassword",
    REFRESH_TOKEN: "/user/refresh-token",
    GET_WORDS: "/wordBank",
    GET_USER_MASTERIES: "/wordMastery",
    UPSERT_MASTERY: "/wordMastery/upsert-mastery",

}

const BASE_URL = "http://localhost:3001/api";

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" }
});
