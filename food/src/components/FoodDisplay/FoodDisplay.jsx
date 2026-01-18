import React, { useContext, useMemo } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem'; 

const FoodDisplay = ({ category, searchText }) => {
    const { foodList } = useContext(StoreContext); 

    // Sử dụng useMemo để tránh việc tính toán lại danh sách lọc mỗi khi component re-render không cần thiết
    const filteredFoods = useMemo(() => {
        return foodList.filter(food => {
            const foodCategory = food.category ? food.category.toLowerCase().trim() : "";
            const foodName = food.name ? food.name.toLowerCase().trim() : "";
            const selectedCategory = category.toLowerCase().trim();
            const search = searchText.toLowerCase().trim();

            // 1. Kiểm tra danh mục
            const isCategoryMatch = category === 'All' || foodCategory === selectedCategory;

            
            // 2. Kiểm tra từ khóa tìm kiếm (Tìm trong tên món ăn)
            const isSearchMatch = foodName.includes(search);

            return isCategoryMatch && isSearchMatch;
        });
    }, [foodList, category, searchText]);

    return (
        <div className="container mt-5" id="food-display">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h2 className="fw-bold text-dark">Món ăn dành cho bạn</h2>
                <span className="badge bg-secondary rounded-pill">{filteredFoods.length} kết quả</span>
            </div>
            
            <div className="row g-4"> 
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((food) => (
                        <FoodItem 
                            // Key quan trọng để React quản lý danh sách mượt mà
                            key={food.id} 
                            id={food.id} 
                            name={food.name}
                            description={food.description}
                            price={food.price}
                            imageUrl={food.imageUrl} 
                            averageRating={food.averageRating} 
                            totalReviews={food.totalReviews} 
                        />
                    ))
                ) : (
                    <div className="col-12 py-5 shadow-sm rounded-4 bg-light text-center">
                        <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
                        <h4 className="mt-3 fw-bold">Rất tiếc, không tìm thấy món ăn!</h4>
                        <p className="text-muted">Bạn hãy thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác nhé.</p>
                        <button 
                            className="btn btn-primary mt-2 rounded-pill px-4"
                            onClick={() => window.location.reload()}
                        >
                            Xem tất cả món ăn
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodDisplay;