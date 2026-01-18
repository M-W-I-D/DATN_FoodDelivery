import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

/**
 * Thêm món vào giỏ hàng
 */
export const addToCart = async (foodId, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/add`,
            { foodId },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

/**
 * Giảm số lượng / xóa món khỏi giỏ hàng
 */
export const removeQtyFromCart = async (foodId, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/remove`,
            { foodId },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
    }
};

/**
 * Lấy dữ liệu giỏ hàng
 */
export const getCartData = async (token) => {
    try {
        const response = await axios.post(
            `${API_URL}/get`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data; // { items: { foodId: qty } }
    } catch (error) {
        console.error("Error fetching cart data:", error);
        throw error;
    }
};
