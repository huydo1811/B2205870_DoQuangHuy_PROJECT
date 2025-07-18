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
          <img :src="book.Img || defaultImg" class="card-img-top" :alt="book.TenSach" />
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
        <div class="modal-content p-4">
          <div class="modal-header">
            <h5 class="modal-title" id="bookModalLabel">{{ selectedBook?.TenSach }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
          </div>
          <div class="modal-body row">
            <div class="col-md-5 text-center mb-3">
              <img :src="selectedBook?.Img || defaultImg" alt="Ảnh sách" class="img-fluid rounded shadow-sm" style="max-height: 300px;" />
            </div>
            <div class="col-md-7">
              <p><strong>Tác giả:</strong> {{ selectedBook?.TacGia }}</p>
              <p><strong>Năm xuất bản:</strong> {{ selectedBook?.NamXuatBan }}</p>
              <p><strong>Số quyển còn:</strong> {{ selectedBook?.SoQuyen }}</p>
              <p><strong>Giá:</strong> {{ selectedBook?.DonGia?.toLocaleString() }}đ</p>
              <p><strong>Mã sách:</strong> {{ selectedBook?.MaSach }}</p>
              <p><strong>Tên nhà xuất bản:</strong> {{ getTenNXB(selectedBook?.MaNXB) }}</p>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button class="btn btn-success" @click="handleBorrow">
              <i class="bi bi-bookmark-plus-fill me-1"></i> Mượn sách
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api.service';
import Swal from 'sweetalert2';

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
    Swal.fire('Lỗi', err?.response?.data?.message || 'Mượn sách thất bại!', 'error');
  }
}

onMounted(async () => {
  try {
    const [resBooks, resNXB] = await Promise.all([
      api.get('/api/sach'),
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
});

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

// Khi bấm nút tìm, về trang 1
async function onSearch() {
  currentPage.value = 1;
  let url = '/api/sach';
  let params = [];

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
  onSearch();
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
  border-radius: 18px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.book-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 8px 32px rgba(0, 123, 255, 0.15);
}
.card-img-top {
  height: 220px;
  object-fit: cover;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}
.btn-gradient {
  background: linear-gradient(90deg, #339af0 0%, #74c0fc 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  padding: 8px 16px;
  transition: 0.3s ease;
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
