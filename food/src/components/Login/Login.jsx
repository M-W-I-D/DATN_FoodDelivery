import React, { useState, useContext } from 'react';
import './Login.css';
import loginBg from '../../assets/HiaThoiNen.jpg'; 
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext'; 
import { toast } from 'react-toastify'; // ⭐ Bước 1: Import toast

const Login = () => {
  const { url, setToken, setRole, setUserName } = useContext(StoreContext); 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${url}/api/login`, {
            email: email,
            password: password
        });

        if (response.data.token) {
            const { token, role, name } = response.data;

            setToken(token);
            setRole(role);
            setUserName(name);

            if (role === "ADMIN") {
                // ⭐ Bước 2: Dùng toast.info thay cho alert
                toast.info(`Chào Admin ${name}! Đang chuyển hướng...`);
                setTimeout(() => {
                    window.location.href = `http://localhost:5174/?token=${token}`;
                }, 1500);
            } else {
                // ⭐ Bước 3: Dùng toast.success thay cho alert
                toast.success(`Chào mừng ${name} quay trở lại!`);
                setTimeout(() => navigate('/'), 1500);
            }
        }
    } catch (error) {
        console.error("Login Error:", error);
        const errorMsg = error.response?.data?.message || "Sai email hoặc mật khẩu!";
        // ⭐ Bước 4: Dùng toast.error thay cho alert
        toast.error(errorMsg);
    }
  };

  return (
    <div className="login-page-wrapper d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div className="card flex-row border-0 shadow-lg overflow-hidden">
              <div 
                className="d-none d-md-flex col-md-5 bg-image-form" 
                style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>

              <div className="card-body p-4 p-sm-5 col-md-7">
                <h3 className="login-heading mb-4 text-center fw-bold">Đăng nhập SIU Food!</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="floatingInput">Địa chỉ Email</label>
                  </div>
                  
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Mật khẩu"
                      value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label htmlFor="floatingPassword">Mật khẩu</label>
                  </div>

                  <div className="d-grid">
                    <button className="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2 py-3" type="submit">
                      Đăng nhập
                    </button>
                  </div>

                  <hr className="my-4" />
                  <div className="text-center">
                    <span className="small">Chưa có tài khoản? </span>
                    <Link className="small text-decoration-none fw-bold" to="/register">Đăng ký ngay</Link>
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

export default Login;