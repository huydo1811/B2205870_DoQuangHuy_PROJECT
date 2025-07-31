<template>
  <main class="container my-5 animate-fadein">
    <div class="text-center mb-4">
      <span class="section-hero-icon mb-2">
        <i class="bi bi-clock-history"></i>
      </span>
      <h2 class="section-title">Lịch sử mượn sách</h2>
    </div>
    <div class="d-flex flex-wrap justify-content-center gap-2 mb-4">
      <button
        v-for="st in statusList"
        :key="st.value"
        class="btn btn-status"
        :class="{ active: filterStatus === st.value }"
        @click="filterStatus = st.value; currentPage = 1"
      >
        {{ st.label }}
      </button>
    </div>
    <transition-group name="fade-list" tag="div" class="row g-4">
      <div
        v-for="item in pagedHistory"
        :key="item.MaMuonSach"
        class="col-md-3 col-12"
      >
        <div class="card shadow-sm borrow-card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-book fs-2 text-info me-3"></i>
              <div>
                <div class="fw-bold fs-5 text-dark">{{ item.TenSach }}</div>
                <div class="small text-muted">Mã sách: {{ item.MaSach }}</div>
                <div class="small text-muted">Mã mượn: {{ item.MaMuonSach }}</div>
              </div>
            </div>
            <ul class="list-unstyled mb-3">
              <li>
                <i class="bi bi-calendar-check me-2"></i>
                <b>Ngày mượn: </b>
                {{ formatDate(item.NgayMuon) }}
              </li>
              <li>
                <i class="bi bi-calendar-x me-2"></i>
                <b>Ngày trả: </b>
                <span v-if="item.NgayTra">{{ formatDate(item.NgayTra) }}</span>
                <span v-else class="text-warning">Chưa trả</span>
              </li>
              <li>
                <i class="bi bi-info-circle me-2"></i>
                <b>Trạng thái: </b>
                <span :class="statusClass(item.TrangThai)">{{ item.TrangThai }}</span>
              </li>
              <li v-if="item.TrangThai === 'Đã trả' && item.TienPhat && item.TienPhat > 0">
                <i class="bi bi-cash-coin me-2"></i>
                <b>Tiền phạt: </b>
                <span class="text-danger fw-bold">{{ item.TienPhat.toLocaleString('vi-VN') }} đ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition-group>
    <div v-if="!loading && pagedHistory.length === 0" class="text-center text-danger mt-5 fs-5">
      <i class="bi bi-emoji-frown"></i> Không có lịch sử mượn sách
    </div>
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
    <!-- Pagination -->
    <nav v-if="!loading && totalPages > 1" class="d-flex justify-content-center mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">Trước</button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="currentPage = page">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">Sau</button>
        </li>
      </ul>
    </nav>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api.service';
import Swal from 'sweetalert2';

const history = ref([]);
const loading = ref(true);
const filterStatus = ref('Chờ duyệt');
const currentPage = ref(1);
const pageSize = 12;

const statusList = [
  { label: 'Chờ duyệt', value: 'Chờ duyệt' },
  { label: 'Đã duyệt', value: 'Đã duyệt' },
  { label: 'Đang mượn', value: 'Đang mượn' },
  { label: 'Đã trả', value: 'Đã trả' }
];

// Sắp xếp ưu tiên: Chờ duyệt > Đã duyệt > Đang mượn > Đã trả
const statusOrder = {
  'Chờ duyệt': 1,
  'Đã duyệt': 2,
  'Đang mượn': 3,
  'Đã trả': 4
};

const filteredHistory = computed(() =>
  history.value
    .filter(item => filterStatus.value === '' || item.TrangThai === filterStatus.value)
    .sort((a, b) => statusOrder[a.TrangThai] - statusOrder[b.TrangThai])
);

//pagination
const totalPages = computed(() => Math.ceil(filteredHistory.value.length / pageSize));

const pagedHistory = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredHistory.value.slice(start, start + pageSize);
});

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

function statusClass(status) {
  if (status === 'Đang mượn') return 'text-primary fw-bold';
  if (status === 'Chờ duyệt') return 'text-warning fw-bold';
  if (status === 'Đã duyệt') return 'text-info fw-bold';
  if (status === 'Đã trả') return 'text-success fw-bold';
  return 'text-secondary';
}

onMounted(async () => {
  try {
    const maDocGia = localStorage.getItem('maDocGia');
    if (!maDocGia) {
      await Swal.fire('Bạn cần đăng nhập để xem lịch sử!', '', 'warning');
      return;
    }
    const res = await api.get(`/api/theodoimuonsach/docgia/${maDocGia}`);
    history.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    Swal.fire('Lỗi', err?.response?.data?.message || 'Không thể tải lịch sử!', 'error');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.animate-fadein {
  animation: fadein 0.7s;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: none;}
}
.fade-list-enter-active, .fade-list-leave-active {
  transition: opacity 0.4s cubic-bezier(.4,2,.6,1), transform 0.4s cubic-bezier(.4,2,.6,1);
}
.fade-list-enter-from, .fade-list-leave-to {
  opacity: 0;
  transform: scale(0.98);
  position: absolute;
  width: 100%;
}
.fade-list-leave-active {
  position: absolute;
  width: 100%;
}
.borrow-card {
  border-radius: 18px;
  border: 1.5px solid #e7f5ff;
  transition: box-shadow 0.2s;
}
.borrow-card:hover {
  box-shadow: 0 8px 32px 0 #339af055;
  border-color: #339af0;
}
.section-hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 3.2rem;
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  color: #fff;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  box-shadow: 0 4px 16px 0 #339af055;
  margin-bottom: 0.5rem;
}
.section-title {
  font-weight: 700;
  font-size: 2.2rem;
  color: #339af0;
  margin-bottom: 0.2rem;
}
.btn-status {
  border: none;
  background: #e7f5ff;
  color: #339af0;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 20px;
  transition: background 0.2s, color 0.2s;
}
.btn-status.active,
.btn-status:hover {
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  color: #fff;
}
.pagination .page-link {
  color: #339af0;
  border-radius: 50% !important;
  margin: 0 2px;
}
.pagination .page-item.active .page-link,
.pagination .page-link:hover {
  background: #339af0;
  color: #fff;
  border-color: #339af0;
}
</style>