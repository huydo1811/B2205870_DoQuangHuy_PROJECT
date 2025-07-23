<template>
  <main class="container my-2 animate-fadein">
    <h2 class="fw-bold mb-4 text-primary">
      <i class="bi bi-building me-2"></i>Quản lý nhà xuất bản
    </h2>
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="input-group">
          <input
            v-model="search"
            @keyup.enter="onSearch"
            class="form-control"
            placeholder="Tìm theo tên NXB..."
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
          <i class="bi bi-building me-1 text-primary"></i>
          {{ totalPublishers }} Nhà xuất bản
        </span>

      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-success" @click="openAdd">
          <i class="bi bi-plus-circle me-1"></i> Thêm NXB
        </button>
      </div>
    </div>
    <div v-if="message" class="alert" :class="success ? 'alert-success' : 'alert-danger'">{{ message }}</div>
    <div class="table-responsive">
      <table class="table table-bordered align-middle table-hover">
        <thead class="table-primary">
          <tr>
            <th>Mã NXB</th>
            <th>Tên NXB</th>
            <th>Địa chỉ</th>
            <th class="text-center" style="width:120px;">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="nxb in nxbList"
            :key="nxb._id"
            class="fadein-row table-row-hover"
          >
            <td>{{ nxb.MaNXB }}</td>
            <td>{{ nxb.TenNXB }}</td>
            <td>{{ nxb.DiaChi }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-primary me-2" @click="openEdit(nxb)">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="openDeleteModal(nxb)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="nxbList.length === 0">
            <td colspan="4" class="text-center text-muted py-4">Không có nhà xuất bản nào.</td>
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

    <!-- Modal Thêm/Sửa -->
    <div class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display: block;" v-if="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="saveNXB">
            <div v-if="modalError" class="alert alert-danger mb-2">
              {{ modalError }}
            </div>
            <div class="modal-header">
              <h5 class="modal-title">{{ isEdit ? 'Sửa NXB' : 'Thêm NXB' }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body row g-3">
                <div class="col-12" v-if="isEdit">
                    <label class="form-label">Mã NXB</label>
                    <input v-model="form.MaNXB" class="form-control" readonly>
                </div>
              <div class="col-12">
                <label class="form-label">Tên NXB</label>
                <input v-model="form.TenNXB" class="form-control" required maxlength="100">
              </div>
              <div class="col-12">
                <label class="form-label">Địa chỉ</label>
                <input v-model="form.DiaChi" class="form-control" required maxlength="200">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" @click="closeModal">Hủy</button>
              <button class="btn btn-primary" type="submit">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                {{ isEdit ? 'Lưu' : 'Thêm' }}
              </button>
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
            <p>Bạn có chắc chắn muốn xóa nhà xuất bản <b>{{ nxbToDelete?.TenNXB }}</b>?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDeleteModal">Hủy</button>
            <button class="btn btn-danger" @click="delNXB(nxbToDelete)">Xóa</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Modal -->
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import api from '../../services/api.service';

const nxbList = ref([]);
const showModal = ref(false);
const isEdit = ref(false);
const form = reactive({
  _id: '',
  MaNXB: '',
  TenNXB: '',
  DiaChi: ''
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
const nxbToDelete = ref(null);
const saving = ref(false);
const totalPublishers = ref(0);

async function fetchNXBs() {
  try {
    const res = await api.get('/api/nhaxuatban/paged', {
      params: {
        page: page.value,
        pageSize,
        search: search.value
      }
    });
    nxbList.value = Array.isArray(res.data.items) ? res.data.items : [];
    total.value = res.data.total || 0;
  } catch (err) {
    nxbList.value = [];
    message.value = 'Không thể tải danh sách NXB!';
    success.value = false;
    setTimeout(() => message.value = '', 2500);
  }
}

function openAdd() {
  isEdit.value = false;
  Object.assign(form, {
    _id: '',
    MaNXB: '',
    TenNXB: '',
    DiaChi: ''
  });
  showModal.value = true;
}

function openEdit(nxb) {
  isEdit.value = true;
  Object.assign(form, nxb);
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  modalError.value = '';
}

function openDeleteModal(nxb) {
  nxbToDelete.value = nxb;
  showDeleteModal.value = true;
}
function closeDeleteModal() {
  showDeleteModal.value = false;
  nxbToDelete.value = null;
}

async function saveNXB() {
  saving.value = true;
  try {
    if (isEdit.value) {
    await api.put(`/api/nhaxuatban/${form.MaNXB}`, {
        TenNXB: form.TenNXB,
        DiaChi: form.DiaChi
    });
      message.value = 'Cập nhật NXB thành công!';
      modalError.value = '';
      success.value = true;
      showModal.value = false;
      await fetchNXBs();
    } else {
      await api.post('/api/nhaxuatban', {
        TenNXB: form.TenNXB,
        DiaChi: form.DiaChi
      });
      message.value = 'Thêm NXB thành công!';
      modalError.value = '';
      success.value = true;
      showModal.value = false;
      await fetchNXBs();
    }
  } catch (err) {
    modalError.value = err.response?.data?.message || 'Lỗi thao tác!';
    success.value = false;
  }
  saving.value = false;
  setTimeout(() => {
    message.value = '';
    modalError.value = '';
  }, 2500);
}

async function delNXB(nxb) {
  if (!nxb) return;
  try {
    await api.delete(`/api/nhaxuatban/${nxb.MaNXB}`);
    message.value = 'Xóa NXB thành công!';
    success.value = true;
    await fetchNXBs();
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
  fetchNXBs();
}

function onSearch() {
  page.value = 1;
  fetchNXBs();
}

function clearSearch() {
  search.value = '';
  onSearch();
}

watch(search, (val, oldVal) => {
  if (val !== oldVal && val !== '') {
    page.value = 1;
    fetchNXBs();
  }
});

async function fetchPublisherCount() {
  try {
    const res = await api.get('/api/nhaxuatban/count');
    totalPublishers.value = res.data.count || 0;
  } catch {
    totalPublishers.value = 0;
  }
}

onMounted (() => {
  fetchNXBs();
  fetchPublisherCount();
});

</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}
.table-primary {
  background: #e3f0ff;
}
.table-row-hover:hover {
  background: #f2f2f2 !important;
  transition: background 0.2s;
}
.text-center {
  text-align: center !important;
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
.fadein-row {
  animation: fadeInRow 0.5s;
}
@keyframes fadeInRow {
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>