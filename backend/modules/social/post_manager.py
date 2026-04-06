from datetime import datetime
from memory import social_memory
from logger import log_info

# ===============================
# 🔹 Post Manager
# ===============================

class PostManager:
    def __init__(self):
        self.memory = social_memory

    # -------------------------------
    # 🔹 إنشاء منشور جديد
    def create_post(self, user_id, content, media=None):
        if not content:
            raise ValueError("Content is required for a post")

        post_id = len(self.memory.all()) + 1
        post = {
            "id": post_id,
            "user_id": user_id,
            "content": content,
            "media": media or [],
            "created_at": str(datetime.utcnow()),
            "updated_at": None
        }
        self.memory.append(post)
        log_info(f"Post created: ID {post_id} by user {user_id}")
        return post

    # -------------------------------
    # 🔹 تعديل منشور موجود
    def update_post(self, post_id, user_id, content=None, media=None):
        posts = self.memory.get("id", post_id)
        if not posts:
            raise ValueError("Post not found")

        post = posts[0]
        if post["user_id"] != user_id:
            raise PermissionError("Cannot edit another user's post")

        if content:
            post["content"] = content
        if media is not None:
            post["media"] = media

        post["updated_at"] = str(datetime.utcnow())
        self.memory.update("id", post_id, post)
        log_info(f"Post updated: ID {post_id} by user {user_id}")
        return post

    # -------------------------------
    # 🔹 حذف منشور
    def delete_post(self, post_id, user_id):
        posts = self.memory.get("id", post_id)
        if not posts:
            raise ValueError("Post not found")

        post = posts[0]
        if post["user_id"] != user_id:
            raise PermissionError("Cannot delete another user's post")

        self.memory.remove("id", post_id)
        log_info(f"Post deleted: ID {post_id} by user {user_id}")
        return True

    # -------------------------------
    # 🔹 جلب المنشورات (اختياري حسب المستخدم)
    def get_posts(self, user_id=None):
        if user_id:
            return [p for p in self.memory.all() if p["user_id"] == user_id]
        return self.memory.all()
