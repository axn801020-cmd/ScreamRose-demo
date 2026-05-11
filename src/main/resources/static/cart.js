// 取得購物車（若沒有就給空陣列）
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// 存回購物車
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 格式化金額
function formatMoney(n) {
  return Number(n).toLocaleString();
}

// 渲染購物車（可被重複呼叫）
function renderCart() {
  const cart = getCart();
  const cartList = document.getElementById("cart-list");
  const totalEl = document.getElementById("total-price");
  const cartContainer = document.querySelector(".cart-container");

  // 如果沒有購物車相關元素就不執行
  if (!cartList || !totalEl || !cartContainer) return;

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `<p class="empty-cart">購物車目前為空。<a href="index.html">回到商品頁</a></p>`;
    totalEl.textContent = "NT$ 0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const qty = item.qty || 1;
    const itemTotal = (item.price || 0) * qty;
    total += itemTotal;

    cartList.insertAdjacentHTML("beforeend", `
      <div class="cart-item" data-index="${index}">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>顏色：${item.color}</p>
          <p>數量：<span class="item-qty">${qty}</span></p>
        </div>
        <div class="cart-price">
          NT$ ${formatMoney(itemTotal)}
          <button class="remove-btn" data-index="${index}" aria-label="移除商品">✕</button>
        </div>
      </div>
    `);
  });

  totalEl.textContent = "NT$ " + formatMoney(total);
}

// ✅ 修正①：只保留一個 click 事件（用 closest 版本），刪除舊的重複監聽器
document.addEventListener("click", function (e) {

  // 加入購物車
  const addBtn = e.target.closest && e.target.closest(".add-cart");
  if (addBtn) {
    let qty = 1;
    const container = addBtn.closest(".product") || document;
    const qtyInput = container.querySelector("#qty") || container.querySelector(".qty");
    if (qtyInput) {
      const parsed = parseInt(qtyInput.value, 10);
      if (!isNaN(parsed) && parsed > 0) qty = parsed;
    }

    const product = {
      id: addBtn.dataset.id,
      name: addBtn.dataset.name,
      color: addBtn.dataset.color || "",
      price: Number(addBtn.dataset.price) || 0,
      image: addBtn.dataset.image || "",
      qty: qty
    };

    const cart = getCart();
    const existing = cart.find(item => item.id === product.id && item.color === product.color);
    if (existing) {
      existing.qty = (existing.qty || 0) + product.qty;
    } else {
      cart.push(product);	
    }

    saveCart(cart);

    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) cartCountEl.textContent = cart.reduce((s, it) => s + (it.qty || 0), 0);
	
    renderCart();
		
    alert("已加入購物車！");
    return;
  }

  // 刪除商品
  const removeBtn = e.target.closest && e.target.closest(".remove-btn");
  if (removeBtn) {
    const index = Number(removeBtn.dataset.index);
    if (!isNaN(index)) {
      const cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    }
    return;
  }
});

// ✅ 修正②③：移除孤立的 });，改用 DOMContentLoaded 綁定結帳按鈕
document.addEventListener("DOMContentLoaded", function () {
  renderCart();

  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const cart = getCart();
      if (cart.length === 0) {
        alert("購物車為空！");
        return;
      }
      window.location.href = "checkout.html";
    });
  }
});
