import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; 
import { StoreContext } from '../../context/StoreContext';
import './FoodItem.css';

const FoodItem = ({ name, description, id, imageUrl, price, averageRating, totalReviews }) => {
    const { increaseQty, decreaseQty, quantities } = useContext(StoreContext); 

    const formatCurrency = (amount) => {
        if (!amount) return '0 VNĐ';
        return amount.toLocaleString('vi-VN') + ' VNĐ';
    };

    // Hàm render sao động: Hiển thị đúng số sao từ Backend trả về
    const renderStars = (rating) => {
        const stars = [];
        const score = rating || 0; // Nếu null thì coi là 0
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(score)) {
                // Sao đầy
                stars.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
            } else if (i === Math.ceil(score) && score % 1 !== 0) {
                // Sao nửa (ví dụ 4.5)
                stars.push(<i key={i} className="bi bi-star-half text-warning me-1"></i>);
            } else {
                // Sao rỗng
                stars.push(<i key={i} className="bi bi-star text-secondary me-1"></i>);
            }
        }
        return stars;
    };

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
            <div className="card food-item-card shadow-sm border-0">
                
                <div className="food-item-img-container">
                    <Link to={`/food/${id}`}>
                        <img 
                            src={imageUrl || 'https://via.placeholder.com/320x200?text=Food+Image'} 
                            className="card-img-top" 
                            alt={name} 
                        />
                    </Link>
                </div>

                <div className="card-body d-flex flex-column p-3">
                    <h5 className="card-title text-truncate fw-bold mb-1">{name}</h5>
                    <p className="card-text text-muted small mb-2 text-description">
                        {description || "Hương vị thơm ngon khó cưỡng..."}
                    </p>
                    
                    {/* KHU VỰC ĐÁNH GIÁ SAO */}
                    <div className="rating-section mb-2">
                        <div className="d-flex align-items-center mb-1">
                            {renderStars(averageRating)}
                            <span className="ms-1 small fw-bold">
                                {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
                            </span>
                        </div>
                        <div className="small text-muted" style={{fontSize: '0.75rem'}}>
                            <i className="bi bi-chat-dots me-1"></i>{totalReviews || 0} đánh giá
                        </div>
                    </div>

                    <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span className="text-danger fw-bold fs-5">
                            {formatCurrency(price)}
                        </span>
                    </div>
                </div>
                
                <div className="card-footer bg-white border-0 pb-3 pt-0 d-flex justify-content-between align-items-center">
                    <Link className="btn btn-light btn-sm rounded-pill px-3 border shadow-xs" to={`/food/${id}`}>
                        Chi tiết
                    </Link>

                    {quantities[id] > 0 ? (
                        <div className="d-flex align-items-center bg-primary bg-opacity-10 rounded-pill px-1 py-1">
                            <button className="btn btn-sm btn-link text-primary p-0" onClick={() => decreaseQty(id)}> 
                                <i className='bi bi-dash-circle-fill fs-5'></i> 
                            </button>
                            <span className='mx-2 fw-bold text-primary'>{quantities[id]}</span>
                            <button className="btn btn-sm btn-link text-primary p-0" onClick={() => increaseQty(id)}> 
                                <i className='bi bi-plus-circle-fill fs-5'></i> 
                            </button>
                        </div>
                    ) : (
                        <button className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm fw-bold" onClick={() => increaseQty(id)}>
                            <i className='bi bi-plus-lg me-1'></i> Thêm
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FoodItem;