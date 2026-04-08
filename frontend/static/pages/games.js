import { GamesAPI, UsersAPI } from "./api.js";

// ===========================
// 🔹 عناصر DOM
// ===========================
const gamesContainer = document.getElementById("gamesContainer");
const gameContainer = document.getElementById("gameContainer");
const gameTitle = document.getElementById("gameTitle");

// ===========================
// 🔹 تحميل قائمة الألعاب
// ===========================
async function loadGames() {
    const games = await GamesAPI.getGameState("list"); // أو API خاص باللائحة
    if (!games) return;

    gamesContainer.innerHTML = "";

    games.forEach(game => {
        const gameEl = document.createElement("div");
        gameEl.classList.add("game");

        gameEl.innerHTML = `
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <button class="playBtn" data-id="${game.id}" data-name="${game.name}">
                تشغيل
            </button>
        `;

        gamesContainer.appendChild(gameEl);
    });

    attachGameEvents();
}

// ===========================
// 🔹 تشغيل لعبة
// ===========================
function attachGameEvents() {
    const buttons = document.querySelectorAll(".playBtn");

    buttons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const gameId = btn.dataset.id;
            const name = btn.dataset.name;

            startGame(gameId, name);
        });
    });
}

// ===========================
// 🔹 بدء اللعبة
// ===========================
async function startGame(gameId, name) {
    gameTitle.textContent = name;
    gameContainer.innerHTML = "<p>جارٍ تحميل اللعبة...</p>";

    // تحميل ديناميكي للعبة
    try {
        if (gameId === "btc_game") {
            const module = await import("./modules/games/btc_game.js");
            module.startBTCGame(gameContainer, onGameEnd);
        } else {
            gameContainer.innerHTML = "<p>اللعبة غير متوفرة حالياً</p>";
        }
    } catch (err) {
        console.error(err);
        gameContainer.innerHTML = "<p>خطأ في تحميل اللعبة</p>";
    }
}

// ===========================
// 🔹 عند انتهاء اللعبة
// ===========================
async function onGameEnd(result) {
    /*
        result = {
            score: number,
            energyChange: number
        }
    */

    try {
        await GamesAPI.submitMove("btc_game", result);

        // تحديث بيانات المستخدم بعد اللعبة
        const user = await UsersAPI.getMe();
        if (user) {
            console.log("Updated user:", user);
        }

        alert(`انتهت اللعبة! النقاط: ${result.score}`);
    } catch (err) {
        console.error("Game End Error:", err);
    }
}

// ===========================
// 🔹 التحميل الأولي
// ===========================
document.addEventListener("DOMContentLoaded", loadGames);
