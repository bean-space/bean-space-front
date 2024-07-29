import { authClient } from "./client";

export const reserveSpace = async ({ reservationInfo, id }) => {
  const response = await authClient.post(
    `api/v1/spaces/${id}/reservations`,
    reservationInfo
  );

  return response;
};
