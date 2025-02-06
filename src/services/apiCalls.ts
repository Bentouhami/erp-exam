// path: src/services/apiCalls.ts

import axios from "axios";
import {API_DOMAIN} from "@/lib/utils/constants";
import {CreateAdminDTO, LoginDTO} from "@/services/dtos/UserDtos";

const apiCalls = {


    //region api calls for products
    getAllProducts: async () => {
        const response = await axios.get(`${API_DOMAIN}/products`);
        return response.data;
    },
    getProductById: async (id: number) => {
        const response = await axios.get(`${API_DOMAIN}/products/${id}`);
        return response.data;
    },
    createProduct: async (product: any) => {
        const response = await axios.post(`${API_DOMAIN}/products`, product);
        return response.data;
    },

    updateProduct: async (id: number, product: any) => {
        const response = await axios.put(`${API_DOMAIN}/products/${id}`, product);
        return response.data;
    },
    deleteProduct: async (id: number) => {
        const response = await axios.delete(`${API_DOMAIN}/products/${id}`);
        return response.data;
    },
    //endregion


    //region API calls for Users 

    createAdmin: async (user: CreateAdminDTO) => {
        const response = await axios.post(`${API_DOMAIN}/users/register`, user);
        return response.data;
    },

    getAllUsers: async () => {
        const response = await axios.get(`${API_DOMAIN}/users`);
        return response.data;
    },
    getUserById: async (id: number) => {
        const response = await axios.get(`${API_DOMAIN}/users/${id}`);
        return response.data;
    },

    getUserByEmail: async (loginData: LoginDTO) => {
        console.log("login data in getUserByEmail function is: ", loginData)

        const response = await axios.post(`${API_DOMAIN}/users/login`, loginData);

        return response.data;
    },


    createUser: async (user: any) => {
        const response = await axios.post(`${API_DOMAIN}/users`, user);
        return response.data;
    },


    updateUser: async (id: number, user: any) => {
        const response = await axios.put(`${API_DOMAIN}/users/${id}`, user);
        return response.data;
    },
    deleteUser: async (id: number) => {
        const response = await axios.delete(`${API_DOMAIN}/users/${id}`);
        return response.data;
    },
    //endregion


    //region API calls for Addresses
    getAllAddresses: async () => {
        const response = await axios.get(`${API_DOMAIN}/addresses`);
        return response.data;
    },
    getAddressById: async (id: number) => {
        const response = await axios.get(`${API_DOMAIN}/addresses/${id}`);
        return response.data;
    },
    createAddress: async (address: any) => {
        const response = await axios.post(`${API_DOMAIN}/addresses`, address);
        return response.data;
    },
    updateAddress: async (id: number, address: any) => {
        const response = await axios.put(`${API_DOMAIN}/addresses/${id}`, address);
        return response.data;
    },
    deleteAddress: async (id: number) => {
        const response = await axios.delete(`${API_DOMAIN}/addresses/${id}`);
        return response.data;
    },
    //endregion


    //region API calls for Invoices
    getAllInvoices: async () => {
        const response = await axios.get(`${API_DOMAIN}/invoices`);
        return response.data;
    },
    getInvoiceById: async (id: number) => {
        const response = await axios.get(`${API_DOMAIN}/invoices/${id}`);
        return response.data;
    },
    createInvoice: async (invoice: any) => {
        const response = await axios.post(`${API_DOMAIN}/invoices`, invoice);
        return response.data;
    },
    updateInvoice: async (id: number, invoice: any) => {
        const response = await axios.put(`${API_DOMAIN}/invoices/${id}`, invoice);
        return response.data;
    },
    deleteInvoice: async (id: number) => {
        const response = await axios.delete(`${API_DOMAIN}/invoices/${id}`);
        return response.data;
    },
    //endregion

};

export default apiCalls;