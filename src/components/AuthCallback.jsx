import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthCallback = () => {
  const { kakaoSocialLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      kakaoSocialLogin(code);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [kakaoSocialLogin, navigate]);

  return <div>로그인 시도 중...</div>;
};

export default AuthCallback;
