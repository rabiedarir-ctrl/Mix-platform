// ===========================
// 🔹 إعدادات أساسية للمنصة
// ===========================
const MIX_API_BASE = "http://localhost:3000/api"; // يمكن تغييره إلى الإنتاج لاحقًا
const token = localStorage.getItem("mixToken");

// ===========================
// 🔹 إعادة توجيه المستخدم إذا لم يكن مسجلاً
// ===========================
if (!token && window.location.pathname !== "../login.html") {
    window.location.href = "login.html";
}

// ===========================
// 🔹 تسجيل الخروج
// ===========================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("mixToken");
        window.location.href = "login.html";
    });
}

// ===========================
// 🔹 الوظائف المساعدة المشتركة
// ===========================
async function apiGet(endpoint) {
    try {
        const res = await fetch(`${MIX_API_BASE}${endpoint}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await res.json();
    } catch (err) {
        console.error(`API GET Error: ${endpoint}`, err);
        return null;
    }
}

async function apiPost(endpoint, body) {
    try {
        const res = await fetch(`${MIX_API_BASE}${endpoint}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        return await res.json();
    } catch (err) {
        console.error(`API POST Error: ${endpoint}`, err);
        return null;
    }
}

// ===========================
// 🔹 تحديث الطاقة للمستخدم في جميع الصفحات
// ===========================
async function updateEnergy() {
    const energyElem = document.getElementById("energyDisplay");
    if (!energyElem) return;

    const data = await apiGet("../users/me");
    if (data && data.energy !== undefined) {
        energyElem.textContent = `⚡ الطاقة: ${data.energy}`;
    }
}

// ===========================
// 🔹 تحديث الطاقة كل 5 ثوانٍ
// ===========================
setInterval(updateEnergy, 5000);

// ===========================
// 🔹 تحميل الإشعارات العامة
// ===========================
async function loadNotifications() {
    const notifElem = document.getElementById("notifications");
    if (!notifElem) return;

    const data = await apiGet("../users/notifications");
    if (data && Array.isArray(data)) {
        notifElem.innerHTML = data.map(n => `<li>${n.message}</li>`).join('');
    }
}

// ===========================
// 🔹 تنفيذ الوظائف عند تحميل الصفحة
// ===========================
window.addEventListener("DOMContentLoaded", () => {
    updateEnergy();
    loadNotifications();
});
