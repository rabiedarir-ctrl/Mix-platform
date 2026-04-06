from flask import Blueprint, request, jsonify
from auth import auth_required
from memory import dream_worlds_memory, users_memory
from logger import log_info
import datetime

# ===============================
# 🔹 Blueprint Metaverse API
# ===============================
metaverse_bp = Blueprint('metaverse', __name__)

# -------------------------------
# 🔹 Get all available worlds
@metaverse_bp.route('/api/metaverse/worlds', methods=['GET'])
def list_worlds():
    worlds = dream_worlds_memory.all()
    return jsonify(worlds), 200

# -------------------------------
# 🔹 Get current user world
@metaverse_bp.route('/api/metaverse/myworld', methods=['GET'])
@auth_required
def my_world():
    user_id = request.user.get("id")
    world_list = dream_worlds_memory.get("user_id", user_id)
    if not world_list:
        return jsonify({"error": "No world assigned"}), 404

    world = world_list[0]
    return jsonify(world), 200

# -------------------------------
# 🔹 Update world state (Protected)
@metaverse_bp.route('/api/metaverse/worlds/<int:world_id>', methods=['PUT'])
@auth_required
def update_world(world_id):
    data = request.get_json()
    world_list = dream_worlds_memory.get("id", world_id)
    if not world_list:
        return jsonify({"error": "World not found"}), 404

    world = world_list[0]

    # تحديث الحقول المسموح بها
    allowed_fields = ["name", "objects", "players", "dream_state"]
    for field in allowed_fields:
        if field in data:
            world[field] = data[field]

    dream_worlds_memory.update("id", world_id, world)
    log_info(f"World updated: ID {world_id} by user {request.user.get('id')}")
    return jsonify(world), 200

# -------------------------------
# 🔹 Sync world state for multiplayer (Protected)
@metaverse_bp.route('/api/metaverse/sync/<int:world_id>', methods=['POST'])
@auth_required
def sync_world(world_id):
    data = request.get_json()
    world_list = dream_worlds_memory.get("id", world_id)
    if not world_list:
        return jsonify({"error": "World not found"}), 404

    world = world_list[0]
    # تحديث حالة اللاعبين والأحداث
    world["players"] = data.get("players", world.get("players", []))
    world["objects"] = data.get("objects", world.get("objects", []))
    world["dream_state"] = data.get("dream_state", world.get("dream_state", {}))

    dream_worlds_memory.update("id", world_id, world)
    log_info(f"World synced: ID {world_id} by user {request.user.get('id')}")
    return jsonify(world), 200

# -------------------------------
# 🔹 Load Dream Engine Data
@metaverse_bp.route('/api/metaverse/dreams/<int:user_id>', methods=['GET'])
@auth_required
def get_dream_engine(user_id):
    user = users_memory.get("id", user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    world_list = dream_worlds_memory.get("user_id", user_id)
    dream_data = world_list[0].get("dream_state") if world_list else {}
    return jsonify({
        "user_id": user_id,
        "dream_state": dream_data
    }), 200
