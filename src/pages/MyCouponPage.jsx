import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import MyCouponContainer from "../components/MyCouponContariner";

const MyCouponPage = () => {
  const { role, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role == "ADMIN") {
      alert("관리자는 쿠폰을 발급 받을 수 없습니다.");
      navigate("/");
    }
  }, [role, navigate]);

  if (!isLoggedIn || role == "ADMIN") {
    return null;
  }

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <MyCouponContainer />
    </div>
  );
};

export default MyCouponPage;
