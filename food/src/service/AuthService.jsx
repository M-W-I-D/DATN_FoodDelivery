import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const registerUser = async (Data) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, Data);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 

export const login = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};