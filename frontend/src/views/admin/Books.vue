<!-- filepath: c:\Tài liệu đại học\CT449\Project\frontend\src\views\admin\Books.vue -->
<template>
  <main class="container my-4 animate-fadein">
    <h2 class="fw-bold mb-4 text-primary">
      <i class="bi bi-journal-bookmark-fill me-2"></i> Quản lý Sách
    </h2>
    <div class="row mb-3">
      <div class="col-md-4">
        <input v-model="search" class="form-control" placeholder="Tìm theo tên sách, tác giả..." @keyup.enter="fetchBooks" />
      </div>
      <div class="col-md-4">
        <select v-model="selectedNXB" class="form-select" @change="fetchBooks">
          <option value="">Tất cả NXB</option>
          <option v-for="nxb in nxbs" :key="nxb.MaNXB" :value="nxb.MaNXB">{{ nxb.TenNXB }}</option>
        </select>
      </div>
      <div class="col-md-4 text-end">
        <button class="btn btn-success" @click="openAdd">
          <i class="bi bi-plus-circle me-1"></i> Thêm sách
        </button>
      </div>
    </div>
    <div v-if="message" class="alert" :class="success ? 'alert-success' : 'alert-danger'">{{ message }}</div>
    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle shadow rounded">
        <thead class="table-primary">
          <tr>
            <th>Ảnh</th>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>NXB</th>
            <th>Năm XB</th>
            <th>Số quyển</th>
            <th>Giá</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.MaSach">
            <td>
              <img :src="getImgUrl(book.Img)" alt="Ảnh sách" style="width:48px;height:64px;object-fit:cover;border-radius:6px;box-shadow:0 2px 8px #0001;">
            </td>
            <td>{{ book.MaSach }}</td>
            <td>{{ book.TenSach }}</td>
            <td>{{ book.TacGia }}</td>
            <td>{{ getTenNXB(book.MaNXB) }}</td>
            <td>{{ book.NamXuatBan }}</td>
            <td>{{ book.SoQuyen }}</td>
            <td>{{ book.DonGia?.toLocaleString() }}đ</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="openEdit(book)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="openDeleteModal(book)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="books.length === 0">
            <td colspan="9" class="text-center text-muted">Chưa có sách nào.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Thêm/Sửa -->
    <div class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display: block;" v-if="showModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="saveBook">
            <div v-if="modalError" class="alert alert-danger mb-2">{{ modalError }}</div>
            <div class="modal-header bg-primary text-white rounded-top">
              <h5 class="modal-title">{{ isEdit ? 'Sửa sách' : 'Thêm sách' }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body row g-3">
              <div class="col-md-4 text-center">
                <img :src="form.file ? form.Img : getImgUrl(form.Img)" alt="Ảnh sách" class="img-fluid rounded shadow mb-2" style="max-height:180px;">
                <input type="file" accept="image/*" class="form-control mt-2" @change="onFileChange">
              </div>
              <div class="col-md-8 row g-3">
                <div class="col-md-6">
                  <label class="form-label">Tên sách</label>
                  <input v-model="form.TenSach" type="text" class="form-control" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Tác giả</label>
                  <input v-model="form.TacGia" type="text" class="form-control" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Nhà xuất bản</label>
                  <select v-model="form.MaNXB" class="form-select" required>
                    <option value="">Chọn NXB</option>
                    <option v-for="nxb in nxbs" :key="nxb.MaNXB" :value="nxb.MaNXB">{{ nxb.TenNXB }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Năm xuất bản</label>
                  <input v-model="form.NamXuatBan" type="number" class="form-control" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số quyển</label>
                  <input v-model="form.SoQuyen" type="number" class="form-control" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Đơn giá</label>
                  <input v-model="form.DonGia" type="number" class="form-control" required>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" @click="closeModal">Hủy</button>
              <button class="btn btn-primary" type="submit">{{ isEdit ? 'Lưu' : 'Thêm' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div class="modal fade" tabindex="-1" :class="{ show: showDeleteModal }" style="display: block;" v-if="showDeleteModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title"><i class="bi bi-exclamation-triangle me-2"></i>Xác nhận xóa</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa sách <b>{{ bookToDelete?.TenSach }}</b>?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDeleteModal">Hủy</button>
            <button class="btn btn-danger" @click="delBook(bookToDelete)">Xóa</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Modal -->

    <!-- Phân trang -->
    <nav v-if="total > pageSize" class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button class="page-link" @click="changePage(page - 1)" :disabled="page === 1">Trước</button>
        </li>
        <li class="page-item" v-for="p in totalPages" :key="p" :class="{ active: page === p }">
          <button class="page-link" @click="changePage(p)">{{ p }}</button>
        </li>
        <li class="page-item" :class="{ disabled: page === totalPages }">
          <button class="page-link" @click="changePage(page + 1)" :disabled="page === totalPages">Sau</button>
        </li>
      </ul>
    </nav>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import api from '../../services/api.service';

const books = ref([]);
const nxbs = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const form = reactive({
  MaSach: '',
  TenSach: '',
  TacGia: '',
  MaNXB: '',
  NamXuatBan: '',
  SoQuyen: '',
  DonGia: '',
  Img: ''
});
const message = ref('');
const success = ref(true);
const page = ref(1);
const pageSize = 7;
const total = ref(0);
const search = ref('');
const selectedNXB = ref('');
const totalPages = computed(() => Math.ceil(total.value / pageSize));
const modalError = ref('');
const showDeleteModal = ref(false);
const bookToDelete = ref(null);
const defaultImg = 'https://cdn-icons-png.flaticon.com/512/29/29302.png';

async function fetchBooks() {
  try {
    const res = await api.get('/api/sach', {
      params: {
        search: search.value,
        maNXB: selectedNXB.value,
        page: page.value,
        pageSize
      }
    });
    books.value = Array.isArray(res.data) ? res.data : res.data.items || [];
    total.value = res.data.total || books.value.length;
  } catch (err) {
    books.value = [];
    message.value = 'Không thể tải danh sách sách!';
    success.value = false;
    setTimeout(() => message.value = '', 2500);
  }
}

async function fetchNXBs() {
  try {
    const res = await api.get('/api/nhaxuatban');
    nxbs.value = res.data;
  } catch (err) {
    nxbs.value = [];
  }
}

function getTenNXB(maNXB) {
  const nxb = nxbs.value.find(n => n.MaNXB === maNXB);
  return nxb ? nxb.TenNXB : '';
}

function openAdd() {
  isEdit.value = false;
  Object.assign(form, {
    MaSach: '',
    TenSach: '',
    TacGia: '',
    MaNXB: '',
    NamXuatBan: '',
    SoQuyen: '',
    DonGia: '',
    Img: ''
  });
  form.file = null; 
  showModal.value = true;
}

function openEdit(book) {
  isEdit.value = true;
  const { _id, ...rest } = book;
  Object.assign(form, rest);
  form.file = null;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  modalError.value = '';
  form.file = null;
}

function openDeleteModal(book) {
  bookToDelete.value = book;
  showDeleteModal.value = true;
}
function closeDeleteModal() {
  showDeleteModal.value = false;
  bookToDelete.value = null;
}

async function saveBook() {
  try {
    const formData = new FormData();
    for (const key in form) {
      if (key === '_id' || key === 'file') continue; 
      if (form[key] !== undefined && form[key] !== null) {
        formData.append(key, form[key]);
      }
    }
    if (form.file) formData.append('Img', form.file); 

    if (isEdit.value) {
      await api.put(`/api/sach/${form.MaSach}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.value = 'Cập nhật sách thành công!';
    } else {
      await api.post('/api/sach', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.value = 'Thêm sách thành công!';
    }
    modalError.value = '';
    success.value = true;
    showModal.value = false;
    await fetchBooks();
  } catch (err) {
    modalError.value = err.response?.data?.message || 'Lỗi thao tác!';
    success.value = false;
  }
  setTimeout(() => {
    message.value = '';
    modalError.value = '';
  }, 2500);
}

async function delBook(book) {
  if (!book) return;
  try {
    await api.delete(`/api/sach/${book.MaSach}`);
    message.value = 'Xóa sách thành công!';
    success.value = true;
    await fetchBooks();
  } catch (err) {
    message.value = err.response?.data?.message || 'Xóa thất bại!';
    success.value = false;
    setTimeout(() => message.value = '', 2500);
  }
  closeDeleteModal();
}

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  page.value = newPage;
  fetchBooks();
}

watch(search, (val, oldVal) => {
  if (val !== oldVal && val !== '') {
    page.value = 1;
    fetchBooks();
  }
});
watch(selectedNXB, () => {
  page.value = 1;
  fetchBooks();
});

onMounted(() => {
  fetchBooks();
  fetchNXBs();
});

// Xử lý upload ảnh 
function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  form.file = file;
  const reader = new FileReader();
  reader.onload = (evt) => {
    form.Img = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function getImgUrl(img) {
  if (!img) return defaultImg;
  if (img.startsWith('http')) return img;
  // Nếu là đường dẫn tương đối, thêm host backend
  return `http://localhost:3000${img}`;
}
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}
.modal {
  background: rgba(0,0,0,0.25);
}
.modal.show {
  display: block;
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
</style>