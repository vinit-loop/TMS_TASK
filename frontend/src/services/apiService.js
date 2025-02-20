import axios from "axios";

const API_URL = "http://localhost:8000/api/category";

const userId = localStorage.getItem("user_id");

const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
};

// CATEGORY SERVICES

export const fetchCategories = () =>
  axios.get(`${API_URL}`, {
    ...getHeaders(),
  });

export const createCategory = (taskData) =>
  axios.post(`${API_URL}`, taskData, getHeaders());

export const updateCategory = (id, taskData) =>
  axios.put(`${API_URL}/${id}`, taskData, getHeaders());

export const deleteCategory = (id) =>
  axios.delete(`${API_URL}/${id}`, {
    headers: getHeaders().headers,
    params: { userId },
  });
