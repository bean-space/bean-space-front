import { useState, useEffect, createContext } from "react";
import { getUserInfo, loginUser, logoutUser } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    token: null,
    nickname: null,
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
          profileImageUrl: userdata.profileImageUrl,
          role: userdata.role,
        });
      } else {
        localStorage.removeItem("token");
        setAuthState({
          isLoggedIn: false,
          token: null,
          nickname: null,
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
      profileImageUrl: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
