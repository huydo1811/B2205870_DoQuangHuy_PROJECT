<template>
  <div class="register-bg d-flex flex-column justify-content-center align-items-center">
    <div class="card register-card">
      <div class="register-header fs-2">CẬP NHẬT THÔNG TIN</div>
      <form class="register-body px-5 py-4" @submit.prevent="handleUpdate">
        <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
        <div v-if="success" class="alert alert-success mt-2">{{ success }}</div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label" for="lastname">Họ và chữ lót</label>
            <input id="lastname" type="text" class="form-control register-input" v-model="ho" autocomplete="family-name" />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label" for="firstname">Tên</label>
            <input id="firstname" type="text" class="form-control register-input" v-model="ten" autocomplete="given-name" />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label" for="gender">Giới tính</label>
            <select id="gender" class="form-select register-input" v-model="gioiTinh">
              <option value="" disabled>Chọn</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label" for="phone">Số điện thoại</label>
            <input id="phone" type="tel" class="form-control register-input" v-model="dienThoai" autocomplete="tel" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label" for="address">Địa chỉ</label>
            <input id="address" type="text" class="form-control register-input" v-model="diaChi" autocomplete="street-address" />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="username">Tên đăng nhập</label>
          <input id="username" type="text" class="form-control register-input" v-model="username" disabled />
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label" for="madocgia">Mã độc giả</label>
            <input id="madocgia" type="text" class="form-control register-input" v-model="maDocGia" disabled />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label" for="role">Vai trò</label>
            <input id="role" type="text" class="form-control register-input" v-model="role" disabled />
          </div>
        </div>
        <button type="submit" class="btn btn-register w-100 mb-2">Cập nhật</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api.service';
import { useRouter } from 'vue-router';
const router = useRouter();

const error = ref('');
const success = ref('');
const ho = ref('');
const ten = ref('');
const gioiTinh = ref('');
const dienThoai = ref('');
const diaChi = ref('');
const username = ref('');
const maDocGia = ref('');
const role = ref('');

onMounted(async () => {
  error.value = '';
  success.value = '';
  try {
    const res = await api.get(`/api/docgia/madocgia/${localStorage.getItem('maDocGia')}`, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    const data = res.data[0] || res.data; // Nếu trả về mảng
    ho.value = data.Ho || '';
    ten.value = data.Ten || '';
    gioiTinh.value = data.GioiTinh || '';
    dienThoai.value = data.DienThoai || '';
    diaChi.value = data.DiaChi || '';
    username.value = data.Username || '';
    maDocGia.value = data.MaDocGia || '';
    role.value = data.Role || '';
  } catch (err) {
    error.value = 'Không lấy được thông tin độc giả!';
  }
});

const handleUpdate = async () => {
  error.value = '';
  success.value = '';
  if (!dienThoai.value || !diaChi.value || !gioiTinh.value || !ho.value || !ten.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin!';
    return;
  }
  if (dienThoai.value.length < 10 || dienThoai.value.length > 11) {
    error.value = 'Số điện thoại phải từ 10-11 ký tự!';
    return;
  }
  try {
    await api.put(`/api/docgia/${maDocGia.value}`, {
      Ho: ho.value,
      Ten: ten.value,
      GioiTinh: gioiTinh.value,
      DienThoai: dienThoai.value,
      DiaChi: diaChi.value
    }, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    success.value = 'Cập nhật thành công!';
    setTimeout(() => {
      router.push('/home');
    }, 1000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Cập nhật thất bại!';
    success.value = '';
  }
};
</script>

<style scoped>
.register-bg {
  min-height: 100vh;
  width: 100vw;
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