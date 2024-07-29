import { authClient } from "./client";

export const getCouponListFromMember = async () => {
  const { data } = await authClient.get("/api/v1/members/couponList");

  return data;
};
