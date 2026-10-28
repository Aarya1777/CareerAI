



/* ========================================



   CAREERAI - SIGNUP



======================================== */







const signupForm = document.getElementById("signupForm");







if (signupForm) {



    const name = document.getElementById("signupName");



    const email = document.getElementById("signupEmail");



    const username = document.getElementById("signupUsername");



    const password = document.getElementById("signupPassword");



    const message = document.getElementById("signupMessage");







    signupForm.addEventListener("submit", function (event) {



        event.preventDefault();







        const fullName = name.value.trim();



        const userEmail = email.value.trim();



        const userUsername = username.value.trim();



        const userPassword = password.value;







        // Check empty fields



        if (



            !fullName ||



            !userEmail ||



            !userUsername ||



            !userPassword



        ) {



            message.textContent = "Please fill in all the fields.";



            return;



        }







        // Get saved accounts



        let users = [];







        try {



            users = JSON.parse(



                localStorage.getItem("careerAIUsers") || "[]"



            );



        } catch (error) {



            message.textContent =



                "Unable to read saved accounts. Please try again.";



            return;



        }







        // Check if username already exists



        const existingUser = users.find(function (user) {



            return user.username.toLowerCase() ===



                userUsername.toLowerCase();



        });







        if (existingUser) {



            message.textContent =



                "Username already exists. Please choose another.";



            return;



        }







        // Create and save account



        const newUser = {



            name: fullName,



            email: userEmail,



            username: userUsername,



            password: userPassword



        };







        users.push(newUser);







        try {



            localStorage.setItem(



                "careerAIUsers",



                JSON.stringify(users)



            );



        } catch (error) {



            message.textContent =



                "Unable to save your account. Please try again.";



            return;



        }







        message.textContent =



            "Account created successfully! Redirecting to home...";







        if (typeof showConfetti === "function") {



            showConfetti();



        }







        // Go to home page



        setTimeout(function () {



            window.location.href = "home.html";



        }, 1200);



    });



}











/* ========================================



   CAREERAI - LOGIN



======================================== */







const loginForm = document.getElementById("loginForm");







if (loginForm) {



    const username = document.getElementById("loginUsername");



    const password = document.getElementById("loginPassword");



    const message = document.getElementById("loginMessage");







    loginForm.addEventListener("submit", function (event) {



        event.preventDefault();







        const enteredUsername = username.value.trim();



        const enteredPassword = password.value;







        // Check empty fields



        if (!enteredUsername || !enteredPassword) {



            message.textContent =



                "Please enter your username and password.";



            return;



        }







        // Retrieve registered accounts



        let users = [];







        try {



            users = JSON.parse(



                localStorage.getItem("careerAIUsers") || "[]"



            );



        } catch (error) {



            message.textContent =



                "Unable to retrieve accounts. Please try again.";



            return;



        }







        // Verify username and password



        const matchedUser = users.find(function (user) {



            return (



                user.username.toLowerCase() ===



                    enteredUsername.toLowerCase() &&



                user.password === enteredPassword



            );



        });







        if (matchedUser) {



            // Save current user's public details



            localStorage.setItem(



                "careerAIUser",



                JSON.stringify({



                    name: matchedUser.name,



                    email: matchedUser.email,



                    username: matchedUser.username



                })



            );







            message.textContent =



                "Login successful! Redirecting to home...";







            if (typeof showConfetti === "function") {



                showConfetti();



            }







            // Go to home page



            setTimeout(function () {



                window.location.href = "home.html";



            }, 1200);







        } else {



            message.textContent =



                "Invalid username or password. Please sign up first.";



        }



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



   HOME PAGE STAT COUNTERS (Automatic Scroll-Triggered)



========================= */







function initStatCounters() {
    const statsSection = document.querySelector(".stats-section");
    const counters = document.querySelectorAll(".stat h2[data-target]");
    if (!statsSection || counters.length === 0) return;

    function resetCounters() {
        counters.forEach(function (counter) {
            const target = Number(counter.getAttribute("data-target"));
            counter.textContent = target === 95 ? "0%" : "0+";
        });
    }
    resetCounters();

    let isCounting = false;
    let hasAnimated = false;

    function runCounterAnimation() {
        if (isCounting) return;
        isCounting = true;

        counters.forEach(function (counter) {
            const target = Number(counter.getAttribute("data-target"));
            if (!target) return;

            const duration = 1800; // 1.8s smooth duration
            const startTime = performance.now();

            function tick(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutCubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(ease * target);

                if (target === 95) {
                    counter.textContent = (progress < 1 ? currentVal : target) + "%";
                } else {
                    counter.textContent = (progress < 1 ? currentVal.toLocaleString() : target.toLocaleString()) + "+";
                }

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    isCounting = false;
                }
            }
            requestAnimationFrame(tick);
        });
    }

    // Scroll detection: do NOT run on refresh / top of page
    let userHasScrolled = false;
    window.addEventListener("scroll", function onScrollHandler() {
        userHasScrolled = true;
        checkStatsTrigger();
    }, { passive: true });

    function checkStatsTrigger() {
        if (!userHasScrolled && window.scrollY < 30) return; // Do not animate on refresh at top
        const rect = statsSection.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;

        // When the stats section comes into viewport while scrolling down:
        if (rect.top <= vh * 0.85 && rect.bottom >= vh * 0.15) {
            if (!isCounting && !hasAnimated) {
                hasAnimated = true;
                runCounterAnimation();
            }
        } else if (rect.top > vh || rect.bottom < 0) {
            // Reset when user scrolls completely away so it re-animates on next scroll down
            resetCounters();
            isCounting = false;
            hasAnimated = false;
        }
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (userHasScrolled || window.scrollY > 30) {
                        if (!isCounting && !hasAnimated) {
                            hasAnimated = true;
                            runCounterAnimation();
                        }
                    }
                } else {
                    resetCounters();
                    isCounting = false;
                    hasAnimated = false;
                }
            });
        }, {
            threshold: 0.35,
            rootMargin: "0px 0px -30px 0px"
        });
        observer.observe(statsSection);
    }
}







if (document.readyState === "loading") {



    document.addEventListener("DOMContentLoaded", initStatCounters);



} else {



    initStatCounters();



}











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











                /* MASCOT POSITION - DYNAMIC RESPONSIVE */



                assistant.style.transform = "translateX(0)";







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



   INTERVIEW PAGE CONTROLLER



   ===================================================== */



if (startInterviewBtn) {



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



















}



/* =====================================================



   CAREERAI FEP — PROFILE PHOTO & GSAP ANIMATIONS



   ===================================================== */



// Profile Page Complete Management: Photo, Edit Profile, Settings, Modals, and Toasts (Matches Reference UI)



