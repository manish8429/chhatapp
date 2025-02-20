import { API_ENDPOINTS } from "./api.js";
import { fetchData } from "./Helper";

export const signupUser = async (formData) => {
  return await fetchData(API_ENDPOINTS.SIGNUP, "POST", formData, true);
};

export const loginUser = async (credentials) => {
  return await fetchData(API_ENDPOINTS.LOGIN, "POST", credentials);
};
