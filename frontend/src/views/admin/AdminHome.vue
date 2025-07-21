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
    <div class="row mt-5">
      <div class="col-md-6 mb-4">
        <h5 class="fw-semibold mb-3">📊 Lượt mượn theo ngày</h5>
        <canvas id="borrowByDayChart"></canvas>
      </div>
      <div class="col-md-6 mb-4">
        <h5 class="fw-semibold mb-3">📚 Top 5 sách được mượn nhiều nhất</h5>
        <canvas id="topBooksChart"></canvas>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api.service';
import Chart from 'chart.js/auto';

const stats = ref([
  {
    label: 'Tổng số sách',
    value: 0,
    icon: 'bi bi-journal-richtext text-white fs-4',
    bg: '#339af0'
  },
  {
    label: 'Tổng độc giả',
    value: 0,
    icon: 'bi bi-person-lines-fill text-white fs-4',
    bg: '#51cf66'
  },
  {
    label: 'Lượt mượn hôm nay',
    value: 0,
    icon: 'bi bi-arrow-left-right text-white fs-4',
    bg: '#fcc419'
  },
  {
    label: 'Nhân viên hệ thống',
    value: 0,
    icon: 'bi bi-person-badge text-white fs-4',
    bg: '#845ef7'
  }
]);

const recentActivities = ref([]);

onMounted(async () => {
  try {
    const sach = await api.get('/api/sach/count');
    stats.value[0].value = sach.data.count;

    const docgia = await api.get('/api/docgia/count');
    stats.value[1].value = docgia.data.count;

    const muon = await api.get('/api/theodoimuonsach/count-borrow-today');
    stats.value[2].value = muon.data.count;

    const nhanvien = await api.get('/api/nhanvien/count');
    stats.value[3].value = nhanvien.data.count;



    // Lượt mượn theo ngày
    const borrowRes = await api.get('/api/theodoimuonsach/borrow-stats?days=7').catch(() => ({ data: [] }));
    const borrowLabels = borrowRes.data.map(item => item.date); 
    const borrowData = borrowRes.data.map(item => item.count);
    new Chart(document.getElementById('borrowByDayChart'), {
      type: 'bar',
      data: {
        labels: borrowLabels,
        datasets: [{
          label: 'Lượt mượn',
          data: borrowData,
          backgroundColor: '#339af0'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0 // Đảm bảo chỉ hiện số nguyên
            }
          }
        }
      }
    });

    // Top 5 sách được mượn nhiều nhất
    const topBooksRes = await api.get('/api/theodoimuonsach/top-books?limit=5').catch(() => ({ data: [] }));
    const topBooksLabels = topBooksRes.data.map(item => item.TenSach || item.MaSach);
    const topBooksData = topBooksRes.data.map(item => item.count);
    const topBooksColors = ['#51cf66', '#339af0', '#fcc419', '#845ef7', '#ff6f91'];
    new Chart(document.getElementById('topBooksChart'), {
      type: 'bar',
      data: {
        labels: topBooksLabels,
        datasets: [{
          label: 'Số lượt mượn',
          data: topBooksData,
          backgroundColor: topBooksColors
        }]
      },

      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0 // Đảm bảo chỉ hiện số nguyên
            }
          }
        }
      }
    });

  } catch (err) {
  }
});
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