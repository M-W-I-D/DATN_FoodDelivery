import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { addToCart, removeQtyFromCart, getCartData } from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
    const url = "http://localhost:8080";
    const imageUrl = `${url}/images`;

    // --- STATES ---
    const [foodList, setFoodList] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem("token");
        return savedToken ? savedToken.replace(/"/g, '') : "";
    });
    const [role, setRole] = useState(localStorage.getItem("role") || "");
    const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

    // --- 1. TỰ ĐỘNG LẤY DANH MỤC TỪ DATABASE (MỚI) ---
    // Giúp ExploreMenu.jsx tự cập nhật khi bạn thêm món ăn mới ở Admin
    const dynamicCategories = useMemo(() => {
        if (foodList.length === 0) return [];
        const allCats = foodList.map(food => food.category);
        return [...new Set(allCats)]; // Loại bỏ các tên trùng lặp
    }, [foodList]);

    // --- 2. QUẢN LÝ DỮ LIỆU (FETCH DATA) ---
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/foods`);
            setFoodList(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách món ăn:", error);
        }
    };

    const loadCart = useCallback(async (tokenValue) => {
        if (!tokenValue) return;
        try {
            const data = await getCartData(tokenValue);
            setQuantities(data.items || {});
        } catch (error) {
            console.error("Lỗi khi tải giỏ hàng:", error);
        }
    }, []);

    // --- 3. QUẢN LÝ GIỎ HÀNG (SYNC DATABASE) ---
    const increaseQty = async (foodId) => {
        setQuantities(prev => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
        if (token) {
            try {
                await addToCart(foodId, token);
            } catch (e) {
                setQuantities(prev => ({ ...prev, [foodId]: Math.max(prev[foodId] - 1, 0) }));
            }
        }
    };

    const decreaseQty = async (foodId) => {
        if (!quantities[foodId]) return;
        const currentQty = quantities[foodId];

        setQuantities(prev => {
            const newQty = { ...prev };
            if (currentQty <= 1) delete newQty[foodId];
            else newQty[foodId] = currentQty - 1;
            return newQty;
        });

        if (token) {
            try {
                await removeQtyFromCart(foodId, token);
            } catch (e) {
                loadCart(token); // Sync lại nếu lỗi
            }
        }
    };

    const removeItemCompletely = async (foodId) => {
        setQuantities(prev => {
            const newQty = { ...prev };
            delete newQty[foodId];
            return newQty;
        });

        if (token) {
            try {
                await axios.post(`${url}/api/cart/delete-item`, 
                    { foodId }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Lỗi xóa món hàng:", error);
                loadCart(token);
            }
        }
    };

    // --- 4. BÌNH LUẬN & ĐẶT HÀNG ---
    const addComment = async (commentData) => {
        const response = await axios.post(`${url}/api/comments/add`, commentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    };

    const getCommentsByFood = async (foodId) => {
        const response = await axios.get(`${url}/api/comments/food/${foodId}`);
        return response.data;
    };

    const deleteComment = async (commentId) => {
        await axios.delete(`${url}/api/comments/delete/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    };

    const placeOrder = async (orderData) => {
        if (!token) return alert("Vui lòng đăng nhập!");
        const response = await axios.post(`${url}/api/orders/create`, orderData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.paymentUrl) window.location.replace(response.data.paymentUrl);
        return response.data;
    };

    // --- 5. EFFECTS ---
    useEffect(() => {
        const init = async () => {
            await fetchFoodList();
            if (token) await loadCart(token);
        };
        init();
    }, [token, loadCart]);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("userName", userName);
        } else {
            localStorage.clear();
        }
    }, [token, role, userName]);

    const contextValue = {
        url, imageUrl, foodList, dynamicCategories, quantities,
        token, setToken, role, setRole, userName, setUserName,
        increaseQty, decreaseQty, removeItemCompletely, placeOrder,
        addComment, getCommentsByFood, deleteComment
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};