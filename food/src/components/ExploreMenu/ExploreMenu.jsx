import React, { useContext, useRef } from 'react'
import { StoreContext } from '../../context/StoreContext'
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
    const { dynamicCategories, foodList } = useContext(StoreContext);
    const menuRef = useRef(null);

    const scroll = (offset) => {
        if (menuRef.current) {
            menuRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    return (
        <div className='explore-menu container' id='explore-menu'>
            <div className='d-flex align-items-center justify-content-between mb-2'>
                <h1 className='fw-bold mb-0'>Khám Phá Thực Đơn</h1>
                <div className='d-flex gap-2'>
                    <button className='btn scroll-btn rounded-circle p-0 d-flex align-items-center justify-content-center' 
                            style={{width: '40px', height: '40px'}} onClick={() => scroll(-300)}>
                        <i className='bi bi-chevron-left'></i>
                    </button>
                    <button className='btn scroll-btn rounded-circle p-0 d-flex align-items-center justify-content-center' 
                            style={{width: '40px', height: '40px'}} onClick={() => scroll(300)}>
                        <i className='bi bi-chevron-right'></i>
                    </button>
                </div>
            </div>

            <p className='text-muted'>
                Thưởng thức hương vị ẩm thực đa dạng với những danh mục món ăn đặc sắc nhất dành cho bạn.
            </p>

            <div className='explore-menu-list gap-4 overflow-auto' ref={menuRef}>
                {/* Nút All */}
                                
                <div className='text-center explore-menu-list-item flex-shrink-0' onClick={() => setCategory('All')}>
                    <div className={`cat-all-box d-flex align-items-center justify-content-center fw-bold fs-4 ${category === 'All' ? 'active-cat text-white bg-danger' : 'bg-light text-dark'}`}>
                        Tất cả
                    </div>
                    <p className={category === 'All' ? 'text-primary-active' : ''}>Món ăn</p>
                </div>

                {/* Danh mục từ DB */}
                {dynamicCategories.map((catName, index) => {
                    const representativeFood = foodList.find(f => f.category === catName);
                    const imageUrl = representativeFood ? representativeFood.imageUrl : "https://via.placeholder.com/100";

                    return (
                        <div key={index} className='text-center explore-menu-list-item flex-shrink-0'
                             onClick={() => setCategory(prev => prev === catName ? 'All' : catName)}>
                            <img src={imageUrl} alt={catName} className={category === catName ? 'active-cat' : ''} />
                            <p className={category === catName ? 'text-primary-active' : ''}>{catName}</p>
                        </div>
                    )
                })}
            </div>
            <hr />
        </div>
    )
}

export default ExploreMenu;