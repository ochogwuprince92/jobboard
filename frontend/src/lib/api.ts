import axiosClient from '../api/axiosClient';

// Common API utilities and base functions
export default {
  get: async <T>(url: string) => {
    const response = await axiosClient.get<T>(url);
    return response;
  },

  post: async <T>(url: string, data: any) => {
    const response = await axiosClient.post<T>(url, data);
    return response;
  },

  put: async <T>(url: string, data: any) => {
    const response = await axiosClient.put<T>(url, data);
    return response;
  },

  delete: async <T>(url: string) => {
    const response = await axiosClient.delete<T>(url);
    return response;
  },

  patch: async <T>(url: string, data: any) => {
    const response = await axiosClient.patch<T>(url, data);
    return response;
  }
};