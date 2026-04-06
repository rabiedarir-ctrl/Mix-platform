from datetime import datetime
from memory import alerts_memory
from logger import log_info

# ===============================
# 🔹 AI Alerts Manager
# ===============================

class AIAlerts:
    def __init__(self):
        self.memory = alerts_memory

    # -------------------------------
    # 🔹 إرسال تنبيه
    def send_alert(self, user_id, message, alert_type="info"):
        if not message:
            raise ValueError("Alert message is required")

        alert_id = len(self.memory.all()) + 1
        alert = {
            "id": alert_id,
            "user_id": user_id,
            "message": message,
            "type": alert_type,
            "created_at": str(datetime.utcnow()),
            "read": False
        }
        self.memory.append(alert)
        log_info(f"Alert sent: ID {alert_id} to user {user_id}, type: {alert_type}")
        return alert

    # -------------------------------
    # 🔹 جلب جميع التنبيهات لمستخدم
    def get_alerts(self, user_id, unread_only=False):
        alerts = [a for a in self.memory.all() if a["user_id"] == user_id]
        if unread_only:
            alerts = [a for a in alerts if not a["read"]]
        return alerts

    # -------------------------------
    # 🔹 حذف تنبيه
    def delete_alert(self, alert_id, user_id):
        alerts = [a for a in self.memory.all() if a["id"] == alert_id and a["user_id"] == user_id]
        if not alerts:
            raise ValueError("Alert not found")
        self.memory.remove("id", alert_id)
        log_info(f"Alert deleted: ID {alert_id} for user {user_id}")
        return True
