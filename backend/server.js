// ======================================================
// Mix Platform - API Client
// File: frontend/static/pages/api.js
// ======================================================

"use strict";

// ======================================================
// 🔹 API Base
// ======================================================

const API_BASE = "http://localhost:3000/api";
window.MIX_API_BASE = API_BASE;

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
    const contentType = response.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        let message = `HTTP ${response.status}`;

        if (data && typeof data === "object") {
            message = data.message || data.error || message;
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
// 🔐 Authentication API
// ======================================================

const AuthAPI = {
    login: (identifier, password) => {
        const payload = identifier.includes("@")
            ? { email: identifier, password }
            : { username: identifier, password };

        return fetchPost("/users/login", payload);
    },

    register: (data) => fetchPost("/users/register", data)
};

window.AuthAPI = AuthAPI;
window.MixAPI = {
    API_BASE: window.MIX_API_BASE,
    AuthAPI,
    fetchGet,
    fetchPost,
    getToken
};

console.log("✅ Mix Platform API loaded:", window.MIX_API_BASE);
