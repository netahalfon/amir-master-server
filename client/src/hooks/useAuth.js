import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider.jsx";

export const ROLES = {
    User: "User",
    Admin: "Admin",
};

const useAuth = () => {
    const { auth } = useContext(AuthContext);
    useDebugValue(auth, auth => auth?.accessToken ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

export default useAuth;