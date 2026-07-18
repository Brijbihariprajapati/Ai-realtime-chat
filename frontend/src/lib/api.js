import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token) => localStorage.setItem("token", token);

export const clearToken = () => localStorage.removeItem("token");

export const getApiBase = () => API_URL;

const getData = async (endpoint) => {
  try {
    const token = getToken();
    const res = await api.get(endpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("getData error:", error);
    throw error;
  }
};

const postData = async (endpoint, data = {}) => {
  try {
    const token = getToken();
    const res = await api.post(endpoint, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("postData error:", error);
    throw error;
  }
};

export const getMe = () => getData("/auth/me");
export const getMessages = () => getData("/chat/messages");
export const createPaymentOrder = () => postData("/payment/create-order");
export const verifyPayment = (payload) => postData("/payment/verify", payload);
export const suggestReply = () => postData("/ai/suggest-reply");
export const summarizeChat = () => postData("/ai/summarize");
