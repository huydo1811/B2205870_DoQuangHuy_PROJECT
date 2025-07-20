<template>
  <div class="login-bg d-flex flex-column justify-content-center align-items-center">
    <div class="card login-card">
      <div class="login-header fs-2">ĐĂNG NHẬP</div>
      <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
      <form class="login-body px-5 py-4" @submit.prevent="handleLogin">
        <div class="form-group mb-4 position-relative">
          <!-- Icon user -->
          <span class="input-icon">
            <svg width="20" height="20" fill="#b0b8c1" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4-3a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
              <path d="M14 14s-1-1.5-6-1.5S2 14 2 14V13a6 6 0 0 1 12 0v1z"/>
            </svg>
          </span>
          <input
            id="username"
            type="text"
            class="form-control login-input"
            style="padding-left:44px"
            placeholder="Nhập tên đăng nhập"
            v-model="username"
            autocomplete="username"
          />
        </div>
        <div class="form-group mb-4 position-relative">
          <!-- Icon lock -->
          <span class="input-icon">
            <svg width="20" height="20" fill="#b0b8c1" viewBox="0 0 16 16">
              <path d="M8 1a3 3 0 0 0-3 3v3H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1V4a3 3 0 0 0-3-3zm-2 3a2 2 0 1 1 4 0v3H6V4zm-2 5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z"/>
            </svg>
          </span>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-control login-input pr-5"
            style="padding-left:44px"
            placeholder="Mật khẩu"
            v-model="password"
            autocomplete="current-password"
          />
          <!-- Icon eye -->
          <span
            class="toggle-password"
            @click="showPassword = !showPassword"
            :title="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
          >
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>            
          </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
              <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
              <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>            
            </svg>
          </span>
        </div>
        <button type="submit" class="btn btn-login w-100 mb-3">Đăng nhập</button>
        <div class="oauth-divider my-3 text-center">
                  <span>Hoặc đăng nhập bằng</span>
                </div>
                <div class="d-flex justify-content-center gap-3 mb-3">
                <GoogleLogin
                  :callback="onGoogleSuccess"
                  :prompt="true"
                  class="btn btn-oauth google"
                >
                <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.93-6.93C36.45 2.34 30.59 0 24 0 14.61 0 6.26 5.48 1.98 13.44l8.07 6.27C12.43 13.04 17.77 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.18 5.36-4.64 7.02l7.19 5.6C43.74 37.36 46.1 31.45 46.1 24.5z"/><path fill="#FBBC05" d="M13.05 28.73c-1.13-3.36-1.13-6.96 0-10.32l-8.07-6.27C2.19 16.61 0 20.99 0 25.5c0 4.51 2.19 8.89 5.98 12.36l8.07-6.27z"/><path fill="#EA4335" d="M24 46c6.59 0 12.45-2.17 16.93-5.93l-7.19-5.6c-2.01 1.35-4.59 2.13-7.74 2.13-6.23 0-11.57-3.54-14.95-8.73l-8.07 6.27C6.26 42.52 14.61 48 24 48z"/></g></svg>
                  Google
                </GoogleLogin>
                </div>
                <div class="text-center mt-2">
                  <router-link to="/register" class="login-link">Chưa có tài khoản? Đăng ký</router-link>
                </div>      
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../services/api.service';
import { useRouter } from 'vue-router';
import { GoogleLogin } from 'vue3-google-login';


const username = ref('');
const password = ref('');
const showPassword = ref(false);
const error = ref('');
const router = useRouter();

const handleLogin = async (e) => {
  e.preventDefault();
  error.value = '';

  try {
    const res = await api.post('/api/auth/login', {
      Username: username.value,
      MatKhau: password.value
    });

    // Lưu token và role vào localStorage
    localStorage.clear();
    if (res.data.Role === 'admin') {
      localStorage.setItem('maNhanVien', res.data.MaNhanVien);
      localStorage.setItem('role', res.data.Role);
      localStorage.setItem('token', res.data.token);
      router.push('/admin');
    } else {
      localStorage.setItem('maDocGia', res.data.MaDocGia);
      localStorage.setItem('role', res.data.Role);
      localStorage.setItem('token', res.data.token);
      router.push('/home');
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng nhập thất bại!';
  }
};

function onGoogleSuccess(response) {
  const code = response.code;
  if (!code) {
    error.value = 'Không nhận được code từ Google!';
    return;
  }

  api.post('/api/auth/google', { code })
    .then(res => {
      const token = res.data.token;
      const info = res.data.info;
      localStorage.clear();
      localStorage.setItem('maDocGia', info.MaDocGia);
      localStorage.setItem('token', token);

      if (!info?.DienThoai || !info?.DiaChi || !info?.GioiTinh) {
        router.push('/update-info');
      } else {
        router.push('/home');
      }
    })
    .catch(err => {
      error.value = err.response?.data?.message || 'Đăng nhập Google thất bại!';
    });
}

</script>

<style scoped>
.login-bg {
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #e7f5ff 0%, #a5d8ff 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.login-card {
    width: 100%;
    max-width: 480px;
    border-radius: 28px;
    border: none;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
    background: #fff;
    overflow: hidden; /* QUAN TRỌNG để header tràn sát viền */
}

.login-header {
    background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
    color: #fff;
    font-size: 1.35rem;
    font-weight: 600;
    letter-spacing: 1px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    text-align: center;
    padding: 18px 0 12px 0;
    /* XÓA margin để header tràn sát viền */
    margin: 0;
}

.login-body {
    padding: 32px 32px 0 32px;
}

.login-title {
    color: #339af0;
    font-weight: 700;
    letter-spacing: 1px;
    font-size: 2.1rem;
}

.login-input {
    border-radius: 12px;
    border: 1.5px solid #a5d8ff;
    background: #f4faff;
    font-size: 1.1rem;
    padding: 12px 14px;
    transition: border-color 0.2s;
}

.login-input:focus {
    border-color: #339af0;
    box-shadow: 0 0 0 2px #a5d8ff55;
    background: #fff;
}

.btn-login {
    background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.15rem;
    transition: background 0.2s;
    color: #fff;
}

.btn-login:hover {
    background: linear-gradient(90deg, #74c0fc 0%, #339af0 100%);
    color: #fff;
}

.login-link {
    color: #339af0;
    text-decoration: underline;
    font-size: 1rem;
}

.login-link:hover {
    color: #1864ab;
}

.input-icon {
    position: absolute;
    top: 50%;
    left: 18px;
    transform: translateY(-50%);
    color: #b0b8c1;
    display: flex;
    align-items: center;
    pointer-events: none;
    z-index: 2;
}

.toggle-password {
    position: absolute;
    top: 50%;
    right: 18px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    z-index: 2;
}

.oauth-divider {
  font-size: 1rem;
  color: #888;
  margin-bottom: 8px;
}
.btn-oauth {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: none;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 1rem;
  background: #f4faff;
  color: #333;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.08);
  transition: background 0.2s;
}
.btn-oauth.google:hover {
  background: #e7f5ff;
  color: #4285F4;
}
.btn-oauth.facebook:hover {
  background: #e7f5ff;
  color: #1877F3;
}
</style>


