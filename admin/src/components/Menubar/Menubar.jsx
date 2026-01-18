import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets'; // Import assets của bạn
import { toast } from 'react-toastify';

const Menubar = ({ toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        
        toast.info("🔒 Đang quay lại trang bán hàng...", {
            position: "top-right",
            autoClose: 1500,
            theme: "colored",
        });

        setTimeout(() => {
            window.location.href = "http://localhost:5173/";
        }, 1500);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-2">
            <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
                
                {/* PHẦN TRÁI: Logo và Nút Toggle */}
                <div className="d-flex align-items-center gap-3">
                    <button 
                        className="btn btn-light border rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
                        id="sidebarToggle" 
                        onClick={toggleSidebar}
                        style={{ width: '40px', height: '40px' }}
                    >
                        <i className="bi bi-list fs-5"></i>
                    </button>
                    
                    
                </div>

                {/* Nút Toggle cho Mobile (Giao diện thu nhỏ) */}
                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* PHẦN PHẢI: Thông tin Admin & Đăng xuất */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto d-flex align-items-center flex-row gap-3 mt-lg-0 mt-3">
                        
                        {/* Huy hiệu Administrator */}
                        <li className="nav-item">
                            <div className="badge rounded-pill bg-danger bg-opacity-10 text-danger px-3 py-2 border border-danger border-opacity-25 d-flex align-items-center">
                                <i className="bi bi-person-badge-fill me-2"></i>
                                <span className="fw-bold" style={{ fontSize: '0.8rem' }}>Administrator</span>
                            </div>
                        </li>

                        {/* Nút Đăng xuất */}
                        <li className="nav-item">
                            <button 
                                className="btn btn-danger btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-bold shadow-sm transition-all" 
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right"></i>
                                <span className="d-none d-md-inline">Đăng xuất</span>
                            </button>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Menubar;