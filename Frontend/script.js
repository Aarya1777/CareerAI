const API_BASE = "http://127.0.0.1:8000";

// ============================================================
// API HELPER
// ============================================================

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("careerai_token");

    const headers = {
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        let message = `Request failed (${response.status})`;

        if (data) {
            if (typeof data.detail === "string") {
                message = data.detail;
            } else if (Array.isArray(data.detail)) {
                message = data.detail
                    .map(error => error.msg || JSON.stringify(error))
                    .join(", ");
            } else if (data.detail) {
                message = JSON.stringify(data.detail);
            }
        }

        throw new Error(message);
    }

    return data;
}


// ============================================================
// LOGIN
// ============================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");
    const message = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        if (!email.value.trim() || !password.value.trim()) {
            message.textContent = "Please enter your email and password.";
            return;
        }

        message.textContent = "Logging in...";

        try {
            const result = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: email.value.trim(),
                    password: password.value
                })
            });

            localStorage.setItem("careerai_token", result.access_token);

            message.textContent = "Login successful!";

            showConfetti();

            setTimeout(function() {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (error) {
            console.error("Login error:", error);

            message.textContent =
                error.message || "Login failed.";
        }
    });
}


// ============================================================
// SIGNUP
// ============================================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    const name = document.getElementById("signupName");
    const email = document.getElementById("signupEmail");
    const password = document.getElementById("signupPassword");
    const message = document.getElementById("signupMessage");

    signupForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        if (
            !name.value.trim() ||
            !email.value.trim() ||
            !password.value.trim()
        ) {
            message.textContent =
                "Please fill in your name, email and password.";
            return;
        }

        message.textContent = "Creating your account...";

        try {
            await apiRequest("/auth/signup", {
                method: "POST",
                body: JSON.stringify({
                    name: name.value.trim(),
                    email: email.value.trim(),
                    password: password.value,
                    user_type: "student"
                })
            });

            message.textContent =
                "Account created successfully!";

            showConfetti();

            setTimeout(function() {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {
            console.error("Signup error:", error);

            message.textContent =
                error.message || "Signup failed.";
        }
    });
}


// ============================================================
// LOGOUT
// ============================================================

function logout() {
    localStorage.removeItem("careerai_token");
    window.location.href = "login.html";
}


// ============================================================
// AUTH CHECK
// ============================================================

function requireLogin() {
    const token = localStorage.getItem("careerai_token");

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}


// ============================================================
// CONFETTI
// ============================================================

function showConfetti() {
    for (let i = 0; i < 80; i++) {
        const piece = document.createElement("div");

        piece.style.position = "fixed";
        piece.style.width = "8px";
        piece.style.height = "8px";

        piece.style.backgroundColor =
            i % 2 === 0 ? "#7A1F1F" : "#C9AAA0";

        piece.style.left =
            Math.random() * 100 + "vw";

        piece.style.top = "-10px";
        piece.style.zIndex = "9999";
        piece.style.pointerEvents = "none";

        document.body.appendChild(piece);

        const duration =
            1000 + Math.random() * 1500;

        piece.animate(
            [
                {
                    transform: "translateY(0) rotate(0deg)",
                    opacity: 1
                },
                {
                    transform: "translateY(100vh) rotate(720deg)",
                    opacity: 0
                }
            ],
            {
                duration: duration,
                easing: "ease-out"
            }
        );

        setTimeout(function() {
            piece.remove();
        }, duration);
    }
}
// ========================================
// CAREERAI INTERACTIVE MASCOT
// ========================================
document.addEventListener("DOMContentLoaded", function () {
const assistant = document.querySelector(".cursor-assistant");
const cursorMascot = document.getElementById("cursor-mascot");

if (!assistant || !cursorMascot) return;

const isDashboard = document.body.classList.contains("dashboard-body");

function showMascot(element, image = "cursor.png") {
    const rect = element.getBoundingClientRect();

    assistant.style.left = Math.max(8, rect.left - 95) + "px";
    assistant.style.top = Math.max(8, rect.top + rect.height / 2 - 35) + "px";

    cursorMascot.src = image;
    assistant.classList.add("show");
}

function hideMascot() {
    assistant.classList.remove("show");
    cursorMascot.src = "cursor.png";
}

if (isDashboard) {
    document.querySelectorAll(".dashboard-card").forEach(function (card, index) {
        card.addEventListener("mouseenter", function () {
            // Use the matching illustration when available.
            const cardImage = (index + 1) + ".jpeg";
            showMascot(card, cardImage);
        });

        card.addEventListener("mouseleave", hideMascot);
    });
}

const interactiveElements = document.querySelectorAll(
    ".navbar a, .navbar button, footer a, footer button, a[href*='dashboard.html'], a[href*='landing.html']"
);

interactiveElements.forEach(function (element) {
    element.addEventListener("mouseenter", function () {
        showMascot(element);
    });

    element.addEventListener("mouseleave", hideMascot);
});

});



/* CareerAI mascot fallback */
window.addEventListener("load", function () {
    const assistant = document.querySelector(".cursor-assistant");
    const mascot = document.getElementById("cursor-mascot");
    const cards = document.querySelectorAll(".dashboard-card");

    if (!assistant || !mascot) return;

    cards.forEach(function (card, index) {
        card.addEventListener("mouseenter", function () {
            const rect = card.getBoundingClientRect();
            assistant.style.left = Math.max(8, rect.left - 95) + "px";
            assistant.style.top = Math.max(8, rect.top + rect.height / 2 - 35) + "px";
            mascot.src = (index + 1) + ".jpeg";
            assistant.classList.add("show");
        });

        card.addEventListener("mouseleave", function () {
            assistant.classList.remove("show");
            mascot.src = "cursor.png";
        });
    });
});
