<template>
  <div class="notfound-bg d-flex flex-column justify-content-center align-items-center">
    <div class="card shadow p-5 notfound-card">
      <p class="notfound-title text-center">Không tìm thấy trang bạn yêu cầu!</p>
      <button class="notfound-btn mt-3 mx-auto d-block" @click="$router.back()">Quay lại</button>
    </div>
  </div>
</template>

<style scoped>
.notfound-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e7f5ff 0%, #a5d8ff 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.notfound-card {
  width: 100%;
  max-width: 75%;
  border-radius: 28px;
  border: none;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  background: #fff;
}
.notfound-title {
  font-size: 2rem;
  font-weight: 800;
  color: #339af0;
  margin-bottom: 0.5rem;
}

.notfound-btn {
  background: linear-gradient(90deg, #339af0 60%, #74c0fc 100%);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  color: #fff;
  padding: 10px 36px;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px 0 rgba(51, 154, 240, 0.10);
  outline: none;
}
.notfound-btn:hover {
  background: linear-gradient(90deg, #74c0fc 0%, #339af0 100%);
  color: #fff;
  box-shadow: 0 4px 16px 0 rgba(51, 154, 240, 0.18);
}
</style>