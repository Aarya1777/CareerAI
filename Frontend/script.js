const loginForm = document.getElementById("loginForm");
if (loginForm) {
const username = document.getElementById("loginUsername");
const password = document.getElementById("loginPassword");
const message = document.getElementById("loginMessage");
const demoUsername = "ananya_123";
const demoPassword = "Career@123";
loginForm.addEventListener("submit", function(event) {
event.preventDefault();
if (username.value === "" || password.value === "") {
message.textContent = "Please enter your username and password.";
return;
}
if (username.value === demoUsername && password.value === demoPassword) {
message.textContent = "Login successful!";
showConfetti();
setTimeout(function() {
window.location.href = "dashboard.html";
}, 1200);
} else {
message.textContent = "Incorrect username or password.";
}
});
}
const signupForm = document.getElementById("signupForm");
if (signupForm) {
const name = document.getElementById("signupName");
const email = document.getElementById("signupEmail");
const username = document.getElementById("signupUsername");
const password = document.getElementById("signupPassword");
const message = document.getElementById("signupMessage");
signupForm.addEventListener("submit", function(event) {
event.preventDefault();
if (name.value === "" || email.value === "" || username.value === "" || password.value === "") {
message.textContent = "Please fill in all the fields.";
return;
}
message.textContent = "Account created successfully!";
showConfetti();
setTimeout(function() {
window.location.href = "dashboard.html";
}, 1200);
});
}
function showConfetti() {
for (let i = 0; i < 80; i++) {
const piece = document.createElement("div");
piece.style.position = "fixed";
piece.style.width = "8px";
piece.style.height = "8px";
piece.style.backgroundColor = i % 2 === 0 ? "#7A1F1F" : "#C9AAA0";
piece.style.left = Math.random() * 100 + "vw";
piece.style.top = "-10px";
piece.style.zIndex = "9999";
piece.style.pointerEvents = "none";
document.body.appendChild(piece);
const duration = 1000 + Math.random() * 1500;
piece.animate([
{ transform: "translateY(0) rotate(0deg)", opacity: 1 },
{ transform: "translateY(100vh) rotate(720deg)", opacity: 0 }
], {
duration: duration,
easing: "ease-out"
});
setTimeout(function() {
piece.remove();
}, duration);
}
}

document.addEventListener("DOMContentLoaded", function () {

    const counters = document.querySelectorAll(".stat h2");

    counters.forEach(function (counter) {

        const target = Number(counter.getAttribute("data-target"));
        let current = 0;

        const increment = target / 100;

        function updateCounter() {

            current += increment;

            if (current < target) {

                if (target === 95) {
                    counter.textContent = Math.floor(current) + "%";
                } else {
                    counter.textContent =
                        Math.floor(current).toLocaleString() + "+";
                }

                setTimeout(updateCounter, 20);

            } else {

                if (target === 95) {
                    counter.textContent = "95%";
                } else {
                    counter.textContent =
                        target.toLocaleString() + "+";
                }
            }
        }

        updateCounter();
    });

});

/* =========================
   CAREERAI INTERACTIVE ASSISTANT
========================= */

const assistant = document.querySelector(".cursor-assistant");

if (assistant) {

    const interactiveElements = document.querySelectorAll(
    "a, button, .dashboard-card"
);
    interactiveElements.forEach(function (element) {

        element.addEventListener("mouseenter", function () {

            const rect = element.getBoundingClientRect();

            assistant.style.left = (rect.left - 95) + "px";
            assistant.style.top = (rect.top + rect.height / 2 + 15) + "px";

            assistant.classList.add("show");
        });

        element.addEventListener("mouseleave", function () {

            assistant.classList.remove("show");

        });

    });

}

 /* =========================
    LOGIN / SIGNUP ASSISTANT
 ========================= */

const formAssistant = document.querySelector(".form-assistant");

if (formAssistant) {

    const formElements = document.querySelectorAll(
        ".auth-form input, .auth-form button, .auth-form a"
    );

    formElements.forEach(function (element) {

        element.addEventListener("mouseenter", function () {

            const rect = element.getBoundingClientRect();

            formAssistant.style.left = (rect.left - 5) + "px";
            formAssistant.style.top = (rect.top + rect.height / 2 + 15) + "px";

            formAssistant.classList.add("show");
        });

        element.addEventListener("mouseleave", function () {

            formAssistant.classList.remove("show");

        });

    });

}