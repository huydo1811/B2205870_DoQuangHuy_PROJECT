<template>
  <main class="container my-3 animate-fadein">
    <h2 class="fw-bold mb-4 text-primary">
      <i class="bi bi-clock-history me-2"></i> Quản lý phiếu mượn sách
    </h2>
    <div class="row mb-3">
      <div class="col-md-4">
        <select v-model="filterStatus" class="form-select" @change="fetchBorrows">
          <option value="">Tất cả trạng thái</option>
          <option v-for="st in statusList" :key="st" :value="st">{{ st }}</option>
        </select>
      </div>
      <div class="col-md-4">
        <input v-model="search" class="form-control" placeholder="Tìm mã mượn, mã độc giả, tên sách..." @input="onSearch" />
      </div>
      <div class="col-md-4 text-end">
        <span class="badge bg-light text-dark border" style="font-size:1rem;">
          <i class="bi bi-clipboard-data me-1 text-primary"></i>
          {{ totalBorrows }} phiếu mượn
        </span>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-12 d-flex flex-wrap gap-2">
        <span class="badge bg-warning text-dark">
          <i class="bi bi-hourglass-split me-1"></i>
          Chờ duyệt: {{ borrowStats['Chờ duyệt'] }}
        </span>
        <span class="badge bg-info text-dark">
          <i class="bi bi-check2-square me-1"></i>
          Đã duyệt: {{ borrowStats['Đã duyệt'] }}
        </span>
        <span class="badge bg-primary">
          <i class="bi bi-book-half me-1"></i>
          Đang mượn: {{ borrowStats['Đang mượn'] }}
        </span>
        <span class="badge bg-success">
          <i class="bi bi-check-circle me-1"></i>
          Đã trả: {{ borrowStats['Đã trả'] }}
        </span>
      </div>
    </div>
    <button class="btn btn-warning btn-sm mb-2"
        @click="cancelExpiredApprovals">
        Hủy các phiếu 'Đã duyệt' quá hạn 3 ngày
    </button>
    <div v-if="message" class="alert" :class="success ? 'alert-success' : 'alert-danger'">{{ message }}</div>
    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-primary">
          <tr>
            <th style="min-width:110px;">Mã mượn</th>
            <th style="min-width:140px;">Độc giả</th>
            <th style="min-width:140px;">Tên sách</th>
            <th style="min-width:100px;">Ngày mượn</th>
            <th style="min-width:120px;">Ngày trả</th>
            <th style="min-width:110px;">Trạng thái</th>
            <th style="min-width:100px;">Tiền phạt</th>
            <th class="text-center" style="width:120px;">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pagedBorrows" :key="item.MaMuonSach" class="fadein-row">
            <td>{{ item.MaMuonSach }}</td>
            <td>{{ item.MaDocGia }}</td>
            <td>{{ item.TenSach}}</td>
            <td>{{ formatDate(item.NgayMuon) }}</td>
            <td>
              <span v-if="item.NgayTra">{{ formatDate(item.NgayTra) }}</span>
              <span v-else class="text-warning">Chưa trả</span>
            </td>
            <td>
              <span :class="statusClass(item.TrangThai)">{{ item.TrangThai }}</span>
            </td>
            <td>
              <span v-if="item.TienPhat && item.TienPhat > 0" class="text-danger fw-bold">
                {{ item.TienPhat.toLocaleString('vi-VN') }} đ
              </span>
              <span v-else>-</span>
            </td>
            <td class="text-center">
              <button
                v-if="item.TrangThai === 'Chờ duyệt'"
                class="btn btn-sm btn-info me-1"
                @click="updateStatus(item, 'Đã duyệt')"
              >Duyệt</button>
              <button
                v-if="item.TrangThai === 'Đã duyệt'"
                class="btn btn-sm btn-primary me-1"
                @click="updateStatus(item, 'Đang mượn')"
              >Xác nhận lấy</button>
              <button
                v-if="item.TrangThai === 'Đang mượn'"
                class="btn btn-sm btn-success me-1"
                @click="updateStatus(item, 'Đã trả')"
              >Xác nhận trả</button>
              <button
                v-if="item.TrangThai === 'Đã trả'"
                class="btn btn-sm btn-danger"
                @click="deleteBorrow(item)"
              >
                Xóa
              </button>
            </td>
          </tr>
          <tr v-if="pagedBorrows.length === 0">
            <td colspan="8" class="text-center text-muted py-4">Không có phiếu mượn nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="mt-3">
      <ul class="pagination justify-content-center mb-0">
        <li class="page-item" :class="{disabled: page===1}">
          <button class="page-link" @click="changePage(page-1)">Trước</button>
        </li>
        <li class="page-item" v-for="p in totalPages" :key="p" :class="{active: page===p}">
          <button class="page-link" @click="changePage(p)">{{ p }}</button>
        </li>
        <li class="page-item" :class="{disabled: page===totalPages}">
          <button class="page-link" @click="changePage(page+1)">Sau</button>
        </li>
      </ul>
    </nav>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api.service';
import Swal from 'sweetalert2';

