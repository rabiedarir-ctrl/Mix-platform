// ===========================
// 🔹 إعدادات أساسية
// ===========================
import { UsersAPI } from "./api.js";

const loginForm = document.getElementById("loginForm");
const tokenKey = "mixToken";

// ===========================
// 🔹 التحقق من التوكن عند تحميل الصفحة
// ===========================
window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem(tokenKey);

    // إذا كان في صفحة غير login.html والتحقق فشل
    if (!token && window.location.pathname !== "/login.html") {
        window.location.href = "login.html";
        return;
    }

    // تحديث البيانات الأساسية للمستخدم
    if (token) {
        const userData = await UsersAPI.getMe();
        if (!userData || userData.error) {
            // التوكن غير صالح أو انتهت صلاحيته
            localStorage.removeItem(tokenKey);
            window.location.href = "login.html";
        }
    }
});

// ===========================
// 🔹 تسجيل الدخول
// ===========================
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data && data.token) {
            localStorage.setItem(tokenKey, data.token);
            window.location.href = "dashboard.html";
        } else {
            alert(data.message || "فشل تسجيل الدخول، حاول مرة أخرى");
        }
    });
}

// ===========================
// 🔹 تسجيل الخروج
// ===========================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(tokenKey);
        window.location.href = "login.html";
    });
}
