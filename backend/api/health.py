from flask import Blueprint, jsonify
from pathlib import Path
from memory import users_memory, social_memory, messages_memory, wallets_memory, dreams_memory, dream_worlds_memory
from self_heal import self_heal_engine

# ===============================
# 🔹 Blueprint Health API
# ===============================
health_bp = Blueprint('health', __name__)

@health_bp.route('/api/health', methods=['GET'])
def health_check():
    """
    تحقق شامل من صحة النظام
    """
    status = {
        "status": "OK",
        "services": {},
        "storage": {},
        "self_heal": {},
    }

    # -------------------------------
    # 🔹 Services
    try:
        # تحقق من self_heal engine
        test_user = {"id": 0, "energy": 50}
        healed_user = self_heal_engine.heal_user(test_user)
        status["self_heal"]["heal_function"] = "OK" if healed_user["energy"] > 50 else "FAIL"
        status["services"]["memory"] = "OK"
    except Exception as e:
        status["services"]["memory"] = f"FAIL: {e}"
        status["self_heal"]["heal_function"] = f"FAIL: {e}"

    # -------------------------------
    # 🔹 Storage Files
    try:
        storage_files = {
            "users": users_memory.file_path,
            "social": social_memory.file_path,
            "messages": messages_memory.file_path,
            "wallets": wallets_memory.file_path,
            "dreams": dreams_memory.file_path,
            "dream_worlds": dream_worlds_memory.file_path
        }
        storage_status = {}
        for name, path in storage_files.items():
            storage_status[name] = "OK" if Path(path).exists() else "MISSING"
        status["storage"] = storage_status
    except Exception as e:
        status["storage"]["error"] = str(e)

    return jsonify(status), 200
