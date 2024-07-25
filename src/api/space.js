import { authClient } from "./client";

export const searchSpaces = async (queryParams) => {
  const { data } = await authClient.get("/api/v1/spaces", {
    params: queryParams,
  });

  return data;
};

export const getSpaceItem = async (id) => {
  const { data } = await authClient.get(`/api/v1/spaces/${id}`);

  return data;
};
