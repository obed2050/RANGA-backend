import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const getProfile = () => API.get("/auth/profile");

// Products
export const getProducts = (params) => API.get("/products", { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Shops
export const getMyShop = () => API.get("/shops/mine");
export const createShop = (data) => API.post("/shops", data);
export const updateShop = (data) => API.put("/shops/mine", data);
export const deleteShop = (id) => API.delete(`/shops/${id}`);
export const getAllShops = () => API.get("/shops");

// Categories
export const getCategories = () => API.get("/categories");

// Orders
export const getMyOrders = () => API.get("/orders/my");
export const getSellerOrders = () => API.get("/orders/seller");
export const createOrder = (data) => API.post("/orders", data);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Notifications
export const getNotifications = () => API.get("/notifications");
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put("/notifications/read-all");

// Admin
export const adminGetUsers = () => API.get("/admin/users");
export const adminGetUser = (id) => API.get(`/admin/users/${id}`);
export const adminCreateUser = (data) => API.post("/admin/users", data);
export const adminUpdateUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const adminDeleteUser = (id) => API.delete(`/admin/users/${id}`);
export const adminGetShops = () => API.get("/admin/shops");
export const adminDeleteShop = (id) => API.delete(`/admin/shops/${id}`);
export const adminGetProducts = () => API.get("/admin/products");
export const adminDeleteProduct = (id) => API.delete(`/admin/products/${id}`);
