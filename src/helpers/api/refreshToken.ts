import mem from "mem";

import { axiosPublic } from "./axiosPublic";
import { settings } from "@/helpers/settings/config";
import { storageService } from "../storage";

const refreshTokenFn = async () => {
    const session = storageService.get('session');
    try {
        const response = await axiosPublic.post(`${settings.AUTH_SERVICE}/generateAccessToken`, {
            // refreshToken: session?.refreshToken,
        }, {
            headers: {
                Authorization: session?.accessToken,
            }
        });
        const { session: newSession } = response.data;

        if (!newSession?.accessToken) {
            storageService.delete('session')
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