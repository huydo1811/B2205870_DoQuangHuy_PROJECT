<template>
  <main class="container my-5 animate-fadein">
    <div class="text-center mb-4">
      <h2 class="home-title">Chào mừng đến với Thư viện Ước mơ!</h2>
      <p class="home-slogan">Khám phá tri thức, chạm tới ước mơ của bạn.</p>
      <p class="text-muted">Tìm kiếm và mượn sách một cách nhanh chóng và tiện lợi.</p>
    </div>
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card home-card h-100 shadow-sm">
          <img src="../../assets/imgs/photo-1512820790803-83ca734da794.avif" class="card-img-top" alt="Sách mới">
          <div class="card-body">
            <div class="card-header-row mb-2">
              <span class="card-icon"><i class="bi bi-book"></i></span>
              <h5 class="card-title ms-2 mb-0">Sách mới</h5>
            </div>
            <p class="card-text">Khám phá những đầu sách mới nhất được cập nhật hàng tuần.</p>
            <a href="#" class="btn btn-gradient">Xem thêm</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card home-card h-100 shadow-sm">
          <img src="../../assets/imgs/5_Return_Borrowed_Books_1200x834.webp" class="card-img-top" alt="Hướng dẫn mượn sách">
          <div class="card-body">
            <div class="card-header-row mb-2">
              <span class="card-icon"><i class="bi bi-journal-check"></i></span>
              <h5 class="card-title ms-2 mb-0">Hướng dẫn mượn sách</h5>
            </div>
            <p class="card-text">Tìm hiểu cách mượn sách, trả sách và theo dõi lịch sử mượn.</p>
            <router-link to="/guide" class="btn btn-gradient">Xem thêm</router-link>          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card home-card h-100 shadow-sm">
          <img src="../../assets/imgs/photo-1507842217343-583bb7270b66.avif" class="card-img-top" alt="Tủ sách yêu thích">
          <div class="card-body">
            <div class="card-header-row mb-2">
              <span class="card-icon"><i class="bi bi-bookshelf"></i></span>
              <h5 class="card-title ms-2 mb-0">Tủ sách của bạn</h5>
            </div>
            <p class="card-text">Xem danh sách sách bạn đã mượn, đang mượn được hiển thị chi tiết.</p>
            <a href="#" class="btn btn-gradient">Truy cập</a>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-fadein {
  animation: fadeInUp 0.6s ease-in-out;
}
@keyframes fadeInUp {
  0% { transform: translateY(40px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.home-title {
  font-weight: 700;
  font-size: 2.2rem;
  color: #339af0;
  margin-bottom: 0.5rem;
}
.home-slogan {
  font-size: 1.15rem;
  color: #3890d4;
  margin-bottom: 0.5rem;
}
.home-card {
  border-radius: 18px;
  transition: transform 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 16px 0 #a5d8ff33;
  overflow: hidden;
}
.home-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 8px 32px 0 #339af055;
}
.card-img-top {
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  height: 220px; /* Ảnh to hơn */
  object-fit: cover;
}
.card-header-row {
  display: flex;
  align-items: center;
}
.card-icon {
  font-size: 2.1rem;
  color: #339af0;
  display: flex;
  align-items: center;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 0;
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
</style>
