// File: App.js / App.jsx

// 1. SỬA LỖI: Chỉ import những gì cần thiết. Thêm useState.
import { useState } from 'react'; 
// SỬA LỖI: Thêm Routes vào import từ react-router-dom
import { Routes, Route } from 'react-router-dom'; 

import Sidebar from './component/Sidebar/Sidebar';
import Menubar from './component/Menubar/Menubar';
import Orders from './pages/Orders/Orders';
import ListFood from './pages/ListFood/ListFood';
// SỬA LỖI: Cần import AddFood
import AddFood from './pages/AddFood/AddFood'; 


const App = () => {
    // Không cần import React ở đây nữa, chỉ cần import Hook useState
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    }
    
  return (
    <div>
      <div className="d-flex" id="wrapper">
            
            <Sidebar sidebarVisible={sidebarVisible}/>
            
            <div id="page-content-wrapper">
                
                {/* 3. SỬA LỖI CÚ PHÁP: Thay to thành toggleSidebar */}
                <Menubar toggleSidebar={toggleSidebar}/> 
                
                <div className="container-fluid">
                    <Routes>
                        <Route path='/add' element={<AddFood />} />
                        <Route path='/list' element={<ListFood />} />
                        <Route path='/orders' element={<Orders />} />
                        <Route path='/' element={<ListFood />} />
                    </Routes>
                </div>
            </div>
        </div>
    </div>
  )
}

export default App