document.addEventListener("DOMContentLoaded", function () {



    const photoInput = document.getElementById("profilePhotoInput");



    const photoPreview = document.getElementById("profileImagePreview");



    const initialsDisplay = document.getElementById("profileInitialsDisplay");



    const navAvatarBadge = document.getElementById("navAvatarBadge");



    const navInitialsBadge = document.getElementById("navInitialsBadge");



    const navAvatarImg = document.getElementById("navAvatarImg");



    const avatarCircle = document.getElementById("profileAvatarCircle");







    // Toast Notification Utility



    const toast = document.getElementById("profileToast");



    const toastMsg = document.getElementById("profileToastMessage");



    let toastTimeout = null;







    function showProfileToast(message) {



        if (!toast || !toastMsg) return;



        toastMsg.innerHTML = message;



        toast.classList.add("show");



        if (toastTimeout) clearTimeout(toastTimeout);



        toastTimeout = setTimeout(function () {



            toast.classList.remove("show");



        }, 3200);



    }







    // Helper: compute initials



    function getInitials(fullName) {



        if (!fullName) return "AW";



        const parts = fullName.trim().split(/\s+/);



        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();



        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();



    }







    // 1. Photo Upload, Restore & Sync



    try {



        const savedPhoto = localStorage.getItem("careerAI_profilePhoto") || localStorage.getItem("careerAI_userPhoto");



        if (savedPhoto) {



            if (photoPreview) {



                photoPreview.src = savedPhoto;



                photoPreview.style.display = "block";



            }



            if (initialsDisplay) initialsDisplay.style.display = "none";



            if (navAvatarImg) {



                navAvatarImg.src = savedPhoto;



                navAvatarImg.style.display = "block";



            }



            if (navInitialsBadge) navInitialsBadge.style.display = "none";



        }



    } catch (e) {



        console.warn("Could not read profile photo from localStorage:", e);



    }







    if (avatarCircle && photoInput) {



        avatarCircle.addEventListener("click", function () {



            photoInput.click();



        });



        avatarCircle.addEventListener("keydown", function (e) {



            if (e.key === "Enter" || e.key === " ") {



                e.preventDefault();



                photoInput.click();



            }



        });







        photoInput.addEventListener("change", function (e) {



            const file = e.target.files && e.target.files[0];



            if (!file) return;







            const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];



            if (!allowed.includes(file.type.toLowerCase())) {



                alert("Please choose a PNG, JPG, or WebP image.");



                photoInput.value = "";



                return;



            }







            if (file.size > 3 * 1024 * 1024) {



                alert("File size exceeds 3 MB. Please choose a smaller image.");



                photoInput.value = "";



                return;



            }







            const reader = new FileReader();



            reader.onload = function (event) {



                const dataUrl = event.target.result;



                if (photoPreview) {



                    photoPreview.src = dataUrl;



                    photoPreview.style.display = "block";



                }



                if (initialsDisplay) initialsDisplay.style.display = "none";



                if (navAvatarImg) {



                    navAvatarImg.src = dataUrl;



                    navAvatarImg.style.display = "block";



                }



                if (navInitialsBadge) navInitialsBadge.style.display = "none";







                try {



                    localStorage.setItem("careerAI_profilePhoto", dataUrl);



                    localStorage.setItem("careerAI_userPhoto", dataUrl);



                } catch (err) {



                    console.warn("Profile photo localStorage limit exceeded.");



                }



                showProfileToast("Profile photo updated! &#128248;");



            };



            reader.readAsDataURL(file);



        });



    }







    // 2. Editable Profile Information (Relevant student career data)



    const defaultProfile = {



        name: "Ananya Walunjkar",



        role: "Computer Science Student",



        email: "ananya.walunjkar@example.com",



        college: "Engineering & Tech",



        targetRole: "Software Engineer",



        location: "Mumbai, India"



    };







    let currentProfile = Object.assign({}, defaultProfile);







    try {



        const savedProfile = localStorage.getItem("careerAI_userProfile");



        if (savedProfile) {



            const parsed = JSON.parse(savedProfile);



            currentProfile = Object.assign({}, defaultProfile, parsed);



        }



    } catch (e) {



        console.warn("Could not read profile data from localStorage:", e);



    }







    const nameDisplay = document.getElementById("profileDisplayName");



    const roleDisplay = document.getElementById("profileRoleDisplay");



    const emailDisplay = document.getElementById("profileEmailDisplay");



    const collegeDisplay = document.getElementById("profileCollegeDisplay");



    const targetRoleDisplay = document.getElementById("profileTargetRoleDisplay");



    const locationDisplay = document.getElementById("profileLocationDisplay");







    const editView = document.getElementById("profileViewContainer");



    const editForm = document.getElementById("profileEditForm");



    const editToggleBtn = document.getElementById("editProfileToggleBtn");



    const editDetailsBtn = document.getElementById("editDetailsBtn");



    const saveProfileBtn = document.getElementById("saveProfileBtn");



    const cancelProfileBtn = document.getElementById("cancelProfileBtn");







    const nameInput = document.getElementById("editNameInput");



    const roleInput = document.getElementById("editRoleInput");



    const emailInput = document.getElementById("editEmailInput");



    const collegeInput = document.getElementById("editCollegeInput");



    const targetRoleInput = document.getElementById("editTargetRoleInput");



    const locationInput = document.getElementById("editLocationInput");







    function renderProfile() {



        if (nameDisplay) nameDisplay.textContent = currentProfile.name;



        if (roleDisplay) roleDisplay.textContent = currentProfile.role;



        if (emailDisplay) emailDisplay.textContent = currentProfile.email;



        if (collegeDisplay) collegeDisplay.textContent = currentProfile.college;



        if (targetRoleDisplay) targetRoleDisplay.textContent = currentProfile.targetRole;



        if (locationDisplay) locationDisplay.textContent = currentProfile.location;







        const inits = getInitials(currentProfile.name);



        if (initialsDisplay) initialsDisplay.textContent = inits;



        if (navInitialsBadge) navInitialsBadge.textContent = inits;







        if (nameInput) nameInput.value = currentProfile.name;



        if (roleInput) roleInput.value = currentProfile.role;



        if (emailInput) emailInput.value = currentProfile.email;



        if (collegeInput) collegeInput.value = currentProfile.college;



        if (targetRoleInput) targetRoleInput.value = currentProfile.targetRole;



        if (locationInput) locationInput.value = currentProfile.location;



    }







    renderProfile();







    function openProfileEditor() {



        if (editView) editView.style.display = "none";



        if (editForm) editForm.style.display = "block";



        if (nameInput) {



            nameInput.focus();



            nameInput.select();



        }



    }







    function closeProfileEditor() {



        if (editView) editView.style.display = "block";



        if (editForm) editForm.style.display = "none";



    }







    if (editToggleBtn) editToggleBtn.addEventListener("click", openProfileEditor);



    if (editDetailsBtn) editDetailsBtn.addEventListener("click", openProfileEditor);







    if (saveProfileBtn) {



        saveProfileBtn.addEventListener("click", function () {



            currentProfile.name = (nameInput && nameInput.value.trim()) || defaultProfile.name;



            currentProfile.role = (roleInput && roleInput.value.trim()) || defaultProfile.role;



            currentProfile.email = (emailInput && emailInput.value.trim()) || defaultProfile.email;



            currentProfile.college = (collegeInput && collegeInput.value.trim()) || defaultProfile.college;



            currentProfile.targetRole = (targetRoleInput && targetRoleInput.value.trim()) || defaultProfile.targetRole;



            currentProfile.location = (locationInput && locationInput.value.trim()) || defaultProfile.location;







            try {



                localStorage.setItem("careerAI_userProfile", JSON.stringify(currentProfile));



            } catch (e) {



                console.warn("Could not save profile to localStorage:", e);



            }







            renderProfile();



            closeProfileEditor();



            showProfileToast("Profile details updated successfully! &#10024;");



        });



    }







    if (cancelProfileBtn) {



        cancelProfileBtn.addEventListener("click", function () {



            renderProfile();



            closeProfileEditor();



        });



    }







        // 3. Resume Repository Management (Upload, Persistence, ATS Calculation & View Modal)



    const resumeModal = document.getElementById("resumeViewModal");



    const closeResumeBtn1 = document.getElementById("closeResumeModalBtn");



    const closeResumeBtn2 = document.getElementById("closeResumeModalBtn2");



    const modalName = document.getElementById("modalResumeName");



    const modalMeta = document.getElementById("modalResumeMeta");



    const modalAts = document.getElementById("modalResumeAts");



    const modalBar = document.getElementById("modalResumeAtsBar");



    const modalStatus = document.getElementById("modalResumeStatus");



    const repoListContainer = document.getElementById("repoListContainer");



    const uploadBtn = document.getElementById("uploadResumeBtn");



    const repoFileInput = document.getElementById("repoFileInput");



    const repoCard = document.querySelector(".resume-repo-card");







    const defaultResumes = [
        {
            id: "res_default_1",
            name: "Resume_Ananya_2026.pdf",
            date: "03/28, 2026",
            badge: "CareerAI Optimized",
            badgeType: "optimized",
            ats: "92%",
            pillClass: "pill-ats-high"
        },
        {
            id: "res_default_2",
            name: "Resume_Internship.pdf",
            date: "03/28, 2020",
            badge: "Standard Template",
            badgeType: "standard",
            ats: "78%",
            pillClass: "pill-ats-mid"
        },
        {
            id: "res_default_3",
            name: "Software_Engineer_Google_v3.pdf",
            date: "04/12, 2026",
            badge: "CareerAI Optimized",
            badgeType: "optimized",
            ats: "95%",
            pillClass: "pill-ats-high"
        },
        {
            id: "res_default_4",
            name: "FullStack_Developer_Stanford.docx",
            date: "04/18, 2026",
            badge: "Executive Template",
            badgeType: "executive",
            ats: "88%",
            pillClass: "pill-ats-high"
        },
        {
            id: "res_default_5",
            name: "Data_AI_Specialist_Resume.pdf",
            date: "04/24, 2026",
            badge: "Creative Template",
            badgeType: "creative",
            ats: "86%",
            pillClass: "pill-ats-high"
        }
    ];

    let resumeList = [];
    try {
        const savedRes = localStorage.getItem("careerAI_resumeRepository");
        if (savedRes) {
            resumeList = JSON.parse(savedRes);
        }
    } catch (e) {
        console.warn("Could not read resume repository from localStorage:", e);
    }

    if (!Array.isArray(resumeList) || resumeList.length === 0) {
        resumeList = defaultResumes.slice();
    } else if (resumeList.length < 5) {
        defaultResumes.forEach(function (def) {
            const exists = resumeList.some(function (r) {
                return r.name === def.name;
            });
            if (!exists) {
                resumeList.push(def);
            }
        });
        try {
            localStorage.setItem("careerAI_resumeRepository", JSON.stringify(resumeList));
        } catch (e) {}
    }

    function saveResumesToStorage() {



        try {



            localStorage.setItem("careerAI_resumeRepository", JSON.stringify(resumeList));



        } catch (e) {



            console.warn("Could not save resumes to localStorage:", e);



        }



        updateProfileStatsCount();



    }







    function updateProfileStatsCount() {
        // Resumes Made (total resumes in repo) and Resumes Optimized (CareerAI Optimized tag / ATS >= 80)
        const totalMade = resumeList.length;
        const totalOptimized = resumeList.filter(function (r) {
            return (r.badge && r.badge.toLowerCase().includes("optimized")) || (r.ats && parseInt(r.ats) >= 80);
        }).length;

        const valMade = document.getElementById("statResumesMade");
        const valOpt = document.getElementById("statResumesOptimized");
        const valSaved = document.getElementById("statSavedJobs");

        if (valMade) valMade.textContent = totalMade;
        if (valOpt) valOpt.textContent = totalOptimized;
        if (valSaved) valSaved.textContent = "12";

        const statItems = document.querySelectorAll(".profile-stat-item");
        statItems.forEach(function (item) {
            const lbl = item.querySelector(".profile-stat-lbl");
            const val = item.querySelector(".profile-stat-val");
            if (lbl && val) {
                const text = lbl.textContent.trim().toLowerCase();
                if (text === "resumes made") {
                    val.textContent = totalMade;
                } else if (text === "resumes optimized") {
                    val.textContent = totalOptimized;
                } else if (text.includes("saved") || text.includes("job")) {
                    val.textContent = "12";
                }
            }
        });

        // Compute average ATS score from repo
        let totalAts = 0;
        let atsCount = 0;
        resumeList.forEach(function (r) {
            if (r.ats) {
                const num = parseInt(r.ats, 10);
                if (!isNaN(num)) {
                    totalAts += num;
                    atsCount++;
                }
            }
        });
        const avgAts = atsCount > 0 ? Math.round(totalAts / atsCount) : 88;

        // Also sync with dashboard user stats
        try {
            let stats = {};
            const raw = localStorage.getItem("careerai_user_stats");
            if (raw) stats = JSON.parse(raw);
            stats.resumesMade = totalMade;
            stats.resumesOptimized = totalOptimized;
            stats.resumes = totalMade;
            stats.savedJobs = 12;
            stats.jobs = 12;
            stats.atsScore = avgAts;
            stats.readiness = avgAts;

            localStorage.setItem("careerai_user_stats", JSON.stringify(stats));
        } catch (e) {}
    }

    function renderResumeList(highlightId) {



        if (!repoListContainer) return;



        repoListContainer.innerHTML = "";







        resumeList.forEach(function (item) {



            const itemEl = document.createElement("div");



            itemEl.className = "repo-item" + (item.id === highlightId ? " newly-added" : "");







            const targetUrl = "resume.html?doc=" + encodeURIComponent(item.name) + "&ats=" + encodeURIComponent(item.ats);



            itemEl.innerHTML = `



                <div class="repo-item-meta">



                    <h3 class="repo-file-name">${item.name}</h3>



                    <div class="repo-sub-row">



                        <span class="repo-date">Date, ${item.date}</span>



                        <span class="repo-badge badge-${item.badgeType}">${item.badge}</span>



                    </div>



                </div>



                <div class="repo-item-actions">



                    <span class="repo-ats-pill ${item.pillClass}">ATS ${item.ats}</span>



                    <a href="${targetUrl}" class="repo-view-btn" data-doc="${item.name}" data-ats="${item.ats}" data-status="${item.badge}" data-date="${item.date}" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">View</a>



                </div>



            `;







            const viewBtn = itemEl.querySelector(".repo-view-btn");



            if (viewBtn) {



                viewBtn.addEventListener("click", function (e) {



                    // Save active resume details to localStorage



                    try {



                        localStorage.setItem("careerAI_openResume", JSON.stringify({



                            name: item.name,



                            ats: item.ats,



                            badge: item.badge,



                            date: item.date,



                            size: "ATS Compatibility: " + item.ats



                        }));



                    } catch (err) {}



                    // Native navigation to resume.html opens directly in optimizer



                });



            }







            repoListContainer.appendChild(itemEl);



        });







        updateProfileStatsCount();



    }







    function openResumeModal(doc, date, ats, status) {



        if (modalName) modalName.textContent = doc;



        if (modalMeta) modalMeta.textContent = "Date, " + date;



        if (modalAts) modalAts.textContent = ats;



        if (modalBar) modalBar.style.width = ats;



        if (modalStatus) modalStatus.textContent = "Status: " + status;







        const optBtn = resumeModal ? resumeModal.querySelector("a[href*='resume.html']") : null;



        if (optBtn) {



            optBtn.href = "resume.html?doc=" + encodeURIComponent(doc) + "&ats=" + encodeURIComponent(ats);



        }







        if (resumeModal) {



            resumeModal.classList.add("open");



            resumeModal.style.display = "flex";



        }



    }







    function closeResumeModal() {



        if (resumeModal) {



            resumeModal.classList.remove("open");



            resumeModal.style.display = "none";



        }



    }







    if (closeResumeBtn1) closeResumeBtn1.addEventListener("click", closeResumeModal);



    if (closeResumeBtn2) closeResumeBtn2.addEventListener("click", closeResumeModal);



    if (resumeModal) {



        resumeModal.addEventListener("click", function (e) {



            if (e.target === resumeModal) closeResumeModal();



        });



    }







    // Process a newly chosen or dropped file



    function handleResumeFileUpload(file) {



        if (!file) return;







        // Validation



        const validExtensions = [".pdf", ".docx", ".doc", ".txt"];



        const fileNameLower = file.name.toLowerCase();



        const hasValidExt = validExtensions.some(ext => fileNameLower.endsWith(ext));







        if (!hasValidExt) {



            alert("Please choose a valid resume document (.pdf, .docx, .doc, or .txt).");



            if (repoFileInput) repoFileInput.value = "";



            return;



        }







        if (file.size > 10 * 1024 * 1024) {



            alert("File exceeds maximum allowed size (10 MB). Please upload a smaller file.");



            if (repoFileInput) repoFileInput.value = "";



            return;



        }







        // Show uploading feedback on button



        if (uploadBtn) {



            uploadBtn.disabled = true;



            uploadBtn.innerHTML = `



                <svg class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">



                    <line x1="12" y1="2" x2="12" y2="6"></line>



                    <line x1="12" y1="18" x2="12" y2="22"></line>



                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>



                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>



                    <line x1="2" y1="12" x2="6" y2="12"></line>



                    <line x1="18" y1="12" x2="22" y2="12"></line>



                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>



                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>



                </svg>



                Processing Resume...



            `;



        }







        setTimeout(function () {



            // Compute realistic high ATS score



            let score = 86 + Math.floor(Math.random() * 9); // 86% - 94%



            if (fileNameLower.includes("ats") || fileNameLower.includes("opt")) score = 93;







            const now = new Date();



            const month = String(now.getMonth() + 1).padStart(2, "0");



            const day = String(now.getDate()).padStart(2, "0");



            const year = now.getFullYear();



            const formattedDate = `${month}/${day}, ${year}`;







            const newId = "res_" + Date.now();



            const newResume = {



                id: newId,



                name: file.name,



                date: formattedDate,



                badge: "CareerAI Optimized",



                badgeType: "optimized",



                ats: score + "%",



                pillClass: score >= 80 ? "pill-ats-high" : (score >= 70 ? "pill-ats-mid" : "pill-ats-low")



            };







            // Prepend to top of list



            resumeList.unshift(newResume);



            saveResumesToStorage();



            renderResumeList(newId);







            // Restore upload button



            if (uploadBtn) {



                uploadBtn.disabled = false;



                uploadBtn.innerHTML = `



                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">



                        <line x1="12" y1="5" x2="12" y2="19"></line>



                        <line x1="5" y1="12" x2="19" y2="12"></line>



                    </svg>



                    Upload New Resume



                `;



            }







            if (repoFileInput) repoFileInput.value = "";







            showProfileToast("Resume <strong>" + file.name + "</strong> uploaded & optimized! Opening in Optimizer...");
            setTimeout(function () {
                window.location.href = "resume.html?doc=" + encodeURIComponent(file.name) + "&ats=" + encodeURIComponent(score + "%");
            }, 450);



        }, 400);



    }







    if (uploadBtn && repoFileInput) {



        uploadBtn.addEventListener("click", function () {



            repoFileInput.click();



        });



        repoFileInput.addEventListener("change", function (e) {



            const file = e.target.files && e.target.files[0];



            if (file) handleResumeFileUpload(file);



        });



    }







    // Drag-and-drop support on resume repository card



    if (repoCard) {



        ['dragenter', 'dragover'].forEach(eventName => {



            repoCard.addEventListener(eventName, function (e) {



                e.preventDefault();



                e.stopPropagation();



                repoCard.classList.add("drag-over");



            }, false);



        });







        ['dragleave', 'drop'].forEach(eventName => {



            repoCard.addEventListener(eventName, function (e) {



                e.preventDefault();



                e.stopPropagation();



                repoCard.classList.remove("drag-over");



            }, false);



        });







        repoCard.addEventListener('drop', function (e) {



            const dt = e.dataTransfer;



            const files = dt && dt.files;



            if (files && files.length > 0) {



                handleResumeFileUpload(files[0]);



            }



        }, false);



    }







    // Initial render of resume repository



    renderResumeList();















    // 4. Change Password Section



    const changePassBtn = document.getElementById("settingsChangePassBtn");



    const changePassPanel = document.getElementById("changePasswordPanel");



    const savePassBtn = document.getElementById("savePasswordBtn");



    const cancelPassBtn = document.getElementById("cancelPasswordBtn");



    const currentPassInput = document.getElementById("currentPasswordInput");



    const newPassInput = document.getElementById("newPasswordInput");



    const confirmPassInput = document.getElementById("confirmPasswordInput");







    if (changePassBtn && changePassPanel) {



        changePassBtn.addEventListener("click", function () {



            const isHidden = changePassPanel.style.display === "none" || !changePassPanel.style.display;



            changePassPanel.style.display = isHidden ? "block" : "none";



            if (isHidden && currentPassInput) currentPassInput.focus();



        });



    }







    if (cancelPassBtn && changePassPanel) {



        cancelPassBtn.addEventListener("click", function () {



            changePassPanel.style.display = "none";



            if (currentPassInput) currentPassInput.value = "";



            if (newPassInput) newPassInput.value = "";



            if (confirmPassInput) confirmPassInput.value = "";



        });



    }







    if (savePassBtn) {



        savePassBtn.addEventListener("click", function () {



            const newP = newPassInput ? newPassInput.value : "";



            const confP = confirmPassInput ? confirmPassInput.value : "";







            if (!newP || newP.length < 6) {



                alert("New password must be at least 6 characters long.");



                if (newPassInput) newPassInput.focus();



                return;



            }



            if (newP !== confP) {



                alert("New passwords do not match. Please check and re-enter.");



                if (confirmPassInput) confirmPassInput.focus();



                return;



            }







            try {



                localStorage.setItem("careerAI_passUpdated", new Date().toISOString());



            } catch (e) {}







            if (currentPassInput) currentPassInput.value = "";



            if (newPassInput) newPassInput.value = "";



            if (confirmPassInput) confirmPassInput.value = "";



            if (changePassPanel) changePassPanel.style.display = "none";



            showProfileToast("Account password updated successfully! &#128274;");



        });



    }







    // 5. Account Preferences Section & Voice Permission Settings



    const prefsBtn = document.getElementById("settingsPreferencesBtn");



    const prefsPanel = document.getElementById("accountPreferencesPanel");



    const savePrefsBtn = document.getElementById("savePreferencesBtn");



    const cancelPrefsBtn = document.getElementById("cancelPreferencesBtn");



    const voiceToggle = document.getElementById("prefVoiceToggle");



    const voiceStateSelect = document.getElementById("prefVoiceState");



    const voiceModeSelect = document.getElementById("prefVoicePermissionMode");



    const voiceDotIndicator = document.getElementById("voiceDotIndicator");



    const voiceModeText = document.getElementById("voiceModeText");



    const voiceModeGroup = document.getElementById("voicePermissionModeGroup");



    const emailAlertsCheckbox = document.getElementById("prefEmailAlerts");







    const modeLabels = {



        always: "Always",



        in_use: "When app in use",



        ask_always: "Always ask for permission"



    };







    function updateVoiceUI(isEnabled, mode) {



        if (voiceToggle) voiceToggle.checked = isEnabled;



        if (voiceStateSelect) voiceStateSelect.value = isEnabled ? "on" : "off";



        if (voiceModeSelect && mode) voiceModeSelect.value = mode;







        if (isEnabled) {



            if (voiceDotIndicator) voiceDotIndicator.style.background = "#2E7D32";



            if (voiceModeText) voiceModeText.textContent = modeLabels[mode] || "When app in use";



            if (voiceModeGroup) {



                voiceModeGroup.style.opacity = "1";



                voiceModeGroup.style.pointerEvents = "auto";



            }



        } else {



            if (voiceDotIndicator) voiceDotIndicator.style.background = "#D32F2F";



            if (voiceModeText) voiceModeText.textContent = "Off";



            if (voiceModeGroup) {



                voiceModeGroup.style.opacity = "0.5";



                voiceModeGroup.style.pointerEvents = "none";



            }



        }



    }







    let currentVoiceEnabled = true;



    let currentVoiceMode = "in_use";







    try {



        const savedVoiceEnabled = localStorage.getItem("careerAI_voiceEnabled");



        if (savedVoiceEnabled !== null) {



            currentVoiceEnabled = savedVoiceEnabled === "true";



        }



        const savedVoiceMode = localStorage.getItem("careerAI_voicePermissionMode");



        if (savedVoiceMode && modeLabels[savedVoiceMode]) {



            currentVoiceMode = savedVoiceMode;



        }



        updateVoiceUI(currentVoiceEnabled, currentVoiceMode);







        const savedAlerts = localStorage.getItem("careerAI_notifications") !== null 



            ? localStorage.getItem("careerAI_notifications") 



            : localStorage.getItem("careerAI_placementAlerts");



        if (savedAlerts !== null && emailAlertsCheckbox) {



            emailAlertsCheckbox.checked = savedAlerts === "true";



        }



    } catch (e) {}







    // Quick toggle on the row



    if (voiceToggle) {



        voiceToggle.addEventListener("change", function () {



            currentVoiceEnabled = voiceToggle.checked;



            try {



                localStorage.setItem("careerAI_voiceEnabled", currentVoiceEnabled);



            } catch (e) {}



            updateVoiceUI(currentVoiceEnabled, currentVoiceMode);



            if (currentVoiceEnabled) {



                showProfileToast("Voice permission enabled! (" + (modeLabels[currentVoiceMode] || "When app in use") + ") &#127897;&#65039;");



            } else {



                showProfileToast("Voice permission turned off &#128263;");



            }



        });



    }







    // Toggle button opens/closes panel



    if (prefsBtn && prefsPanel) {



        prefsBtn.addEventListener("click", function () {



            const isHidden = prefsPanel.style.display === "none" || !prefsPanel.style.display;



            prefsPanel.style.display = isHidden ? "block" : "none";



            if (isHidden) {



                updateVoiceUI(currentVoiceEnabled, currentVoiceMode);



            }



        });



    }







    // In-panel state change (on / off)



    if (voiceStateSelect) {



        voiceStateSelect.addEventListener("change", function () {



            const isNowEnabled = voiceStateSelect.value === "on";



            updateVoiceUI(isNowEnabled, voiceModeSelect ? voiceModeSelect.value : currentVoiceMode);



        });



    }







    // Cancel closes panel and reverts to saved



    if (cancelPrefsBtn && prefsPanel) {



        cancelPrefsBtn.addEventListener("click", function () {



            prefsPanel.style.display = "none";



            updateVoiceUI(currentVoiceEnabled, currentVoiceMode);



        });



    }







    // Save button inside panel



    if (savePrefsBtn) {



        savePrefsBtn.addEventListener("click", function () {



            currentVoiceEnabled = voiceStateSelect ? voiceStateSelect.value === "on" : currentVoiceEnabled;



            if (voiceModeSelect && voiceModeSelect.value) {



                currentVoiceMode = voiceModeSelect.value;



            }



            try {



                localStorage.setItem("careerAI_voiceEnabled", currentVoiceEnabled);



                localStorage.setItem("careerAI_voicePermissionMode", currentVoiceMode);



            } catch (e) {}







            updateVoiceUI(currentVoiceEnabled, currentVoiceMode);



            if (prefsPanel) prefsPanel.style.display = "none";







            if (currentVoiceEnabled) {



                showProfileToast("Voice permission set to: " + (modeLabels[currentVoiceMode] || "When app in use") + " &#127897;&#65039;");



            } else {



                showProfileToast("Voice permission turned off &#128263;");



            }



        });



    }







    if (emailAlertsCheckbox) {



        emailAlertsCheckbox.addEventListener("change", function () {



            try {



                localStorage.setItem("careerAI_notifications", emailAlertsCheckbox.checked);



                localStorage.setItem("careerAI_placementAlerts", emailAlertsCheckbox.checked);



            } catch (e) {}



            showProfileToast(emailAlertsCheckbox.checked ? "Notifications enabled! &#128276;" : "Notifications muted.");



        });



    }







    // 6. Student Placement Help Center Modal



    const helpModal = document.getElementById("helpCenterModal");



    const helpLink = document.getElementById("helpCenterLink");



    const closeHelpBtn = document.getElementById("closeHelpModalBtn");



    const closeHelpBtn2 = document.getElementById("closeHelpModalBtn2");







    if (helpLink && helpModal) {



        helpLink.addEventListener("click", function (e) {



            e.preventDefault();



            helpModal.classList.add("open");



        });



    }







    function closeHelpModal() {



        if (helpModal) helpModal.classList.remove("open");



    }







    if (closeHelpBtn) closeHelpBtn.addEventListener("click", closeHelpModal);



    if (closeHelpBtn2) closeHelpBtn2.addEventListener("click", closeHelpModal);







    if (helpModal) {



        helpModal.addEventListener("click", function (e) {



            if (e.target === helpModal) closeHelpModal();



        });



    }







    document.addEventListener("keydown", function (e) {



        if (e.key === "Escape") {



            if (helpModal && helpModal.classList.contains("open")) closeHelpModal();



            if (resumeModal && resumeModal.style.display === "flex") closeResumeModal();



        }



    });















    // GSAP Controlled Animations



    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;



    if (typeof gsap === "undefined" || prefersReducedMotion) {



        return;



    }







    if (typeof ScrollTrigger !== "undefined") {



        gsap.registerPlugin(ScrollTrigger);



    }







    // 1. Hero Section entrance



    const homeIntro = document.querySelector(".home-intro");



    if (homeIntro) {



        gsap.from(".home-intro .small-heading", {



            opacity: 0,



            y: -15,



            duration: 0.6,



            ease: "power2.out"



        });







        gsap.from(".home-intro h1", {



            opacity: 0,



            y: 24,



            duration: 0.8,



            delay: 0.12,



            stagger: 0.12,



            ease: "power3.out"



        });







        gsap.from(".home-intro p:not(.small-heading)", {



            opacity: 0,



            y: 16,



            duration: 0.7,



            delay: 0.35,



            stagger: 0.1,



            ease: "power2.out"



        });







        gsap.from(".hero-actions", {



            opacity: 0,



            y: 18,



            duration: 0.6,



            delay: 0.55,



            ease: "power2.out"



        });



    }







    // 2. Video Showcase reveal



    const videoSection = document.querySelector(".video-showcase-section");



    if (videoSection && typeof ScrollTrigger !== "undefined") {



        gsap.from(".video-container-card", {



            scrollTrigger: {



                trigger: ".video-showcase-section",



                start: "top 82%"



            },



            opacity: 0,



            y: 35,



            duration: 0.85,



            ease: "power2.out"



        });



    }







    // 2.5 Stats Section entrance reveal



    const statsSectionEl = document.querySelector(".stats-section");



    if (statsSectionEl && typeof ScrollTrigger !== "undefined") {



        gsap.from(".stats-section", {



            scrollTrigger: {



                trigger: ".stats-section",



                start: "top 86%"



            },



            opacity: 0,



            y: 30,



            duration: 0.8,



            ease: "power2.out",



            clearProps: "all"



        });



    }







    // 3. Stepping-Stone Features sequential reveal



    const stonesSection = document.querySelector(".stepping-stones-section");



    if (stonesSection) {



        const stoneTrigger = typeof ScrollTrigger !== "undefined" ? {



            trigger: ".stepping-stones-section",



            start: "top 78%"



        } : undefined;







        gsap.from(".stone-card", {



            scrollTrigger: stoneTrigger,



            opacity: 0,



            scale: 0.88,



            duration: 0.75,



            stagger: 0.12,



            ease: "back.out(1.2)",



            clearProps: "all"



        });







        gsap.from(".stone-connector", {



            scrollTrigger: stoneTrigger,



            opacity: 0,



            scale: 0.5,



            duration: 0.5,



            delay: 0.25,



            stagger: 0.12,



            ease: "power2.out",



            clearProps: "all"



        });



    }







        // 4. Testimonials Automatic Load on Scroll (Curved Arch, 0.4s one-by-one stagger timer)
    const reviewsSection = document.querySelector(".reviews-section") || document.querySelector(".testimonials-hero");
    const reviewCards = document.querySelectorAll(".reviews-section .review-card");

    if (reviewsSection && reviewCards.length > 0) {
        // Ensure no conflicting inline styles so CSS curved variables take full effect
        reviewCards.forEach(function (card) {
            card.classList.remove("revealed");
            card.style.removeProperty("opacity");
            card.style.removeProperty("transform");
        });

        let reviewsRevealed = false;

        function revealReviewsOnScroll() {
            if (reviewsRevealed) return;
            reviewsRevealed = true;

            reviewCards.forEach(function (card, index) {
                setTimeout(function () {
                    card.classList.add("revealed");
                }, index * 400); // 0.4 secs one by one
            });
        }

        function checkReviewsScroll() {
            if (reviewsRevealed) return;
            const targetEl = document.querySelector(".reviews-section") || document.querySelector(".testimonials-hero");
            if (!targetEl) return;
            const rect = targetEl.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top <= vh * 0.85) {
                revealReviewsOnScroll();
            }
        }

        window.addEventListener("scroll", checkReviewsScroll, { passive: true });

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        revealReviewsOnScroll();
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: "0px 0px -30px 0px"
            });
            const sec = document.querySelector(".reviews-section");
            if (sec) observer.observe(sec);
            const heroSec = document.querySelector(".testimonials-hero");
            if (heroSec) observer.observe(heroSec);
        }

        // Trigger if already scrolled into view on load
        checkReviewsScroll();
    }










    // 5. Auth Mascot entrance & subtle idle floating



    const mascotPanel = document.querySelector(".auth-mascot-panel");



    const authFormCard = document.querySelector(".auth-form-card");







    if (mascotPanel && authFormCard) {



        gsap.from(".auth-mascot-panel", {



            opacity: 0,



            x: -30,



            duration: 0.8,



            ease: "power2.out"



        });







        gsap.from(".auth-form-card", {



            opacity: 0,



            x: 30,



            duration: 0.8,



            delay: 0.1,



            ease: "power2.out"



        });







        // Subtle, restrained idle float



        gsap.to(".mascot-orbit-ring", {



            y: -10,



            duration: 2.2,



            repeat: -1,



            yoyo: true,



            ease: "sine.inOut"



        });



    }



});











