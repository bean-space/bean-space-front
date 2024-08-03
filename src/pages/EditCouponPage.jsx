import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import EditCouponContainer from "../components/EditCouponContainer";

const EditCouponPage = () => {
  const { role, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isCouponLoaded, setIsCouponLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [coupon, setCoupon] = useState(location.state?.coupon);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (location.state?.coupon) {
      setCoupon(location.state.coupon);
      setIsCouponLoaded(true);
    } else {
      alert("존재하지 않는 페이지입니다");
      navigate("/admin/coupon");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || role !== "ADMIN")) {
      alert("관리자만 접근할 수 있는 페이지입니다.");
      navigate("/");
    }
  }, [isLoading, isLoggedIn, role, navigate]);

  if (!isLoggedIn || role !== "ADMIN" || isLoading || !isCouponLoaded) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <EditCouponContainer coupon={coupon} setCoupon={setCoupon} />
    </div>
  );
};

export default EditCouponPage;
