import { commonClient } from "./client";

export const reserveSpace = async ({ reservationInfo, id }) => {
  const response = await commonClient.post(
    `api/v1/spaces/${id}/reservations`,
    reservationInfo
  );

  return response;
};