/* =========================================================



 *   CARA MASCOT - TOUCH / CLICK 180° ROTATION



 * ========================================================= */



function initCaraTouchRotation() {



    const caraPanel = document.getElementById("caraMascotPanel") || document.querySelector(".auth-mascot-panel");



    const caraImg = document.getElementById("caraMascotImg") || document.querySelector(".auth-mascot-img");







    if (!caraPanel || !caraImg) return;







    let hoverTimer = null;







    function flipCara() {



        caraPanel.classList.add("is-flipped");



        if (typeof gsap !== "undefined") {



            gsap.to(caraImg, {



                rotationY: 180,



                duration: 0.55,



                ease: "back.out(1.4)",



                overwrite: "auto"



            });



        } else {



            caraImg.style.transform = "rotateY(180deg)";



        }



    }







    function unflipCara() {



        caraPanel.classList.remove("is-flipped");



        if (typeof gsap !== "undefined") {



            gsap.to(caraImg, {



                rotationY: 0,



                duration: 0.55,



                ease: "back.out(1.4)",



                overwrite: "auto"



            });



        } else {



            caraImg.style.transform = "rotateY(0deg)";



        }



    }







    // Flip 180 degrees horizontally as soon as we hover on Cara!



    caraPanel.addEventListener("mouseenter", flipCara);



    caraPanel.addEventListener("mouseleave", unflipCara);







    // Mobile touch support: tap flips for 1.2s then returns



    caraPanel.addEventListener("touchstart", function () {



        flipCara();



        clearTimeout(hoverTimer);



        hoverTimer = setTimeout(unflipCara, 1200);



    }, { passive: true });



}







if (document.readyState === "loading") {



    document.addEventListener("DOMContentLoaded", initCaraTouchRotation);



} else {



    initCaraTouchRotation();



}











/* =========================================================



 *   ATS SCORE - 0 TO SCORE NUMBER ANIMATION IN 1 SECOND



 * ========================================================= */



function initATSScoreAnimation() {
    const scoreNumEl = document.getElementById("atsScoreValue") || document.querySelector(".score-number");
    const gaugeProgEl = document.getElementById("gaugeProgress") || document.querySelector(".gauge-progress");
    if (!scoreNumEl && !gaugeProgEl) return;

    // 1. Resolve Target ATS Score:
    // Priority: URL query (?score=XX or ?ats=XX) -> localStorage currentResumeAts -> localStorage atsScore -> HTML attribute -> default 88
    let targetScore = null;
    const urlParams = new URLSearchParams(window.location.search);
    const paramScore = urlParams.get("score") || urlParams.get("ats");

    if (paramScore) {
        const parsed = parseInt(paramScore.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
            targetScore = parsed;
        }
    }

    if (targetScore === null) {
        try {
            const savedAts = localStorage.getItem("careerAI_currentResumeAts") || localStorage.getItem("careerAI_atsScore");
            if (savedAts) {
                const parsed = parseInt(savedAts, 10);
                if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
                    targetScore = parsed;
                }
            }
        } catch (e) {}
    }

    if (targetScore === null) {
        const attrScore = scoreNumEl ? parseInt(scoreNumEl.getAttribute("data-target"), 10) : 88;
        targetScore = !isNaN(attrScore) && attrScore > 0 ? attrScore : 88;
    }

    // Keep localStorage in sync so other tabs/navs know the latest score
    try {
        localStorage.setItem("careerAI_currentResumeAts", targetScore);
        localStorage.setItem("careerAI_atsScore", targetScore);
    } catch (e) {}

    // Update data-target on DOM element
    if (scoreNumEl) {
        scoreNumEl.setAttribute("data-target", targetScore);
    }

    // 2. Update Status Text Label ("Excellent", "Good", etc.)
    const scoreContentP = document.getElementById("atsScoreLabel") || document.querySelector(".score-content p");
    if (scoreContentP) {
        if (targetScore >= 88) {
            scoreContentP.textContent = "Excellent";
            scoreContentP.style.color = "#2e7d32";
        } else if (targetScore >= 75) {
            scoreContentP.textContent = "Good";
            scoreContentP.style.color = "#1565c0";
        } else if (targetScore >= 60) {
            scoreContentP.textContent = "Average";
            scoreContentP.style.color = "#e65100";
        } else {
            scoreContentP.textContent = "Needs Improvement";
            scoreContentP.style.color = "#c62828";
        }
    }

    // 3. Update Analysis / Issues Badge
    const issueBadge = document.querySelector(".issue-count");
    if (issueBadge) {
        if (targetScore >= 90) {
            issueBadge.textContent = "1 minor tip";
        } else if (targetScore >= 82) {
            issueBadge.textContent = "2 areas";
        } else if (targetScore >= 70) {
            issueBadge.textContent = "3 areas";
        } else {
            issueBadge.textContent = "4 areas";
        }
    }

    // 4. Update & Calibrate Breakdown Metrics to match targetScore exactly
    // Order in ats.html: Keywords, Formatting, Content, Skills, Organization
    // Average of: (t+2) + (t+6) + (t-7) + (t-1) + (t) = 5*t
    const mKeywords = Math.min(99, Math.max(15, Math.round(targetScore + 2)));
    const mFormatting = Math.min(99, Math.max(25, Math.round(targetScore + 6)));
    const mContent = Math.min(98, Math.max(15, Math.round(targetScore - 7)));
    const mSkills = Math.min(99, Math.max(15, Math.round(targetScore - 1)));
    const mOrg = Math.min(99, Math.max(15, Math.round(targetScore)));
    const metricPcts = [mKeywords, mFormatting, mContent, mSkills, mOrg];

    const metricItems = document.querySelectorAll(".breakdown .metric");
    metricItems.forEach(function(item, idx) {
        if (idx < metricPcts.length) {
            const pctVal = metricPcts[idx];
            const strongEl = item.querySelector(".metric-info strong");
            if (strongEl) strongEl.textContent = pctVal + "%";
            const bar = item.querySelector(".progress-bar");
            if (bar) bar.setAttribute("data-target-width", pctVal + "%");
        }
    });

    const arcLength = 392.7; // semicircle arc length: pi * 125
    const targetOffset = arcLength * (1 - (targetScore / 100));

    // Initial reset: start score at 0 and arc empty
    if (scoreNumEl) scoreNumEl.textContent = "0";

    if (gaugeProgEl) {
        gaugeProgEl.style.strokeDasharray = `${arcLength} ${arcLength}`;
        gaugeProgEl.style.strokeDashoffset = `${arcLength}`;
    }

    // Capture target widths of metric progress bars
    const metricBars = document.querySelectorAll(".breakdown .progress-bar");
    const barTargets = [];
    metricBars.forEach(function (bar, idx) {
        const rawW = bar.getAttribute("data-target-width") || (metricPcts[idx] ? (metricPcts[idx] + "%") : (bar.style.width || "0%"));
        barTargets.push(rawW);
        bar.style.width = "0%";
    });

    const duration = 1000; // exactly 1 second
    let startTime = null;

    function stepATSAnimation(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // smooth cubic ease-out
        const currentVal = Math.round(ease * targetScore);

        if (scoreNumEl) scoreNumEl.textContent = currentVal;

        if (gaugeProgEl) {
            const currentOffset = arcLength - ((arcLength - targetOffset) * ease);
            gaugeProgEl.style.strokeDashoffset = currentOffset;
        }

        metricBars.forEach(function (bar, idx) {
            const targetPct = parseFloat(barTargets[idx]) || 0;
            bar.style.width = (targetPct * ease) + "%";
        });

        if (progress < 1) {
            requestAnimationFrame(stepATSAnimation);
        } else {
            if (scoreNumEl) scoreNumEl.textContent = targetScore;
            if (gaugeProgEl) gaugeProgEl.style.strokeDashoffset = targetOffset;
            metricBars.forEach(function (bar, idx) {
                bar.style.width = barTargets[idx];
            });
        }
    }

    // Trigger after a tiny frame delay so browser paints 0 before animating
    requestAnimationFrame(function () {
        requestAnimationFrame(stepATSAnimation);
    });
}







