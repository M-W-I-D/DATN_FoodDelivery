import React, { useContext } from 'react';
import './Cart.css'; 
import { StoreContext } from '../../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    
    // Lấy các hàm đồng bộ DB từ StoreContext
    const {
        foodList,
        increaseQty,
        decreaseQty,
        quantities,
        removeItemCompletely // Hàm xóa vĩnh viễn khỏi MongoDB
    } = useContext(StoreContext);

    // Lọc danh sách món ăn đang có trong giỏ hàng
    const cartItems = foodList.filter(food => quantities[food.id] > 0);

    const formatCurrency = (amount) => {
        if (!amount || amount === 0) return '0 VNĐ';
        return amount.toLocaleString('vi-VN') + ' VNĐ'; 
    };

    // Tính toán tài chính
    const subtotal = cartItems.reduce(
        (acc, food) => acc + food.price * quantities[food.id], 0
    );
    const shipping = subtotal === 0 ? 0 : 30000;
    const tax = Math.round(subtotal * 0.1); // Thuế 10%
    const total = subtotal + shipping + tax;

    // Xử lý nút xóa vĩnh viễn (Nút thùng rác)
    const handleRemoveItem = (foodId, name) => {
        if (window.confirm(`Bạn có chắc muốn xóa "${name}" khỏi giỏ hàng?`)) {
            removeItemCompletely(foodId);
        }
    };

    return (
        <div className="container py-5">
            <div className="d-flex align-items-center mb-5">
                <h1 className="fw-bold m-0">Giỏ hàng của bạn</h1>
                <span className="badge bg-danger rounded-pill ms-3 fs-6">
                    {cartItems.length} món
                </span>
            </div>

            <div className="row g-4">
                {/* DANH SÁCH MÓN ĂN */}
                <div className="col-lg-8">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-5 shadow-sm bg-white rounded-4 border">
                            <div className="mb-4">
                                <i className="bi bi-cart-x text-muted" style={{fontSize: "5rem"}}></i>
                            </div>
                            <h3 className="fw-bold">Giỏ hàng trống!</h3>
                            <p className="text-muted">Có vẻ như bạn chưa chọn món ăn nào ngon lành cả.</p>
                            <Link to="/" className="btn btn-primary btn-lg mt-3 px-5 rounded-pill shadow">
                                <i className="bi bi-arrow-left me-2"></i>Quay lại thực đơn
                            </Link>
                        </div>
                    ) : ( 
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-4 py-3 border-0">Món ăn</th>
                                                <th className="py-3 border-0">Số lượng</th>
                                                <th className="py-3 border-0 text-end">Thành tiền</th>
                                                <th className="py-3 border-0 text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((food) => (
                                                <tr key={food.id} className="cart-item-row">
                                                    <td className="ps-4 py-4">
                                                        <div className="d-flex align-items-center">
                                                            <img 
                                                                src={food.imageUrl} 
                                                                alt={food.name} 
                                                                className="rounded-3 shadow-sm me-3"
                                                                style={{width: '70px', height: '70px', objectFit: 'cover'}}
                                                            />
                                                            <div>
                                                                <h6 className="fw-bold mb-1 text-dark">{food.name}</h6>
                                                                <small className="text-muted">{formatCurrency(food.price)}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="d-flex align-items-center bg-light rounded-pill p-1" style={{width: 'fit-content'}}>
                                                            <button 
                                                                className="btn btn-sm btn-white rounded-circle shadow-sm border-0" 
                                                                onClick={() => decreaseQty(food.id)}>
                                                                <i className="bi bi-dash-lg"></i>
                                                            </button>
                                                            <span className="mx-3 fw-bold">{quantities[food.id]}</span>
                                                            <button 
                                                                className="btn btn-sm btn-white rounded-circle shadow-sm border-0" 
                                                                onClick={() => increaseQty(food.id)}>
                                                                <i className="bi bi-plus-lg"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-end">
                                                        <span className="fw-bold text-primary">
                                                            {formatCurrency(food.price * quantities[food.id])}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-center pe-3">
                                                        <button 
                                                            className="btn btn-outline-danger btn-sm rounded-circle border-0"
                                                            onClick={() => handleRemoveItem(food.id, food.name)}
                                                        >
                                                            <i className="bi bi-trash3-fill"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-4">
                        <Link to="/" className="text-decoration-none text-dark fw-bold d-flex align-items-center">
                            <i className="bi bi-chevron-left me-2"></i> Tiếp tục mua thêm
                        </Link>
                    </div>
                </div>
                
                {/* TÓM TẮT THANH TOÁN */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow rounded-4 p-3 sticky-top" style={{top: '20px'}}>
                        <div className="card-body">
                            <h5 className="fw-bold mb-4 border-bottom pb-2">CHI TIẾT THANH TOÁN</h5>
                            
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Tạm tính</span>
                                <span className="fw-bold">{formatCurrency(subtotal)}</span> 
                            </div>
                            
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Phí vận chuyển</span>
                                <span className="text-success fw-bold">+{formatCurrency(shipping)}</span>
                            </div>
                            
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Thuế VAT (10%)</span>
                                <span className="fw-bold">+{formatCurrency(tax)}</span>
                            </div>

                            <hr className="my-4" style={{borderStyle: 'dashed'}}/>
                            
                            <div className="d-flex justify-content-between mb-4 align-items-center">
                                <span className="fs-5 fw-bold">Tổng thanh toán</span>
                                <strong className="fs-3 text-danger">{formatCurrency(total)}</strong>
                            </div>

                            <button 
                                className="btn btn-danger btn-lg w-100 fw-bold rounded-pill shadow-sm py-3 transition-all"
                                disabled={cartItems.length === 0}
                                onClick={() => navigate('/order')}
                            >
                                <i className="bi bi-bag-check-fill me-2"></i>TIẾN HÀNH ĐẶT HÀNG
                            </button>

                            <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-25">
                                <small className="text-dark d-flex">
                                    <i className="bi bi-info-circle-fill me-2"></i>
                                    Mọi thay đổi về số lượng sẽ được lưu lại tự động cho lần đăng nhập sau.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;