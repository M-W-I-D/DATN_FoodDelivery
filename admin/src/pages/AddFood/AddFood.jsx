import React, { useState } from 'react'; 
import { assets } from '../../assets/assets';
import { addFood } from '../../services/foodService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 

const AddFood = () => {
    const navigate = useNavigate();
    
    // 1. KHỞI TẠO STATES
    const [image, setImage] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        category: 'Sáng', // Mặc định chọn danh mục Sáng
        price: '' 
    });
    
    // 2. XỬ LÝ THAY ĐỔI INPUT
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    }

    // 3. XỬ LÝ GỬI DỮ LIỆU
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!image) {
            toast.error('Vui lòng tải lên ảnh món ăn.');
            return;
        }
        
        setLoading(true);
        try {
            // Gọi service thêm món ăn (Data bao gồm danh mục tiếng Việt)
            await addFood(data, image); 
            toast.success('Thêm món ăn mới thành công!');
            
            // Chuyển hướng về danh sách sau khi thêm thành công
            navigate('/list'); 
            
        } catch (error) {
            console.error('Lỗi thêm món:', error); 
            const errorMessage = error.response?.data?.message || 'Không thể kết nối Server. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="container-fluid px-2 mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-4">
                            <h2 className="mb-4 text-center fw-bold text-primary">Thêm Món Ăn Mới</h2>
                            
                            <form onSubmit={onSubmitHandler}>
                                
                                {/* --- KHU VỰC TẢI ẢNH --- */}
                                <div className="mb-4 text-center">
                                    <label className="form-label d-block fw-bold mb-3 text-secondary">
                                        Hình ảnh món ăn
                                    </label>
                                    
                                    <label 
                                        htmlFor="image" 
                                        className="d-flex flex-column align-items-center justify-content-center rounded-4 border-dashed p-3"
                                        style={{
                                            border: '2px dashed #dee2e6',
                                            cursor: 'pointer',
                                            minHeight: '180px', 
                                            backgroundColor: '#f8f9fa',
                                            transition: '0.3s'
                                        }}
                                    >
                                        <input 
                                            onChange={(e) => setImage(e.target.files[0])}
                                            type="file" 
                                            id="image" 
                                            accept="image/*" 
                                            hidden 
                                        />
                                        
                                        {image ? (
                                            <div className="text-center">
                                                <img 
                                                    src={URL.createObjectURL(image)} 
                                                    alt="Preview" 
                                                    className='mb-2 rounded shadow' 
                                                    style={{width: '120px', height: '120px', objectFit: 'cover'}}
                                                />
                                                <p className="small text-success fw-bold mb-0">{image.name}</p>
                                                <span className="badge bg-secondary mt-1">Thay đổi ảnh</span>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <img 
                                                    src={assets.upload} 
                                                    alt="Upload icon" 
                                                    className='mb-3 opacity-50'
                                                    style={{width: '50px'}}
                                                />
                                                <p className="text-muted mb-0">Nhấn vào đây để tải ảnh lên</p>
                                                <p className="small text-muted fst-italic">Hỗ trợ JPG, PNG (Tối đa 2MB)</p>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                {/* --- TÊN MÓN --- */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Tên món ăn</label>
                                    <input 
                                        type="text" 
                                        name='name'
                                        className='form-control form-control-lg' 
                                        placeholder='Nhập tên món ăn...' 
                                        required 
                                        onChange={onChangeHandler} 
                                        value={data.name}
                                    />
                                </div>

                                {/* --- MÔ TẢ --- */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Mô tả chi tiết</label>
                                    <textarea 
                                        name='description'
                                        className="form-control" 
                                        rows="4" 
                                        placeholder='Hương vị, thành phần chính...' 
                                        required 
                                        onChange={onChangeHandler} 
                                        value={data.description}
                                    ></textarea>
                                </div>

                                <div className="row">
                                    {/* --- DANH MỤC TIẾNG VIỆT --- */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Danh mục</label>
                                        <select 
                                            name="category" 
                                            className='form-select' 
                                            onChange={onChangeHandler} 
                                            value={data.category}
                                        >
                                            <option value="Sáng">Đồ ăn sáng</option>
                                            <option value="Trưa">Cơm trưa</option>
                                            <option value="Tối">Món ăn tối</option>
                                            <option value="Ăn vặt">Đồ ăn vặt</option>
                                            <option value="Thức uống">Nước giải khát</option>
                                            <option value="Tráng miệng">Tráng miệng</option>
                                        </select>
                                    </div>

                                    {/* --- GIÁ TIỀN --- */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Giá bán (VNĐ)</label>
                                        <div className="input-group">
                                            <input 
                                                type="number" 
                                                name="price" 
                                                className='form-control' 
                                                placeholder='45000'
                                                required 
                                                min="0"
                                                onChange={onChangeHandler} 
                                                value={data.price} 
                                            />
                                            <span className="input-group-text">₫</span>
                                        </div>
                                    </div>
                                </div>

                                {/* --- NÚT GỬI --- */}
                                <div className="mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow" 
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Đang lưu dữ liệu...
                                            </>
                                        ) : 'Xác nhận lưu món ăn'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFood;