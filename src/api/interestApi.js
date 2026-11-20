import client from "./client";

export const getCategories = () => {
  return client.get("/api/categories");
};

export const getMyInterests = () => {
  return client.get("/api/me/interests");
};

export const updateMyInterests = (categoryIds) => {
  return client.put("/api/me/interests", { categoryIds });
};
