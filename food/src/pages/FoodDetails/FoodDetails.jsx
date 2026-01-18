import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFoodDetails } from '../../service/foodService';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import './FoodDetails.css';

const FoodDetails = () => {
    const { id } = useParams();
    const { 
        increaseQty, 
        token, 
        userName, 
        role, 
        addComment, 
        getCommentsByFood, 
        deleteComment,
        fetchFoodList // ⭐ Lấy hàm này từ Context để đồng bộ trang chủ
    } = useContext(StoreContext);
    
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5); 
    const [hover, setHover] = useState(0); 
    const [activeTab, setActiveTab] = useState('review');

    // Hàm tải lại toàn bộ dữ liệu trang chi tiết
    const loadData = async () => {
        try {
            const foodData = await fetchFoodDetails(id);
            setData(foodData);
            const commentData = await getCommentsByFood(id);
            setComments(commentData);
        } catch (error) { 
            console.error("Lỗi tải dữ liệu:", error); 
        }
    };

    useEffect(() => { 
        loadData(); 
        window.scrollTo(0, 0); // Cuộn lên đầu trang khi vào chi tiết
    }, [id]);

    // Xử lý gửi bình luận
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.warn("Vui lòng đăng nhập để bình luận");
            return navigate('/login');
        }
        
        try {
            const commentObj = {
                foodId: id, 
                content: newComment, 
                userName: userName,
                rating: rating 
            };
            await addComment(commentObj);
            setNewComment("");
            setRating(5);
            
            await loadData(); // Cập nhật tại chỗ
            await fetchFoodList(); // ⭐ ĐỒNG BỘ DỮ LIỆU TOÀN CỤC (Để trang chủ hiện đúng)
            
            toast.success("Cảm ơn bạn đã để lại đánh giá!");
        } catch (error) { 
            toast.error("Gửi bình luận thất bại. Thử lại sau!"); 
        }
    };

    const handleDelete = async (commentId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
            try {
                await deleteComment(commentId);
                await loadData();
                await fetchFoodList(); // ⭐ Đồng bộ lại sau khi xóa
                toast.success("Đã gỡ bỏ bình luận!");
            } catch (error) { toast.error("Lỗi khi xóa bình luận"); }
        }
    };

    // Hàm hiển thị sao động dựa trên averageRating
    const renderStars = (score) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(score)) {
                stars.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
            } else if (i === Math.ceil(score) && score % 1 !== 0) {
                stars.push(<i key={i} className="bi bi-star-half text-warning me-1"></i>);
            } else {
                stars.push(<i key={i} className="bi bi-star text-secondary me-1"></i>);
            }
        }
        return stars;
    };

    if (!data) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    return (
        <div className="container py-5">
            {/* PHẦN 1: HEADER THÔNG TIN MÓN ĂN */}
            <div className="food-main-card shadow border-0 rounded-4 bg-white p-4 mb-5">
                <div className="row g-4 align-items-center">
                    <div className="col-md-5">
                        <div className="img-wrapper rounded-4 overflow-hidden shadow-sm">
                            <img src={data.imageUrl} className="img-fluid main-img" alt={data.name} />
                        </div>
                    </div>
                    <div className="col-md-7 ps-md-5">
                        <span className="badge bg-soft-warning text-warning-emphasis mb-2 px-3 py-2 rounded-pill">
                            <i className="bi bi-tag-fill me-1"></i> {data.category}
                        </span>
                        <h1 className="display-6 fw-bold mb-2">{data.name}</h1>
                        
                        <div className="d-flex align-items-center mb-3">
                            <div className="me-2">{renderStars(data.averageRating || 0)}</div>
                            <span className="fw-bold me-1">{(data.averageRating || 0).toFixed(1)}</span>
                            <span className="text-muted small">({comments.length} đánh giá)</span>
                        </div>

                        <h3 className="text-danger fw-bold mb-4">{data.price?.toLocaleString()} VNĐ</h3>
                        
                        <div className="mb-4">
                            <h6 className="fw-bold text-uppercase small text-muted">Mô tả ngắn:</h6>
                            <p className="lead fs-6 text-secondary">{data.description || 'Hương vị tuyệt vời từ Siu Food, được chế biến từ nguyên liệu tươi sạch mỗi ngày.'}</p>
                        </div>

                        <div className="d-flex gap-3">
                            <button className="btn btn-danger btn-lg px-5 rounded-pill shadow-sm fw-bold transition-all" 
                                onClick={() => { increaseQty(data.id); navigate('/cart'); }}>
                                <i className="bi bi-bag-plus-fill me-2"></i> Mua ngay
                            </button>
                            <button className="btn btn-outline-secondary btn-lg rounded-circle shadow-sm" onClick={() => increaseQty(data.id)}>
                                <i className="bi bi-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PHẦN 2: TABS CHI TIẾT */}
            <div className="detail-tabs bg-white shadow rounded-4 p-4">
                <ul className="nav nav-tabs border-bottom-0 mb-4 gap-2">
                    <li className="nav-item">
                        <button className={`nav-link border-0 px-4 py-2 rounded-pill fw-bold ${activeTab === 'desc' ? 'active bg-primary text-white shadow-sm' : 'text-muted'}`} 
                            onClick={() => setActiveTab('desc')}>Thông tin chi tiết</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link border-0 px-4 py-2 rounded-pill fw-bold ${activeTab === 'review' ? 'active bg-danger text-white shadow-sm' : 'text-muted'}`} 
                            onClick={() => setActiveTab('review')}>Đánh giá ({comments.length})</button>
                    </li>
                </ul>

                <div className="tab-content pt-2">
                    {activeTab === 'desc' ? (
                        <div className="animate__animated animate__fadeIn">
                            <h5 className="fw-bold mb-3">Về sản phẩm này</h5>
                            <p className="text-secondary" style={{lineHeight: '1.8'}}>{data.description}</p>
                        </div>
                    ) : (
                        <div className="row g-5 animate__animated animate__fadeIn">
                            {/* Danh sách bình luận */}
                            <div className="col-lg-7 border-end-lg">
                                <h5 className="mb-4 fw-bold text-dark d-flex align-items-center">
                                    <i className="bi bi-chat-left-text-fill text-danger me-2"></i> Khách hàng nói gì?
                                </h5>
                                <div className="comment-list pe-lg-3">
                                    {comments.length > 0 ? comments.map((item) => (
                                        <div key={item.id} className="comment-item p-3 mb-3 rounded-3 border-bottom border-light">
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="avatar-small bg-primary-subtle text-primary fw-bold rounded-circle d-flex align-items-center justify-content-center me-2">
                                                        {item.userName?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="fw-bold">{item.userName}</span>
                                                </div>
                                                {(userName === item.userName || role === "ADMIN") && (
                                                    <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger border-0"><i className="bi bi-trash3"></i></button>
                                                )}
                                            </div>
                                            <div className="mb-2">{renderStars(item.rating)}</div>
                                            <p className="text-secondary small mb-1">{item.content}</p>
                                            <small className="text-muted" style={{fontSize: '0.7rem'}}>{new Date(item.createdAt).toLocaleString('vi-VN')}</small>
                                        </div>
                                    )) : <div className="text-center py-5 text-muted">Chưa có đánh giá nào. Hãy trải nghiệm và chia sẻ cảm nhận nhé!</div>}
                                </div>
                            </div>

                            {/* Form viết bình luận */}
                            <div className="col-lg-5">
                                <div className="sticky-form p-4 rounded-4 bg-light-subtle border shadow-sm">
                                    <h5 className="mb-3 fw-bold">Để lại đánh giá</h5>
                                    <form onSubmit={handleAddComment}>
                                        <div className="mb-3 text-center p-2 bg-white rounded-3 border">
                                            <label className="form-label d-block small fw-bold text-muted mb-2 text-uppercase">Chất lượng món ăn</label>
                                            <div className="star-selector fs-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i key={star} className={`bi ${star <= (hover || rating) ? "bi-star-fill text-warning" : "bi-star text-secondary"} cursor-pointer mx-1`}
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHover(star)}
                                                        onMouseLeave={() => setHover(0)}
                                                        style={{ cursor: 'pointer', transition: '0.2s' }}></i>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <textarea className="form-control rounded-3 border-0 shadow-sm p-3" rows="4" 
                                                placeholder="Bạn thấy món ăn này thế nào?" value={newComment} 
                                                onChange={(e) => setNewComment(e.target.value)} required></textarea>
                                        </div>
                                        <button className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow transition-all" type="submit">
                                            GỬI ĐÁNH GIÁ <i className="bi bi-send-fill ms-2"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodDetails;