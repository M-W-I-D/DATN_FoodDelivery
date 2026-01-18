import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets.js';

const Sidebar = ({ sidebarVisible }) => {
  // Hook để lấy đường dẫn hiện tại nhằm làm nổi bật (active) mục đang chọn
  const location = useLocation();

  return (
    <div className={`border-end bg-white ${sidebarVisible ? '' : 'd-none'}`} id="sidebar-wrapper" style={{ minWidth: '250px', transition: 'all 0.3s' }}>
      
      {/* Phần đầu Sidebar: Logo và Tên hệ thống */}
      <div className="sidebar-heading border-bottom bg-light p-3 d-flex align-items-center gap-2">
        <img src={assets.logo} alt="Logo" height={35} width={35} />
        <span className="fw-bold text-primary">SIU FOOD ADMIN</span>
      </div>

      {/* Danh sách các mục quản lý */}
      <div className="list-group list-group-flush">
        
        <Link 
          className={`list-group-item list-group-item-action p-3 ${location.pathname === '/add' ? 'active' : ''}`} 
          to="/add"
        >
          <i className='bi bi-plus-circle-fill me-2'></i> Thêm món ăn
        </Link>

        <Link 
          className={`list-group-item list-group-item-action p-3 ${location.pathname === '/list' ? 'active' : ''}`} 
          to="/list"
        >
          <i className='bi bi-grid-3x3-gap-fill me-2'></i> Danh sách món ăn
        </Link>

        <Link 
          className={`list-group-item list-group-item-action p-3 ${location.pathname === '/orders' ? 'active' : ''}`} 
          to="/orders"
        >
          <i className='bi bi-box-seam-fill me-2'></i> Quản lý đơn hàng
        </Link>
        
      </div>

      {/* Thông tin phiên bản phía dưới cùng (Tùy chọn) */}
      <div className="mt-auto p-3 text-center text-muted border-top" style={{fontSize: '12px'}}>
        <p className="mb-0">Phiên bản Đồ Án 2026</p>
      </div>
    </div>
  );
}

export default Sidebar;