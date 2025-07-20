<template>
  <footer class="admin-footer text-center py-1">
    <span>© {{ new Date().getFullYear() }} Thư viện Ước mơ - Trang quản trị</span>
  </footer>
</template>

<style scoped>
.admin-footer {
  background: #f1f3f5;
  color: #1864ab;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 -2px 8px #339af022;
  border-radius: 0 0 18px 0;
  margin-top: 32px;
  font-size: 1.05rem;
  animation: fadein 0.7s;
  width: 100%;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: none;}
}
@media (max-width: 767.98px) {
  .admin-footer {
    font-size: 0.95rem;
    padding: 8px 0;
  }
}
</style>