import React, { useState, useEffect } from 'react'
import './App.css'
import AddFood from './pages/AddFood/AddFood';
import Orders from './pages/Orders/Orders';
import ListFood from './pages/ListFood/ListFood';
import Sidebar from './components/Sidebar/Sidebar';
import Menubar from './components/Menubar/Menubar';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Thêm toast
import 'react-toastify/dist/ReactToastify.css'; // Đảm bảo đã import css

const App = ()  => {
    const [sidebarVisible , setSidebarVisible] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            localStorage.setItem("token", tokenFromUrl);
            
            // ⭐ Thay vì alert, hiển thị toast thông báo thành công ⭐
            toast.success("🚀 Xác thực Admin thành công!");

            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    }

    return (
        <div className="d-flex" id="wrapper">
            {/* Cấu hình ToastContainer chuyên nghiệp */}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            
            <Sidebar sidebarVisible={sidebarVisible} />
            <div id="page-content-wrapper" className="w-100">
                <Menubar toggleSidebar={toggleSidebar} />
                <div className="container-fluid p-4">
                    <Routes>
                        <Route path="/add" element={<AddFood />} />
                        <Route path="/list" element={<ListFood />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/" element={<ListFood />} /> 
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default App;