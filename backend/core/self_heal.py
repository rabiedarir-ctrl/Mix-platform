import datetime
from memory import users_memory

# ===============================
# 🔹 Self-Heal Engine
# ===============================
class SelfHeal:
    def __init__(self, regen_rate_per_hour=5, max_energy=100):
        """
        regen_rate_per_hour: عدد نقاط الطاقة التي يستعيدها المستخدم في الساعة
        max_energy: الحد الأقصى للطاقة
        """
        self.regen_rate = regen_rate_per_hour
        self.max_energy = max_energy

    def heal_user(self, user):
        """
        تحديث طاقة مستخدم محدد
        """
        last_update_str = user.get("last_heal")
        now = datetime.datetime.utcnow()

        if last_update_str:
            last_update = datetime.datetime.fromisoformat(last_update_str)
            elapsed_hours = (now - last_update).total_seconds() / 3600
        else:
            elapsed_hours = 1  # أول مرة يتم فيها التحديث

        # حساب الطاقة المكتسبة
        energy_gain = int(elapsed_hours * self.regen_rate)
        if energy_gain > 0:
            user["energy"] = min(user.get("energy", self.max_energy) + energy_gain, self.max_energy)
            user["last_heal"] = now.isoformat()
            users_memory.update("id", user["id"], user)

        return user

    def heal_all_users(self):
        """
        تحديث طاقة جميع المستخدمين
        """
        all_users = users_memory.all()
        updated_users = []
        for user in all_users:
            updated_user = self.heal_user(user)
            updated_users.append(updated_user)
        return updated_users

# ===============================
# 🔹 Instance جاهز للاستخدام
# ===============================
self_heal_engine = SelfHeal(regen_rate_per_hour=5, max_energy=100)
