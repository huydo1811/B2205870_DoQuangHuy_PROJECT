<template>
  <main class="container my-2 animate-fadein">
    <h2 class="fw-bold mb-4 text-primary">
      <i class="bi bi-people me-2"></i>Quản lý nhân viên
    </h2>
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="input-group">
          <input
            v-model="search"
            @keyup.enter="onSearch"
            class="form-control"
            placeholder="Tìm theo mã nhân viên, tên hoặc SĐT..."
          />
          <button class="btn btn-outline-primary" type="button" @click="onSearch">
            <i class="bi bi-search"></i>
          </button>
          <button
            v-if="search"
            class="btn btn-outline-danger"
            type="button"
            @click="clearSearch"
            title="Xóa lọc"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      <div class="col-md-2">
          <span class="badge bg-light text-dark border" style="font-size:1rem;">
            <i class="bi bi-person-badge-fill me-1 text-primary"></i>
            {{ totalStaff }} Nhân viên
        </span>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-success" @click="openAdd">
          <i class="bi bi-plus-circle me-1"></i> Thêm nhân viên
        </button>
      </div>
    </div>
    <div v-if="message" class="alert" :class="success ? 'alert-success' : 'alert-danger'">{{ message }}</div>
    <div class="table-responsive">
      <table class="table table-bordered align-middle table-hover">
        <thead class="table-primary">
          <tr>
            <th>Mã NV</th>
            <th style="min-width: 140px;">Họ tên</th>
            <th>Giới tính</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Username</th>
            <th>Chức vụ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="nv in nhanviens" :key="nv.MaNhanVien" class="fadein-row">
            <td>{{ nv.MaNhanVien }}</td>
            <td style="min-width: 140px; white-space: normal;">
              <span v-if="nv.MaNhanVien === maNhanVienDangNhap" class="text-primary fw-bold">
                <i class="bi bi-person-circle me-1"></i>{{ nv.HoTen }} <span class="badge bg-info text-dark ms-1">Bạn</span>
              </span>
              <span v-else>
                {{ nv.HoTen }}
              </span>
            </td>
            <td>{{ nv.GioiTinh }}</td>
            <td>{{ nv.DienThoai }}</td>
            <td>{{ nv.DiaChi }}</td>
            <td>{{ nv.Username }}</td>
            <td>{{ nv.ChucVu }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="openEdit(nv)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="openDeleteModal(nv)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="nhanviens.length === 0">
            <td colspan="8" class="text-center text-muted">Chưa có nhân viên nào.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Thêm/Sửa -->
    <div class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display: block;" v-if="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="saveNhanVien">
            <div v-if="modalError" class="alert alert-danger mb-2">
              {{ modalError }}
            </div>
            <div class="modal-header">
              <h5 class="modal-title">{{ isEdit ? 'Sửa nhân viên' : 'Thêm nhân viên' }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body row g-3">
              <div class="col-12">
                <label class="form-label">Họ tên</label>
                <input v-model="form.HoTen" type="text" class="form-control" required>
              </div>
              <div class="col-6">
                <label class="form-label">Giới tính</label>
                <select v-model="form.GioiTinh" class="form-select">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div class="col-6">
                <label class="form-label">Số điện thoại</label>
                <input v-model="form.DienThoai" type="text" class="form-control">
              </div>
              <div class="col-12">
                <label class="form-label">Địa chỉ</label>
                <input v-model="form.DiaChi" type="text" class="form-control">
              </div>
              <div class="col-6">
                <label class="form-label">Username</label>
                <input v-model="form.Username" type="text" class="form-control" required :disabled="isEdit">
              </div>
              <div class="col-6" v-if="!isEdit">
                <label class="form-label">Mật khẩu</label>
                <input v-model="form.MatKhau" type="password" class="form-control" required>
              </div>
              <div class="col-12">
                <label class="form-label">Chức vụ</label>
                <input v-model="form.ChucVu" type="text" class="form-control">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" @click="closeModal">Hủy</button>
              <button
                v-if="isEdit"
                class="btn btn-warning me-auto"
                type="button"
                @click="resetPassword"
              >
                <i class="bi bi-arrow-counterclockwise"></i> Reset mật khẩu
              </button>
              <button class="btn btn-primary" type="submit">{{ isEdit ? 'Lưu' : 'Thêm' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- End Modal -->

    <!-- Modal xác nhận xóa -->
    <div class="modal fade" tabindex="-1" :class="{ show: showDeleteModal }" style="display: block;" v-if="showDeleteModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title"><i class="bi bi-exclamation-triangle me-2"></i>Xác nhận xóa</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa nhân viên <b>{{ nvToDelete?.HoTen }}</b>?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDeleteModal">Hủy</button>
            <button class="btn btn-danger" @click="delNhanVien(nvToDelete)">Xóa</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Modal -->

    <nav v-if="total > pageSize" class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button class="page-link" @click="changePage(page - 1)" :disabled="page === 1">Trước</button>
        </li>
        <li
          class="page-item"
          v-for="p in totalPages"
          :key="p"
          :class="{ active: page === p }"
        >
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

const nhanviens = ref([]);
const totalStaff = ref(0);
const showModal = ref(false);
const isEdit = ref(false);
const form = reactive({
  MaNhanVien: '',
  HoTen: '',
  GioiTinh: 'Nam',
  DienThoai: '',
  DiaChi: '',
  Username: '',
  MatKhau: '',
  ChucVu: ''
});
const message = ref('');
const success = ref(true);
const page = ref(1);
const pageSize = 7;
const total = ref(0);
const search = ref('');
const totalPages = computed(() => Math.ceil(total.value / pageSize));
const modalError = ref('');
const showDeleteModal = ref(false);
const nvToDelete = ref(null);

const maNhanVienDangNhap = localStorage.getItem('maNhanVien');

async function fetchNhanViens() {
  try {
    const res = await api.get('/api/nhanvien', {
      params: {
        page: page.value,
        pageSize,
        search: search.value
      }
    });
    nhanviens.value = Array.isArray(res.data.items) ? res.data.items : [];
    total.value = res.data.total || 0;
  } catch (err) {
    nhanviens.value = [];
    message.value = 'Không thể tải danh sách nhân viên!';
    success.value = false;
    setTimeout(() => message.value = '', 2500);
  }
}

function openAdd() {
  isEdit.value = false;
  Object.assign(form, {
    MaNhanVien: '',
    HoTen: '',
    GioiTinh: 'Nam',
    DienThoai: '',
    DiaChi: '',
    Username: '',
    MatKhau: '',
    ChucVu: ''
  });
  showModal.value = true;
}

function openEdit(nv) {
  isEdit.value = true;
  Object.assign(form, nv, { MatKhau: '' });
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function openDeleteModal(nv) {
  nvToDelete.value = nv;
  showDeleteModal.value = true;
}
function closeDeleteModal() {
  showDeleteModal.value = false;
  nvToDelete.value = null;
}

async function saveNhanVien() {
  try {
    if (isEdit.value) {
      await api.put(`/api/nhanvien/${form.MaNhanVien}`, {
        HoTen: form.HoTen,
        GioiTinh: form.GioiTinh,
        DienThoai: form.DienThoai,
        DiaChi: form.DiaChi,
        ChucVu: form.ChucVu
      });
      message.value = 'Cập nhật nhân viên thành công!';
      modalError.value = '';
      success.value = true;
      showModal.value = false;
      await fetchNhanViens();
    } else {
      await api.post('/api/nhanvien', {
        HoTen: form.HoTen,
        GioiTinh: form.GioiTinh,
        DienThoai: form.DienThoai,
        DiaChi: form.DiaChi,
        Username: form.Username,
        MatKhau: form.MatKhau,
        ChucVu: form.ChucVu
      });
      message.value = 'Thêm nhân viên thành công!';
      modalError.value = '';
      success.value = true;
      showModal.value = false;
      await fetchNhanViens();
    }
  } catch (err) {
    modalError.value = err.response?.data?.message || 'Lỗi thao tác!';
    success.value = false;
    // Không đóng modal, không set message.value
  }
  setTimeout(() => {
    message.value = '';
    modalError.value = '';
  }, 2500);
}

function confirmDelete(nv) {
  nvToDelete.value = nv;
  showDeleteModal.value = true;
}

async function delNhanVien(nv) {
  if (!nv) return;
  try {
    await api.delete(`/api/nhanvien/${nv.MaNhanVien}`);
    message.value = 'Xóa nhân viên thành công!';
    success.value = true;
    await fetchNhanViens();
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
  fetchNhanViens();
}

function onSearch() {
  page.value = 1;
  fetchNhanViens();
}

function clearSearch() {
  search.value = '';
  onSearch();
}

watch(search, (val, oldVal) => {
  if (val !== oldVal && val !== '') {
    page.value = 1;
    fetchNhanViens();
  }
});

async function fetchStaffCount() {
  try {
    const res = await api.get('/api/nhanvien/count');
    totalStaff.value = res.data.count || 0;
  } catch (err) {
    console.error('Lỗi lấy số lượng nhân viên:', err);
    totalStaff.value = 0;
  }
}

onMounted (() => {
  fetchNhanViens();
  fetchStaffCount();
});

async function resetPassword() {
  if (!form.MaNhanVien) return;
  if (!confirm('Bạn có chắc muốn đặt lại mật khẩu về 123456?')) return;
  try {
    await api.put(`/api/nhanvien/${form.MaNhanVien}/reset-password`, { MatKhau: '123456' });
    modalError.value = '';
    message.value = 'Đã đặt lại mật khẩu về 123456!';
    success.value = true;
    showModal.value = false;
    await fetchNhanViens();
  } catch (err) {
    modalError.value = err.response?.data?.message || 'Lỗi reset mật khẩu!';
    success.value = false;
  }
  setTimeout(() => {
    message.value = '';
    modalError.value = '';
  }, 2500);
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

/* Hiệu ứng fadein giống adminhome */
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