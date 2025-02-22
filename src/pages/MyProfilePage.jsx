import { useEffect } from "react";
import MyProfileContainer from "../components/MyProfileContainer";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const MyProfilePage = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      alert("로그인만 사용자만 접근할 수 있는 페이지입니다");
      navigate("/");
    }
  }, [navigate, isLoggedIn, isLoading]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <MyProfileContainer />
    </div>
  );
};

export default MyProfilePage;
