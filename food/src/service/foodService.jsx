import axios from "axios";

const API_URL = "http://localhost:8080/api/foods";



export const fetchFoodList = async () => {
    try {
      const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách món: ', error);
        throw error;
    }
};


export const fetchFoodDetails = async (id) => {
    // SỬA: Chặn cả giá trị JavaScript undefined/null và chuỗi ký tự "undefined" từ URL
    if (!id || String(id).toLowerCase() === 'undefined') {
        throw new Error("Food ID is missing or invalid.");
    }
    
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data; 
    } catch (error) {
        console.error("Error fetching food details:", error);
        throw error; 
    }
};