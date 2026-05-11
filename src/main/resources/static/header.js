// header.js — 所有頁面共用，自動處理登入/登出狀態顯示

document.addEventListener("DOMContentLoaded", function () {

  const member = JSON.parse(localStorage.getItem("member")) || null;
  const authArea = document.getElementById("auth-area");
  const cartData = JSON.parse(localStorage.getItem("cart")) || [];

  // 更新購物車數量
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = cartData.reduce((s, i) => s + (i.qty || 0), 0);
  }

  if (!authArea) return;

  if (member) {
    const role = localStorage.getItem("role");
    const adminLink = role === "ADMIN"
      ? `<span class="auth-divider-line">|</span><a href="admin.html" class="auth-link-btn">⚙ 後台</a>`
      : "";
    authArea.innerHTML = `
      <a href="member.html" class="auth-link-btn">👤 ${member.name}</a>
      ${adminLink}
      <span class="auth-divider-line">|</span>
      <a href="#" class="auth-link-btn" id="logout-btn">登出</a>
    `;
    document.getElementById("logout-btn").addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("member");
	  localStorage.removeItem("token");
	  localStorage.removeItem("role");
      window.location.href = "index.html";
    });
  } else {
    // 未登入 → 顯示登入 / 註冊
    authArea.innerHTML = `
      <a href="login.html" class="auth-link-btn">登入</a>
      <span class="auth-divider-line">|</span>
      <a href="register.html" class="auth-link-btn">註冊</a>
    `;
  }
});