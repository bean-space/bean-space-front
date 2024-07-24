import { authClient } from "./client";

export const loginUser = async (login) => {
  try {
    const { data } = await authClient.post("/api/v1/auth/login", login);
    const { accessToken } = data;
    localStorage.setItem("token", accessToken);
    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getUserInfo = async () => {
  try {
    const { data } = await authClient.get("/api/v1/members/profile");
    const { nickname, profileImageUrl, role } = data;
    return { success: true, nickname, profileImageUrl, role };
  } catch (error) {
    console.error("Get Info failed:", error);
    return { success: false };
  }
};


export const socialLogin = async (code) => {
  try {
    const { data } = await authClient.get(
      `/oauth2/login/callback?code=${code}`
    );
    const { accessToken } = data;
    localStorage.setItem("token", accessToken);
    return { success: true };
  } catch (error) {
    console.error("Get Info failed:", error);
    return { success: false };
  }
};
