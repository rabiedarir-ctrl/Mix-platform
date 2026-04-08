import { SocialAPI, UsersAPI } from "./api.js";

// ===========================
// 🔹 عناصر DOM الأساسية
// ===========================
const postsContainer = document.getElementById("postsContainer");
const postForm = document.getElementById("postForm");
const postInput = document.getElementById("postInput");

// ===========================
// 🔹 جلب وعرض المنشورات
// ===========================
async function loadPosts() {
    const posts = await SocialAPI.getPosts();
    if (!posts) return;

    postsContainer.innerHTML = "";
    posts.forEach(post => {
        const postEl = document.createElement("div");
        postEl.classList.add("post");

        postEl.innerHTML = `
            <div class="post-header">
                <strong>${post.authorName}</strong>
                <span>${new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div class="post-body">${post.content}</div>
            <div class="post-footer">
                <button class="likeBtn" data-id="${post.id}">👍 ${post.likes}</button>
                <button class="commentBtn" data-id="${post.id}">💬 ${post.comments.length}</button>
            </div>
        `;

        postsContainer.appendChild(postEl);
    });

    attachPostEventListeners();
}

// ===========================
// 🔹 إرسال منشور جديد
// ===========================
if (postForm) {
    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = postInput.value.trim();
        if (!content) return;

        const newPost = await SocialAPI.createPost({ content });
        if (newPost && !newPost.error) {
            postInput.value = "";
            loadPosts();
        } else {
            alert("فشل إنشاء المنشور");
        }
    });
}

// ===========================
// 🔹 التعامل مع الإعجابات والتعليقات
// ===========================
function attachPostEventListeners() {
    const likeButtons = document.querySelectorAll(".likeBtn");
    likeButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const postId = btn.dataset.id;
            // مؤقت: زيادة عدد الإعجابات محليًا (يمكن ربط API لاحقًا)
            btn.textContent = `👍 ${parseInt(btn.textContent.split(" ")[1]) + 1}`;
        });
    });

    const commentButtons = document.querySelectorAll(".commentBtn");
    commentButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const postId = btn.dataset.id;
            alert(`فتح التعليقات للمنشور #${postId} (قيد التطوير)`);
        });
    });
}

// ===========================
// 🔹 التحميل الأولي للمنشورات
// ===========================
document.addEventListener("DOMContentLoaded", loadPosts);
