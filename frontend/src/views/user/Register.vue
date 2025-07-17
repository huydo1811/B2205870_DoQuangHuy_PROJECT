<template>
  <div class="register-bg d-flex flex-column justify-content-center align-items-center">
    <div class="card register-card">
      <div class="register-header fs-2">ĐĂNG KÝ</div>

      <form class="register-body px-5 py-4" @submit.prevent="handleRegister">
      <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
      <div v-if="success" class="alert alert-success mt-2">{{ success }}</div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label" for="lastname">Họ và chữ lót</label>
            <input id="lastname" type="text" class="form-control register-input" v-model="lastname" placeholder="Nhập họ và chữ lót" autocomplete="family-name" />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label" for="firstname">Tên</label>
            <input id="firstname" type="text" class="form-control register-input" v-model="firstname" placeholder="Tên" autocomplete="given-name" />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label" for="gender">Giới tính</label>
            <select id="gender" class="form-select register-input" v-model="gender">
              <option value="" disabled>Chọn</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label" for="phone">Số điện thoại</label>
            <input id="phone" type="tel" class="form-control register-input" v-model="phone" placeholder="Nhập số điện thoại" autocomplete="tel" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label" for="address">Địa chỉ</label>
            <input id="address" type="text" class="form-control register-input" v-model="address" placeholder="Nhập địa chỉ" autocomplete="street-address" />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="username">Tên đăng nhập</label>
          <input id="username" type="text" class="form-control register-input" v-model="username" placeholder="Nhập tên đăng nhập (Tối thiểu 6 ký tự)" autocomplete="username" />
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label" for="password">Mật khẩu</label>
            <input id="password" type="password" class="form-control register-input" v-model="password" placeholder="Nhập mật khẩu (Tối thiểu 6 ký tự)" autocomplete="new-password" />
          </div>
          <div class="col-md-6 mb-4">
            <label class="form-label" for="confirmPassword">Nhập lại mật khẩu</label>
            <input id="confirmPassword" type="password" class="form-control register-input" v-model="confirmPassword" placeholder="Nhập lại mật khẩu" autocomplete="new-password" />
          </div>
        </div>
        <button type="submit" class="btn btn-register w-100 mb-2">Đăng ký</button>
        <div class="text-center mt-2">
          <router-link to="/login" class="register-link">Đã có tài khoản? Đăng nhập</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../services/api.service';
import { useRouter } from 'vue-router';
const router = useRouter();
const error = ref('');
const success = ref('');
const lastname = ref('');
const firstname = ref('');
const gender = ref('');
const phone = ref('');
const address = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleRegister = async () => {
  error.value = '';
  success.value = '';

  if (password.value !== confirmPassword.value) {
    error.value = 'Mật khẩu nhập lại không khớp!';
    return;
  }

  try {
    const res = await api.post('/api/docgia', {
      Ho: lastname.value,
      Ten: firstname.value,
      GioiTinh: gender.value,
      DienThoai: phone.value,
      DiaChi: address.value,
      Username: username.value,
      MatKhau: password.value
    });

    success.value = 'Đăng ký thành công!';
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng ký thất bại!';
    success.value = '';
  }
};

</script>

<style scoped>
.register-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e7f5ff 0%, #a5d8ff 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.register-card {
  width: 100%;
  max-width: 600px;
  border-radius: 28px;
  border: none;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  background: #fff;
  overflow: hidden; 
}
.register-title {
  color: #339af0;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 2.1rem;
}
.register-input,
.form-select {
  border-radius: 12px;
  border: 1.5px solid #a5d8ff;
  background: #f4faff;
  font-size: 1.1rem;
  padding: 12px 14px;
  transition: border-color 0.2s;
}
.register-input:focus,
.form-select:focus {
  border-color: #339af0;
  box-shadow: 0 0 0 2px #a5d8ff55;
  background: #fff;
}
.btn-register {
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.15rem;
  transition: background 0.2s;
  color: #fff;
}
.btn-register:hover {
  background: linear-gradient(90deg, #74c0fc 0%, #339af0 100%);
  color: #fff;
}
.register-link {
  color: #339af0;
  text-decoration: underline;
  font-size: 1rem;
}
.register-link:hover {
  color: #1864ab;
}

.register-header {
    background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
    color: #fff;
    font-size: 1.35rem;
    font-weight: 600;
    letter-spacing: 1px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    text-align: center;
    padding: 18px 0 12px 0;
    margin: 0; 
}

.register-body {
  padding: 32px 32px 0 32px;
}
</style>