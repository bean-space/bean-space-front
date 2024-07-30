import { commonClient } from "./client";

export const getCouponListFromMember = async () => {
  const { data } = await commonClient.get("/api/v1/members/couponList");

  return data;
};

export const getCouponList = async () => {
  const { data } = await commonClient.get("/api/v1/coupons");

  return data;
};

export const issueCoupon = async (id) => {
  const { data } = await commonClient.post(`/api/v1/coupons/${id}`);

  return data;
};
