import React, { useState } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';

const ExploreFood = () => {
  const [category, setCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  return (
    <>
      <div className='container mt-4'>
        <div className='row justify-content-center'>
          <div className='col-md-8 col-lg-6'> {/* Cải thiện độ rộng trên các màn hình */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className='input-group mb-3 shadow-sm rounded'>
                <select 
                  className='form-select' 
                  style={{ maxWidth: '140px', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }} 
                  onChange={(e) => setCategory(e.target.value)} 
                  value={category}
                >
                  <option value="All">Tất cả</option>
                  {/* LƯU Ý: Value phải khớp chính xác với trường 'category' trong Database */}
                  <option value="Sáng">Sáng</option> 
                  <option value="Trưa">Trưa</option>
                  <option value="Tối">Tối</option>
                  <option value="Ăn vặt">Ăn vặt</option>
                  <option value="Thức uống">Thức uống</option>
                </select>
                
                <input 
                  type="text" 
                  className='form-control' 
                  placeholder='Tìm tên món ăn...' 
                  onChange={(e) => setSearchText(e.target.value)} 
                  value={searchText} 
                />
                
                <button 
                  className='btn btn-primary' 
                  type='submit' 
                  style={{ borderTopRightRadius: '20px', borderBottomRightRadius: '20px' }}
                >
                  <i className='bi bi-search'></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Truyền props xuống FoodDisplay */}
      <FoodDisplay category={category} searchText={searchText}/>
    </>
  );
}

export default ExploreFood;