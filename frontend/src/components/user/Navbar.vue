<template>
  <nav class="custom-navbar navbar navbar-expand-lg bg-white shadow-sm">
    <div class="container justify-content-center">
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item"><a class="nav-link fs-5" href="#">Danh mục sách</a></li>
          <li class="nav-item"><a class="nav-link fs-5" href="#">Lịch sử mượn sách</a></li>
          <li class="nav-item"><a class="nav-link fs-5" href="#">Liên hệ</a></li>
          <li class="nav-item"><a class="nav-link fs-5" href="#">Tài khoản</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.custom-navbar {
  background: #fff;
  border-bottom: 1.5px solid #e7f5ff;
  border-radius: 0 0 18px 18px;
  box-shadow: 0 2px 12px 0 #a5d8ff33;
}
.navbar-nav {
  display: flex;
  justify-content: center;
  width: 100%;
}
.navbar-nav .nav-link {
  color: #339af0;
  font-weight: 500;
  transition: color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.18s;
  border-radius: 10px;
  padding: 10px 20px;
  margin: 0 8px;
}
.navbar-nav .nav-link:hover, .navbar-nav .nav-link:focus {
  color: #fff;
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  box-shadow: 0 4px 16px 0 #339af055;
  transform: translateY(-2px) scale(1.05);
  text-decoration: none;
}
</style>