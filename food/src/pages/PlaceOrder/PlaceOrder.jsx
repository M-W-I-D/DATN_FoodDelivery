import React, { useState, useContext } from 'react'; 
import { StoreContext } from '../../context/StoreContext'; 
import './PlaceOrder.css';

const PlaceOrder = () => {
    const { foodList, quantities, placeOrder, token } = useContext(StoreContext); 
    
    const [paymentMethod, setPaymentMethod] = useState('payos');
    const [isLoading, setIsLoading] = useState(false); 
    const [formData, setFormData] = useState({ 
        firstName: '', lastName: '', email: '', phone: '', address: '' 
    });

    // --- LOGIC GIỐNG HỆT CART.JSX CỦA BẠN ---
    const cartItems = foodList.filter(food => quantities[food.id] > 0);
    
    const subtotal = cartItems.reduce((acc, food) => {
        return acc + (food.price * quantities[food.id]);
    }, 0);

    const shipping = subtotal === 0 ? 0 : 30000;
    const tax = subtotal * 0.1;
    const total = Math.round(subtotal + shipping + tax); 

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("Vui lòng đăng nhập lại!");
            return;
        }

        if (cartItems.length === 0) {
            alert("Giỏ hàng rỗng!");
            return;
        }

        setIsLoading(true);

        const orderData = {
            orderedItems: cartItems.map(item => ({
                foodId: item.id, // Dùng .id như Cart.jsx
                name: item.name,
                quantity: quantities[item.id],
                price: item.price
            })),
            userAddress: formData.address,
            phoneNumber: formData.phone,
            email: formData.email,
            amount: total
        };

        try {
            if (paymentMethod === 'payos') {
                await placeOrder(orderData);
            } else {
                alert("Tính năng COD đang bảo trì");
            }
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="place-order-container py-5 bg-light">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="row g-5">
                        <div className="col-md-5 col-lg-4 order-md-last">
                            <h4 className="d-flex justify-content-between mb-3">
                                <span className="text-primary">Đơn hàng</span>
                                <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
                            </h4>
                            <ul className="list-group mb-3">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between">
                                        <div>
                                            <h6 className="my-0">{item.name}</h6>
                                            <small>Số lượng: {quantities[item.id]}</small>
                                        </div>
                                        <span>{(item.price * quantities[item.id]).toLocaleString()}đ</span>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Tổng cộng (gồm thuế)</strong>
                                    <strong className="text-danger">{total.toLocaleString()}đ</strong>
                                </li>
                            </ul>
                        </div>

                        <div className="col-md-7 col-lg-8">
                            <div className="card p-4 border-0 shadow-sm">
                                <h4>Thông tin giao hàng</h4>
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label className="form-label">Tên</label>
                                        <input type="text" id="firstName" className="form-control" required onChange={handleInputChange} />
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label">Họ</label>
                                        <input type="text" id="lastName" className="form-control" required onChange={handleInputChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Email</label>
                                        <input type="email" id="email" className="form-control" required onChange={handleInputChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Số điện thoại</label>
                                        <input type="text" id="phone" className="form-control" required onChange={handleInputChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Địa chỉ</label>
                                        <textarea id="address" className="form-control" required onChange={handleInputChange}></textarea>
                                    </div>
                                </div>
                                <hr className="my-4" />
                                <h5>Thanh toán</h5>
                                <div className="form-check">
                                    <input type="radio" checked className="form-check-input" readOnly />
                                    <label className="form-check-label">💳 QR Code (PayOS)</label>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-100 mt-4" disabled={isLoading}>
                                    {isLoading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN THANH TOÁN"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default PlaceOrder;