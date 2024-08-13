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

export const addReview = async ({ review, id }) => {
  const { data } = await commonClient.post(
    `/api/v1/spaces/${id}/reviews`,
    review
  );

  return data;
};

export const deleteReview = async ({ spaceId, reviewId }) => {
  const { data } = await commonClient.delete(
    `/api/v1/spaces/${spaceId}/reviews/${reviewId}`
  );

  return data;
};

export const updateReview = async ({ review, spaceId, reviewId }) => {
  const { data } = await commonClient.put(
    `/api/v1/spaces/${spaceId}/reviews/${reviewId}`,
    review
  );

  return data;
};

export const getOfferList = async () => {
  const { data } = await commonClient.get("/api/v1/spaces/offer");

  return data;
};

export const getPopularKeywords = async () => {
  const { data } = await commonClient.get("/api/v1/spaces/popular-keywords");

  return data;
};

export const getPopularSpaces = async () => {
  const { data } = await commonClient.get("/api/v1/spaces/popular-spaces");

  return data;
};
