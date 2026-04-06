from flask import Blueprint, request, jsonify
from auth import register_user, login_user, auth_required, verify_token
from memory import users_memory
from self_heal import self_heal_engine
from logger import log_info, log_self_heal

# ===============================
# 🔹 Blueprint Users API
# ===============================
users_bp = Blueprint('users', __name__)

# -------------------------------
# 🔹 Register New User
@users_bp.route('/api/users/register', methods=['POST'])
def api_register_user():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"error": "Name is required"}), 400

    result = register_user(name)
    log_info(f"New user registered: {name} (ID: {result['user']['id']})")
    return jsonify(result), 201

# -------------------------------
# 🔹 Login User by ID
@users_bp.route('/api/users/login', methods=['POST'])
def api_login_user():
    data = request.get_json()
    user_id = data.get("id")
    if user_id is None:
        return jsonify({"error": "User ID is required"}), 400

    result = login_user(user_id)
    if "error" in result:
        return jsonify(result), 404

    log_info(f"User logged in: ID {user_id}")
    return jsonify(result), 200

# -------------------------------
# 🔹 Get Current User (Protected)
@users_bp.route('/api/users/me', methods=['GET'])
@auth_required
def api_get_current_user():
    user_id = request.user.get("id")
    user_list = users_memory.get("id", user_id)
    if not user_list:
        return jsonify({"error": "User not found"}), 404

    user = user_list[0]

    # تحديث الطاقة تلقائيًا عند كل طلب
    old_energy = user.get("energy", 100)
    updated_user = self_heal_engine.heal_user(user)
    new_energy = updated_user.get("energy", old_energy)
    log_self_heal(user_id=user_id, old_energy=old_energy, new_energy=new_energy)

    return jsonify(updated_user), 200

# -------------------------------
# 🔹 Update User Info (Protected)
@users_bp.route('/api/users/<int:user_id>', methods=['PUT'])
@auth_required
def api_update_user(user_id):
    user_list = users_memory.get("id", user_id)
    if not user_list:
        return jsonify({"error": "User not found"}), 404

    user = user_list[0]
    data = request.get_json()

    # تحديث الحقول المسموح بها فقط
    allowed_fields = ["name", "energy", "cells"]
    for field in allowed_fields:
        if field in data:
            user[field] = data[field]

    users_memory.update("id", user_id, user)
    log_info(f"User updated: ID {user_id}")
    return jsonify(user), 200

# -------------------------------
# 🔹 Delete User (Protected)
@users_bp.route('/api/users/<int:user_id>', methods=['DELETE'])
@auth_required
def api_delete_user(user_id):
    user_list = users_memory.get("id", user_id)
    if not user_list:
        return jsonify({"error": "User not found"}), 404

    users_memory.delete("id", user_id)
    log_info(f"User deleted: ID {user_id}")
    return jsonify({"message": "User deleted successfully"}), 200

# -------------------------------
# 🔹 List All Users (Protected)
@users_bp.route('/api/users', methods=['GET'])
@auth_required
def api_list_users():
    all_users = users_memory.all()
    return jsonify(all_users), 200
