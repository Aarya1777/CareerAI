/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const username = document.getElementById("loginUsername");
    const password = document.getElementById("loginPassword");
    const message = document.getElementById("loginMessage");

    const demoUsername = "ananya_123";
    const demoPassword = "Career@123";

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (username.value === "" || password.value === "") {
            message.textContent =
                "Please enter your username and password.";
            return;
        }

        if (
            username.value === demoUsername &&
            password.value === demoPassword
        ) {
            message.textContent = "Login successful!";

            showConfetti();

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1200);

        } else {
            message.textContent =
                "Incorrect username or password.";
        }
    });
}


/* =========================
   SIGNUP
========================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    const name = document.getElementById("signupName");
    const email = document.getElementById("signupEmail");
    const username = document.getElementById("signupUsername");
    const password = document.getElementById("signupPassword");
    const message = document.getElementById("signupMessage");

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (
            name.value === "" ||
            email.value === "" ||
            username.value === "" ||
            password.value === ""
        ) {
            message.textContent =
                "Please fill in all the fields.";
            return;
        }

        message.textContent =
            "Account created successfully!";

        showConfetti();

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 1200);
    });
}


/* =========================
   CONFETTI
========================= */

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
                    transform:
                        "translateY(0) rotate(0deg)",
                    opacity: 1
                },
                {
                    transform:
                        "translateY(100vh) rotate(720deg)",
                    opacity: 0
                }
            ],
            {
                duration: duration,
                easing: "ease-out"
            }
        );

        setTimeout(function () {
            piece.remove();
        }, duration);
    }
}


/* =========================
   HOME PAGE STAT COUNTERS
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const counters =
        document.querySelectorAll(".stat h2");

    counters.forEach(function (counter) {

        const target =
            Number(counter.getAttribute("data-target"));

        let current = 0;

        const increment =
            target / 100;

        function updateCounter() {

            current += increment;

            if (current < target) {

                if (target === 95) {

                    counter.textContent =
                        Math.floor(current) + "%";

                } else {

                    counter.textContent =
                        Math.floor(current)
                            .toLocaleString() + "+";
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

const assistant =
    document.querySelector(".cursor-assistant");

const cursorMascot =
    document.getElementById("cursor-mascot");


if (assistant && cursorMascot) {

    const isDashboard =
        document.body.classList.contains("dashboard-body");


    /* =========================
       DASHBOARD PAGE
    ========================= */

    if (isDashboard) {

        const dashboardCards =
            document.querySelectorAll(".dashboard-card");


        /* -------------------------
           DASHBOARD CARDS
        ------------------------- */

        dashboardCards.forEach(function (card, index) {

            card.addEventListener("mouseenter", function () {

                const rect =
                    card.getBoundingClientRect();

                assistant.style.left =
                    (rect.left - 95) + "px";

                assistant.style.top =
                    (rect.top + rect.height / 2 + 15) + "px";


                /* CHANGE MASCOT */

                const cardNumber =
                    index + 1;

                cursorMascot.src =
                    cardNumber + ".jpeg";


                /* MASCOT POSITION */

                if (
                    cardNumber === 2 ||
                    cardNumber === 4
                ) {

                    assistant.style.transform =
                        "translateX(885px)";

                } else {

                    assistant.style.transform =
                        "translateX(0)";
                }

                assistant.classList.add("show");
            });


            card.addEventListener("mouseleave", function () {

                cursorMascot.src =
                    "cursor.png";

                assistant.style.transform =
                    "translateX(0)";

                assistant.classList.remove("show");
            });
        });


        /* -------------------------
           NAVBAR + FOOTER
        ------------------------- */

        const dashboardElements =
            document.querySelectorAll(
                ".navbar a, .navbar button, footer a, footer button"
            );


        dashboardElements.forEach(function (element) {

            element.addEventListener("mouseenter", function () {

                const rect =
                    element.getBoundingClientRect();

                assistant.style.left =
                    (rect.left - 95) + "px";

                assistant.style.top =
                    (rect.top + rect.height / 2 + 15) + "px";

                cursorMascot.src =
                    "cursor.png";

                assistant.style.transform =
                    "translateX(0)";

                assistant.classList.add("show");
            });


            element.addEventListener("mouseleave", function () {

                assistant.classList.remove("show");
            });
        });
    }


    /* =========================
       HOME + OTHER PAGES
    ========================= */

    else {

        const interactiveElements =
            document.querySelectorAll(
                "a, button, .dashboard-card"
            );


        interactiveElements.forEach(function (element) {

            element.addEventListener("mouseenter", function () {

                const rect =
                    element.getBoundingClientRect();

                assistant.style.left =
                    (rect.left - 95) + "px";

                assistant.style.top =
                    (rect.top + rect.height / 2 + 15) + "px";

                cursorMascot.src =
                    "cursor.png";

                assistant.style.transform =
                    "translateX(0)";

                assistant.classList.add("show");
            });


            element.addEventListener("mouseleave", function () {

                assistant.classList.remove("show");
            });
        });
    }
}


