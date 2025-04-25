import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        } else if (error?.response?.status === 403) {
            navigate("/login", { state: { from: location }, replace: true });
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseIterceptor);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;