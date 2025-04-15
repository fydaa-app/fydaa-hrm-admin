import mem from "mem";
import { axiosPublic } from "./axiosPublic";
import { settings } from "@/helpers/settings/config";
import { storageService } from "../storage";

// Define the structure of the session object
interface Session {
  token: string;
  refreshToken: string;
}

const refreshTokenFn = async () => {
  const session = storageService.get<Session>('session'); // Use the Session interface
  try {
    const response = await axiosPublic.post(
      `${settings.AUTH_SERVICE}/generateAccessToken`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session?.token}`, // Add "Bearer" prefix for consistency
        },
      }
    );
    const { session: newSession } = response.data;

    if (!newSession?.accessToken) {
      storageService.delete('session');
    }
    storageService.set("session", JSON.stringify(newSession));

    return newSession;
  } catch (error) {
    console.error(error);
    localStorage.removeItem("session");
  }
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
  maxAge,
});