/* =========================
   LOGIN / SIGNUP ASSISTANT
========================= */

const formAssistant =
    document.querySelector(".form-assistant");


if (formAssistant) {

    const formElements =
        document.querySelectorAll(
            ".auth-form input, .auth-form button, .auth-form a"
        );


    formElements.forEach(function (element) {

        element.addEventListener("mouseenter", function () {

            const rect =
                element.getBoundingClientRect();

            formAssistant.style.left =
                (rect.left - 5) + "px";

            formAssistant.style.top =
                (rect.top + rect.height / 2 + 15) + "px";

            formAssistant.classList.add("show");
        });


        element.addEventListener("mouseleave", function () {

            formAssistant.classList.remove("show");
        });
    });
}


/* =====================================================
   CAREERAI - AI INTERVIEW
   ===================================================== */


/* =====================================================
   QUESTIONS
   ===================================================== */

const questions = [

    "Tell me about yourself and your journey as a student.",

    "What is one project you have worked on that you are particularly proud of? What did you learn from it?",

    "Tell me about a challenge or problem you faced while working on a project. How did you solve it?",

    "What technical skill are you currently trying to improve, and why?",

    "Where do you see yourself at the beginning of your career, and what are you doing today to get there?"

];


/* =====================================================
   VARIABLES
   ===================================================== */

let currentQuestion = 0;

let mediaRecorder = null;

let audioChunks = [];

let recordedAudio = null;

let isRecording = false;


/* =====================================================
   ELEMENTS
   ===================================================== */

const chatArea =
    document.getElementById("chatArea");

const startWrapper =
    document.getElementById("startWrapper");

const startInterviewBtn =
    document.getElementById("startInterviewBtn");

const recordingPanel =
    document.getElementById("recordingPanel");

const recordBtn =
    document.getElementById("recordBtn");

const stopBtn =
    document.getElementById("stopBtn");

const recordingText =
    document.getElementById("recordingText");

const nextSection =
    document.getElementById("nextSection");

const nextQuestionBtn =
    document.getElementById("nextQuestionBtn");

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");


/* =====================================================
   START INTERVIEW
   ===================================================== */

startInterviewBtn.addEventListener(
    "click",
    function () {

        startWrapper.style.display = "none";

        currentQuestion = 0;

        showQuestion();

    }
);


/* =====================================================
   SHOW QUESTION
   ===================================================== */

function showQuestion() {

    /* Reset recording state */

    recordingPanel.classList.remove("recording");

    recordingPanel.style.display = "block";

    nextSection.style.display = "none";

    recordBtn.disabled = false;

    stopBtn.disabled = true;

    recordingText.textContent =
        "Ready to record";

    document.getElementById("recordBtnText").textContent =
        "Start Recording";


    /* Create Cara's question message */

    const questionRow =
        document.createElement("div");

    questionRow.className =
        "message-row cara-row question-row";


    questionRow.innerHTML = `

        <div class="avatar-container question-avatar">

            <img
                src="1.jpeg"
                alt="Cara"
                class="cara-image"
            >

        </div>


        <div class="message-content">

            <div class="speaker-name">
                Cara
            </div>


            <div class="chat-bubble cara-bubble">

                <p>
                    ${questions[currentQuestion]}
                </p>

            </div>

        </div>

    `;


    chatArea.appendChild(questionRow);


    /* Update progress */

    updateProgress();


    /* Scroll to question */

    setTimeout(function () {

        chatArea.scrollTo({

            top: chatArea.scrollHeight,

            behavior: "smooth"

        });

    }, 100);

}


/* =====================================================
   PROGRESS
   ===================================================== */

function updateProgress() {

    progressText.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    const percentage =
        ((currentQuestion + 1) / questions.length) * 100;


    progressFill.style.width =
        percentage + "%";

}


/* =====================================================
   START RECORDING
   ===================================================== */

