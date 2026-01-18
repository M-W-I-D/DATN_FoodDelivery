import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

import Menubar from './components/Menubar/Menubar';
import Home from './pages/Home/Home';
import ExploreFood from './pages/ExploreFood/ExploreFood';
import Contact from './pages/Contact/Contact'; 
import FoodDetails from './pages/FoodDetails/FoodDetails';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import MyOrders from './pages/MyOrders/MyOrders'; 

const App = () => {
    return (
        <div>
            {/* Cấu hình Toast chuyên nghiệp đồng bộ với Admin */}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            /> 
            
            <Menubar />
            
            <Routes>
                <Route path='/' element={<Home />} /> 
                <Route path='/explore' element={<ExploreFood />} /> 
                <Route path='/contact' element={<Contact />} /> 
                <Route path='/food/:id' element={<FoodDetails />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/order' element={<PlaceOrder />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/order-success' element={<OrderSuccess />} />
                <Route path='/myorders' element={<MyOrders />} /> 
            </Routes>
        </div>
    )
}

export default App;