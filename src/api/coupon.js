import { commonClient } from "./client";

export const getCouponListFromMember = async () => {
  const { data } = await commonClient.get("/api/v1/members/couponList");

  return data;
};