recordBtn.addEventListener(
    "click",
    async function () {

        if (isRecording) {
            return;
        }


        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });


            mediaRecorder =
                new MediaRecorder(stream);


            audioChunks = [];


            mediaRecorder.addEventListener(
                "dataavailable",
                function (event) {

                    if (event.data.size > 0) {

                        audioChunks.push(event.data);

                    }

                }
            );


            mediaRecorder.addEventListener(
                "stop",
                function () {

                    recordedAudio =
                        new Blob(
                            audioChunks,
                            {
                                type: "audio/webm"
                            }
                        );


                    stream
                        .getTracks()
                        .forEach(
                            track => track.stop()
                        );


                    showRecordedAnswer();

                }
            );


            mediaRecorder.start();

            isRecording = true;


            /* UI */

            recordingPanel.classList.add("recording");

            recordingText.textContent =
                "Recording...";

            document.getElementById("recordBtnText").textContent =
                "Recording...";

            recordBtn.disabled = true;

            stopBtn.disabled = false;


        } catch (error) {

            console.error(error);

            alert(
                "Microphone access is required for the interview. Please allow microphone access in your browser."
            );

        }

    }
);


/* =====================================================
   STOP RECORDING
   ===================================================== */

stopBtn.addEventListener(
    "click",
    function () {

        if (
            mediaRecorder &&
            mediaRecorder.state !== "inactive"
        ) {

            mediaRecorder.stop();

            isRecording = false;


            recordingPanel.classList.remove(
                "recording"
            );


            recordingText.textContent =
                "Answer recorded ✓";


            recordBtn.disabled = true;

            stopBtn.disabled = true;

        }

    }
);


/* =====================================================
   SHOW USER'S RECORDED ANSWER
   ===================================================== */

function showRecordedAnswer() {

    const userRow =
        document.createElement("div");

    userRow.className =
        "message-row user-row";


    userRow.innerHTML = `

        <div class="avatar-container user-avatar">

            👤

        </div>


        <div class="message-content">

            <div class="speaker-name">

                You

            </div>


            <div class="chat-bubble user-bubble">

                <p>
                    🎙️ Answer recorded
                </p>

            </div>

        </div>

    `;


    chatArea.appendChild(userRow);


    /* Add audio player */

    if (recordedAudio) {

        const audioURL =
            URL.createObjectURL(recordedAudio);


        const audio =
            document.createElement("audio");


        audio.controls = true;

        audio.src = audioURL;

        audio.style.marginTop = "10px";

        audio.style.width = "100%";


        const bubble =
            userRow.querySelector(
                ".user-bubble"
            );


        bubble.appendChild(audio);

    }


    /* Show next button */

    nextSection.style.display = "block";


    if (
        currentQuestion ===
        questions.length - 1
    ) {

        nextQuestionBtn.textContent =
            "Finish Interview →";

    } else {

        nextQuestionBtn.textContent =
            "Next Question →";

    }


    /* Scroll down */

    setTimeout(function () {

        chatArea.scrollTo({

            top: chatArea.scrollHeight,

            behavior: "smooth"

        });

    }, 100);

}


/* =====================================================
   NEXT QUESTION / FINISH
   ===================================================== */

nextQuestionBtn.addEventListener(
    "click",
    function () {

        /* If last question */

        if (
            currentQuestion ===
            questions.length - 1
        ) {

            finishInterview();

            return;

        }


        /* Move to next question */

        currentQuestion++;

        showQuestion();

    }
);


/* =====================================================
   FINISH INTERVIEW
   ===================================================== */

function finishInterview() {

    recordingPanel.style.display =
        "none";

    nextSection.style.display =
        "none";


    /* Final Cara message */

    const finalRow =
        document.createElement("div");

    finalRow.className =
        "message-row cara-row";


    finalRow.innerHTML = `

        <div class="avatar-container">

            <img
                src="cursor.png"
                alt="Cara"
                class="cara-image"
            >

        </div>


        <div class="message-content">

            <div class="speaker-name">
                Cara
            </div>


            <div class="chat-bubble cara-bubble">

                <p>
                    Great job! You've completed the interview.
                </p>

                <p>
                    Now let's use what you've shared to
                    help you improve your resume.
                </p>

            </div>

        </div>

    `;


    chatArea.appendChild(finalRow);


    /* Progress */

    progressText.textContent =
        "Interview Completed ✓";

    progressFill.style.width =
        "100%";


    /* Optimize Resume button */

    const optimizeWrapper =
        document.createElement("div");

    optimizeWrapper.className =
        "start-interview-wrapper";


    const optimizeButton =
        document.createElement("button");

    optimizeButton.className =
        "start-interview-btn";


    optimizeButton.textContent =
        "Optimize My Resume →";


    optimizeButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "optimize.html";

        }
    );


    optimizeWrapper.appendChild(
        optimizeButton
    );


    chatArea.appendChild(
        optimizeWrapper
    );


    /* Scroll */

    setTimeout(function () {

        chatArea.scrollTo({

            top: chatArea.scrollHeight,

            behavior: "smooth"

        });

    }, 100);

}