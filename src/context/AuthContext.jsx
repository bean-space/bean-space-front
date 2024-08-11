import { useState, useEffect, createContext } from "react";
import { getUserInfo, loginUser, logoutUser, socialLogin } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isLoading: true,
    token: null,
    id: null,
    nickname: null,
    email: null,
    profileImageUrl: null,
    isPhoneNumberEmpty: null,
    role: null,
  });

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const userdata = await getUserInfo();
      if (userdata.success) {
        setAuthState({
          isLoggedIn: true,
          isLoading: false,
          token,
          id: userdata.id,
          nickname: userdata.nickname,
          email: userdata.email,
          profileImageUrl: userdata.profileImageUrl,
          isPhoneNumberEmpty: userdata.isPhoneNumberEmpty,
          role: userdata.role,
        });
      } else {
        localStorage.removeItem("token");
        setAuthState({
          isLoggedIn: false,
          isLoading: false,
          token: null,
          id: null,
          nickname: null,
          email: null,
          profileImageUrl: null,
          isPhoneNumberEmpty: null,
          role: null,
        });
      }
    } else {
      setAuthState((prevState) => ({ ...prevState, isLoading: false }));
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
      isLoading: false,
      token: null,
      id: null,
      nickname: null,
      email: null,
      profileImageUrl: null,
      isPhoneNumberEmpty: null,
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

  const updateAuthState = async (newToken) => {
    localStorage.setItem("token", newToken);
    await fetchUserInfo();
  };

  const updateSocialInfo = (email) => {
    setAuthState((prevState) => ({
      ...prevState,
      email,
      isPhoneNumberEmpty: false,
    }));
  };

  const updateProfileInfo = (updatedProfileData) => {
    setAuthState((prevState) => ({
      ...prevState,
      email: updatedProfileData.email,
      nickname: updatedProfileData.nickname,
      profileImageUrl: updatedProfileData.profileImageUrl,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        kakaoSocialLogin,
        updateAuthState,
        updateSocialInfo,
        updateProfileInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
