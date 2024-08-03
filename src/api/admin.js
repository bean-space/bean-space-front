import { commonClient } from "./client";

export const getRequestAddSpace = async (queryParams) => {
  const { data } = await commonClient.get("/api/v1/admin/spaces", {
    params: queryParams,
  });

  return data;
};

export const updateSpaceStatus = async ({ id, status }) => {
  const { data } = await commonClient.patch(
    `/api/v1/admin/spaces/${id}`,
    status
  );

  return data;
};

export const getCouponList = async () => {
  const { data } = await commonClient.get("/api/v1/admin/coupons");

  return data;
};

export const createCoupon = async (coupon) => {
  const { data } = await commonClient.post("/api/v1/admin/coupons", coupon);

  return data;
};

export const deleteCoupon = async (id) => {
  const { data } = await commonClient.delete(`/api/v1/admin/coupons/${id}`);

  return data;
};

export const updateCoupon = async ({ coupon, id }) => {
  const { data } = await commonClient.put(
    `/api/v1/admin/coupons/${id}`,
    coupon
  );

  return data;
};
