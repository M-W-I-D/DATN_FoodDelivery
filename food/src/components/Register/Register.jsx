import React, { useState, useContext } from 'react';
import './Register.css';
import registerBg from '../../assets/HiaThoiNen.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify'; // ⭐ Bước 1: Import toast

const Register = () => {
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⭐ Bước 2: Dùng toast.warn cho thông báo cảnh báo
    if (formData.password !== formData.confirmPassword) {
      toast.warn("⚠️ Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data) {
        // ⭐ Bước 3: Dùng toast.success cho thông báo thành công
        toast.success("🚀 Đăng ký thành công! Đang chuyển hướng sang Đăng nhập...");
        
        // Đợi 2 giây để người dùng kịp đọc thông báo
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error("Đăng ký thất bại", error);
      const errorMsg = error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!";
      
      // ⭐ Bước 4: Dùng toast.error cho thông báo lỗi
      toast.error(`❌ ${errorMsg}`);
    }
  };

  return (
    <div className="register-page-wrapper d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div className="card flex-row border-0 shadow-lg overflow-hidden animate__animated animate__fadeIn">
              
              <div 
                className="d-none d-md-flex col-md-5 bg-image-register" 
                style={{ backgroundImage: `url(${registerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>

              <div className="card-body p-4 p-sm-5 col-md-7">
                <h3 className="register-heading mb-4 text-center fw-bold">Tạo tài khoản mới</h3>
                
                <form onSubmit={handleSubmit}>
                  {/* Họ và Tên */}
                  <div className="form-floating mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name" 
                      placeholder="Nguyễn Văn A"
                      onChange={handleInputChange}
                      name="name"
                      value={formData.name}
                      required
                    />
                    <label htmlFor="name">Họ và Tên</label>
                  </div>

                  {/* Email */}
                  <div className="form-floating mb-3">
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      placeholder="name@example.com"
                      onChange={handleInputChange}
                      name="email"
                      value={formData.email}
                      required
                    />
                    <label htmlFor="email">Địa chỉ Email</label>
                  </div>
                  
                  {/* Mật khẩu */}
                  <div className="form-floating mb-3">
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      placeholder="Mật khẩu"
                      onChange={handleInputChange}
                      name="password"
                      value={formData.password}
                      required
                    />
                    <label htmlFor="password">Mật khẩu</label>
                  </div>

                  {/* Xác nhận mật khẩu */}
                  <div className="form-floating mb-3">
                    <input 
                      type="password" 
                      className="form-control" 
                      id="confirmPassword" 
                      placeholder="Xác nhận mật khẩu"
                      onChange={handleInputChange}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      required
                    />
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  </div>

                  <div className="d-grid mt-4">
                    <button className="btn btn-lg btn-primary btn-register text-uppercase fw-bold mb-2 py-3" type="submit">
                      Đăng ký ngay
                    </button>
                    <div className="text-center mt-2">
                      <span className="small">Đã có tài khoản? </span>
                      <Link className="small text-decoration-none fw-bold text-primary" to="/login">Đăng nhập</Link>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;