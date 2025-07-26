<template>
  <main class="container my-5 animate-fadein">
    <div class="text-center mb-5">
      <span class="intruct-hero-icon mb-3">📖</span>
      <h2 class="intruct-title">Hướng dẫn mượn & trả sách</h2>
      <p class="intruct-slogan">Chỉ với vài bước đơn giản, bạn đã có thể tiếp cận tri thức!</p>
    </div>
    <div class="row g-4">
      <div class="col-md-4" v-for="(step, idx) in steps" :key="idx">
        <div class="step-card shadow-lg p-4 rounded-4 bg-white h-100 animate-step" :style="{animationDelay: (idx*0.15)+'s'}">
          <div class="step-number mb-3">{{ idx + 1 }}</div>
          <div class="step-icon mb-2">{{ step.icon }}</div>
          <h5 class="mb-2">{{ step.title }}</h5>
          <p class="mb-0">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
const steps = [
  {
    icon: "🔎",
    title: "Tìm kiếm sách",
    desc: "Sử dụng thanh tìm kiếm hoặc vào 'Danh mục sách' để chọn sách bạn muốn mượn."
  },
  {
    icon: "📝",
    title: "Đăng ký mượn",
    desc: "Nhấn nút 'Mượn' và xác nhận thông tin. Sách sẽ được giữ cho bạn tại thư viện trong vòng 3 ngày. Nếu sau 3 ngày bạn không đến lấy sách thì sẽ bị đặt lại trạng thái 'Chờ duyệt'."
  },
  {
    icon: "📦",
    title: "Nhận & trả sách",
    desc: "Đến thư viện nhận sách. Khi trả, hãy đến thư viện trả và trạng thái 'Đã trả' sẽ được cập nhật trong 'Lịch sử mượn'. Thời hạn mượn sách là 14 ngày, nếu sau 14 ngày sẽ bị tính phí trễ 5000đ/ngày."
  }
];
</script>

<style scoped>
.animate-fadein {
  animation: fadeInUp 0.7s ease;
}
@keyframes fadeInUp {
  0% { transform: translateY(40px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.animate-step {
  animation: fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) both;
}
.intruct-hero-icon {
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
.intruct-title {
  font-weight: 700;
  color: #339af0;
  font-size: 2.2rem;
}
.intruct-slogan {
  color: #3890d4;
  font-size: 1.1rem;
}
.step-card {
  border: 1.5px solid #e7f5ff;
  border-radius: 18px;
  transition: box-shadow 0.18s, transform 0.18s;
  background: #fff;
  text-align: center;
  min-height: 260px;
}
.step-card:hover {
  box-shadow: 0 8px 32px 0 #339af055;
  transform: translateY(-4px) scale(1.03);
}
.step-number {
  font-size: 2.2rem;
  font-weight: 700;
  color: #339af0;
  background: #e7f5ff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.step-icon {
  font-size: 2rem;
}
</style>