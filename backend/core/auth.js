"use strict";

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "رمز المصادقة مطلوب"
            });
        }

        const token = authHeader.substring(7).trim();

        if (!token) {
            return res.status(401).json({
                message: "رمز المصادقة غير صالح"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                message: "إعدادات المصادقة غير مكتملة"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded.userId) {
            return res.status(401).json({
                message: "رمز المصادقة غير صالح"
            });
        }

        req.user = decoded;

        next();
    } catch (error) {
        console.error("AUTH ERROR:", error.message);

        return res.status(401).json({
            message: "رمز المصادقة منتهي أو غير صالح"
        });
    }
}

module.exports = {
    authenticateToken
};
