from flask import Blueprint, request, jsonify
from auth import auth_required
from memory import users_memory
from modules.wallet.wallet_manager import wallets_memory, transactions_memory
from logger import log_info
import random
from datetime import datetime

# ===============================
# 🔹 Blueprint Games API
# ===============================
games_bp = Blueprint('games', __name__)

# -------------------------------
# 🔹 Start BTC Game
@games_bp.route('/api/games/btc', methods=['POST'])
@auth_required
def play_btc_game():
    user_id = request.user.get("id")
    data = request.get_json()
    bet_amount = data.get("bet")

    if bet_amount is None or bet_amount <= 0:
        return jsonify({"error": "Bet amount must be positive"}), 400

    # تحقق من رصيد المستخدم
    wallet_list = wallets_memory.get("user_id", user_id)
    if not wallet_list or wallet_list[0]["balance"] < bet_amount:
        return jsonify({"error": "Insufficient balance"}), 400

    wallet = wallet_list[0]

    # -------------------------------
    # 🔹 لعبة BTC عشوائية
    outcome = random.random()
    reward = 0
    if outcome < 0.45:
        # خسارة الرهان
        wallet["balance"] -= bet_amount
        log_info(f"User {user_id} lost {bet_amount} in BTC game")
    elif outcome < 0.9:
        # ربح 1x
        reward = bet_amount
        wallet["balance"] += reward
        log_info(f"User {user_id} won {reward} in BTC game")
    else:
        # ربح 2x (Jackpot)
        reward = bet_amount * 2
        wallet["balance"] += reward
        log_info(f"User {user_id} hit jackpot {reward} in BTC game")

    wallets_memory.update("user_id", user_id, wallet)

    # تسجيل المعاملة
    transaction = {
        "id": len(transactions_memory.all()) + 1,
        "user_id": user_id,
        "type": "btc_game",
        "bet": bet_amount,
        "reward": reward,
        "timestamp": str(datetime.utcnow())
    }
    transactions_memory.append(transaction)

    return jsonify({
        "user_id": user_id,
        "bet": bet_amount,
        "reward": reward,
        "balance": wallet["balance"]
    }), 200

# -------------------------------
# 🔹 List All Games History for User
@games_bp.route('/api/games/history', methods=['GET'])
@auth_required
def games_history():
    user_id = request.user.get("id")
    history = [t for t in transactions_memory.all() if t["user_id"] == user_id and t["type"] == "btc_game"]
    return jsonify(history), 200
