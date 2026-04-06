import { WalletAPI } from "./api.js";

// ===========================
// 🔹 عناصر DOM الأساسية
// ===========================
const balanceEl = document.getElementById("walletBalance");
const transactionsContainer = document.getElementById("transactionsContainer");
const sendForm = document.getElementById("sendForm");
const recipientInput = document.getElementById("recipient");
const amountInput = document.getElementById("amount");

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
// 🔹 جلب المعاملات
// ===========================
async function loadTransactions() {
    const txs = await WalletAPI.getTransactions();
    if (!txs) return;

    transactionsContainer.innerHTML = "";
    txs.forEach(tx => {
        const txEl = document.createElement("div");
        txEl.classList.add("transaction");
        txEl.innerHTML = `
            <span>${tx.type.toUpperCase()}</span>
            <span>${tx.amount.toFixed(2)} MIX</span>
            <span>${new Date(tx.date).toLocaleString()}</span>
        `;
        transactionsContainer.appendChild(txEl);
    });
}

// ===========================
// 🔹 إرسال الأموال
// ===========================
if (sendForm) {
    sendForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const recipient = recipientInput.value.trim();
        const amount = parseFloat(amountInput.value);

        if (!recipient || isNaN(amount) || amount <= 0) {
            alert("أدخل بيانات صحيحة");
            return;
        }

        const response = await WalletAPI.sendFunds({ recipient, amount });
        if (response && !response.error) {
            alert("تم الإرسال بنجاح");
            recipientInput.value = "";
            amountInput.value = "";
            loadBalance();
            loadTransactions();
        } else {
            alert(response.message || "فشل في إرسال الأموال");
        }
    });
}

// ===========================
// 🔹 التحميل الأولي
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    loadBalance();
    loadTransactions();
});
