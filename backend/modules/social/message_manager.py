from datetime import datetime
from memory import messages_memory
from logger import log_info

# ===============================
# 🔹 Message Manager
# ===============================

class MessageManager:
    def __init__(self):
        self.memory = messages_memory

    # -------------------------------
    # 🔹 إرسال رسالة جديدة
    def send_message(self, sender_id, receiver_id, content):
        if not content:
            raise ValueError("Content is required for a message")

        message_id = len(self.memory.all()) + 1
        message = {
            "id": message_id,
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "content": content,
            "created_at": str(datetime.utcnow()),
            "updated_at": None
        }
        self.memory.append(message)
        log_info(f"Message sent: ID {message_id} from {sender_id} to {receiver_id}")
        return message

    # -------------------------------
    # 🔹 تعديل رسالة
    def update_message(self, message_id, user_id, content):
        messages = self.memory.get("id", message_id)
        if not messages:
            raise ValueError("Message not found")

        message = messages[0]
        if message["sender_id"] != user_id:
            raise PermissionError("Cannot edit another user's message")

        message["content"] = content
        message["updated_at"] = str(datetime.utcnow())
        self.memory.update("id", message_id, message)
        log_info(f"Message updated: ID {message_id} by user {user_id}")
        return message

    # -------------------------------
    # 🔹 حذف رسالة
    def delete_message(self, message_id, user_id):
        messages = self.memory.get("id", message_id)
        if not messages:
            raise ValueError("Message not found")

        message = messages[0]
        if message["sender_id"] != user_id:
            raise PermissionError("Cannot delete another user's message")

        self.memory.remove("id", message_id)
        log_info(f"Message deleted: ID {message_id} by user {user_id}")
        return True

    # -------------------------------
    # 🔹 جلب الرسائل لمستخدم معين
    def get_messages(self, user_id, peer_id=None):
        msgs = [m for m in self.memory.all() if m["sender_id"] == user_id or m["receiver_id"] == user_id]
        if peer_id:
            msgs = [m for m in msgs if m["sender_id"] == peer_id or m["receiver_id"] == peer_id]
        return msgs
