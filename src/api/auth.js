import { commonClient } from "./client";

export const loginUser = async (login) => {
  try {
    const { data } = await commonClient.post("/api/v1/auth/login", login);
    const { accessToken } = data;
    localStorage.setItem("token", accessToken);
    return { success: true };
  } catch (error) {
    if (error.response.data.msg) {
      alert(error.response.data.msg);
    } else {
      alert("로그인에 실패하였습니다!");
    }
    return { success: false };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getUserInfo = async () => {
  try {
    const { data } = await commonClient.get("/api/v1/members/profile");
    const { id, nickname, email, profileImageUrl, role } = data;
    return { success: true, id, nickname, email, profileImageUrl, role };
  } catch (error) {
    return { success: false };
  }
};

export const socialLogin = async (code) => {
  try {
    const { data } = await commonClient.get(
      `/oauth2/login/callback?code=${code}`
    );
    const { accessToken } = data;
    localStorage.setItem("token", accessToken);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const signupUser = async (member) => {
  const response = await commonClient.post("api/v1/auth/sign-up", member);

  return response;
};
