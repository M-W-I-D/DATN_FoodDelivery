import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { url, token, setQuantities } = useContext(StoreContext);

    const orderCode = searchParams.get("orderCode");
    const status = searchParams.get("status");

    useEffect(() => {
        const verifyPayment = async () => {
            // Chỉ xác thực khi status từ PayOS trả về là PAID
            if (status === "PAID" && orderCode) {
                try {
                    await axios.post(`${url}/api/orders/verify`, {
                        orderCode: orderCode,
                        transactionId: searchParams.get("id") || "N/A",
                        signature: "verified" 
                    });
                    
                    // Reset giỏ hàng về trống
                    setQuantities({}); 
                } catch (error) {
                    console.error("Lỗi cập nhật đơn hàng:", error);
                }
            }
        };

        if (token) {
            verifyPayment();
        }
    }, [token, orderCode, status]);

    return (
        <div className="order-success-container">
            <div className="success-card">
                {status === "PAID" ? (
                    <>
                        <div className="icon-box">✅</div>
                        <h2>Thanh toán thành công!</h2>
                        <p>Đơn hàng <b>#{orderCode}</b> của bạn đang được xử lý.</p>
                    </>
                ) : (
                    <>
                        <div className="icon-box error">❌</div>
                        <h2>Thanh toán thất bại</h2>
                        <p>Giao dịch bị hủy hoặc có lỗi xảy ra.</p>
                    </>
                )}
                <button className="btn-home" onClick={() => navigate('/')}>Quay lại trang chủ</button>
            </div>
        </div>
    );
};

export default OrderSuccess;