import { useState, useEffect, createContext } from "react";
import { getUserInfo, loginUser, logoutUser, socialLogin } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    token: null,
    nickname: null,
    email: null,
    profileImageUrl: null,
    role: null,
  });

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const userdata = await getUserInfo();
      if (userdata.success) {
        setAuthState({
          isLoggedIn: true,
          token,
          nickname: userdata.nickname,
          email: userdata.email,
          profileImageUrl: userdata.profileImageUrl,
          role: userdata.role,
        });
      } else {
        localStorage.removeItem("token");
        setAuthState({
          isLoggedIn: false,
          token: null,
          nickname: null,
          email: null,
          profileImageUrl: null,
          role: null,
        });
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const login = async (loginData) => {
    const result = await loginUser(loginData);
    if (result.success) {
      await fetchUserInfo();
    }
    return result.success;
  };

  const logout = () => {
    logoutUser();
    setAuthState({
      isLoggedIn: false,
      token: null,
      nickname: null,
      email: null,
      profileImageUrl: null,
      role: null,
    });
  };

  const kakaoSocialLogin = async (code) => {
    const result = await socialLogin(code);
    if (result.success) {
      await fetchUserInfo();
    }
    return result.success;
  };

  return (
    <AuthContext.Provider
      value={{ ...authState, login, logout, kakaoSocialLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
