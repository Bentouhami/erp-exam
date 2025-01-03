// path: src/services/apiCalls.ts

import axios from "axios";

const apiCalls = {
  getAllProducts: async () => {
    const response = await axios.get("http://localhost:3000/products");
    return response.data;
  },
  getProductById: async (id: number) => {
    const response = await axios.get(`http://localhost:3000/products/${id}`);
    return response.data;
  },
  createProduct: async (product: any) => {
    const response = await axios.post("http://localhost:3000/products", product);
    return response.data;
  },
  updateProduct: async (id: number, product: any) => {
    const response = await axios.put(`http://localhost:3000/products/${id}`, product);
    return response.data;
  },
  deleteProduct: async (id: number) => {
    const response = await axios.delete(`http://localhost:3000/products/${id}`);
    return response.data;
  },
};

export default apiCalls;