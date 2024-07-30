import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import MyWishListContainer from "../components/MyWishListContainer";

const MyWishListPage = () => {
  const { role, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role == "ADMIN") {
      alert("관리자는 공간 찜하기를 할 수 없습니다.");
      navigate("/");
    }
  }, [role, navigate]);

  if (!isLoggedIn || role == "ADMIN") {
    return null;
  }

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <MyWishListContainer />
    </div>
  );
};

export default MyWishListPage;
