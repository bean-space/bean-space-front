import { authClient } from "./client";

export const getPresignedUrl = async (request) => {
  const { data } = await authClient.post(
    "api/v1/images/presigned-url",
    request
  );

  return data.preSignedUrl;
};
