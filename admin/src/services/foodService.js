import axios from "axios";

const API_URL = "http://localhost:8080/api/foods";

// --- Lấy Token từ LocalStorage ---
const getAuthHeaders = (isMultipart = false) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Authorization": `Bearer ${token}`
    };
    if (isMultipart) {
        headers["Content-Type"] = "multipart/form-data";
    }
    return { headers };
};

// 1. THÊM MÓN ĂN
export const addFood = async (foodData, imageFile) => { 
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('food', JSON.stringify(foodData)); 

    try {
        const response = await axios.post(API_URL, formData, getAuthHeaders(true));
        return response.data; 
    } catch (error) {
        console.error("Lỗi khi thêm món ăn:", error);
        throw error;
    }
};

// 2. LẤY DANH SÁCH MÓN ĂN
export const getFoodList = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data || []; 
    } catch (error) {
        console.error('Lỗi khi lấy danh sách món:', error);
        throw error;
    }
};

// 3. XÓA MÓN ĂN
export const deleteFood = async (foodId) => {
    try {
        const response = await axios.delete(`${API_URL}/${foodId}`, getAuthHeaders());
        return response.status === 204 || response.status === 200; 
    } catch (error) {
        console.error('Lỗi khi xóa món ăn:', error);
        throw error;
    }
};

// 4. CẬP NHẬT MÓN ĂN (MỚI THÊM)
export const updateFood = async (foodId, foodData, imageFile = null) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    
    if (imageFile) {
        formData.append('file', imageFile);
    }
    // Gửi object food dưới dạng chuỗi JSON
    formData.append('food', JSON.stringify(foodData));

    try {
        const response = await axios.put(`${API_URL}/${foodId}`, formData, {
            headers: {
                "Authorization": `Bearer ${token}`
                // KHÔNG set "Content-Type" ở đây, để Axios và trình duyệt tự xử lý
            }
        });
        return response.status === 200 || response.status === 204;
    } catch (error) {
        console.error("Lỗi khi cập nhật món ăn:", error.response?.data || error.message);
        throw error;
    }
};