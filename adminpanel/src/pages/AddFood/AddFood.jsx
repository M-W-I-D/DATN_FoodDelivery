import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';



const AddFood = () => {
  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div className="card col-md-4">
          <div className="card-body">
            <h2 className="mb-4">Thêm món ăn</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="file" className="form-label">
                  <img src={/* preview state will go here */ assets.upload} alt="" width={98}/>
                </label>
                <input type="file" accept="image/*" className="form-control" id="file" required hidden/> 
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Tên món ăn</label>
                <input type="text" className="form-control" id="name" required name='name'/> 
              </div>

              <div className="mb-3">
                {/* SỬA: Thay 'for' thành 'htmlFor' */}
                <label htmlFor="description" className="form-label">Mô tả</label>
                <textarea className="form-control" id="message" rows="5" required name='description' ></textarea>
              </div>

              <div className="mb-3">
                {/* SỬA: Thay 'for' thành 'htmlFor' trong JSX */}
                <label htmlFor="category" className="form-label">Danh mục</label>
                {/* SỬA: Thêm / vào cuối thẻ input */}
                <select name="category" id="category" className='form-control'>
                  <option value="sang">Sáng</option>
                  <option value="trua">Trưa</option>
                  <option value="chieu">Chiều</option>
                  <option value="toi">Tối</option>  
                </select> 
              </div>
              <div className="mb-3">
                {/* SỬA: Thay 'for' thành 'htmlFor' trong JSX */}
                <label htmlFor="price" className="form-label">Giá tiền</label>
                {/* SỬA: Thêm / vào cuối thẻ input */}
                <input type="number" name="price" id="price" className='form-control'/> 
              </div>

              <button type="submit" className="btn btn-primary">Lưu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddFood