<template>
  <main class="container my-5 animate-fadein">
    <div class="text-center mb-4">
      <span class="section-hero-icon mb-2">
        <i class="bi bi-journal-bookmark-fill"></i>
      </span>
      <h2 class="section-title">Danh mục Sách</h2>
      <p class="text-muted">Khám phá những cuốn sách nổi bật của thư viện</p>
    </div>

    <!-- Bộ lọc -->
    <form class="row g-3 mb-4" @submit.prevent="onSearch">
      <div class="col-md-4">
        <input v-model="filter.TenSach" class="form-control" placeholder="Tìm theo tên sách..." />
      </div>
      <div class="col-md-4">
        <input v-model="filter.TacGia" class="form-control" placeholder="Tìm theo tác giả..." />
      </div>
      <div class="col-md-3">
        <select v-model="filter.MaNXB" class="form-select">
          <option value="">Tất cả NXB</option>
          <option v-for="nxb in nxbs" :key="nxb.MaNXB" :value="nxb.MaNXB">{{ nxb.TenNXB }}</option>
        </select>
      </div>
      <div class="col-md-1 d-flex align-items-end gap-1">
        <button class="btn btn-outline-primary" type="submit" title="Tìm kiếm">
          <i class="bi bi-search"></i>
        </button>
        <button class="btn btn-outline-danger" type="button" title="Xóa lọc" @click="clearFilter">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </form>

    <div v-if="pagedBooks.length === 0" class="text-center text-danger my-5 fs-5">
      <i class="bi bi-emoji-frown"></i> Không tìm thấy sách phù hợp
    </div>

    <div class="row g-4" v-else>
      <div class="col-md-4 col-sm-6" v-for="book in pagedBooks" :key="book.MaSach">
        <div class="card book-card h-100 shadow-sm">
          <img :src="getImgUrl(book.Img)" class="card-img-top" :alt="book.TenSach" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary">
              <i class="bi bi-book-half me-1"></i>{{ book.TenSach }}
            </h5>
            <p class="card-text text-muted mb-1"><strong><i class="bi bi-person"></i> Tác giả:</strong> {{ book.TacGia }}</p>
            <p class="card-text text-muted mb-1"><strong><i class="bi bi-collection"></i> Số quyển:</strong> {{ book.SoQuyen }}</p>
            <button class="btn btn-gradient w-100 mt-auto"
              @click="openModal(book)" data-bs-toggle="modal" data-bs-target="#bookModal">
              <i class="bi bi-eye"></i> Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <nav class="mt-4 d-flex justify-content-center" v-if="totalPages > 1">
      <ul class="pagination">
        <li class="page-item" :class="{disabled: currentPage === 1}">
          <button class="page-link" @click="gotoPage(currentPage - 1)">Trước</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{active: currentPage === page}">
          <button class="page-link" @click="gotoPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{disabled: currentPage === totalPages}">
          <button class="page-link" @click="gotoPage(currentPage + 1)">Sau</button>
        </li>
      </ul>
    </nav>

    <!-- Modal chi tiết sách -->
    <div class="modal fade" id="bookModal" tabindex="-1" aria-labelledby="bookModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content book-modal-content p-0 overflow-hidden">
          <div class="row g-0">
            <div class="col-md-5 d-flex align-items-center justify-content-center bg-gradient-book p-4">
              <img :src="getImgUrl(selectedBook?.Img)" alt="Ảnh sách" class="img-fluid rounded-4 shadow-lg book-modal-img" />
            </div>
            <div class="col-md-7 p-4">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-book-half fs-2 text-primary me-2"></i>
                <h4 class="modal-title fw-bold mb-0" id="bookModalLabel">{{ selectedBook?.TenSach }}</h4>
              </div>
              <div class="mb-2">
                <span class="badge bg-info text-dark me-2 mb-1"><i class="bi bi-person"></i> {{ selectedBook?.TacGia }}</span>
                <span class="badge bg-secondary me-2 mb-1"><i class="bi bi-calendar"></i> {{ selectedBook?.NamXuatBan }}</span>
                <span class="badge bg-success mb-1"><i class="bi bi-collection"></i> Số quyển: {{ selectedBook?.SoQuyen }}</span>
              </div>
              <ul class="list-unstyled mb-3">
                <li class="mb-1"><i class="bi bi-cash-coin me-2 text-warning"></i> <b>Giá:</b> <span class="text-danger fw-bold">{{ selectedBook?.DonGia?.toLocaleString() }} đ</span></li>
                <li class="mb-1"><i class="bi bi-upc-scan me-2"></i> <b>Mã sách:</b> {{ selectedBook?.MaSach }}</li>
                <li class="mb-1"><i class="bi bi-building me-2"></i> <b>Nhà xuất bản:</b> {{ getTenNXB(selectedBook?.MaNXB) }}</li>
              </ul>
              <div class="d-flex justify-content-between align-items-center mt-4">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                  <i class="bi bi-x-lg"></i> Đóng
                </button>
                <button class="btn btn-gradient px-4 py-2 fs-6" @click="handleBorrow">
                  <i class="bi bi-bookmark-plus-fill me-1"></i> Mượn sách
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../services/api.service';
import Swal from 'sweetalert2';

const route = useRoute();

const books = ref([]);
const nxbs = ref([]);
const selectedBook = ref(null);
const defaultImg = 'https://cdn-icons-png.flaticon.com/512/29/29302.png';

const filter = ref({
  TenSach: '',
  TacGia: '',
  MaNXB: ''
});

