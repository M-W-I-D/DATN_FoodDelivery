import React, { useEffect, useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets'; // Đảm bảo bạn có file assets
import './MyOrders.css'; // Chúng ta sẽ thêm một chút CSS bên dưới

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(url + "/api/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            console.error("Lỗi khi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN') + ' VNĐ';
    };

    return (
        <div className='my-orders container my-5'>
            <h2 className='mb-4'>Đơn hàng của tôi</h2>
            <div className='container'>
                {loading ? (
                    <div className="text-center py-5">Đang tải danh sách đơn hàng...</div>
                ) : data.length === 0 ? (
                    <div className="text-center py-5 card shadow-sm">
                        <p className='mb-0'>Bạn chưa có đơn hàng nào.</p>
                    </div>
                ) : (
                    <div className="my-orders-list">
                        {data.map((order, index) => {
                            return (
                                <div key={index} className='my-orders-order row align-items-center p-3 mb-3 shadow-sm border rounded bg-white'>
                                    {/* Icon gói hàng */}
                                    <div className="col-md-1 text-center">
                                        <img src={assets.parcel_icon || "https://cdn-icons-png.flaticon.com/512/679/679821.png"} alt="Order Icon" width={50} />
                                    </div>

                                    {/* Danh sách món ăn */}
                                    <div className="col-md-4">
                                        <p className='mb-1 fw-bold'>
                                            {order.orderedItems.map((item, i) => {
                                                if (i === order.orderedItems.length - 1) {
                                                    return item.name + " x " + item.quantity;
                                                } else {
                                                    return item.name + " x " + item.quantity + ", ";
                                                }
                                            })}
                                        </p>
                                    </div>

                                    {/* Tổng tiền */}
                                    <div className="col-md-2 text-center text-danger fw-bold">
                                        {formatCurrency(order.amount)}
                                    </div>

                                    {/* Số lượng items */}
                                    <div className="col-md-1 text-center text-muted">
                                        Số lượng: {order.orderedItems.length}
                                    </div>

                                    {/* Trạng thái đơn hàng */}
                                    <div className="col-md-2 text-center">
                                        <p className='mb-0'>
                                            <span className={`status-dot ${order.orderStatus.toLowerCase()}`}>&#x25cf;</span> 
                                            <b className='ms-1'>{order.orderStatus}</b>
                                        </p>
                                        <small className='text-muted' style={{fontSize:'10px'}}>{order.paymentStatus}</small>
                                    </div>

                                    {/* Nút làm mới */}
                                    <div className="col-md-2 text-end">
                                        <button onClick={fetchOrders} className='btn btn-outline-primary btn-sm px-3'>
                                            Theo dõi đơn hàng
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
};

export default MyOrders;