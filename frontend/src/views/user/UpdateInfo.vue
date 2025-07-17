<template>
  <form @submit.prevent="handleUpdate">
    <div v-if="error" style="color: red; margin-bottom: 8px;">{{ error }}</div>
    <input v-model="dienThoai" placeholder="Số điện thoại" required />
    <input v-model="diaChi" placeholder="Địa chỉ" required />
    <select v-model="gioiTinh" required>
      <option value="">Chọn giới tính</option>
      <option value="Nam">Nam</option>
      <option value="Nữ">Nữ</option>
    </select>
    <button type="submit">Cập nhật</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../services/api.service';
import { useRouter } from 'vue-router';

const dienThoai = ref('');
const diaChi = ref('');
const gioiTinh = ref('');
const error = ref('');
const router = useRouter();

const maDocGia = localStorage.getItem('maDocGia'); 

const handleUpdate = async () => {
  error.value = '';
  if (!dienThoai.value || !diaChi.value || !gioiTinh.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin!';
    return;
  }
  if (dienThoai.value.length < 10 || dienThoai.value.length > 11) {
    error.value = 'Số điện thoại phải từ 10-11 ký tự!';
    return;
  }
  try {
    await api.put(`/api/docgia/${maDocGia}`, {
      DienThoai: dienThoai.value,
      DiaChi: diaChi.value,
      GioiTinh: gioiTinh.value
    }, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    router.push('/home');
  } catch (err) {
    error.value = err.response?.data?.message || 'Cập nhật thất bại!';
  }
};
</script>