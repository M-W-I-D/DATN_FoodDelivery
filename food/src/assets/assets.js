import logo from './logo.png';
import cart from './trolley.png'; 
import parcel_icon from './parcel.png'; 

// Các icon chức năng dùng link online hoặc file local tùy bạn
const upload_area = "https://cdn-icons-png.flaticon.com/512/126/126477.png";
const cross_icon = "https://cdn-icons-png.flaticon.com/512/1828/1828778.png";
const google_icon = "https://cdn-icons-png.flaticon.com/512/300/300221.png";

export const assets = {
    logo,
    cart,
    parcel_icon,
    upload_area,
    cross_icon,
    google_icon
};

// ⭐ LƯU Ý: Không cần export const categories ở đây nữa 
// vì ExploreMenu đã lấy dynamicCategories từ StoreContext rồi.