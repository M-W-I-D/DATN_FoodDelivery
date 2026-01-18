import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Thêm import Link
import { StoreContext } from '../../context/StoreContext';
import './Header.css'; 

const Header = () => {
    const { foodList } = useContext(StoreContext);
    const bannerImages = foodList.length > 0 
        ? foodList.slice(0, 8).map(item => item.imageUrl) 
        : [];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (bannerImages.length === 0) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bannerImages]);

    const currentBg = bannerImages.length > 0 
        ? bannerImages[currentImageIndex] 
        : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920";

    return (
        <header className="header-container">
            <div 
                className="header-banner" 
                style={{ backgroundImage: `url(${currentBg})` }}
            >
                <div className="header-overlay"></div>
                
                <div className="container">
                    <div className="header-content">
                        <span className="header-tagline">Tận hưởng hương vị đỉnh cao</span>
                        <h1 className="header-title">
                            Chào mừng đến với <span className="text-highlight">Food SIU</span>
                        </h1>
                        <p className="header-subtitle">
                            Khám phá tinh hoa ẩm thực được chọn lọc kỹ lưỡng. Đặt món ngay để nhận ưu đãi lên đến 36% cho tài khoản mới!
                        </p>
                        <div className="header-btns">
                            <a href="#explore-menu" className="btn-explore-now">
                                <i className="bi bi-cart-plus me-2"></i>Đặt món ngay
                            </a>
                            {/* THAY ĐỔI TẠI ĐÂY: Dùng Link thay vì thẻ a */}
                            <Link to="/contact" className="btn-contact">
                                Liên hệ chúng tôi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;