const borrows = ref([]);
const page = ref(1);
const pageSize = 10;
const totalBorrows = ref(0);
const filterStatus = ref('');
const message = ref('');
const success = ref(true);
const search = ref('');

const statusList = ['Chờ duyệt', 'Đã duyệt', 'Đang mượn', 'Đã trả'];

const statusOrder = {
  'Chờ duyệt': 0,
  'Đã duyệt': 1,
  'Đang mượn': 2,
  'Đã trả': 3
};

const filteredBorrows = computed(() => {
  let arr = borrows.value.filter(item => {
    // Lọc trạng thái
    if (filterStatus.value && item.TrangThai !== filterStatus.value) return false;
    // Lọc search
    const q = search.value.trim().toLowerCase();
    if (!q) return true;
    return (
      (item.MaMuonSach && item.MaMuonSach.toLowerCase().includes(q)) ||
      (item.MaDocGia && item.MaDocGia.toLowerCase().includes(q)) ||
      (item.TenSach && item.TenSach.toLowerCase().includes(q))
    );
  });
  // Sắp xếp theo thứ tự trạng thái
  return arr.sort((a, b) => {
    return statusOrder[a.TrangThai] - statusOrder[b.TrangThai];
  });
});

const totalPages = computed(() => Math.ceil(filteredBorrows.value.length / pageSize));
const pagedBorrows = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredBorrows.value.slice(start, start + pageSize);
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

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  page.value = newPage;
}

async function fetchBorrows() {
  try {
    const res = await api.get('/api/theodoimuonsach');
    borrows.value = Array.isArray(res.data) ? res.data : [];
    totalBorrows.value = borrows.value.length;
  } catch (err) {
    borrows.value = [];
    message.value = 'Không thể tải danh sách!';
    success.value = false;
    setTimeout(() => message.value = '', 2500);
  }
}

async function updateStatus(item, newStatus) {
  const msg = {
    'Đã duyệt': 'Bạn có chắc muốn duyệt phiếu này?',
    'Đang mượn': 'Xác nhận độc giả đã lấy sách?',
    'Đã trả': 'Xác nhận độc giả đã trả sách?'
  };
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: msg[newStatus] || 'Xác nhận thao tác?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Hủy'
  });
  if (!result.isConfirmed) return;
  try {
    await api.put(`/api/theodoimuonsach/${item.MaMuonSach}`, {
      TrangThai: newStatus,
      NgayTra: newStatus === 'Đã trả' ? new Date() : item.NgayTra
    });
    message.value = `Đã cập nhật trạng thái: ${newStatus}`;
    success.value = true;
    await fetchBorrows();
    setTimeout(() => {
      message.value = '';
    }, 2500);
  } catch (err) {
    message.value = err.response?.data?.message || 'Lỗi cập nhật!';
    success.value = false;
    setTimeout(() => message.value = '', 2500);
  }
}

function onSearch() {
  page.value = 1;
}

const borrowStats = ref({
  'Chờ duyệt': 0,
  'Đã duyệt': 0,
  'Đang mượn': 0,
  'Đã trả': 0
});

async function fetchBorrowStats() {
  try {
    const res = await api.get('/api/theodoimuonsach/status-stats');
    borrowStats.value = res.data;
  } catch {
    borrowStats.value = {
      'Chờ duyệt': 0,
      'Đã duyệt': 0,
      'Đang mượn': 0,
      'Đã trả': 0
    };
  }
}

async function deleteBorrow(item) {
  const result = await Swal.fire({
    title: 'Xác nhận xóa',
    text: `Bạn có chắc muốn xóa phiếu mượn ${item.MaMuonSach}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  });
  if (!result.isConfirmed) return;
  try {
    await api.delete(`/api/theodoimuonsach/${item.MaMuonSach}`);
    message.value = 'Đã xóa phiếu mượn';
    success.value = true;
    await fetchBorrows();
    setTimeout(() => message.value = '', 2500);
  } catch (err) {
    message.value = err.response?.data?.message || 'Lỗi xóa phiếu mượn!';
    success.value = false;
    setTimeout(() => message.value = '', 2500);
  }
}

async function cancelExpiredApprovals() {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn có chắc muốn hủy các phiếu duyệt quá hạn 3 ngày?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Hủy'
  });
  if (!result.isConfirmed) return;
  try {
    const res = await api.post('/api/theodoimuonsach/cancel-expired-approvals');
    message.value = res.data.message + ` (${res.data.modified} phiếu)`;
    success.value = true;
    await fetchBorrows();
    await fetchBorrowStats();
    setTimeout(() => message.value = '', 2500);
  } catch (err) {
    message.value = err.response?.data?.message || 'Lỗi!';
    success.value = false;
    setTimeout(() => message.value = '', 2500);
  }
}

onMounted(() => {
  fetchBorrows();
  fetchBorrowStats();
});
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}
.table-primary {
  background: #e3f0ff;
}
.table-hover tbody tr:hover {
  background: #f2f2f2 !important;
  transition: background 0.2s;
}
.text-center {
  text-align: center !important;
}
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
.fadein-row {
  animation: fadeInRow 0.5s;
}
@keyframes fadeInRow {
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>