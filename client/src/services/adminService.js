import api from './api';

export const getUsers = (params) => api.get('/users', { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUserStatus = (id, status) => api.patch(`/users/${id}/status`, { status });
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getAdminStats = () => api.get('/admin/stats');