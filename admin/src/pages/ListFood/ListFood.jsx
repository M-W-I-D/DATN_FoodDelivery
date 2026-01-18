import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteFood, getFoodList, updateFood } from '../../services/foodService';
import "./ListFood.css";

const ListFood = () => {
  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null); 
  const [newImage, setNewImage] = useState(null); // Trạng thái lưu ảnh mới khi sửa
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách món ăn.');
    }
  };

  const removeFood = async (foodId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món này?")) {
      try {
        const success = await deleteFood(foodId);
        if (success) {
          toast.success('Xóa thành công!');
          await fetchList();
        }
      } catch (error) {
        toast.error('Lỗi khi xóa.');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // ⭐ CHỈ TRÍCH XUẤT CÁC TRƯỜNG CẦN THIẾT CHO BACKEND ⭐
        const foodDataToSend = {
            name: editItem.name,
            description: editItem.description,
            price: Number(editItem.price), // Đảm bảo là số
            category: editItem.category
        };

        const success = await updateFood(editItem.id, foodDataToSend, newImage);
        
        if (success) {
            toast.success('Cập nhật món ăn thành công!');
            setEditItem(null); 
            setNewImage(null);
            await fetchList(); 
        }
    } catch (error) {
        console.error("Lỗi 400:", error.response?.data);
        toast.error('Cập nhật thất bại. Lỗi định dạng dữ liệu.');
    } finally {
        setLoading(false);
    }
};
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11 card shadow-sm p-4 border-0 rounded-4">
        <h3 className="fw-bold mb-4 text-primary">Quản lý danh sách món ăn</h3>
        
        {/* FORM CHỈNH SỬA */}
        {editItem && (
          <div className="edit-form-overlay mb-5 p-4 border rounded-4 bg-white shadow animate__animated animate__fadeIn">
            <h4 className="fw-bold text-success mb-3">Chỉnh sửa món ăn: {editItem.name}</h4>
            <form onSubmit={handleUpdate} className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold">Tên món</label>
                <input type="text" className="form-control" value={editItem.name} 
                  onChange={(e) => setEditItem({...editItem, name: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Danh mục</label>
                <select className="form-select" value={editItem.category} 
                  onChange={(e) => setEditItem({...editItem, category: e.target.value})}>
                    <option value="Sáng">Đồ ăn sáng</option>
                    <option value="Trưa">Cơm trưa</option>
                    <option value="Tối">Món ăn tối</option>
                    <option value="Ăn vặt">Đồ ăn vặt</option>
                    <option value="Thức uống">Nước giải khát</option>
                    <option value="Tráng miệng">Tráng miệng</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold">Giá bán (VNĐ)</label>
                <input type="number" className="form-control" value={editItem.price} 
                  onChange={(e) => setEditItem({...editItem, price: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Thay đổi ảnh (Nếu có)</label>
                <input type="file" className="form-control" accept="image/*"
                  onChange={(e) => setNewImage(e.target.files[0])} />
              </div>
              <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-secondary px-4 rounded-pill" onClick={() => {setEditItem(null); setNewImage(null);}}>Hủy</button>
                <button type="submit" className="btn btn-success px-4 rounded-pill fw-bold" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* BẢNG DANH SÁCH */}
        <div className="table-responsive">
          <table className='table table-hover align-middle'>
            <thead className="table-light">
              <tr>
                <th>Hình ảnh</th>
                <th>Tên món ăn</th>
                <th>Danh mục</th>
                <th>Giá tiền</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.imageUrl} alt={item.name} className="rounded shadow-sm" style={{width: '65px', height: '65px', objectFit: 'cover'}} />
                  </td>
                  <td className="fw-bold">{item.name}</td>
                  <td><span className="badge bg-light text-dark border">{item.category}</span></td>
                  <td className="text-danger fw-bold">{Number(item.price).toLocaleString()} ₫</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-warning me-2 rounded-pill px-3" onClick={() => {setEditItem(item); window.scrollTo(0,0);}}>
                      <i className="bi bi-pencil-square"></i> Sửa
                    </button>
                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => removeFood(item.id)}>
                      <i className="bi bi-trash"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListFood;