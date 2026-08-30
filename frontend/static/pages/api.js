// ======================================================
// Mix Platform - API Client
// File: frontend/static/pages/api.js
// ======================================================

// ======================================================
// 🧠 Dream Memory API
// ======================================================

const DreamMemoryAPI = {

    // إنشاء ذاكرة
    create: (data) =>
        fetchPost(
            "/dream-memory",
            data
        ),

    // جلب ذاكرة
    get: (memoryId) =>
        fetchGet(
            `/dream-memory/${encodeURIComponent(memoryId)}`
        ),

    // جلب ذاكرة الخلية
    getByCell: (cellId) =>
        fetchGet(
            `/dream-memory/cell/${encodeURIComponent(cellId)}`
        ),

    // تفعيل
    activate: (memoryId) =>
        fetchPut(
            `/dream-memory/${encodeURIComponent(memoryId)}/activate`,
            {}
        ),

    // تعطيل
    deactivate: (memoryId) =>
        fetchPut(
            `/dream-memory/${encodeURIComponent(memoryId)}/deactivate`,
            {}
        ),

    // تحديث الموقع
    setLocation: (memoryId, location) =>
        fetchPut(
            `/dream-memory/${encodeURIComponent(memoryId)}/location`,
            location
        ),

    // تحديث حالة العالم
    setWorldState: (memoryId, state) =>
        fetchPut(
            `/dream-memory/${encodeURIComponent(memoryId)}/world`,
            state
        ),

    // إضافة أمر تحكم
    addAction: (memoryId, action, payload = {}) =>
        fetchPost(
            `/dream-memory/${encodeURIComponent(memoryId)}/actions`,
            {
                action,
                payload
            }
        ),

    // الأوامر غير المنفذة
    getPendingActions: (memoryId) =>
        fetchGet(
            `/dream-memory/${encodeURIComponent(memoryId)}/actions/pending`
        ),

    // تسجيل تنفيذ أمر
    markActionExecuted: (memoryId, actionId) =>
        fetchPut(
            `/dream-memory/${encodeURIComponent(memoryId)}/actions/${encodeURIComponent(actionId)}/execute`,
            {}
        ),

    // قفل
    lock: (memoryId) =>
        fetchPut(
            `/dream-memory/${encodeURIComponent(memoryId)}/lock`,
            {}
        ),

    // فتح
    unlock: (memoryId) =>
        fetchPut(
            `/dream-memory/${encodeURIComponent(memoryId)}/unlock`,
            {}
        )
};

"use strict";

// ======================================================
// 🔹 API Base
// ======================================================

// للاختبار المحلي:
const API_BASE = "http://localhost:3000/api";

// إتاحة العنوان للصفحات مثل login.html و register.html
window.MIX_API_BASE = API_BASE;DreamMemoryAPI,


// ======================================================
// 🔹 Authentication Token
// ======================================================

function getToken() {
    return localStorage.getItem("mixToken");
}

function getAuthHeaders(includeJson = false) {
    const headers = {};

    const token = getToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}


// ======================================================
// 🔹 معالجة استجابة الخادم
// ======================================================

async function parseResponse(response) {

    const contentType =
        response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {

        let message = `HTTP ${response.status}`;

        if (data && typeof data === "object") {
            message =
                data.message ||
                data.error ||
                message;
        } else if (typeof data === "string" && data.trim()) {
            message = data;
        }

        const error = new Error(message);

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}


// ======================================================
// 🔹 GET
// ======================================================

async function fetchGet(endpoint) {

    if (!endpoint.startsWith("/")) {
        endpoint = `/${endpoint}`;
    }

    const url = `${window.MIX_API_BASE}${endpoint}`;

    try {

        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: "include"
        });

        return await parseResponse(response);

    } catch (error) {

        console.error(`GET ${url} failed:`, error);

        throw error;
    }
}


// ======================================================
// 🔹 POST
// ======================================================

async function fetchPost(endpoint, body = {}) {

    if (!endpoint.startsWith("/")) {
        endpoint = `/${endpoint}`;
    }

    const url = `${window.MIX_API_BASE}${endpoint}`;

    try {

        const response = await fetch(url, {
            method: "POST",
            headers: getAuthHeaders(true),
            credentials: "include",
            body: JSON.stringify(body)
        });

        return await parseResponse(response);

    } catch (error) {

        console.error(`POST ${url} failed:`, error);

        throw error;
    }
}


// ======================================================
// 🔹 PUT
// ======================================================

async function fetchPut(endpoint, body = {}) {

    if (!endpoint.startsWith("/")) {
        endpoint = `/${endpoint}`;
    }

    const url = `${window.MIX_API_BASE}${endpoint}`;

    try {

        const response = await fetch(url, {
            method: "PUT",
            headers: getAuthHeaders(true),
            credentials: "include",
            body: JSON.stringify(body)
        });

        return await parseResponse(response);

    } catch (error) {

        console.error(`PUT ${url} failed:`, error);

        throw error;
    }
}


// ======================================================
// 🔹 DELETE
// ======================================================

async function fetchDelete(endpoint) {

    if (!endpoint.startsWith("/")) {
        endpoint = `/${endpoint}`;
    }

    const url = `${window.MIX_API_BASE}${endpoint}`;

    try {

        const response = await fetch(url, {
            method: "DELETE",
            headers: getAuthHeaders(),
            credentials: "include"
        });

        return await parseResponse(response);

    } catch (error) {

        console.error(`DELETE ${url} failed:`, error);

        throw error;
    }
}


// ======================================================
// 🔐 Authentication API
// ======================================================

const AuthAPI = {

    login: (username, password) =>
        fetchPost("/users/login", {
            username,
            password
        }),

    register: (data) =>
        fetchPost("/users/register", data)
};


// ======================================================
// 👤 Users API
// ======================================================

const UsersAPI = {

    getMe: () =>
        fetchGet("/users/me"),

    getById: (userId) =>
        fetchGet(`/users/${encodeURIComponent(userId)}`),

    getNotifications: () =>
        fetchGet("/users/notifications"),

    updateProfile: (data) =>
        fetchPut("/users/update", data)
};


// ======================================================
// 🛒 Store API
// ======================================================

const StoreAPI = {

    getProducts: () =>
        fetchGet("/store/items"),

    buyProduct: (itemId) =>
        fetchPost("/store/buy", {
            itemId
        })
};


// ======================================================
// 🎮 Games API
// Backend الحالي يستخدم BTC
// ======================================================

const GamesAPI = {

    startBTC: (userId) =>
        fetchPost("/games/btc/start", {
            userId
        }),

    updateBTC: (userId, score, energyChange) =>
        fetchPost("/games/btc/update", {
            userId,
            score,
            energyChange
        }),

    endBTC: (userId) =>
        fetchPost("/games/btc/end", {
            userId
        })
};


// ======================================================
// 💰 Wallet API
// Backend الحالي يحتاج userId في المسار
// ======================================================

const WalletAPI = {

    getBalance: (userId) =>
        fetchGet(
            `/wallet/${encodeURIComponent(userId)}/balance`
        ),

    getTransactions: (userId) =>
        fetchGet(
            `/wallet/${encodeURIComponent(userId)}/transactions`
        ),

    createTransaction: (userId, data) =>
        fetchPost(
            `/wallet/${encodeURIComponent(userId)}/transaction`,
            data
        ),

    updateTransactionStatus: (transactionId, status) =>
        fetchPut(
            `/wallet/transaction/${encodeURIComponent(transactionId)}/status`,
            {
                status
            }
        )
};


// ======================================================
// 🌐 Social API
// ======================================================

const SocialAPI = {

    getPosts: () =>
        fetchGet("/social/posts"),

    createPost: (post) =>
        fetchPost("/social/posts", post),

    addComment: (postId, data) =>
        fetchPost(
            `/social/posts/${encodeURIComponent(postId)}/comments`,
            data
        ),

    sendMessage: (message) =>
        fetchPost("/social/messages", message),

    getMessages: (userId) =>
        fetchGet(
            `/social/messages/${encodeURIComponent(userId)}`
        )
};


// ======================================================
// 🌙 Dreams API
// ======================================================

const DreamsAPI = {

    create: (dream) =>
        fetchPost("/dreams", dream),

    getByUser: (userId) =>
        fetchGet(
            `/dreams/user/${encodeURIComponent(userId)}`
        ),

    update: (dreamId, data) =>
        fetchPut(
            `/dreams/${encodeURIComponent(dreamId)}`,
            data
        ),

    addSceneObject: (dreamId, objData) =>
        fetchPost(
            `/dreams/${encodeURIComponent(dreamId)}/scene-object`,
            {
                objData
            }
        ),

    addEvent: (dreamId, eventData) =>
        fetchPost(
            `/dreams/${encodeURIComponent(dreamId)}/event`,
            {
                eventData
            }
        )
};


// ======================================================
// 🧩 Matrix API
// ======================================================

const MatrixAPI = {

    getRooms: () =>
        fetchGet("/matrix/rooms"),

    joinRoom: (roomId) =>
        fetchPost(
            `/matrix/rooms/${encodeURIComponent(roomId)}/join`,
            {}
        )
};


// ======================================================
// ❤️ Health Check
// ======================================================

const HealthAPI = {

    check: () =>
        fetchGet("/health")
};


// ======================================================
// 🔹 تصدير الخدمات إلى window
// ======================================================

// الملف يستخدم <script> عادي وليس ES Module.
// لذلك نضع الخدمات على window بدل export.

window.MixAPI = {

    API_BASE: window.MIX_API_BASE,

    AuthAPI,

    UsersAPI,

    StoreAPI,

    GamesAPI,

    WalletAPI,

    SocialAPI,

    DreamsAPI,

    MatrixAPI,

    HealthAPI,

    fetchGet,

    fetchPost,

    fetchPut,

    fetchDelete,

    getToken
};


// ======================================================
// 🔹 جاهزية API
// ======================================================

console.log(
    "✅ Mix Platform API loaded:",
    window.MIX_API_BASE
);
