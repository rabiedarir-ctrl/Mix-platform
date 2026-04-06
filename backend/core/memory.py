import os
import json
from pathlib import Path
from dotenv import load_dotenv

# ===============================
# 🔹 Load ENV
# ===============================
load_dotenv()

STORAGE_PATH = Path(os.getenv("STORAGE_PATH", "./storage"))
USERS_FILE = STORAGE_PATH / "users.json"
SOCIAL_FILE = STORAGE_PATH / "social.json"
MESSAGES_FILE = STORAGE_PATH / "messages.json"
WALLETS_FILE = STORAGE_PATH / "wallets.json"
DREAMS_FILE = STORAGE_PATH / "dreams.json"
DREAM_WORLDS_FILE = STORAGE_PATH / "dream_worlds.json"

# ===============================
# 🔹 Helper Functions
# ===============================

def ensure_file(file_path, default_data):
    """تأكد من وجود ملف JSON"""
    if not file_path.exists():
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(default_data, f, indent=4)

def load_json(file_path):
    """تحميل JSON"""
    ensure_file(file_path, [])
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(file_path, data):
    """حفظ JSON"""
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

# ===============================
# 🔹 Memory Management Classes
# ===============================

class Memory:
    def __init__(self, file_path):
        self.file_path = Path(file_path)
        self.data = load_json(self.file_path)

    def all(self):
        return self.data

    def get(self, key, value):
        return [item for item in self.data if item.get(key) == value]

    def add(self, obj):
        self.data.append(obj)
        save_json(self.file_path, self.data)
        return obj

    def update(self, key, value, new_obj):
        updated = False
        for idx, item in enumerate(self.data):
            if item.get(key) == value:
                self.data[idx] = new_obj
                updated = True
        if updated:
            save_json(self.file_path, self.data)
        return updated

    def delete(self, key, value):
        original_len = len(self.data)
        self.data = [item for item in self.data if item.get(key) != value]
        if len(self.data) < original_len:
            save_json(self.file_path, self.data)
            return True
        return False

# ===============================
# 🔹 Instances for Project
# ===============================
users_memory = Memory(USERS_FILE)
social_memory = Memory(SOCIAL_FILE)
messages_memory = Memory(MESSAGES_FILE)
wallets_memory = Memory(WALLETS_FILE)
dreams_memory = Memory(DREAMS_FILE)
dream_worlds_memory = Memory(DREAM_WORLDS_FILE)
