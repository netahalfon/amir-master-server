import axios, { REQUESTS } from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.post(REQUESTS.REFRESH_TOKEN,{
        refreshToken: auth.refreshToken
    });
    console.log("token refreshed :)");
    // override the previous accessToken with the new one
    setAuth((prev) => ({ ...prev, accessToken: response.data.accessToken }));

    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;