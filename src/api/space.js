import { commonClient } from "./client";

export const searchSpaces = async (queryParams) => {
  const { data } = await commonClient.get("/api/v1/spaces", {
    params: queryParams,
  });

  return data;
};

export const getSpaceItem = async (id) => {
  const { data } = await commonClient.get(`/api/v1/spaces/${id}`);

  return data;
};

export const getSpaceReview = async ({ id, ...queryParams }) => {
  const { data } = await commonClient.get(`/api/v1/spaces/${id}/reviews`, {
    params: queryParams,
  });

  return data;
};
