<template>
  <main class="admin-dashboard animate-fadein">
    <h2 class="fw-bold mb-4 text-primary">
      <i class="bi bi-speedometer2 me-2"></i>Trang quản trị thư viện
    </h2>
    <div class="row g-4">
      <div class="col-md-6 col-xl-3" v-for="item in stats" :key="item.label">
        <div class="dashboard-card shadow-sm animate-pop">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-box" :style="{ backgroundColor: item.bg }">
              <i :class="item.icon"></i>
            </div>
            <div>
              <h5 class="mb-0 fw-bold">{{ item.value }}</h5>
              <small class="text-muted">{{ item.label }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <h5 class="fw-semibold mb-3">📅 Hoạt động gần đây</h5>
      <ul class="list-group">
        <li v-for="(log, i) in recentActivities" :key="i" class="list-group-item d-flex justify-content-between align-items-center">
          <span><i class="bi bi-clock me-2 text-primary"></i>{{ log }}</span>
          <span class="badge bg-light text-secondary">Hôm nay</span>
        </li>
      </ul>
    </div>
  </main>
</template>

<script setup>
const stats = [
  {
    label: 'Tổng số sách',
    value: 180,
    icon: 'bi bi-journal-richtext text-white fs-4',
    bg: '#339af0'
  },
  {
    label: 'Tổng độc giả',
    value: 120,
    icon: 'bi bi-person-lines-fill text-white fs-4',
    bg: '#51cf66'
  },
  {
    label: 'Lượt mượn hôm nay',
    value: 12,
    icon: 'bi bi-arrow-left-right text-white fs-4',
    bg: '#fcc419'
  },
  {
    label: 'Nhân viên hệ thống',
    value: 3,
    icon: 'bi bi-person-badge text-white fs-4',
    bg: '#845ef7'
  }
];

const recentActivities = [
  'Độc giả Nguyễn Văn A mượn sách "Conan – Tập 1"',
  'Độc giả Trần Thị B trả sách "Doraemon – Tập 5"',
  'Nhân viên thêm sách mới "One Piece – Tập 10"'
];
</script>

<style scoped>
.animate-fadein {
  animation: fadeInUp 0.5s ease;
}
@keyframes fadeInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.dashboard-card {
  border-radius: 18px;
  transition: 0.3s;
  background: #fff;
  border: 1.5px solid #e7f5ff;
  box-shadow: 0 8px 32px 0 #339af055;
  padding: 24px 18px;
  min-width: 0;
}
.dashboard-card:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 16px 48px 0 #339af055;
}
.icon-box {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
@media (max-width: 767.98px) {
  .dashboard-card {
    padding: 16px 8px;
    margin-bottom: 12px;
  }
  .icon-box {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
  .admin-dashboard {
    padding: 0 2px;
  }
}
.list-group-item {
  border: none;
  padding: 12px 16px;
  transition: background 0.3s;
}
.list-group-item:hover {
  background: #f8f9fa;
}
</style>