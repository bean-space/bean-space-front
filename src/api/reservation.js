import { commonClient } from "./client";

export const reserveSpace = async ({ reservationInfo, id }) => {
  const response = await commonClient.post(
    `api/v1/spaces/${id}/reservations`,
    reservationInfo
  );

  return response;
};

export const getMemberReservationList = async () => {
  const { data } = await commonClient.get("api/v1/members/reservations");

  return data;
};

export const cancelReservation = async ({ spaceId, reservationId }) => {
  const response = await commonClient.delete(
    `api/v1/spaces/${spaceId}/reservations/${reservationId}`
  );

  return response;
};
