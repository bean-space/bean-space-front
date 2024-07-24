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
      alert("회원가입에 성공하였습니다. 메인페이지로 이동합니다");
      navigate("/");
    } else {
      alert("회원가입에 실패하였습니다.");
      navigate("/login");
    }
  }, [kakaoSocialLogin, navigate]);

  return <div>로그인 시도 중...</div>;
};

export default AuthCallback;