if (document.readyState === "loading") {



    document.addEventListener("DOMContentLoaded", initATSScoreAnimation);



} else {



    initATSScoreAnimation();



}











/* =========================================================



 *   STEPPING STONES - 180° HORIZONTAL HOVER FLIP



 *   Rotates 180° on hover, stays for ~1 sec, and returns



 *   to how it was originally. Purely visual, no redirects.



 * ========================================================= */



function initSteppingStoneHoverFlip() {



    const stoneCards = document.querySelectorAll(".stone-card");







    stoneCards.forEach(function (card) {



        let flipTimer = null;



        let isFlipping = false;







        function doFlip() {



            if (isFlipping) return;



            isFlipping = true;







            // Rotate 180° horizontally



            card.classList.add("is-flipped");







            // Stay for 1 second, then come back to how it was originally



            clearTimeout(flipTimer);



            flipTimer = setTimeout(function () {



                card.classList.remove("is-flipped");



                setTimeout(function () {



                    isFlipping = false;



                }, 650);



            }, 1000);



        }







        function cancelFlip() {



            clearTimeout(flipTimer);



            card.classList.remove("is-flipped");



            setTimeout(function () {



                isFlipping = false;



            }, 650);



        }







        card.addEventListener("mouseenter", doFlip);



        card.addEventListener("mouseleave", cancelFlip);







        // Mobile touch support: tap rotates 180° for 1s and returns



        card.addEventListener("touchstart", function () {



            doFlip();



        }, { passive: true });







        // Ensure clicking never redirects or causes page jump



        card.addEventListener("click", function (e) {



            e.preventDefault();



            doFlip();



        });



    });



}







if (document.readyState === "loading") {



    document.addEventListener("DOMContentLoaded", initSteppingStoneHoverFlip);



} else {



    initSteppingStoneHoverFlip();



}







/* =========================================================



 *   RESUME OPTIMIZER - BIG EDITABLE WORKSPACE & PDF PREVIEW



 * ========================================================= */



