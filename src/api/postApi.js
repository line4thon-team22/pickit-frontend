import client from "./client";

export const getPosts = (params = {}) => {
  return client.get("/api/posts", { params });
};

export const getRecommendedPosts = (size = 5) => {
  return client.get("/api/posts/recommended", {
    params: { size },
  });
};