const currentPage = ref(1);
const pageSize = 9;

function openModal(book) {
  selectedBook.value = book;
}

const maDocGia = localStorage.getItem('maDocGia');
async function handleBorrow() {
  if (!selectedBook.value) return;
  if (!maDocGia) {
    Swal.fire('Bạn cần đăng nhập để mượn sách!', '', 'warning');
    return;
  }
  const result = await Swal.fire({
    title: 'Xác nhận mượn sách?',
    text: `Bạn muốn gửi yêu cầu mượn sách "${selectedBook.value.TenSach}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Hủy'
  });
  if (!result.isConfirmed) return;

  try {
    const payload = {
      MaDocGia: maDocGia,
      MaSach: selectedBook.value.MaSach,
      TrangThai: "Chờ duyệt"
    };
    await api.post('/api/theodoimuonsach', payload);
    Swal.fire('Thành công!', 'Đã gửi yêu cầu mượn sách! Vui lòng chờ duyệt.', 'success');
    // Đóng modal nếu muốn
    const modal = window.bootstrap?.Modal.getOrCreateInstance(document.getElementById('bookModal'));
    modal && modal.hide();
  } catch (err) {
    Swal.fire('Thông báo', err?.response?.data?.message || 'Mượn sách thất bại!', 'error');
  }
}

onMounted(async () => {
  try {
    const [resBooks, resNXB] = await Promise.all([
      api.get('/api/sach/all'),
      api.get('/api/nhaxuatban')
    ]);
    books.value = resBooks.data.map(book => ({
      ...book,
      DonGia: Number(book.DonGia)
    }));
    nxbs.value = resNXB.data;
  } catch (err) {
    books.value = [];
    nxbs.value = [];
  }

  if (route.query.TenSach) {
    filter.value.TenSach = route.query.TenSach;
    await onSearch();
  }
});

watch(
  () => route.query.TenSach,
  (newVal) => {
    filter.value.TenSach = newVal || '';
    if (newVal) {
      onSearch();
    }
  }
);

// Hàm lấy tên NXB theo MaNXB
function getTenNXB(maNXB) {
  const nxb = nxbs.value.find(n => n.MaNXB === maNXB);
  return nxb ? nxb.TenNXB : '';
}

// Lọc sách theo filter
const filteredBooks = computed(() => {
  return books.value.filter(book =>
    (!filter.value.TenSach || (book.TenSach && book.TenSach.toLowerCase().includes(filter.value.TenSach.toLowerCase()))) &&
    (!filter.value.TacGia || (book.TacGia && book.TacGia.toLowerCase().includes(filter.value.TacGia.toLowerCase()))) &&
    (!filter.value.MaNXB || book.MaNXB === filter.value.MaNXB)
  );
});

// Phân trang
const totalPages = computed(() => Math.ceil(filteredBooks.value.length / pageSize));
const pagedBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredBooks.value.slice(start, start + pageSize);
});

function gotoPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

async function onSearch() {
  currentPage.value = 1;
  if (!filter.value.TenSach && !filter.value.TacGia && !filter.value.MaNXB) {
    const res = await api.get('/api/sach/all');
    books.value = res.data.map(book => ({
      ...book,
      DonGia: Number(book.DonGia)
    }));
    return;
  }
  let url = '/api/sach';
  if (filter.value.TenSach) {
    url = `/api/sach/tensach/${encodeURIComponent(filter.value.TenSach)}`;
  } else if (filter.value.TacGia) {
    url = `/api/sach/tacgia/${encodeURIComponent(filter.value.TacGia)}`;
  } else if (filter.value.MaNXB) {
    url = `/api/sach/nxb/${encodeURIComponent(filter.value.MaNXB)}`;
  }

  try {
    const res = await api.get(url);
    books.value = Array.isArray(res.data) ? res.data : [res.data];
  } catch (err) {
    books.value = [];
  }
}

// Hàm xóa lọc
function clearFilter() {
  filter.value = { TenSach: '', TacGia: '', MaNXB: '' };
  currentPage.value = 1;
  api.get('/api/sach/all').then(res => {
    books.value = res.data.map(book => ({
      ...book,
      DonGia: Number(book.DonGia)
    }));
  });
}

function getImgUrl(img) {
  if (!img) return defaultImg;
  if (img.startsWith('http')) return img;
  return `http://localhost:3000${img}`;
}
</script>

<style scoped>
.animate-fadein {
  animation: fadeInUp 0.6s ease-in-out;
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
.books-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #339af0;
}
.book-card {
  min-height: 520px;
  border-radius: 18px;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.book-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 8px 32px rgba(0, 123, 255, 0.15);
}
.card-img-top {
  width: 100%;
  height: 520px;         
  object-fit: cover;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  display: block;
}
.book-modal-content {
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 #339af055;
  border: none;
  background: #fff;
}
.bg-gradient-book {
  background: linear-gradient(135deg, #e3f2fd 0%, #b6e0fe 100%);
  min-height: 340px;
}
.book-modal-img {
  max-height: 300px;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 #339af055;
  background: #fff;
  padding: 8px;
}
.badge {
  font-size: 1rem;
  padding: 0.5em 0.9em;
  border-radius: 12px;
}
.btn-gradient {
  background: linear-gradient(90deg, #339af0 0%, #74c0fc 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
}
.btn-gradient:hover {
  background: linear-gradient(90deg, #74c0fc 0%, #339af0 100%);
  box-shadow: 0 4px 16px rgba(51, 154, 240, 0.4);
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
</style>