function initResumeOptimizer() {



    const fileInput = document.getElementById("resume-file");



    const dropzoneWrapper = document.getElementById("dropzoneWrapper");



    const uploadLabel = document.getElementById("uploadResumeLabel");



    const editorContainer = document.getElementById("resumeEditorContainer");



    const resumeSheet = document.getElementById("resumeSheet");



    if (!fileInput || !dropzoneWrapper || !editorContainer || !resumeSheet) return;







    const activeFileName = document.getElementById("activeFileName");



    const activeFileSize = document.getElementById("activeFileSize");



    const btnLoadSample = document.getElementById("btnLoadSample");



    const btnChangeFile = document.getElementById("btnChangeFile");



    const btnDownloadResume = document.getElementById("btnDownloadResume");



    const viewToggleGroup = document.getElementById("viewToggleGroup");



    const btnViewEditable = document.getElementById("btnViewEditable");



    const btnViewOriginal = document.getElementById("btnViewOriginal");



    const originalPdfViewer = document.getElementById("originalPdfViewer");



    const resumeCanvasScroller = document.getElementById("resumeCanvasScroller");



    const pdfIframe = document.getElementById("pdfIframe");



    const btnZoomIn = document.getElementById("btnZoomIn");



    const btnZoomOut = document.getElementById("btnZoomOut");



    const zoomLevelText = document.getElementById("zoomLevelText");



    const btnToggleSettings = document.getElementById("btnToggleSettings");



    const sidebarSettingsBody = document.getElementById("sidebarSettingsBody");







    if (btnToggleSettings && sidebarSettingsBody) {



        btnToggleSettings.addEventListener("click", function() {



            const isOpen = sidebarSettingsBody.classList.toggle("is-open");



            btnToggleSettings.setAttribute("aria-expanded", isOpen);



            const icon = btnToggleSettings.querySelector(".toggle-icon");



            if (icon) icon.textContent = isOpen ? "▲" : "▼";



        });



    }







    // Sidebar Controls



    const colorPicker = document.getElementById("resume-color");



    const colorCount = document.getElementById("color-count");



    const fontChoice = document.getElementById("font-choice");



    const currentFontDemo = document.getElementById("current-font");



    const fontSection = document.getElementById("font-section");



    const fontSize = document.getElementById("font-size");



    const currentTheme = document.getElementById("current-theme");



    const editTheme = document.getElementById("edit-theme");







    let currentZoom = 1.0;







    // Helper: format file size



    function formatBytes(bytes) {



        if (!bytes || bytes === 0) return "0 KB";



        const k = 1024;



        const sizes = ["Bytes", "KB", "MB"];



        const i = Math.floor(Math.log(bytes) / Math.log(k));



        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];



    }







    // Show Editor Container



    
    // Ensure every single part of text inside resume sheet is editable
    function makeAllResumeTextEditable() {
        if (!resumeSheet) return;
        const textSelectors = [
            "h1", "h2", "h3", "h4",
            "p",
            "li",
            "strong",
            "em",
            ".sheet-section-body",
            ".resume-tagline",
            ".resume-name",
            ".contact-item",
            ".exp-role", ".exp-dates", ".exp-company", ".exp-location",
            ".edu-degree", ".edu-dates", ".edu-school", ".edu-gpa"
        ];
        textSelectors.forEach(function (sel) {
            resumeSheet.querySelectorAll(sel).forEach(function (el) {
                if (!el.classList.contains("contact-sep") && !el.classList.contains("btn-add-entry")) {
                    el.setAttribute("contenteditable", "true");
                    el.setAttribute("spellcheck", "false");
                    if (!el.getAttribute("title")) {
                        el.setAttribute("title", "Click to edit text");
                    }
                }
            });
        });
    }

    // Dynamic ATS Score Loading & Calculation Animation with Semicircle Gauge
    function triggerAtsScoreLoading(targetScore) {
        const sidebarAtsBox = document.getElementById("sidebarAtsBox");
        const sidebarAtsScoreVal = document.getElementById("sidebarAtsScoreVal");
        const optimizerBottomActions = document.getElementById("optimizerBottomActions");
        const btnViewAtsReports = document.getElementById("btnViewAtsReports");
        const atsSemicircleProgress = document.getElementById("atsSemicircleProgress");
        const atsSemicircleVal = document.getElementById("atsSemicircleVal");
        const atsSemicircleBadge = document.getElementById("atsSemicircleBadge");

        const finalScore = (typeof targetScore === "number" && targetScore > 0) ? targetScore : 88;

        // Reset progress arc and numbers to 0
        if (atsSemicircleProgress) atsSemicircleProgress.style.strokeDashoffset = "283";
        if (atsSemicircleVal) atsSemicircleVal.textContent = "0";
        if (atsSemicircleBadge) {
            atsSemicircleBadge.textContent = "Analyzing...";
            atsSemicircleBadge.className = "semicircle-score-badge";
        }

        // Show loading state in sidebar if visible
        if (sidebarAtsBox) {
            sidebarAtsBox.style.display = "none"; // Kept clean so user only sees score once under the button
            sidebarAtsBox.classList.remove("is-loaded");
            sidebarAtsBox.classList.add("is-loading");
        }
        if (sidebarAtsScoreVal) {
            sidebarAtsScoreVal.innerHTML = '<span class="ats-calc-loader"><span class="ats-calc-spinner"></span> Analyzing...</span>';
        }

        // Reveal the bottom actions container (button + semicircle box)
        if (optimizerBottomActions) {
            optimizerBottomActions.style.display = "flex";
            optimizerBottomActions.classList.add("fade-in");
        }
        if (btnViewAtsReports) {
            btnViewAtsReports.innerHTML = 'View Detailed ATS Report &rarr;';
            btnViewAtsReports.href = "ats.html?score=" + finalScore;
        }

        // Simulate realistic analysis pause (550ms) then animate ticker and semicircle arc
        setTimeout(function() {
            if (sidebarAtsBox) {
                sidebarAtsBox.classList.remove("is-loading");
                sidebarAtsBox.classList.add("is-loaded");
            }

            // Animate SVG semicircle arc
            const maxArc = 283;
            const targetOffset = maxArc - (maxArc * (finalScore / 100));
            if (atsSemicircleProgress) {
                atsSemicircleProgress.style.strokeDashoffset = targetOffset.toFixed(1);
            }

            // Number counter ticker
            let currentCount = 0;
            const duration = 650;
            const steps = 18;
            const increment = finalScore / steps;
            const intervalTime = Math.floor(duration / steps);

            const counterInterval = setInterval(function() {
                currentCount += increment;
                if (currentCount >= finalScore) {
                    clearInterval(counterInterval);
                    if (atsSemicircleVal) atsSemicircleVal.textContent = finalScore;
                    if (sidebarAtsScoreVal) sidebarAtsScoreVal.textContent = finalScore + "/100";

                    // Set badge label
                    if (atsSemicircleBadge) {
                        if (finalScore >= 85) {
                            atsSemicircleBadge.textContent = "⚡ Excellent Match";
                            atsSemicircleBadge.className = "semicircle-score-badge";
                        } else if (finalScore >= 70) {
                            atsSemicircleBadge.textContent = "👍 Good Match";
                            atsSemicircleBadge.className = "semicircle-score-badge status-warning";
                        } else {
                            atsSemicircleBadge.textContent = "⚠️ Needs Optimization";
                            atsSemicircleBadge.className = "semicircle-score-badge status-danger";
                        }
                    }

                    try {
                        localStorage.setItem("careerAI_currentResumeAts", finalScore);
                        localStorage.setItem("careerAI_atsScore", finalScore);
                    } catch (e) {}

                    if (btnViewAtsReports) {
                        btnViewAtsReports.href = "ats.html?score=" + finalScore;
                    }
                } else {
                    const rounded = Math.round(currentCount);
                    if (atsSemicircleVal) atsSemicircleVal.textContent = rounded;
                    if (sidebarAtsScoreVal) sidebarAtsScoreVal.textContent = rounded + "/100";
                }
            }, intervalTime);
        }, 550);
    }

    function openEditor(fileName, fileSizeText) {



        dropzoneWrapper.style.display = "none";



        editorContainer.style.display = "flex";



        if (activeFileName) activeFileName.textContent = fileName || "resume.pdf";



        if (activeFileSize) activeFileSize.textContent = fileSizeText || "Uploaded file";







        makeAllResumeTextEditable();
        editorContainer.scrollIntoView({ behavior: "smooth", block: "start" });



    }







    // Auto-load resume when directed from Profile page via URL param or localStorage



    const urlParams = new URLSearchParams(window.location.search);



    const docFromUrl = urlParams.get("doc");



    const atsFromUrl = urlParams.get("ats") || urlParams.get("score");







    let savedResumeData = null;



    try {



        const stored = localStorage.getItem("careerAI_openResume");



        if (stored) savedResumeData = JSON.parse(stored);



    } catch (e) {}







    // Only open when a resume file was uploaded or viewed explicitly via doc parameter
    if (docFromUrl) {
        const scoreText = atsFromUrl ? "ATS Score: " + atsFromUrl : "ATS Optimized Resume";
        openEditor(docFromUrl, scoreText);
        const parsedAts = atsFromUrl ? parseInt(atsFromUrl.replace(/\D/g, ""), 10) : (parseInt(localStorage.getItem("careerAI_currentResumeAts"), 10) || 88);
        triggerAtsScoreLoading(parsedAts);

        // Customize the resume name on the sheet with user's profile name if available
        try {
            const userProfile = JSON.parse(localStorage.getItem("careerAI_userProfile") || "{}");
            const sheetName = document.querySelector(".resume-name");
            const sheetTagline = document.querySelector(".resume-tagline");

            if (userProfile.name && sheetName) {
                sheetName.textContent = userProfile.name.toUpperCase();
            }

            if (userProfile.role && sheetTagline) {
                sheetTagline.textContent = userProfile.role + " | Software & Cloud Systems";
            }
        } catch (e) {}
    } else {
        // Show upload dropzone by default, only open when a file is uploaded
        dropzoneWrapper.style.display = "block";
        editorContainer.style.display = "none";
        try {
            localStorage.removeItem("careerAI_openResume");
        } catch (e) {}
    }

    // Process Uploaded File



    function handleFile(file) {
        if (!file) return;

        openEditor(file.name, formatBytes(file.size));

        // Immediately show the ATS score box in analyzing state upon file upload
        const sidebarAtsBox = document.getElementById("sidebarAtsBox");
        const sidebarAtsScoreVal = document.getElementById("sidebarAtsScoreVal");
        if (sidebarAtsBox) {
            sidebarAtsBox.style.display = "flex";
            sidebarAtsBox.classList.remove("is-loaded");
            sidebarAtsBox.classList.add("is-loading");
            if (sidebarAtsScoreVal) {
                sidebarAtsScoreVal.innerHTML = '<span class="ats-calc-loader"><span class="ats-calc-spinner"></span> Analyzing...</span>';
            }
        }
        const optBottom = document.getElementById("optimizerBottomActions");
        if (optBottom) optBottom.style.display = "none";

        // Save metadata to repository
        try {
            const existing = JSON.parse(localStorage.getItem("careerAI_resumeRepository") || "[]");
            const newEntry = {
                id: "res_" + Date.now(),
                name: file.name,
                size: formatBytes(file.size),
                date: "Today",
                atsScore: 88,
                pillClass: "pill-ats-high"
            };
            if (!existing.some(r => r.name === file.name)) {
                existing.unshift(newEntry);
                localStorage.setItem("careerAI_resumeRepository", JSON.stringify(existing));
            }
        } catch (e) {}

        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        const isDocx = file.name.toLowerCase().endsWith(".docx") || file.name.toLowerCase().endsWith(".doc");
        const isText = file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md");

        // Enable view toggle between Edit Canvas and Original file
        if (viewToggleGroup) viewToggleGroup.style.display = "inline-flex";

        // Set up original viewer
        try {
            const blobUrl = URL.createObjectURL(file);
            if (pdfIframe) pdfIframe.src = blobUrl;
        } catch (err) {
            console.warn("Could not create object URL for file:", err);
        }

        // Show parsing indicator
        const badge = document.querySelector(".badge-live-edit");
        if (badge) badge.textContent = "📄 Loading & parsing file contents...";

        if (isPdf && window.pdfjsLib) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const typedArray = new Uint8Array(e.target.result);
                pdfjsLib.getDocument(typedArray).promise.then(async function(pdf) {
                    let allLines = [];
                    for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
                        try {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageLines = extractLinesFromPdfTextContent(textContent);
                            if (pageLines.length > 0) {
                                allLines.push(...pageLines);
                            }
                        } catch (err) {
                            console.warn("Error reading page " + i, err);
                        }
                    }

                    if (allLines.length > 0) {
                        const parsed = parseResumeLines(allLines, file.name);
                        renderParsedResumeToCanvas(parsed);
                        if (badge) badge.textContent = "✏️ Click any text to edit directly";
                    } else {
                        // Scanned PDF fallback: attempt OCR or notify
                        handleScannedPdfFallback(pdf, file.name);
                    }
                }).catch(function(err) {
                    console.warn("PDF extraction error:", err);
                    if (badge) badge.textContent = "✏️ Click any text to edit directly";
                });
            };
            reader.readAsArrayBuffer(file);

        } else if (isDocx && window.mammoth) {
            const reader = new FileReader();
            reader.onload = function(e) {
                mammoth.extractRawText({ arrayBuffer: e.target.result }).then(function(result) {
                    const raw = result.value || "";
                    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                    if (lines.length > 0) {
                        const parsed = parseResumeLines(lines, file.name);
                        renderParsedResumeToCanvas(parsed);
                    }
                    if (badge) badge.textContent = "✏️ Click any text to edit directly";
                }).catch(function(err) {
                    console.warn("Mammoth extraction error:", err);
                    if (badge) badge.textContent = "✏️ Click any text to edit directly";
                });
            };
            reader.readAsArrayBuffer(file);

        } else if (isText) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result || "";
                const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                if (lines.length > 0) {
                    const parsed = parseResumeLines(lines, file.name);
                    renderParsedResumeToCanvas(parsed);
                }
                if (badge) badge.textContent = "✏️ Click any text to edit directly";
            };
            reader.readAsText(file);

        } else {
            if (badge) badge.textContent = "✏️ Click any text to edit directly";
        }
    }

    // Helper: Extract ordered lines from PDF.js textContent preserving spatial line baselines
    function extractLinesFromPdfTextContent(textContent) {
        if (!textContent || !textContent.items || textContent.items.length === 0) return [];

        const items = textContent.items.filter(it => it.str && it.str.trim().length > 0);
        if (items.length === 0) return [];

        // Sort by Y descending (top-to-bottom), then X ascending (left-to-right)
        items.sort((a, b) => {
            const yA = a.transform ? a.transform[5] : 0;
            const yB = b.transform ? b.transform[5] : 0;
            const xA = a.transform ? a.transform[4] : 0;
            const xB = b.transform ? b.transform[4] : 0;

            if (Math.abs(yA - yB) > 3.5) {
                return yB - yA; // Top of page down to bottom
            }
            return xA - xB; // Left to right
        });

        const lines = [];
        let currentLine = [];
        let lastY = null;

        items.forEach(item => {
            const y = item.transform ? item.transform[5] : 0;
            if (lastY === null || Math.abs(lastY - y) > 3.5) {
                if (currentLine.length > 0) {
                    lines.push(currentLine.join(" ").trim());
                }
                currentLine = [item.str.trim()];
                lastY = y;
            } else {
                currentLine.push(item.str.trim());
            }
        });

        if (currentLine.length > 0) {
            lines.push(currentLine.join(" ").trim());
        }

        return lines;
    }

    // Fallback for scanned/image PDFs
    async function handleScannedPdfFallback(pdf, filename) {
        const badge = document.querySelector(".badge-live-edit");
        if (window.Tesseract) {
            if (badge) badge.textContent = "🔍 OCR scanning text from document image...";
            try {
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext("2d");
                await page.render({ canvasContext: ctx, viewport }).promise;

                const ocrRes = await Tesseract.recognize(canvas, "eng");
                const ocrLines = ocrRes.data.lines.map(l => l.text.trim()).filter(Boolean);
                if (ocrLines.length > 0) {
                    const parsed = parseResumeLines(ocrLines, filename);
                    renderParsedResumeToCanvas(parsed);
                }
            } catch (err) {
                console.warn("Tesseract OCR error:", err);
            }
        }
        if (badge) badge.textContent = "✏️ Click any text to edit directly";
    }

    // Universal Resume Line Parser
    function parseResumeLines(lines, filename) {
        if (!lines || lines.length === 0) return null;

        const cleanLines = lines.map(l => l.trim()).filter(Boolean);
        if (cleanLines.length === 0) return null;

        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
        const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
        const linkRegex = /(?:https?:\/\/|www\.)?[a-zA-Z0-9-]+\.(?:com|org|io|dev|in|net|edu)(?:\/[^\s]*)?/i;

        const sectionKeywords = [
            "summary", "professional summary", "executive summary", "profile", "about me", "about", "objective", "career objective",
            "experience", "work experience", "professional experience", "employment history", "work history", "career history", "employment",
            "education", "academic background", "academics", "qualifications", "academic history",
            "skills", "technical skills", "core competencies", "skills & abilities", "technologies", "tools", "areas of expertise", "competencies",
            "projects", "key projects", "academic projects", "personal projects", "portfolio",
            "certifications", "certificates", "licenses", "training",
            "awards", "honors", "achievements", "accomplishments",
            "publications", "research",
            "languages", "volunteer", "volunteering", "leadership", "extracurricular"
        ];

        function isSectionHeader(line) {
            if (!line || line.length > 50) return false;
            const norm = line.toLowerCase().replace(/[:#*_\-–•]/g, "").trim();
            for (const kw of sectionKeywords) {
                if (norm === kw || norm.startsWith(kw + " ") || norm.endsWith(" " + kw)) {
                    return kw;
                }
            }
            if (line.length >= 3 && line.length <= 35 && line === line.toUpperCase() && /^[A-Z\s&/\-]+$/.test(line) && !line.includes("@") && !/\d/.test(line)) {
                return norm;
            }
            return false;
        }

        let firstSectionIdx = -1;
        for (let i = 0; i < cleanLines.length; i++) {
            if (isSectionHeader(cleanLines[i])) {
                firstSectionIdx = i;
                break;
            }
        }

        const headerEnd = firstSectionIdx !== -1 ? firstSectionIdx : Math.min(cleanLines.length, 6);
        const headerLines = cleanLines.slice(0, headerEnd);

        let candidateName = "";
        let tagline = "";
        const contactInfo = {
            email: "",
            phone: "",
            location: "",
            links: []
        };

        // Scan contact info
        for (const l of cleanLines) {
            if (!contactInfo.email) {
                const em = l.match(emailRegex);
                if (em) contactInfo.email = em[0];
            }
            if (!contactInfo.phone) {
                const ph = l.match(phoneRegex);
                if (ph) contactInfo.phone = ph[0];
            }
            if (contactInfo.links.length < 2) {
                const lnk = l.match(linkRegex);
                if (lnk && !lnk[0].includes("@") && !contactInfo.links.includes(lnk[0])) {
                    contactInfo.links.push(lnk[0]);
                }
            }
        }

        // Determine name
        for (const l of headerLines) {
            if (emailRegex.test(l) || phoneRegex.test(l) || isSectionHeader(l)) continue;
            const clean = l.replace(/[^a-zA-Z\s.-]/g, "").trim();
            if (clean.length >= 3 && clean.length <= 40 && !clean.toLowerCase().includes("resume") && !clean.toLowerCase().includes("curriculum")) {
                candidateName = clean;
                break;
            }
        }

        if (!candidateName) {
            candidateName = filename.replace(/\.(pdf|docx|doc|txt)$/i, "").replace(/[-_]/g, " ").toUpperCase();
        }

        // Determine tagline
        for (const l of headerLines) {
            if (l === candidateName || emailRegex.test(l) || phoneRegex.test(l) || isSectionHeader(l)) continue;
            if (l.length >= 4 && l.length <= 70) {
                tagline = l;
                break;
            }
        }

        // Determine location
        for (const l of headerLines) {
            if (l === candidateName || l === tagline || emailRegex.test(l)) continue;
            const locMatch = l.match(/([A-Z][a-zA-Z]+(?:[\s-][A-Z][a-zA-Z]+)*,\s*[A-Z]{2,}(?:\s+\d{5})?|[A-Z][a-zA-Z]+,\s*[A-Z][a-zA-Z]+)/);
            if (locMatch) {
                contactInfo.location = locMatch[0];
                break;
            }
        }

        // Slice into sections
        const sections = [];
        let currentSection = null;
        const startIdx = firstSectionIdx !== -1 ? firstSectionIdx : headerEnd;

        for (let i = startIdx; i < cleanLines.length; i++) {
            const line = cleanLines[i];
            const matchedKw = isSectionHeader(line);

            if (matchedKw) {
                if (currentSection && currentSection.lines.length > 0) {
                    sections.push(currentSection);
                }
                currentSection = {
                    title: line.replace(/[:#*_\-–•]/g, "").trim().toUpperCase(),
                    keyword: matchedKw,
                    lines: []
                };
            } else {
                if (!currentSection) {
                    currentSection = {
                        title: "SUMMARY",
                        keyword: "summary",
                        lines: []
                    };
                }
                currentSection.lines.push(line);
            }
        }

        if (currentSection && currentSection.lines.length > 0) {
            sections.push(currentSection);
        }

        return {
            candidateName,
            tagline: tagline || "Professional",
            contactInfo,
            sections
        };
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Render experience items
    function renderExperienceItems(lines) {
        if (!lines || lines.length === 0) return "";
        const items = [];
        let currentItem = null;

        const dateRegex = /(?:\b(?:19|20)\d{2}\b|present|current)/i;
        const bulletRegex = /^[•\-*–▪▫➢\d+\.]\s*/;

        for (const line of lines) {
            const isBullet = bulletRegex.test(line);
            const hasDate = dateRegex.test(line);

            if (hasDate && !isBullet && currentItem && currentItem.bullets.length > 0) {
                // New job entry
                items.push(currentItem);
                currentItem = {
                    role: line,
                    company: "",
                    dates: "",
                    bullets: []
                };
            } else if (!currentItem) {
                currentItem = {
                    role: line,
                    company: "",
                    dates: "",
                    bullets: []
                };
            } else if (hasDate && !currentItem.dates) {
                // Split date from role/company if combined
                const dateMatch = line.match(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?\d{4}\s*(?:–|-|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:\d{4}|Present|Current)/i);
                if (dateMatch) {
                    currentItem.dates = dateMatch[0];
                    const rest = line.replace(dateMatch[0], "").replace(/[|•–-]/g, " ").trim();
                    if (rest && !currentItem.company) currentItem.company = rest;
                } else {
                    currentItem.dates = line;
                }
            } else if (isBullet) {
                currentItem.bullets.push(line.replace(bulletRegex, "").trim());
            } else {
                if (!currentItem.company) {
                    currentItem.company = line;
                } else {
                    currentItem.bullets.push(line);
                }
            }
        }

        if (currentItem) items.push(currentItem);

        return items.map(it => `
            <div class="experience-item">
                <div class="exp-header-row">
                    <strong class="exp-role" contenteditable="true" spellcheck="false" data-section="Experience" title="Click to edit role">${escapeHtml(it.role || "Professional Role")}</strong>
                    <span class="exp-dates" contenteditable="true" spellcheck="false" data-section="Experience" title="Click to edit dates">${escapeHtml(it.dates || "2021 — Present")}</span>
                </div>
                ${it.company ? `<div class="exp-company-row"><span class="exp-company" contenteditable="true" spellcheck="false" data-section="Experience" title="Click to edit company">${escapeHtml(it.company)}</span></div>` : ""}
                ${it.bullets.length > 0 ? `
                    <ul class="exp-bullets" data-section="Body">
                        ${it.bullets.map(b => `<li contenteditable="true" spellcheck="false" title="Click to edit bullet point">${escapeHtml(b)}</li>`).join("")}
                    </ul>
                ` : ""}
            </div>
        `).join("");
    }

    // Render education items
    function renderEducationItems(lines) {
        if (!lines || lines.length === 0) return "";
        const items = [];
        let currentItem = null;
        const dateRegex = /(?:\b(?:19|20)\d{2}\b)/;

        for (const line of lines) {
            const hasDate = dateRegex.test(line);
            if (hasDate && currentItem && currentItem.school) {
                items.push(currentItem);
                currentItem = { degree: line, school: "", dates: "", details: "" };
            } else if (!currentItem) {
                currentItem = { degree: line, school: "", dates: "", details: "" };
            } else if (hasDate && !currentItem.dates) {
                currentItem.dates = line;
            } else if (!currentItem.school) {
                currentItem.school = line;
            } else {
                currentItem.details = line;
            }
        }
        if (currentItem) items.push(currentItem);

        return items.map(it => `
            <div class="education-item">
                <div class="exp-header-row">
                    <strong class="edu-degree" contenteditable="true" spellcheck="false" data-section="Education" title="Click to edit degree">${escapeHtml(it.degree || "Degree")}</strong>
                    <span class="edu-dates" contenteditable="true" spellcheck="false" data-section="Education" title="Click to edit dates">${escapeHtml(it.dates || "Graduated")}</span>
                </div>
                ${it.school ? `<div class="exp-company-row"><span class="edu-school" contenteditable="true" spellcheck="false" data-section="Education" title="Click to edit school">${escapeHtml(it.school)}</span></div>` : ""}
                ${it.details ? `<div class="exp-company-row"><span class="edu-gpa" contenteditable="true" spellcheck="false" data-section="Education">${escapeHtml(it.details)}</span></div>` : ""}
            </div>
        `).join("");
    }

    // Render skills items
    function renderSkillsItems(lines) {
        if (!lines || lines.length === 0) return "";
        return lines.map(l => {
            if (l.includes(":")) {
                const parts = l.split(":");
                const category = parts[0].trim();
                const rest = parts.slice(1).join(":").trim();
                return `<p contenteditable="true" spellcheck="false" title="Click to edit skill group"><strong>${escapeHtml(category)}:</strong> ${escapeHtml(rest)}</p>`;
            } else {
                return `<p contenteditable="true" spellcheck="false" title="Click to edit skills">${escapeHtml(l)}</p>`;
            }
        }).join("");
    }

    // Render generic section items
    function renderGenericSectionItems(lines) {
        if (!lines || lines.length === 0) return "";
        const bulletRegex = /^[•\-*–▪▫➢\d+\.]\s*/;
        const hasBullets = lines.some(l => bulletRegex.test(l));

        if (hasBullets) {
            return `
                <ul class="exp-bullets" data-section="Body">
                    ${lines.map(l => `<li contenteditable="true" spellcheck="false" title="Click to edit line">${escapeHtml(l.replace(bulletRegex, ""))}</li>`).join("")}
                </ul>
            `;
        } else {
            return lines.map(l => `<p contenteditable="true" spellcheck="false" title="Click to edit line">${escapeHtml(l)}</p>`).join("");
        }
    }

    
    // Dynamic ATS Score Calculation based on parsed resume quality & completeness
    function calculateResumeAtsScore(parsed) {
        if (!parsed) return 88;
        let score = 52; // baseline

        // Contact information
        if (parsed.contactInfo) {
            if (parsed.contactInfo.email) score += 6;
            if (parsed.contactInfo.phone) score += 6;
            if (parsed.contactInfo.location) score += 4;
            if (parsed.contactInfo.links && parsed.contactInfo.links.length > 0) score += 4;
        }

        // Section coverage
        const sectionKeywords = parsed.sections ? parsed.sections.map(s => (s.keyword || "").toLowerCase()) : [];
        const hasSummary = sectionKeywords.some(k => k.includes("summary") || k.includes("profile") || k.includes("about") || k.includes("objective"));
        const hasExp = sectionKeywords.some(k => k.includes("experience") || k.includes("work") || k.includes("career"));
        const hasEdu = sectionKeywords.some(k => k.includes("education") || k.includes("academic"));
        const hasSkills = sectionKeywords.some(k => k.includes("skill") || k.includes("competenc") || k.includes("technolog"));

        if (hasSummary) score += 6;
        if (hasExp) score += 8;
        if (hasEdu) score += 5;
        if (hasSkills) score += 6;

        // Experience depth
        const expSec = parsed.sections ? parsed.sections.find(s => (s.keyword || "").includes("experience") || (s.keyword || "").includes("work")) : null;
        if (expSec && expSec.lines && expSec.lines.length >= 3) {
            score += 3;
        }

        return Math.min(Math.max(score, 65), 96);
    }

    // Render parsed structured resume into #resumeSheet with 100% editable lines
    function renderParsedResumeToCanvas(parsed) {
        if (!resumeSheet || !parsed) return;

        let html = `
            <!-- RESUME HEADER -->
            <header class="sheet-header">
                <div class="header-name-row">
                    <div class="resume-avatar-container" id="resumeAvatarContainer" style="display: ${includePhotoSelect && includePhotoSelect.value === 'yes' ? 'flex' : 'none'};">
                        <img src="2.jpeg" alt="Profile" id="resumeSheetAvatar" class="resume-sheet-avatar">
                    </div>
                    <div class="header-text-col">
                        <h1 class="resume-name" contenteditable="true" spellcheck="false" data-section="Heading" title="Click to edit name">
                            ${escapeHtml(parsed.candidateName.toUpperCase())}
                        </h1>
                        <div class="resume-tagline" contenteditable="true" spellcheck="false" data-section="Subheading" title="Click to edit title">
                            ${escapeHtml(parsed.tagline)}
                        </div>
                    </div>
                </div>

                <div class="resume-contact-bar" data-section="Contact" title="Click to edit contact details">
        `;

        const contactItems = [];
        if (parsed.contactInfo.email) {
            contactItems.push(`<span class="contact-item" contenteditable="true" spellcheck="false" title="Click to edit email">📧 ${escapeHtml(parsed.contactInfo.email)}</span>`);
        } else {
            contactItems.push(`<span class="contact-item" contenteditable="true" spellcheck="false" title="Click to edit email">📧 contact@email.com</span>`);
        }

        if (parsed.contactInfo.phone) {
            contactItems.push(`<span class="contact-item" contenteditable="true" spellcheck="false" title="Click to edit phone">📱 ${escapeHtml(parsed.contactInfo.phone)}</span>`);
        }

        if (parsed.contactInfo.location) {
            contactItems.push(`<span class="contact-item" contenteditable="true" spellcheck="false" title="Click to edit location">📍 ${escapeHtml(parsed.contactInfo.location)}</span>`);
        } else {
            contactItems.push(`<span class="contact-item" contenteditable="true" spellcheck="false" title="Click to edit location">📍 San Francisco, CA</span>`);
        }

        parsed.contactInfo.links.forEach(lnk => {
            contactItems.push(`<span class="contact-item" contenteditable="true" spellcheck="false" title="Click to edit link">🔗 ${escapeHtml(lnk)}</span>`);
        });

        html += contactItems.join(`\n<span class="contact-sep">•</span>\n`);
        html += `\n</div></header>\n`;

        // Render each extracted section
        parsed.sections.forEach(sec => {
            const kw = (sec.keyword || "").toLowerCase();

            if (kw.includes("summary") || kw.includes("profile") || kw.includes("about") || kw.includes("objective")) {
                html += `
                    <section class="sheet-section section-summary">
                        <h2 class="sheet-section-title" contenteditable="true" spellcheck="false" data-section="Subheading">${escapeHtml(sec.title)}</h2>
                        <div class="sheet-section-body" contenteditable="true" spellcheck="false" data-section="Body">
                            ${sec.lines.map(l => escapeHtml(l)).join(" ")}
                        </div>
                    </section>
                `;
            } else if (kw.includes("experience") || kw.includes("employment") || kw.includes("work") || kw.includes("career")) {
                html += `
                    <section class="sheet-section section-experience">
                        <div class="section-title-row">
                            <h2 class="sheet-section-title" contenteditable="true" spellcheck="false" data-section="Subheading">${escapeHtml(sec.title)}</h2>
                            <button type="button" class="btn-add-entry" id="btnAddExperience" title="Add another job entry">+ Add Role</button>
                        </div>
                        <div class="experience-list" id="experienceList">
                            ${renderExperienceItems(sec.lines)}
                        </div>
                    </section>
                `;
            } else if (kw.includes("education") || kw.includes("academic") || kw.includes("qualification")) {
                html += `
                    <section class="sheet-section section-education">
                        <div class="section-title-row">
                            <h2 class="sheet-section-title" contenteditable="true" spellcheck="false" data-section="Subheading">${escapeHtml(sec.title)}</h2>
                            <button type="button" class="btn-add-entry" id="btnAddEducation" title="Add another education entry">+ Add Degree</button>
                        </div>
                        <div class="education-list" id="educationList">
                            ${renderEducationItems(sec.lines)}
                        </div>
                    </section>
                `;
            } else if (kw.includes("skills") || kw.includes("competencies") || kw.includes("technologies") || kw.includes("tools")) {
                html += `
                    <section class="sheet-section section-skills">
                        <h2 class="sheet-section-title" contenteditable="true" spellcheck="false" data-section="Subheading">${escapeHtml(sec.title)}</h2>
                        <div class="skills-grid" data-section="Skills">
                            ${renderSkillsItems(sec.lines)}
                        </div>
                    </section>
                `;
            } else {
                html += `
                    <section class="sheet-section section-custom">
                        <h2 class="sheet-section-title" contenteditable="true" spellcheck="false" data-section="Subheading">${escapeHtml(sec.title)}</h2>
                        <div class="sheet-section-body" data-section="Body">
                            ${renderGenericSectionItems(sec.lines)}
                        </div>
                    </section>
                `;
            }
        });

        resumeSheet.innerHTML = html;

        // Apply colors and theme
        if (typeof applySelectedColorsToResume === "function") {
            applySelectedColorsToResume();
        }

        // Make every line editable
        makeAllResumeTextEditable();

        // Calculate and trigger dynamic ATS score loading animation
        try {
            const calculatedAts = calculateResumeAtsScore(parsed);
            triggerAtsScoreLoading(calculatedAts);
        } catch (e) {}
    }
    // Input file change



    fileInput.addEventListener("change", function(e) {



        if (e.target.files && e.target.files[0]) {



            handleFile(e.target.files[0]);



        }



    });







    // Drag and drop handlers



    if (uploadLabel) {



        ["dragenter", "dragover"].forEach(function(eventName) {



            uploadLabel.addEventListener(eventName, function(e) {



                e.preventDefault();



                e.stopPropagation();



                uploadLabel.classList.add("dragover");



            }, false);



        });







        ["dragleave", "drop"].forEach(function(eventName) {



            uploadLabel.addEventListener(eventName, function(e) {



                e.preventDefault();



                e.stopPropagation();



                uploadLabel.classList.remove("dragover");



            }, false);



        });







        uploadLabel.addEventListener("drop", function(e) {



            e.preventDefault();



            e.stopPropagation();



            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {



                handleFile(e.dataTransfer.files[0]);



            }



        }, false);



    }







    // Load sample resume



    if (btnLoadSample) {



        btnLoadSample.addEventListener("click", function() {



            openEditor("sample_engineer_resume.pdf", "138 KB");



            if (viewToggleGroup) viewToggleGroup.style.display = "none";

            triggerAtsScoreLoading(88);



        });



    }







    // Replace file



    if (btnChangeFile) {



        btnChangeFile.addEventListener("click", function() {



            fileInput.value = "";



            fileInput.click();



        });



    }







    // View toggles



    if (btnViewEditable && btnViewOriginal && originalPdfViewer && resumeCanvasScroller) {



        btnViewEditable.addEventListener("click", function() {



            btnViewEditable.classList.add("active");



            btnViewOriginal.classList.remove("active");



            resumeCanvasScroller.style.display = "flex";



            originalPdfViewer.style.display = "none";



        });







        btnViewOriginal.addEventListener("click", function() {



            btnViewOriginal.classList.add("active");



            btnViewEditable.classList.remove("active");



            resumeCanvasScroller.style.display = "none";



            originalPdfViewer.style.display = "block";



        });



    }







    // Zoom Controls



    function applyZoom() {



        if (resumeSheet) {



            resumeSheet.style.transform = `scale(${currentZoom})`;



            if (zoomLevelText) zoomLevelText.textContent = Math.round(currentZoom * 100) + "%";



        }



    }







    if (btnZoomIn) {



        btnZoomIn.addEventListener("click", function() {



            if (currentZoom < 1.4) {



                currentZoom = parseFloat((currentZoom + 0.1).toFixed(1));



                applyZoom();



            }



        });



    }







    if (btnZoomOut) {



        btnZoomOut.addEventListener("click", function() {



            if (currentZoom > 0.65) {



                currentZoom = parseFloat((currentZoom - 0.1).toFixed(1));



                applyZoom();



            }



        });



    }







    // Download / Print Resume



    if (btnDownloadResume) {



        btnDownloadResume.addEventListener("click", function() {



            window.print();



        });



    }







    // Add Experience button



    const btnAddExperience = document.getElementById("btnAddExperience");



    if (btnAddExperience) {



        btnAddExperience.addEventListener("click", function() {



            const list = document.getElementById("experienceList");



            if (!list) return;



            const newItem = document.createElement("div");



            newItem.className = "experience-item";



            newItem.innerHTML = `



                <div class="exp-header-row">



                    <strong class="exp-role" contenteditable="true" spellcheck="false" data-section="Experience">Software Engineer</strong>



                    <span class="exp-dates" contenteditable="true" spellcheck="false" data-section="Experience">2023 — 2024</span>



                </div>



                <div class="exp-company-row">



                    <span class="exp-company" contenteditable="true" spellcheck="false" data-section="Experience">Company Name</span>



                    <span class="exp-location" contenteditable="true" spellcheck="false" data-section="Experience">City, Country</span>



                </div>



                <ul class="exp-bullets" data-section="Body">
                    <li contenteditable="true" spellcheck="false" title="Click to edit bullet point">Developed core features, optimized API endpoints, and collaborated cross-functionally.</li>
                </ul>



            `;



            list.appendChild(newItem);



            const roleEl = newItem.querySelector(".exp-role");



            if (roleEl) roleEl.focus();



        });



    }







    // Add Education button



    const btnAddEducation = document.getElementById("btnAddEducation");



    if (btnAddEducation) {



        btnAddEducation.addEventListener("click", function() {



            const list = document.getElementById("educationList");



            if (!list) return;



            const newItem = document.createElement("div");



            newItem.className = "education-item";



            newItem.innerHTML = `



                <div class="exp-header-row">



                    <strong class="edu-degree" contenteditable="true" spellcheck="false" data-section="Education">Degree / Certification Title</strong>



                    <span class="edu-dates" contenteditable="true" spellcheck="false" data-section="Education">2020 — 2024</span>



                </div>



                <div class="exp-company-row">



                    <span class="edu-school" contenteditable="true" spellcheck="false" data-section="Education">University / Institute Name</span>



                    <span class="edu-gpa" contenteditable="true" spellcheck="false" data-section="Education">GPA / Grade</span>



                </div>



            `;



            list.appendChild(newItem);



            const degEl = newItem.querySelector(".edu-degree");



            if (degEl) degEl.focus();



        });



    }







    // =========================================================



    //   SIDEBAR CONTROLS INTEGRATION & ENHANCEMENTS



    // =========================================================







    // 1. Profile Image Feature (Include Profile Image Dropdown + Upload / Camera RN)



    const includePhotoSelect = document.getElementById("includePhotoSelect");



    const photoActionsGroup = document.getElementById("photoActionsGroup");



    const btnUploadResumePhoto = document.getElementById("btnUploadResumePhoto");



    const btnCaptureResumePhoto = document.getElementById("btnCaptureResumePhoto");



    const resumePhotoFileInput = document.getElementById("resumePhotoFileInput");



    const resumeAvatarContainer = document.getElementById("resumeAvatarContainer");



    const resumeSheetAvatar = document.getElementById("resumeSheetAvatar");



    const activePhotoBar = document.getElementById("activePhotoBar");



    const activePhotoThumb = document.getElementById("activePhotoThumb");



    const btnRemovePhoto = document.getElementById("btnRemovePhoto");







    // Camera Modal Elements



    const cameraModal = document.getElementById("cameraCaptureModal");



    const cameraVideo = document.getElementById("cameraVideo");



    const cameraLoadingHint = document.getElementById("cameraLoadingHint");



    const btnSnapPhoto = document.getElementById("btnSnapPhoto");



    const btnCancelCamera = document.getElementById("btnCancelCamera");



    const btnCloseCameraModal = document.getElementById("btnCloseCameraModal");



    let cameraStream = null;







    function setResumeProfileImage(dataUrl) {



        if (!dataUrl) return;



        if (resumeSheetAvatar) resumeSheetAvatar.src = dataUrl;



        if (activePhotoThumb) activePhotoThumb.src = dataUrl;



        if (activePhotoBar) activePhotoBar.style.display = "flex";



        try {



            localStorage.setItem("careerAI_resume_photo", dataUrl);



        } catch (e) {}



    }







    function removeResumeProfileImage() {



        if (resumeSheetAvatar) resumeSheetAvatar.src = "2.jpeg";



        if (activePhotoThumb) activePhotoThumb.src = "";



        if (activePhotoBar) activePhotoBar.style.display = "none";



        try {



            localStorage.removeItem("careerAI_resume_photo");



        } catch (e) {}



    }







        function updateTemplatePreviewsPhotoState(includePhoto) {
        const grid = document.getElementById("templateCardsGrid");
        if (!grid) return;
        if (includePhoto) {
            grid.classList.add("has-photo");
            grid.classList.remove("no-photo");
        } else {
            grid.classList.add("no-photo");
            grid.classList.remove("has-photo");
        }
    }

if (includePhotoSelect) {



        includePhotoSelect.addEventListener("change", function() {



            const isYes = includePhotoSelect.value === "yes";
            updateTemplatePreviewsPhotoState(isYes);



            if (photoActionsGroup) photoActionsGroup.style.display = isYes ? "block" : "none";



            if (resumeAvatarContainer) resumeAvatarContainer.style.display = isYes ? "flex" : "none";



            try {



                localStorage.setItem("careerAI_includePhoto", includePhotoSelect.value);



            } catch (e) {}







            if (isYes) {



                // If saved photo exists, show it; else check profileImage or fallback 2.jpeg



                const savedPhoto = localStorage.getItem("careerAI_resume_photo") || localStorage.getItem("careerAI_profileImage");



                if (savedPhoto) {



                    setResumeProfileImage(savedPhoto);



                } else {



                    setResumeProfileImage("2.jpeg");



                }



            }



        });







        // Initialize state from saved preference



        try {



            const savedPref = localStorage.getItem("careerAI_includePhoto");



            if (savedPref === "yes") {
                updateTemplatePreviewsPhotoState(true);



                includePhotoSelect.value = "yes";



                if (photoActionsGroup) photoActionsGroup.style.display = "block";



                if (resumeAvatarContainer) resumeAvatarContainer.style.display = "flex";



                const savedPhoto = localStorage.getItem("careerAI_resume_photo") || localStorage.getItem("careerAI_profileImage");



                if (savedPhoto) setResumeProfileImage(savedPhoto);



            }



        } catch (e) {}



    }







    // Upload Image from file



    if (btnUploadResumePhoto && resumePhotoFileInput) {



        btnUploadResumePhoto.addEventListener("click", function() {



            resumePhotoFileInput.click();



        });







        resumePhotoFileInput.addEventListener("change", function(e) {



            const file = e.target.files[0];



            if (file) {



                const reader = new FileReader();



                reader.onload = function(evt) {



                    setResumeProfileImage(evt.target.result);



                };



                reader.readAsDataURL(file);



            }



        });



    }







    // Camera Capture Functionality



    function startCamera() {

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {

            alert("Camera is not supported on this browser.");

            return;

        }

        if (cameraModal) {

            cameraModal.style.display = "flex";

            cameraModal.classList.add("open");

        }

        if (cameraLoadingHint) cameraLoadingHint.style.display = "block";



        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })

            .then(function(stream) {

                cameraStream = stream;

                if (cameraVideo) {

                    cameraVideo.srcObject = stream;

                    cameraVideo.play();

                }

                if (cameraLoadingHint) cameraLoadingHint.style.display = "none";

            })

            .catch(function(err) {

                console.warn("Camera permission denied:", err);

                if (cameraModal) {

                    cameraModal.classList.remove("open");

                    cameraModal.style.display = "none";

                }

                alert("Camera permission denied or camera not found. You can upload an image file instead.");

            });

    }



    function stopCamera() {

        if (cameraStream) {

            cameraStream.getTracks().forEach(function(track) { track.stop(); });

            cameraStream = null;

        }

        if (cameraVideo) cameraVideo.srcObject = null;

        if (cameraModal) {

            cameraModal.classList.remove("open");

            cameraModal.style.display = "none";

        }

    }







    if (btnCaptureResumePhoto) {



        btnCaptureResumePhoto.addEventListener("click", startCamera);



    }



    if (btnCancelCamera) {



        btnCancelCamera.addEventListener("click", stopCamera);



    }



    if (btnCloseCameraModal) {



        btnCloseCameraModal.addEventListener("click", stopCamera);



    }







    if (btnSnapPhoto && cameraVideo) {



        btnSnapPhoto.addEventListener("click", function() {



            const canvas = document.createElement("canvas");



            canvas.width = cameraVideo.videoWidth || 320;



            canvas.height = cameraVideo.videoHeight || 320;



            const ctx = canvas.getContext("2d");



            ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);



            const dataUrl = canvas.toDataURL("image/png");



            setResumeProfileImage(dataUrl);



            stopCamera();



        });



    }







    if (btnRemovePhoto) {



        btnRemovePhoto.addEventListener("click", removeResumeProfileImage);



    }











    // 2. Resume Templates Selection



    const templateCards = document.querySelectorAll(".template-card");







    function applyResumeTemplate(templateName) {



        const themeMap = {



            "executive": "theme-executive",



            "professional": "theme-professional",



            "minimalistic": "theme-minimalistic",



            "creative": "theme-creative"



        };



        const allThemes = [



            "theme-executive", "theme-professional", "theme-minimalistic", "theme-creative",



            "theme-classic", "theme-modern", "theme-minimal", "theme-elegant"



        ];



        allThemes.forEach(function(cls) { resumeSheet.classList.remove(cls); });







        const selectedClass = themeMap[templateName.toLowerCase()] || "theme-professional";



        resumeSheet.classList.add(selectedClass);







        templateCards.forEach(function(card) {



            const cardTpl = card.getAttribute("data-template");



            if (cardTpl === templateName.toLowerCase()) {



                card.classList.add("active");



            } else {



                card.classList.remove("active");



            }



        });







        if (editTheme) {



            editTheme.value = templateName.toLowerCase();



        }







        try {



            localStorage.setItem("careerAI_resumeTemplate", templateName.toLowerCase());



        } catch (e) {}



    }







    templateCards.forEach(function(card) {



        card.addEventListener("click", function() {



            const tpl = card.getAttribute("data-template");



            applyResumeTemplate(tpl);



        });



    });











    // 3. Color Palette with Multi-Color Selection & Confirmation
    const colorCountSelect = document.getElementById("colorCountSelect");
    const colorPickingTarget = document.getElementById("colorPickingTarget");
    const pickingBadge = document.getElementById("pickingBadge");
    const pickingTargetText = document.getElementById("pickingTargetText");
    const colorPickerInput = document.getElementById("resume-color");
    const activeColorSwatch = document.getElementById("activeColorSwatch");
    const activeColorHex = document.getElementById("activeColorHex");
    const btnConfirmColor = document.getElementById("btnConfirmColor");
    const colorSwatches = document.querySelectorAll(".swatch-btn");
    const paletteCounter = document.getElementById("paletteCounter");
    const confirmedSwatchesList = document.getElementById("confirmedSwatchesList");
    const btnApplyColors = document.getElementById("btnApplyColors");
    const applyStatusText = document.getElementById("applyStatusText");

    let targetColorCount = 1;
    let confirmedColors = ["#681313"]; // Default active primary color
    let activeSlotIndex = 0; // Which slot is currently targeted
    let currentSelectedColor = "#681313";

    const roleLabels = [
        "Color 1 (Primary Accent)",
        "Color 2 (Secondary)",
        "Color 3 (Highlight / Tertiary)"
    ];
    const roleShort = ["Primary", "Secondary", "Highlight"];

    function getContrastTextColor(hex) {
        if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return "#241A17";
        const r = parseInt(hex.slice(1, 3), 16) || 0;
        const g = parseInt(hex.slice(3, 5), 16) || 0;
        const b = parseInt(hex.slice(5, 7), 16) || 0;
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 150 ? "#241A17" : "#FFFFFF";
    }

    function syncPickerDisplay(hex) {
        if (!hex) return;
        hex = hex.toUpperCase();
        if (colorPickerInput) colorPickerInput.value = hex;
        if (activeColorSwatch) activeColorSwatch.style.backgroundColor = hex;
        if (activeColorHex) activeColorHex.textContent = hex;

        colorSwatches.forEach(function(swatch) {
            const swColor = (swatch.getAttribute("data-color") || "").toUpperCase();
            if (swColor === hex) {
                swatch.classList.add("active");
            } else {
                swatch.classList.remove("active");
            }
        });

        if (btnConfirmColor) {
            const roleName = roleShort[activeSlotIndex] || ("Color " + (activeSlotIndex + 1));
            btnConfirmColor.innerHTML = `✓ Confirm ${roleName}`;
        }
    }

    function updatePickingGuide() {
        if (!pickingTargetText || !pickingBadge) return;
        const slotNum = activeSlotIndex + 1;
        pickingBadge.textContent = `Step ${slotNum}`;
        const role = roleLabels[activeSlotIndex] || `Color ${slotNum}`;

        if (confirmedColors[activeSlotIndex]) {
            pickingTargetText.innerHTML = `Editing <strong>${role}</strong>: Pick a shade & click Confirm`;
        } else {
            pickingTargetText.innerHTML = `Pick shade for <strong>${role}</strong> & click Confirm`;
        }
    }

    function renderConfirmedSlots() {
        if (!confirmedSwatchesList) return;
        confirmedSwatchesList.innerHTML = "";

        const count = targetColorCount;
        let confirmedCount = 0;

        for (let i = 0; i < count; i++) {
            const hex = confirmedColors[i];
            const isFilled = !!hex;
            if (isFilled) confirmedCount++;
            const isCurrent = (i === activeSlotIndex);

            const item = document.createElement("div");
            item.className = `confirmed-color-item ${isFilled ? "filled" : "empty"} ${isCurrent ? "active-slot" : ""}`;
            item.setAttribute("data-index", String(i));

            if (isFilled) {
                item.innerHTML = `
                    <div class="confirmed-swatch-box" style="background-color: ${hex};"></div>
                    <div class="confirmed-color-info">
                        <span class="confirmed-role">${roleLabels[i]}</span>
                        <span class="confirmed-hex">${hex}</span>
                    </div>
                    <button type="button" class="btn-slot-action" title="Remove this color" data-remove="${i}">&times;</button>
                `;
            } else {
                item.innerHTML = `
                    <div class="confirmed-swatch-box empty-slot">+</div>
                    <div class="confirmed-color-info">
                        <span class="confirmed-role">${roleLabels[i]}</span>
                        <span class="confirmed-hint">Choose above & click Confirm</span>
                    </div>
                `;
            }

            item.addEventListener("click", function(e) {
                if (e.target.closest("[data-remove]")) return;
                activeSlotIndex = i;
                if (confirmedColors[i]) {
                    currentSelectedColor = confirmedColors[i];
                }
                syncPickerDisplay(currentSelectedColor);
                renderConfirmedSlots();
                updatePickingGuide();
            });

            const removeBtn = item.querySelector("[data-remove]");
            if (removeBtn) {
                removeBtn.addEventListener("click", function(e) {
                    e.stopPropagation();
                    confirmedColors.splice(i, 1);
                    activeSlotIndex = Math.min(i, confirmedColors.length);
                    renderConfirmedSlots();
                    updatePickingGuide();
                    updateApplyButtonState();
                });
            }

            confirmedSwatchesList.appendChild(item);
        }

        if (paletteCounter) {
            if (confirmedCount === targetColorCount) {
                paletteCounter.textContent = `${confirmedCount} / ${targetColorCount} ready ✓`;
                paletteCounter.style.color = "#2A6F4E";
            } else {
                paletteCounter.textContent = `${confirmedCount} / ${targetColorCount} selected`;
                paletteCounter.style.color = "#665";
            }
        }
    }

    function updateApplyButtonState() {
        if (!btnApplyColors) return;

        let confirmedCount = 0;
        for (let i = 0; i < targetColorCount; i++) {
            if (confirmedColors[i]) confirmedCount++;
        }

        const isReady = (confirmedCount === targetColorCount);

        if (isReady) {
            btnApplyColors.disabled = false;
            btnApplyColors.innerHTML = `🎨 Apply Selected Colors (${targetColorCount})`;
            btnApplyColors.classList.add("ready");
        } else {
            btnApplyColors.disabled = true;
            btnApplyColors.classList.remove("ready");
            const needed = targetColorCount - confirmedCount;
            btnApplyColors.innerHTML = `Confirm ${needed} more color${needed > 1 ? "s" : ""} to apply`;
        }
    }

    function confirmCurrentColor() {
        if (!currentSelectedColor) return;
        currentSelectedColor = currentSelectedColor.toUpperCase();

        confirmedColors[activeSlotIndex] = currentSelectedColor;

        if (confirmedColors.length < targetColorCount) {
            activeSlotIndex = confirmedColors.length;
        } else {
            let nextEmpty = -1;
            for (let i = 0; i < targetColorCount; i++) {
                if (!confirmedColors[i]) {
                    nextEmpty = i;
                    break;
                }
            }
            if (nextEmpty !== -1) {
                activeSlotIndex = nextEmpty;
            }
        }

        renderConfirmedSlots();
        updatePickingGuide();
        updateApplyButtonState();

        if (btnConfirmColor) {
            const prevText = btnConfirmColor.innerHTML;
            btnConfirmColor.innerHTML = `✓ Confirmed!`;
            btnConfirmColor.style.background = "#2A6F4E";
            setTimeout(function() {
                if (btnConfirmColor) {
                    btnConfirmColor.style.background = "";
                    syncPickerDisplay(currentSelectedColor);
                }
            }, 600);
        }
    }

    function applySelectedColorsToResume() {
        if (!resumeSheet) return;

        let confirmedCount = 0;
        for (let i = 0; i < targetColorCount; i++) {
            if (confirmedColors[i]) confirmedCount++;
        }
        if (confirmedCount < targetColorCount) return;

        const c1 = confirmedColors[0] || "#681313";
        const c2 = confirmedColors[1] || (targetColorCount === 1 ? c1 : "#4A3E3D");
        const c3 = confirmedColors[2] || (targetColorCount >= 2 ? c2 : "#FAF1ED");

        resumeSheet.style.setProperty("--resume-accent", c1);
        resumeSheet.style.setProperty("--resume-secondary", c2);
        resumeSheet.style.setProperty("--resume-tertiary", c3);

        // 1. Primary Accent Elements (Color 1)
        const primaryHeadings = resumeSheet.querySelectorAll(".resume-name, .sheet-section-title");
        primaryHeadings.forEach(function(el) {
            el.style.color = c1;
            el.style.borderColor = c1;
        });

        const addButtons = resumeSheet.querySelectorAll(".btn-add-entry");
        addButtons.forEach(function(btn) {
            btn.style.color = c1;
            btn.style.borderColor = c1;
        });

        const avatarContainer = resumeSheet.querySelector(".resume-avatar-container");
        if (avatarContainer) {
            avatarContainer.style.borderColor = c1;
        }

        // 2. Secondary Elements (Color 2)
        const tagline = resumeSheet.querySelector(".resume-tagline");
        if (tagline) {
            tagline.style.color = c2;
        }

        const roleDates = resumeSheet.querySelectorAll(".sheet-item-date, .experience-date");
        roleDates.forEach(function(el) {
            el.style.color = c2;
        });

        const companyItems = resumeSheet.querySelectorAll(".sheet-item-company, .company-name");
        companyItems.forEach(function(el) {
            el.style.color = c2;
        });

        const contactBar = resumeSheet.querySelector(".resume-contact-bar");
        if (contactBar) {
            contactBar.style.borderColor = c2;
        }

        // 3. Badges, Skills & Tertiary Elements (Color 3)
        const skillPills = resumeSheet.querySelectorAll(".skill-pill, .sheet-badge, .skill-tag");
        skillPills.forEach(function(pill) {
            pill.style.borderColor = c2;
            if (targetColorCount >= 3) {
                pill.style.backgroundColor = c3;
                pill.style.color = getContrastTextColor(c3);
            } else {
                pill.style.color = c2;
            }
        });

        // Theme-specific enhancements
        if (resumeSheet.classList.contains("theme-executive")) {
            const header = resumeSheet.querySelector(".sheet-header");
            if (header) header.style.borderColor = c1;
        } else if (resumeSheet.classList.contains("theme-creative")) {
            resumeSheet.style.borderLeftColor = c1;
        } else if (resumeSheet.classList.contains("theme-professional")) {
            const header = resumeSheet.querySelector(".sheet-header");
            if (header && targetColorCount >= 3) {
                header.style.backgroundColor = c3;
            }
        }

        // Save
        try {
            localStorage.setItem("careerAI_resumePalette", JSON.stringify(confirmedColors.slice(0, targetColorCount)));
            localStorage.setItem("careerAI_resumeAccent", c1);
        } catch(e) {}

        // Feedback message
        if (applyStatusText) {
            applyStatusText.style.display = "block";
            applyStatusText.textContent = `✓ ${targetColorCount} color${targetColorCount > 1 ? "s" : ""} applied to resume!`;
            setTimeout(function() {
                if (applyStatusText) applyStatusText.style.display = "none";
            }, 3000);
        }
    }

    // Backwards compatibility helper
    function updateResumeColor(color) {
        if (!color) return;
        currentSelectedColor = color.toUpperCase();
        confirmedColors[0] = currentSelectedColor;
        syncPickerDisplay(currentSelectedColor);
        renderConfirmedSlots();
        updateApplyButtonState();
        applySelectedColorsToResume();
    }

    // Try loading saved palette from localStorage
    try {
        const savedPalette = JSON.parse(localStorage.getItem("careerAI_resumePalette"));
        if (Array.isArray(savedPalette) && savedPalette.length >= 1) {
            confirmedColors = savedPalette.slice(0, 3);
            targetColorCount = confirmedColors.length;
            if (colorCountSelect) colorCountSelect.value = String(targetColorCount);
            currentSelectedColor = confirmedColors[0];
        } else {
            const savedAccent = localStorage.getItem("careerAI_resumeAccent");
            if (savedAccent) {
                confirmedColors = [savedAccent];
                currentSelectedColor = savedAccent;
            }
        }
    } catch (e) {}

    // Attach listeners
    if (colorCountSelect) {
        colorCountSelect.addEventListener("change", function(e) {
            const newCount = parseInt(e.target.value, 10) || 1;
            targetColorCount = newCount;
            if (confirmedColors.length > targetColorCount) {
                confirmedColors = confirmedColors.slice(0, targetColorCount);
            }
            if (confirmedColors.length < targetColorCount) {
                activeSlotIndex = confirmedColors.length;
            } else {
                activeSlotIndex = 0;
            }
            if (confirmedColors[activeSlotIndex]) {
                currentSelectedColor = confirmedColors[activeSlotIndex];
            }
            syncPickerDisplay(currentSelectedColor);
            renderConfirmedSlots();
            updatePickingGuide();
            updateApplyButtonState();
        });
    }

    if (colorPickerInput) {
        colorPickerInput.addEventListener("input", function(e) {
            currentSelectedColor = e.target.value.toUpperCase();
            syncPickerDisplay(currentSelectedColor);
        });
        colorPickerInput.addEventListener("change", function(e) {
            currentSelectedColor = e.target.value.toUpperCase();
            syncPickerDisplay(currentSelectedColor);
        });
    }

    colorSwatches.forEach(function(swatch) {
        swatch.addEventListener("click", function() {
            const col = (swatch.getAttribute("data-color") || "").toUpperCase();
            currentSelectedColor = col;
            syncPickerDisplay(col);
        });
    });

    if (btnConfirmColor) {
        btnConfirmColor.addEventListener("click", function() {
            confirmCurrentColor();
        });
    }

    if (btnApplyColors) {
        btnApplyColors.addEventListener("click", function() {
            applySelectedColorsToResume();
        });
    }

    // Initial render
    syncPickerDisplay(currentSelectedColor);
    renderConfirmedSlots();
    updatePickingGuide();
    updateApplyButtonState();

    // 4. Font Choice



    if (fontChoice) {



        function updateResumeFont(fontName) {



            let fontStack = `'${fontName}', sans-serif`;



            if (["Georgia", "Times New Roman", "Garamond"].includes(fontName)) {



                fontStack = `'${fontName}', serif`;



            } else if (fontName === "Courier New") {



                fontStack = `'Courier New', monospace`;



            }



            if (resumeSheet) {



                resumeSheet.style.setProperty("--resume-font", fontStack);



                resumeSheet.style.fontFamily = fontStack;



            }







            if (currentFontDemo) {



                currentFontDemo.style.fontFamily = fontStack;



                currentFontDemo.textContent = fontName;



            }







            if (fontChoice && fontChoice.value !== fontName) {



                fontChoice.value = fontName;



            }







            try {



                localStorage.setItem("careerAI_resumeFont", fontName);



            } catch (e) {}



        }







        fontChoice.addEventListener("change", function(e) {



            updateResumeFont(e.target.value);



        });







        // Immediately display the font currently in use on page load



        try {



            const activeFont = localStorage.getItem("careerAI_resumeFont") || fontChoice.value || "Arial";



            updateResumeFont(activeFont);



        } catch (e) {



            updateResumeFont(fontChoice.value || "Arial");



        }



    }











    // 5. Section Font Size



    if (fontSection && fontSize) {



        function applySectionFontSize() {



            const section = fontSection.value;



            const size = fontSize.value;







            if (section === "Heading") {



                const el = resumeSheet.querySelector(".resume-name");



                if (el) el.style.fontSize = size;



            } else if (section === "Subheading") {



                resumeSheet.querySelectorAll(".sheet-section-title, .resume-tagline").forEach(function(el) {



                    el.style.fontSize = size;



                });



            } else if (section === "Body") {



                resumeSheet.querySelectorAll(".sheet-section-body, .exp-bullets, .skills-grid p, .projects-list p").forEach(function(el) {



                    el.style.fontSize = size;



                });



            } else if (section === "Skills") {



                const el = resumeSheet.querySelector(".skills-grid");



                if (el) el.style.fontSize = size;



            } else if (section === "Experience") {



                resumeSheet.querySelectorAll(".exp-role, .exp-dates, .exp-company").forEach(function(el) {



                    el.style.fontSize = size;



                });



            } else if (section === "Education") {



                resumeSheet.querySelectorAll(".edu-degree, .edu-dates, .edu-school").forEach(function(el) {



                    el.style.fontSize = size;



                });



            } else if (section === "Contact") {



                const el = resumeSheet.querySelector(".resume-contact-bar");



                if (el) el.style.fontSize = size;



            }



        }







        fontSize.addEventListener("change", applySectionFontSize);



        fontSection.addEventListener("change", function() {



            const section = fontSection.value;



            if (section === "Heading") fontSize.value = "32px";



            else if (section === "Subheading") fontSize.value = "16px";



            else if (section === "Body") fontSize.value = "14px";



            else if (section === "Skills") fontSize.value = "14px";



            else if (section === "Experience") fontSize.value = "14px";



            else if (section === "Education") fontSize.value = "14px";



            else if (section === "Contact") fontSize.value = "14px";



        });



    }







    if (editTheme) {



        editTheme.addEventListener("change", function(e) {



            applyResumeTemplate(e.target.value);



        });



    }











    // 6. ATS Score Box & View ATS Reports Button Integration



    const sidebarAtsScoreVal = document.getElementById("sidebarAtsScoreVal");



    const btnViewAtsReports = document.getElementById("btnViewAtsReports");







    let activeAtsScore = 88;



    if (atsFromUrl) {



        const parsed = parseInt(atsFromUrl.replace(/[^0-9]/g, ""), 10);



        if (!isNaN(parsed)) activeAtsScore = parsed;



    } else {



        try {



            const savedAts = localStorage.getItem("careerAI_currentResumeAts");



            if (savedAts) activeAtsScore = parseInt(savedAts, 10) || 88;



        } catch (e) {}



    }







    // Only display ATS score if a document is already actively opened on initial page load
    const sidebarAtsBox = document.getElementById("sidebarAtsBox");
    const optimizerBottomActions = document.getElementById("optimizerBottomActions");
    if (docFromUrl || (editorContainer && editorContainer.style.display !== "none")) {
        triggerAtsScoreLoading(activeAtsScore);
    } else {
        // No resume uploaded yet: keep score box and report button hidden until upload
        if (sidebarAtsBox) sidebarAtsBox.style.display = "none";
        if (optimizerBottomActions) optimizerBottomActions.style.display = "none";
    }

    if (btnViewAtsReports) {
        btnViewAtsReports.innerHTML = 'View Detailed ATS Report &rarr;';
        btnViewAtsReports.href = "ats.html?score=" + activeAtsScore;
        btnViewAtsReports.addEventListener("click", function(e) {
            const curVal = sidebarAtsScoreVal ? sidebarAtsScoreVal.textContent : "";
            const m = curVal.match(/(\d+)/);
            const scoreToPass = m ? parseInt(m[1], 10) : activeAtsScore;
            try {
                localStorage.setItem("careerAI_currentResumeAts", scoreToPass);
                localStorage.setItem("careerAI_atsScore", scoreToPass);
            } catch (err) {}
            btnViewAtsReports.href = "ats.html?score=" + scoreToPass;
        });
    }

    // Live sync ATS score if user makes edits to resume content
    if (resumeSheet) {
        let editTimeout = null;
        resumeSheet.addEventListener("input", function() {
            clearTimeout(editTimeout);
            editTimeout = setTimeout(function() {
                const curVal = sidebarAtsScoreVal ? sidebarAtsScoreVal.textContent : "";
                const m = curVal.match(/(\d+)/);
                let score = m ? parseInt(m[1], 10) : 88;
                const totalLen = resumeSheet.textContent.length;
                if (totalLen > 1500 && score < 95) score = Math.min(96, score + 1);
                if (sidebarAtsScoreVal) sidebarAtsScoreVal.textContent = score + "/100";
                const atsSemiVal = document.getElementById("atsSemicircleVal");
                const atsSemiProg = document.getElementById("atsSemicircleProgress");
                if (atsSemiVal) atsSemiVal.textContent = score;
                if (atsSemiProg) {
                    const maxArc = 283;
                    atsSemiProg.style.strokeDashoffset = (maxArc - (maxArc * (score / 100))).toFixed(1);
                }
                if (btnViewAtsReports) btnViewAtsReports.href = "ats.html?score=" + score;
                try {
                    localStorage.setItem("careerAI_currentResumeAts", score);
                    localStorage.setItem("careerAI_atsScore", score);
                } catch (e) {}
            }, 600);
        });
    }







    // Restore saved custom color or template



    try {



        const savedColor = localStorage.getItem("careerAI_resumeAccent");



        if (savedColor) updateResumeColor(savedColor);







        const savedTpl = localStorage.getItem("careerAI_resumeTemplate");



        makeAllResumeTextEditable();
        if (savedTpl) applyResumeTemplate(savedTpl);



    } catch (e) {}



}







if (document.readyState === "loading") {



    document.addEventListener("DOMContentLoaded", initResumeOptimizer);



} else {



    initResumeOptimizer();



}











/* =========================================================



 *   FAQ ACCORDION (Home Page)



 * ========================================================= */



function initFAQAccordion() {



    const faqItems = document.querySelectorAll(".faq-item");



    if (faqItems.length === 0) return;







    faqItems.forEach(function (item) {



        const btn = item.querySelector(".faq-question");



        if (!btn) return;







        btn.addEventListener("click", function () {



            const isOpen = item.classList.contains("is-open");







            // Close all other items for a clean single-open accordion feel



            faqItems.forEach(function (other) {



                if (other !== item) {



                    other.classList.remove("is-open");



                    const otherBtn = other.querySelector(".faq-question");



                    if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");



                }



            });







            if (isOpen) {



                item.classList.remove("is-open");



                btn.setAttribute("aria-expanded", "false");



            } else {



                item.classList.add("is-open");



                btn.setAttribute("aria-expanded", "true");



            }



        });



    });



}







/* =========================================================



 *   DASHBOARD STATS STRIP (Scroll-triggered Loading Animation)



 * ========================================================= */



function initDashboardStats() {



    const statsStrip = document.querySelector(".dashboard-stats-strip");



    const statCards = document.querySelectorAll(".dash-stat-card");



    if (!statsStrip || statCards.length === 0) return;







    let hasAnimated = false;



    let isAnimating = false;







    // Reset numbers and progress bars to 0



    function resetStats() {



        statCards.forEach(function (card) {



            const numEl = card.querySelector(".dash-stat-number");



            const fillEl = card.querySelector(".dash-stat-progress-fill");



            if (numEl) numEl.textContent = "0";



            if (fillEl) fillEl.style.width = "0%";



        });



    }







    // Run the count-up and progress bar fill animation (0.3s)



    function runStatsAnimation() {



        if (isAnimating) return;



        isAnimating = true;







        const duration = 300; // exactly 0.3 seconds as requested



        const startTime = performance.now();







        // Pull latest from localStorage or defaults



        let saved = {};



        try {



            const raw = localStorage.getItem("careerai_user_stats");



            if (raw) saved = JSON.parse(raw);



        } catch (e) {}







        statsStrip.classList.add("stats-loaded");







        statCards.forEach(function (card, index) {



            const numEl = card.querySelector(".dash-stat-number");



            const fillEl = card.querySelector(".dash-stat-progress-fill");



            if (!numEl) return;







            const statKey = card.getAttribute("data-stat-key");



            const defaultTarget = Number(numEl.getAttribute("data-target")) || 0;



            let targetVal = defaultTarget;







            if (saved) {



                if (statKey === "resumesMade" && saved.resumesMade !== undefined) {



                    targetVal = Number(saved.resumesMade);



                } else if (statKey === "resumesOptimized" && saved.resumesOptimized !== undefined) {



                    targetVal = Number(saved.resumesOptimized);



                } else if (statKey === "jobs" && (saved.jobs !== undefined || saved.savedJobs !== undefined)) {
                    targetVal = Number(saved.jobs !== undefined ? saved.jobs : saved.savedJobs);
                } else if (statKey && saved[statKey] !== undefined) {



                    targetVal = Number(saved[statKey]);



                } else if (statKey === "resumes" && saved.resumes !== undefined) {



                    targetVal = Number(saved.resumes);



                }



            }







                        let targetPct = fillEl ? (fillEl.getAttribute("data-fill-target") || (targetVal + "%")) : (targetVal + "%");
            if (statKey === "atsScore" || statKey === "readiness") {
                targetPct = targetVal + "%";
            }
            const numericPct = parseFloat(targetPct) || 88;







            numEl.textContent = "0";



            if (fillEl) fillEl.style.width = "0%";







            function tick(now) {



                const elapsed = now - startTime;



                const progress = Math.min(elapsed / duration, 1);



                // smooth easeOut curve



                const ease = 1 - Math.pow(1 - progress, 3);



                const current = Math.round(ease * targetVal);







                numEl.textContent = current;







                if (fillEl) {



                    fillEl.style.width = (ease * numericPct) + "%";



                }







                if (progress < 1) {



                    requestAnimationFrame(tick);



                } else {



                    numEl.textContent = targetVal;



                    if (fillEl) fillEl.style.width = targetPct;



                    if (index === statCards.length - 1) {



                        isAnimating = false;



                        hasAnimated = true;



                    }



                }



            }







            requestAnimationFrame(tick);



        });



    }







    // Initialize with 0



    resetStats();







    // IntersectionObserver triggers animation when user scrolls into view



    if ("IntersectionObserver" in window) {



        const observer = new IntersectionObserver(function (entries) {



            entries.forEach(function (entry) {



                if (entry.isIntersecting) {



                    runStatsAnimation();



                } else {



                    if (hasAnimated && !isAnimating) {



                        resetStats();



                        hasAnimated = false;



                    }



                }



            });



        }, {



            threshold: 0.15,



            rootMargin: "0px 0px -40px 0px"



        });







        observer.observe(statsStrip);



    } else {



        // Fallback for scroll events



        let scrollTimeout = null;



        function checkScroll() {



            const rect = statsStrip.getBoundingClientRect();



            const inView = rect.top < (window.innerHeight - 50) && rect.bottom > 50;



            if (inView && !hasAnimated) {



                runStatsAnimation();



            } else if (!inView && hasAnimated) {



                resetStats();



                hasAnimated = false;



            }



        }



        window.addEventListener("scroll", function () {



            if (scrollTimeout) clearTimeout(scrollTimeout);



            scrollTimeout = setTimeout(checkScroll, 40);



        }, { passive: true });



        checkScroll();



    }



}







// Auto-run on DOM ready



if (document.readyState === "loading") {



    document.addEventListener("DOMContentLoaded", function () {



        initFAQAccordion();



        initDashboardStats();



    });



} else {



    initFAQAccordion();



    initDashboardStats();



}







