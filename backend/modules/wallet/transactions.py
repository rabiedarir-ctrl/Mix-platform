from datetime import datetime
from memory import wallets_memory
from logger import log_info

# ===============================
# 🔹 Transactions Manager
# ===============================

class TransactionManager:
    def __init__(self):
        self.memory = wallets_memory  # الربط مع المحفظة

    # -------------------------------
    # 🔹 إضافة معاملة جديدة
    def add_transaction(self, user_id, amount, description=""):
        wallet_list = self.memory.get("user_id", user_id)
        if not wallet_list:
            raise ValueError("Wallet not found")

        wallet = wallet_list[0]
        transaction_id = len(wallet["transactions"]) + 1
        transaction = {
            "id": transaction_id,
            "amount": amount,
            "description": description,
            "date": str(datetime.utcnow())
        }
        wallet["transactions"].append(transaction)
        wallet["balance"] += amount
        wallet["updated_at"] = str(datetime.utcnow())
        self.memory.update("user_id", user_id, wallet)
        log_info(f"Transaction added: ID {transaction_id} for wallet {wallet['id']}, Amount: {amount}")
        return transaction

    # -------------------------------
    # 🔹 تعديل معاملة
    def update_transaction(self, user_id, transaction_id, amount=None, description=None):
        wallet_list = self.memory.get("user_id", user_id)
        if not wallet_list:
            raise ValueError("Wallet not found")

        wallet = wallet_list[0]
        transactions = wallet["transactions"]
        transaction = next((t for t in transactions if t["id"] == transaction_id), None)
        if not transaction:
            raise ValueError("Transaction not found")

        if amount is not None:
            # تعديل الرصيد حسب الفرق
            diff = amount - transaction["amount"]
            wallet["balance"] += diff
            transaction["amount"] = amount

        if description is not None:
            transaction["description"] = description

        wallet["updated_at"] = str(datetime.utcnow())
        self.memory.update("user_id", user_id, wallet)
        log_info(f"Transaction updated: ID {transaction_id} for wallet {wallet['id']}")
        return transaction

    # -------------------------------
    # 🔹 حذف معاملة
    def delete_transaction(self, user_id, transaction_id):
        wallet_list = self.memory.get("user_id", user_id)
        if not wallet_list:
            raise ValueError("Wallet not found")

        wallet = wallet_list[0]
        transactions = wallet["transactions"]
        transaction = next((t for t in transactions if t["id"] == transaction_id), None)
        if not transaction:
            raise ValueError("Transaction not found")

        wallet["transactions"] = [t for t in transactions if t["id"] != transaction_id]
        wallet["balance"] -= transaction["amount"]
        wallet["updated_at"] = str(datetime.utcnow())
        self.memory.update("user_id", user_id, wallet)
        log_info(f"Transaction deleted: ID {transaction_id} for wallet {wallet['id']}")
        return True

    # -------------------------------
    # 🔹 جلب جميع المعاملات
    def get_transactions(self, user_id):
        wallet_list = self.memory.get("user_id", user_id)
        if not wallet_list:
            raise ValueError("Wallet not found")
        return wallet_list[0]["transactions"]
