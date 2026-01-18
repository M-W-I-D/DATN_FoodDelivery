import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ⚡️ THÊM CẤU HÌNH PROXY DƯỚI ĐÂY ⚡️
  server: {
    proxy: {
      // Khi frontend gọi bất cứ đường dẫn nào bắt đầu bằng '/api'
      '/api': {
        // Vite sẽ chuyển hướng yêu cầu đó đến backend
        target: 'http://localhost:8080',
        // Đảm bảo host header được đặt chính xác
        changeOrigin: true,
        // Ghi lại các yêu cầu được proxy trong console
        logLevel: 'debug'
      }
    }
  }
})