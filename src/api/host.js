import { commonClient } from "./client";

export const createSpace = async (space) => {
  const { data } = await commonClient.post("api/v1/host/spaces", space);

  return data;
};

export const updateSpace = async ({ space, id }) => {
  const { data } = await commonClient.put(`api/v1/host/spaces/${id}`, space);

  return data;
};

export const getHostSpaceList = async () => {
  const { data } = await commonClient.get("api/v1/host/spaces");

  return data;
};

export const deleteSpace = async (id) => {
  const { data } = await commonClient.delete(`api/v1/host/spaces/${id}`);

  return data;
};

export const updateRoleToHost = async () => {
  const { data } = await commonClient.patch("/api/v1/members/request-host");

  return data;
};
