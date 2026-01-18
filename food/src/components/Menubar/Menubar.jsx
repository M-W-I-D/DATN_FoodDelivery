import React, { useContext, useState } from 'react';
import './Menubar.css';
import { Link, useNavigate } from 'react-router-dom'; 
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify'; // ⭐ Thêm import toast

const Menubar = () => {
    const [active, setActive] = useState("home"); 
    
    // Lấy thêm role và userName từ Context
    const { quantities, token, setToken, role, setRole, userName, setUserName } = useContext(StoreContext);
    
    const uniqueItemsInCart = Object.values(quantities).filter(qty => qty > 0).length;
    const navigate = useNavigate();

    // 1. Hàm chuyển hướng sang cổng Admin (5174)
    const goToAdmin = () => {
        const currentToken = localStorage.getItem("token");
        toast.info("🔐 Đang xác thực quyền Admin...");
        setTimeout(() => {
            window.location.href = `http://localhost:5174/?token=${currentToken}`;
        }, 1000);
    };

    // 2. Hàm xử lý Đăng xuất
    const logout = () => {
        // Xóa sạch localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");

        // Cập nhật state trong Context
        setToken("");
        setRole("");
        setUserName("");
        
        // Thông báo chuyên nghiệp
        toast.success("👋 Đăng xuất thành công. Hẹn gặp lại bạn!", {
            position: "top-right",
            autoClose: 2000,
        });

        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-2">
            <div className="container">
                
                {/* Logo */}
                <Link to="/" onClick={() => setActive('home')}>
                    <img src={assets.logo} alt="Logo" height={45} className='me-4' />
                </Link>

                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold">
                        <li className="nav-item">
                            <Link className={active === 'home' ? "nav-link active text-primary" : "nav-link"} to="/" onClick={() => setActive('home')}>
                                Trang chủ
                            </Link> 
                        </li>
                        <li className="nav-item">
                            <Link className={active === 'explore' ? "nav-link active text-primary" : "nav-link"} to="/explore" onClick={() => setActive('explore')}>
                                Khám phá
                            </Link> 
                        </li>
                        <li className="nav-item">
                            <Link className={active === 'contact-us' ? "nav-link active text-primary" : "nav-link"} to="/contact" onClick={() => setActive('contact-us')}>
                                Liên hệ
                            </Link> 
                        </li> 
                    </ul>
                    
                    <div className="d-flex align-items-center gap-4">
                        {/* Giỏ hàng */}
                        <Link to="/cart" className="text-dark text-decoration-none">
                            <div className="position-relative">
                                <i className="bi bi-cart3 fs-4"></i>
                                {uniqueItemsInCart > 0 && (
                                    <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white' style={{fontSize: '0.6rem'}}>
                                        {uniqueItemsInCart}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* User Profile / Login */}
                        {!token ? (
                            <button className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </button>
                        ) : (
                            <div className='navbar-profile position-relative'>
                                <div className="d-flex align-items-center gap-2 cursor-pointer p-1 hover-bg-light rounded-pill transition-all">
                                    <img src={assets.profile_icon || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                                         alt="Profile" className='rounded-circle' width={35} height={35} />
                                    <span className="d-none d-md-block fw-bold small text-dark">{userName || "User"}</span>
                                    <i className="bi bi-chevron-down small"></i>
                                </div>
                                
                                <ul className="nav-profile-dropdown shadow-lg border-0 rounded-3 p-2">
                                    {/* Nút Admin */}
                                    {role === "ADMIN" && (
                                        <>
                                            <li onClick={goToAdmin} className="d-flex align-items-center p-2 rounded hover-bg-primary-light">
                                                <i className="bi bi-shield-lock text-primary fs-5 me-2"></i>
                                                <span className="small fw-bold text-primary">Quản trị hệ thống</span>
                                            </li>
                                            <hr className="my-1 opacity-25"/>
                                        </>
                                    )}

                                    <li onClick={() => navigate('/myorders')} className="d-flex align-items-center p-2 rounded hover-bg-light">
                                        <i className="bi bi-bag-check fs-5 me-2"></i>
                                        <span className="small">Đơn hàng của tôi</span>
                                    </li>
                                    
                                    <hr className="my-1 opacity-25"/>
                                    
                                    <li onClick={logout} className="d-flex align-items-center p-2 rounded hover-bg-danger-light">
                                        <i className="bi bi-box-arrow-right text-danger fs-5 me-2"></i>
                                        <span className="small text-danger fw-bold">Đăng xuất</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Menubar;