import os
import jwt
import datetime
from dotenv import load_dotenv
from memory import users_memory

# ===============================
# 🔹 Load ENV
# ===============================
load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "mixplatformsecretkey")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_HOURS = int(os.getenv("JWT_EXPIRE_HOURS", 24))

# ===============================
# 🔹 Auth Functions
# ===============================

def generate_token(user):
    """
    توليد JWT Token للمستخدم
    """
    payload = {
        "id": user.get("id"),
        "name": user.get("name"),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRE_HOURS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def verify_token(token):
    """
    التحقق من صحة Token
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}

# ===============================
# 🔹 User Management
# ===============================

def register_user(name, energy=100):
    """
    تسجيل مستخدم جديد
    """
    all_users = users_memory.all()
    new_id = max([u["id"] for u in all_users], default=0) + 1
    user_obj = {
        "id": new_id,
        "name": name,
        "energy": energy,
        "cells": [],
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    users_memory.add(user_obj)
    token = generate_token(user_obj)
    return {"user": user_obj, "token": token}

def login_user(user_id):
    """
    تسجيل الدخول بواسطة ID
    """
    users = users_memory.get("id", user_id)
    if not users:
        return {"error": "User not found"}
    user = users[0]
    token = generate_token(user)
    return {"user": user, "token": token}

# ===============================
# 🔹 Decorator لحماية Routes
# ===============================
from functools import wraps

def auth_required(func):
    """
    تأكد من وجود Token صالح
    """
    @wraps(func)
    def wrapper(request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return {"error": "Authorization header missing"}, 401
        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            return {"error": "Bearer token malformed"}, 401

        payload = verify_token(token)
        if "error" in payload:
            return payload, 401

        # تمرير معلومات المستخدم للـ route
        request.user = payload
        return func(request)
    return wrapper
