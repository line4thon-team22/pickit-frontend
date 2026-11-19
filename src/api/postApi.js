import client from "./client";

export const getPosts = (params = {}) => {
  return client.get("/api/posts", { params });
};
