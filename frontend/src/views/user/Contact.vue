<template>
  <main class="contact-container container my-5 animate-fadein">
    <div class="text-center mb-5">
      <div class="contact-hero-icon mb-3">
        <span>📬</span>
      </div>
      <h2 class="contact-title">Liên hệ với Thư viện Ước mơ</h2>
      <p class="contact-slogan">Chúng tôi luôn sẵn sàng hỗ trợ bạn!</p>
    </div>
    <div class="row g-4 align-items-stretch">
      <!-- Card Thông tin liên hệ -->
      <div class="col-md-6">
        <div class="contact-card shadow-lg p-4 rounded-4 bg-white h-100">
          <div class="d-flex align-items-center mb-3">
            <span class="contact-card-icon me-2">🏢</span>
            <h5 class="mb-0">Thông tin liên hệ</h5>
          </div>
          <ul class="list-unstyled mb-4">
            <li class="mb-2"><i class="bi bi-geo-alt-fill text-primary me-2"></i><strong>Địa chỉ:</strong> P.Ninh Kiều, TP.Cần Thơ</li>
            <li class="mb-2"><i class="bi bi-envelope-fill text-danger me-2"></i><strong>Email: </strong>
              <a :href="'mailto:' + email" class="link-primary">{{ email }}</a>
            </li>
            <li><i class="bi bi-telephone-fill text-success me-2"></i><strong>SĐT: </strong>
              <a :href="'tel:' + phone" class="link-success">{{ phone }}</a>
            </li>
          </ul>
          <a :href="'mailto:' + email" class="btn btn-gradient w-100 mb-2">
            <i class="bi bi-envelope-paper-heart me-1"></i> Gửi Email
          </a>
          <a :href="'tel:' + phone" class="btn btn-outline-primary w-100">
            <i class="bi bi-telephone me-1"></i> Gọi ngay
          </a>
        </div>
      </div>
      <!-- Card FAQ -->
      <div class="col-md-6">
        <div class="contact-card shadow-lg p-4 rounded-4 bg-white h-100">
          <div class="d-flex align-items-center mb-3">
            <span class="contact-card-icon me-2">❓</span>
            <h5 class="mb-0">Câu hỏi thường gặp</h5>
          </div>
          <div class="accordion faq shadow bg-white rounded" id="faqAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  📘 Làm sao để mượn sách?
                </button>
              </h2>
              <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div class="accordion-body">Đăng nhập->chọn "Danh mục sách"->chọn sách->nhấn "Mượn". Sau đó, đến thư viện và nhận sách.</div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  📙 Làm sao trả sách?
                </button>
              </h2>
              <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div class="accordion-body">Đến trực tiếp thư viện để trả sách, trạng thái sẽ được cập nhật trong lịch sử mượn sách.</div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  ❓ Tôi quên muốn đổi mật khẩu thì sao?
                </button>
              </h2>
              <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div class="accordion-body">Nhấn "Đổi mật khẩu" ở trang "Tài khoản".</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
const email = "dqh@gmail.com";
const phone = "0123456789";
</script>

<style scoped>
.contact-hero-icon {
  font-size: 3.5rem;
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 16px 0 #339af055;
}
.contact-title {
  font-weight: 700;
  color: #339af0;
  font-size: 2.2rem;
}
.contact-slogan {
  color: #3890d4;
  font-size: 1.1rem;
}
.contact-card {
  border: 1.5px solid #e7f5ff;
  border-radius: 18px;
  transition: box-shadow 0.18s, transform 0.18s;
  background: #fff;
}
.contact-card:hover {
  box-shadow: 0 8px 32px 0 #339af055;
  transform: translateY(-4px) scale(1.02);
}
.contact-card-icon {
  font-size: 2rem;
}
.faq-list {
  padding-left: 0;
  list-style: none;
}
.faq-list li {
  margin-bottom: 1.1rem;
  background: #f1f8fe;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px 0 #a5d8ff22;
}
.contact-img {
  border-radius: 18px;
  max-width: 100%;
  height: auto;
  box-shadow: 0 4px 16px rgba(163, 212, 255, 0.2);
  margin-top: 1.5rem;
}
@keyframes fadeInUp {
  0% { transform: translateY(40px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.animate-fadein {
  animation: fadeInUp 0.6s ease-in-out;
}
.btn-gradient {
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  padding: 8px 22px;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px 0 #a5d8ff55;
}
.btn-gradient:hover {
  background: linear-gradient(90deg, #74c0fc 0%, #339af0 100%);
  color: #fff;
  box-shadow: 0 4px 16px 0 #339af055;
}
.accordion-button {
  background-color: #f1f9ff;
  font-weight: 600;
  color: #339af0;
}
.accordion-button:not(.collapsed) {
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  color: #fff;
}
.accordion-item {
  border-radius: 12px;
  margin-bottom: 10px;
  overflow: hidden;
}
</style>