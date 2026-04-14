import { StoreAPI, WalletAPI } from "../api.js";

// ===========================
// 🔹 عناصر DOM الأساسية
// ===========================
const productsContainer = document.getElementById("productsContainer");
const balanceEl = document.getElementById("walletBalance");

// ===========================
// 🔹 جلب وعرض المنتجات
// ===========================
async function loadProducts() {
    const products = await StoreAPI.getProducts();
    if (!products) return;

    productsContainer.innerHTML = "";
    products.forEach(product => {
        const prodEl = document.createElement("div");
        prodEl.classList.add("product");
        prodEl.innerHTML = `
            <h3>${product.name}</h3>
            <p>السعر: ${product.price.toFixed(2)} MIX</p>
            <button class="buyBtn" data-id="${product.id}">شراء</button>
        `;
        productsContainer.appendChild(prodEl);
    });

    attachBuyButtons();
}

// ===========================
// 🔹 التعامل مع زر الشراء
// ===========================
function attachBuyButtons() {
    const buyButtons = document.querySelectorAll(".buyBtn");
    buyButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const productId = btn.dataset.id;
            const response = await StoreAPI.buyProduct(productId);
            if (response && !response.error) {
                alert(`تم شراء المنتج بنجاح: ${response.product.name}`);
                loadBalance();
            } else {
                alert(response.message || "فشل الشراء");
            }
        });
    });
}

// ===========================
// 🔹 جلب الرصيد
// ===========================
async function loadBalance() {
    const data = await WalletAPI.getBalance();
    if (data && data.balance != null) {
        balanceEl.textContent = `${data.balance.toFixed(2)} MIX`;
    }
}

// ===========================
// 🔹 التحميل الأولي
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadBalance();
});
