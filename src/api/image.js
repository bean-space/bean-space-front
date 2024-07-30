import { commonClient } from "./client";

export const getPresignedUrl = async (request) => {
  const { data } = await commonClient.post(
    "api/v1/images/presigned-url",
    request
  );

  return data.preSignedUrl;
};
