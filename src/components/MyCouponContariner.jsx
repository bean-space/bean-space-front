import { useState, useEffect } from "react";
import MyCouponList from "./MyCouponList";
import { getCouponListFromMember } from "../api/coupon";

const MyCouponContainer = () => {
  const [coupons, setCoupons] = useState([]);

  const fetchCouponList = async () => {
    const data = await getCouponListFromMember();

    setCoupons(data);
  };

  useEffect(() => {
    fetchCouponList();
  }, []);

  return <MyCouponList coupons={coupons} />;
};

export default MyCouponContainer;
