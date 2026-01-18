import React from 'react'
import './Contact.css'

const Contact = () => {
  return (
    <div className='contact-container'>
      <div className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5">
            <div className="contact-info p-4 border-start border-4 border-danger bg-light rounded-end shadow-sm">
              <h2 className="display-6 fw-bold mb-4 text-dark">Liên hệ với Siu Food</h2>
              
              <div className="info-item mb-4">
                <p className='text-muted small text-uppercase fw-bold mb-1'>Hotline & Zalo:</p>
                <a href="tel:0833358955" className="text-decoration-none">
                    <h3 className="fw-bold text-danger">0833358955</h3>
                </a>
              </div>

              <div className="info-item mb-4">
                <p className='text-muted small text-uppercase fw-bold mb-1'>Địa chỉ cửa hàng:</p>
                <p className="fs-5 fw-semibold">Số 41 Thái Hà, Trung Liệt, Đống Đa, Hà Nội</p>
              </div>

              <div className="info-item mb-4">
                <p className='text-muted small text-uppercase fw-bold mb-1'>Kết nối mạng xã hội:</p>
                <div className="d-flex flex-column gap-2">
                    <a 
                        href="https://www.facebook.com/ongucmanh.881723" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-none fw-bold"
                    >
                        <i className="bi bi-facebook me-2"></i>Facebook: Ông Đức Mạnh
                    </a>
                    <a 
                        href="https://zalo.me/0833358955" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-info text-decoration-none fw-bold"
                    >
                        <i className="bi bi-chat-dots me-2"></i>Zalo: 0833358955
                    </a>
                </div>
              </div>

              <div className="info-item">
                <p className='text-muted small text-uppercase fw-bold mb-1'>Giờ làm việc:</p>
                <p className="fw-medium">08:00 - 22:30 (Cả tuần)</p>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="map-wrapper shadow rounded-4 overflow-hidden border">
              {/* CẬP NHẬT: Nhúng bản đồ thật của Google Maps cho 41 Thái Hà */}
              <iframe 
                title="Bản đồ Siu Food 41 Thái Hà"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.476495201479!2d105.82035257596853!3d21.013611388301726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8295b922a9%3A0x6331904d603e9d8b!2zNDEgUC4gVGjDoGkgSMOgLCBUcnVuZyBMaeG7h3QsIMSQ4buRbmcgRGEsIEjDoCBO4buZaSwgVmnhuJETIE5hbQ!5e0!3m2!1svi!2s!4v1715500000000!5m2!1svi!2s" 
                width="100%" 
                height="500" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact;