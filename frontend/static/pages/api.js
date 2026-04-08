// ===========================
// 🔹 إعداد API Base
// ===========================
const API_BASE = "http://localhost:3000/api";
const token = localStorage.getItem("mixToken");
const StoreAPI = {
    getProducts: () => fetchGet("/store/items"),
    buyProduct: (id) => fetchPost("/store/buy", { itemId: id })
};
// ===========================
// 🔹 إعدادات Fetch العامة
// ===========================
async function fetchGet(endpoint) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await res.json();
    } catch (err) {
        console.error(`GET ${endpoint} Error:`, err);
        return null;
    }
}

async function fetchPost(endpoint, body) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        return await res.json();
    } catch (err) {
        console.error(`POST ${endpoint} Error:`, err);
        return null;
    }
}

// ===========================
// 🔹 API المستخدم
// ===========================
const UsersAPI = {
    getMe: () => fetchGet("/users/me"),
    getNotifications: () => fetchGet("/users/notifications"),
    updateProfile: (data) => fetchPost("/users/update", data)
};

// ===========================
// 🔹 API الألعاب
// ===========================
const GamesAPI = {
    getGameState: (gameId) => fetchGet(`/games/${gameId}/state`),
    submitMove: (gameId, move) => fetchPost(`/games/${gameId}/move`, move)
};

// ===========================
// 🔹 API المحفظة الرقمية
// ===========================
const WalletAPI = {
    getBalance: () => fetchGet("/wallet/balance"),
    getTransactions: () => fetchGet("/wallet/transactions"),
    sendFunds: (data) => fetchPost("/wallet/send", data)
};

// ===========================
// 🔹 API الدردشة والمجتمع
// ===========================
const SocialAPI = {
    getPosts: () => fetchGet("/social/posts"),
    createPost: (post) => fetchPost("/social/posts", post),
    getMessages: () => fetchGet("/social/messages"),
    sendMessage: (msg) => fetchPost("/social/messages", msg)
};

// ===========================
// 🔹 API عالم الأحلام
// ===========================
const DreamsAPI = {
    getDreams: () => fetchGet("/dreams/list"),
    submitDream: (dream) => fetchPost("/dreams/create", dream),
    getDreamWorld: () => fetchGet("/dreams/world")
};

// ===========================
// 🔹 API Metaverse / Matrix
// ===========================
const MatrixAPI = {
    getRooms: () => fetchGet("/matrix/rooms"),
    joinRoom: (roomId) => fetchPost(`/matrix/rooms/${roomId}/join`, {})
};

// ===========================
// 🔹 التصدير للاستخدام في باقي السكربتات
// ===========================
export {
    UsersAPI,
    GamesAPI,
    WalletAPI,
    SocialAPI,
    DreamsAPI,
    MatrixAPI,
    fetchGet,
    fetchPost
};
