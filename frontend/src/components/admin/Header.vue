<template>
  <header class="admin-header shadow-sm">
    <div class="d-flex align-items-center justify-content-between h-100 px-4">
      <div class="d-flex align-items-center gap-2">
        <img class="admin-logo" src="/favicon.svg" alt="Logo" />
        <span class="admin-title fs-2">Quản trị Thư viện Ước mơ</span>
      </div>
      <div class="d-flex align-items-center gap-3">
        <span class="admin-user">
          <i class="bi bi-person-circle me-1"></i> Admin
        </span>
        <button class="btn btn-gradient">
          <i class="bi bi-box-arrow-right"></i> Đăng xuất
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.admin-header {
  height: 56px;
  background: #fff;
  color: #1864ab;
  box-shadow: 0 2px 12px #1864ab22;
  position: sticky;
  top: 0;
  z-index: 1001;
  border-bottom: 2px solid #e7f5ff;
}
.admin-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 8px #339af055;
  margin-right: 8px;
  letter-spacing: 1px;
}
.admin-title {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #1864ab;
}
.admin-user {
  font-weight: 500;
  font-size: 1.08rem;
  color: #1864ab;
}
.btn-gradient {
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 20px;
  padding: 7px 20px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px #339af033;
}
.btn-gradient:hover {
  background: #1864ab;
  color: #fff;
  box-shadow: 0 4px 16px #339af055;
}
</style>