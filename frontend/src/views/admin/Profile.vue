<template>
  <main class="account-container container my-5 animate-fadein">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="account-card shadow-lg p-4 rounded-4 bg-white">
          <div class="text-center mb-4">
            <span class="account-avatar mb-2">👤</span>
            <h2 class="account-title">Thông tin tài khoản</h2>
            <p class="text-muted">Cập nhật thông tin cá nhân & đổi mật khẩu</p>
          </div>
          <transition name="fade">
            <div v-if="message" class="alert mt-4" :class="{'alert-success': success, 'alert-danger': !success}">
              {{ message }}
            </div>
          </transition>
          <form @submit.prevent="updateProfile" class="row g-3">
            <div class="col-md-12">
              <label class="form-label">Họ tên</label>
              <input v-model="admin.HoTen" type="text" class="form-control" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Giới tính</label>
              <select v-model="admin.GioiTinh" class="form-select">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Số điện thoại</label>
              <input v-model="admin.DienThoai" type="text" class="form-control">
            </div>
            <div class="col-md-6">
              <label class="form-label">Địa chỉ</label>
              <input v-model="admin.DiaChi" type="text" class="form-control">
            </div>
            <div class="col-md-6">
              <label class="form-label">Chức vụ</label>
              <input v-model="admin.ChucVu" type="text" class="form-control bg-light text-secondary" disabled>
            </div>
            <div class="col-md-6">
              <label class="form-label">Username</label>
              <input v-model="admin.Username" type="text" class="form-control" disabled>
            </div>
            <div class="col-md-6">
              <label class="form-label">Mã nhân viên</label>
              <input v-model="admin.MaNhanVien" type="text" class="form-control" disabled>
            </div>
            <div class="col-12 text-end">
              <button class="btn btn-gradient px-4" type="submit">
                <i class="bi bi-save me-1"></i> Lưu thay đổi
              </button>
            </div>
          </form>
          <hr class="my-4">
          <div>
            <h5 class="mb-3"><i class="bi bi-key me-2"></i>Đổi mật khẩu</h5>
            <form @submit.prevent="changePassword" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Mật khẩu hiện tại</label>
                <input v-model="password.current" type="password" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Mật khẩu mới</label>
                <input v-model="password.new" type="password" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Nhập lại mật khẩu mới</label>
                <input v-model="password.confirm" type="password" class="form-control" required>
              </div>
              <div class="col-12 text-end">
                <button class="btn btn-outline-primary px-4" type="submit">
                  <i class="bi bi-arrow-repeat me-1"></i> Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api.service';

// Lấy MaNhanVien từ localStorage (hoặc session)
const maNhanVien = localStorage.getItem('maNhanVien');

const admin = ref({
  HoTen: '',
  GioiTinh: '',
  DienThoai: '',
  DiaChi: '',
  ChucVu: '', 
  Username: '',
  MaNhanVien: ''
});

const password = ref({
  current: '',
  new: '',
  confirm: ''
});

const message = ref('');
const success = ref(false);

async function fetchAdmin() {
  if (!maNhanVien) {
    message.value = 'Không tìm thấy mã nhân viên!';
    success.value = false;
    return;
  }
  try {
    const res = await api.get(`/api/nhanvien/${maNhanVien}`);
    if (!res.data || Object.keys(res.data).length === 0) {
      message.value = 'Không tìm thấy thông tin nhân viên!';
      success.value = false;
      return;
    }
    admin.value = res.data;
  } catch (err) {
    console.error('Lỗi lấy thông tin nhân viên:', err);
    message.value = 'Không thể tải thông tin nhân viên!';
    success.value = false;
  }
}

async function updateProfile() {
  try {
    const updatedAdmin = {
      HoTen: admin.value.HoTen,
      GioiTinh: admin.value.GioiTinh,
      DienThoai: admin.value.DienThoai,
      DiaChi: admin.value.DiaChi
    };
    await api.put(`/api/nhanvien/${admin.value.MaNhanVien}`, updatedAdmin);
    message.value = 'Cập nhật thông tin thành công!';
    success.value = true;
  } catch (err) {
    message.value = 'Cập nhật thất bại!';
    success.value = false;
  }
  setTimeout(() => message.value = '', 2500);
}

async function changePassword() {
  if (password.value.new.length < 6) {
    message.value = 'Mật khẩu mới phải có ít nhất 6 ký tự!';
    success.value = false;
    return;
  }
  if (password.value.new !== password.value.confirm) {
    message.value = 'Mật khẩu mới không khớp!';
    success.value = false;
    return;
  }
  try {
    await api.put(`/api/nhanvien/${admin.value.MaNhanVien}/password`, {
      currentPassword: password.value.current,
      newPassword: password.value.new
    });
    message.value = 'Đổi mật khẩu thành công!';
    success.value = true;
    password.value.current = '';
    password.value.new = '';
    password.value.confirm = '';
  } catch (err) {
    message.value = err.response?.data?.message || 'Đổi mật khẩu thất bại!';
    success.value = false;
    console.error('Lỗi đổi mật khẩu:', err);
  }
  setTimeout(() => message.value = '', 2500);
}

onMounted(fetchAdmin);
</script>

<style scoped>
.account-container {
  animation: fadeInUp 0.7s;
}
@keyframes fadeInUp {
  0% { transform: translateY(40px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.account-card {
  border: 1.5px solid #e7f5ff;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 32px 0 #339af055;
  transition: box-shadow 0.18s, transform 0.18s;
}
.account-card:hover {
  box-shadow: 0 12px 36px 0 #339af088;
  transform: translateY(-2px) scale(1.01);
}
.account-avatar {
  font-size: 3.5rem;
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px 0 #339af055;
}
.account-title {
  font-weight: 700;
  color: #339af0;
  font-size: 2.2rem;
}
.btn-gradient {
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  padding: 8px 22px;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px 0 #a5d8ff55;
}
.btn-gradient:hover {
  background: linear-gradient(90deg, #74c0fc 0%, #339af0 100%);
  color: #fff;
  box-shadow: 0 4px 16px 0 #339af055;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>