import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { assets } from '../../assets/assets'; 
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = () => {
    // URL Backend và Token lấy trực tiếp từ localStorage
    const url = "http://localhost:8080"; 
    const token = localStorage.getItem("token"); 

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Hàm lấy toàn bộ đơn hàng của tất cả người dùng
    const fetchAllOrders = async () => {
        if (!token) {
            toast.error("Vui lòng đăng nhập với quyền Quản trị viên!");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/orders/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu Admin:", error);
            if (error.response?.status === 403) {
                toast.error("Lỗi 403: Bạn không có quyền Quản trị hoặc phiên đăng nhập hết hạn");
            }
        } finally {
            setLoading(false);
        }
    };

    // 2. Hàm cập nhật trạng thái (Dành riêng cho Admin)
    const statusHandler = async (event, orderId) => {
        const newStatus = event.target.value;
        const token = localStorage.getItem("token");

        if (!orderId || orderId === "undefined") {
            toast.error("Không tìm thấy mã định danh đơn hàng!");
            return;
        }

        try {
            // Sử dụng PATCH để cập nhật trạng thái đơn hàng
            const response = await axios.patch(
                `${url}/api/orders/status/${orderId}?status=${newStatus}`,
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                toast.success("Cập nhật trạng thái đơn hàng thành công!");
                await fetchAllOrders(); 
            }
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            const msg = error.response?.status === 403 
                ? "Lỗi 403: Bạn không có quyền Quản trị hoặc Token không hợp lệ" 
                : "Không thể cập nhật trạng thái đơn hàng";
            toast.error(msg);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAllOrders();
        }
    }, [token]);

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN') + ' VNĐ';
    };

    return (
        <div className='admin-orders container my-5'>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className='fw-bold text-dark'>📦 Quản lý Đơn hàng</h2>
                <button onClick={fetchAllOrders} className='btn btn-outline-dark btn-sm shadow-sm'>
                    <i className="bi bi-arrow-clockwise"></i> Làm mới danh sách
                </button>
            </div>

            <div className='container'>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-2" role="status"></div>
                        <p>Đang tải dữ liệu hệ thống...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-5 card shadow-sm border-0">
                        <p className='text-muted mb-0'>Hệ thống hiện chưa có đơn hàng nào để hiển thị.</p>
                    </div>
                ) : (
                    <div className="order-list">
                        {data.map((order, index) => (
                            <div key={order._id || index} className='order-item row align-items-center p-3 mb-4 shadow-sm border rounded bg-white'>
                                
                                {/* Biểu tượng kiện hàng */}
                                <div className="col-md-1 text-center mb-3 mb-md-0">
                                    <img src={assets.parcel} alt="Kiện hàng" width={50} />
                                </div>

                                {/* Thông tin các món ăn đã đặt */}
                                <div className="col-md-3">
                                    <p className='order-item-food fw-bold mb-1 text-primary'>
                                        {order.orderedItems.map((item, i) => (
                                            <span key={i}>
                                                {item.name} x {item.quantity}
                                                {i !== order.orderedItems.length - 1 ? ", " : ""}
                                            </span>
                                        ))}
                                    </p>
                                    <small className="text-muted fst-italic">Mã đơn: #{order._id?.substring(0, 8)}</small>
                                </div>

                                {/* Thông tin khách hàng */}
                                <div className="col-md-3">
                                    <div className='user-info-admin small'>
                                        <p className="mb-0 text-dark"><strong>Khách hàng:</strong> {order.email}</p>
                                        <p className="mb-0 text-muted"><strong>Địa chỉ:</strong> {order.userAddress}</p>
                                        <p className="mb-0 text-muted"><strong>SĐT:</strong> {order.phoneNumber}</p>
                                    </div>
                                </div>

                                {/* Tổng tiền & Trạng thái thanh toán */}
                                <div className="col-md-2 text-center">
                                    <p className="text-danger fw-bold mb-1 fs-5">{formatCurrency(order.amount)}</p>
                                    <span className={`badge ${order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`} style={{fontSize: '10px'}}>
                                        {order.paymentStatus === 'PAID' ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}
                                    </span>
                                </div>

                                {/* Cập nhật trạng thái đơn hàng */}
                                <div className="col-md-3">
                                    <label className='small text-muted d-block mb-1 fw-bold'>Trạng thái xử lý:</label>
                                    <select 
                                        className="form-select form-select-sm border-primary fw-bold" 
                                        onChange={(e) => statusHandler(e, order.id || order._id || order.orderId)}
                                        value={order.orderStatus}
                                    >
                                        <option value="CREATED">Đơn hàng mới</option>
                                        <option value="CONFIRMED">Đã xác nhận</option>
                                        <option value="SHIPPED">Đang giao hàng</option>
                                        <option value="DELIVERED">Đã giao hàng</option>
                                        <option value="CANCELLED">Đã hủy đơn</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;