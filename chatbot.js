/* ===========================================================
   GLOBAL CONFIG
=========================================================== */
const API_URL = "http://127.0.0.1:8000/chat";
const sessionId = "user_" + Math.floor(Math.random() * 100000);

/* ===========================================================
   TIMESTAMP FORMATTER
=========================================================== */
function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ===========================================================
   APPEND MESSAGE TO CHAT
=========================================================== */
function appendMessage(role, text) {
    const box = document.getElementById("chatBox");

    const wrapper = document.createElement("div");
    wrapper.classList.add("chat-message", role === "User" ? "user" : "bot");

    const bubble = document.createElement("div");
    bubble.classList.add("message-content");
    bubble.textContent = text;

    const timestamp = document.createElement("div");
    timestamp.classList.add("timestamp");
    timestamp.textContent = getTimestamp();

    wrapper.appendChild(bubble);
    wrapper.appendChild(timestamp);
    box.appendChild(wrapper);

    box.scrollTop = box.scrollHeight;
}

/* ===========================================================
   SEND MESSAGE
=========================================================== */
async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    appendMessage("User", message);
    input.value = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId, message })
        });

        const data = await response.json();
        appendMessage("Bot", data.response || "⚠️ Server error.");
    } catch (err) {
        appendMessage("Bot", "⚠️ Backend server unreachable.");
    }
}

/* ===========================================================
   DARK MODE — FIXED & SYNCS WITH CSS
=========================================================== */

/* Apply theme to <html> */
function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
}

/* Check system theme */
function detectSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

/* Manual toggle connected to button */
function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";

    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Update button icon
    const btn = document.getElementById("themeToggle");
    btn.textContent = newTheme === "dark" ? "☀️" : "🌙";
}

/* Load theme on startup */
function loadTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(detectSystemTheme());
    }

    // Sync button icon
    const btn = document.getElementById("themeToggle");
    const current = document.documentElement.getAttribute("data-theme");
    btn.textContent = current === "dark" ? "☀️" : "🌙";

    // Add event listener
    btn.addEventListener("click", toggleTheme);
}

/* ===========================================================
   INITIALIZE
=========================================================== */
window.onload = () => {
    loadTheme();
};
