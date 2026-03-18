/* GLOBAL */

// DARK MODE (PERSISTENT)
const toggle = document.getElementById("forgeToggle");
function applyTheme() {
    const saved = localStorage.getItem("theme");

    if (saved) {
        if (saved === "dark") {
            document.body.classList.add("dark-mode");
        }
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (prefersDark) {
            document.body.classList.add("dark-mode");
        }
    }

    updateToggleIcon();
}

function updateToggleIcon() {
    if (!toggle) return;

    const isDark = document.body.classList.contains("dark-mode");
    toggle.textContent = isDark ? "⚫" : "🔥";
}

if (toggle) {
    toggle.onclick = () => {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        localStorage.setItem("theme", isDark ? "dark" : "light");

        updateToggleIcon();
    };
}

window.matchMedia("(prefers-color-scheme: dark)")
.addEventListener("change", e => {
    if (!localStorage.getItem("theme")) {
        if (e.matches) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
        updateToggleIcon();
    }
});

applyTheme();

// BURGER MENU
const burger = document.getElementById("burger");
const navMenu = document.getElementById("navMenu");

if (burger && navMenu) {
    burger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        burger.classList.toggle("active");
    });
}


/* INDEX PAGE (Particles + Scroll) */

const canvas = document.getElementById("embers");
const sparkCanvas = document.getElementById("sparks");
const fireCanvas = document.getElementById("forgeFire");

if (canvas && sparkCanvas && fireCanvas) {
    const ctx = canvas.getContext("2d");
    const sparkCtx = sparkCanvas.getContext("2d");
    const fireCtx = fireCanvas.getContext("2d");

    let particles = [];
    let sparkParticles = [];
    let flames = [];
    let fireActive = true;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        sparkCanvas.width = window.innerWidth;
        sparkCanvas.height = window.innerHeight;

        fireCanvas.width = window.innerWidth;
        fireCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // EMBERS
    class Ember {
        constructor() { this.reset(); }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 200;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 0.6 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.life = Math.random() * 200;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.life--;

            if (this.life <= 0 || this.y < -20) this.reset();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,140,40,0.35)";
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Ember());

    // FLAMES
    class Flame {
        constructor() { this.reset(); }

        reset() {
            this.x = Math.random() * fireCanvas.width;
            this.y = fireCanvas.height - 80;
            this.size = Math.random() * 6 + 3;
            this.speed = Math.random() * 1.2 + 0.4;
            this.life = Math.random() * 60;
        }

        update() {
            this.y -= this.speed;
            this.life--;
            if (this.life <= 0) this.reset();
        }

        draw() {
            fireCtx.beginPath();
            fireCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            fireCtx.fillStyle = "rgba(255,120,0,0.2)";
            fireCtx.fill();
        }
    }

    for (let i = 0; i < 120; i++) flames.push(new Flame());

    // SPARKS
    class Spark {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = (Math.random() - 1.5) * 6;
            this.life = 40;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.15;
            this.life--;
        }

        draw() {
            sparkCtx.beginPath();
            sparkCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            sparkCtx.fillStyle = "orange";
            sparkCtx.fill();
        }
    }

    window.addEventListener("click", (e) => {
        for (let i = 0; i < 25; i++) {
            sparkParticles.push(new Spark(e.clientX, e.clientY));
        }
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fireCtx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);
        sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);

        if (fireActive) {
            particles.forEach(p => { p.update(); p.draw(); });
            flames.forEach(f => { f.update(); f.draw(); });
        }

        sparkParticles = sparkParticles.filter(s => {
            s.update();
            s.draw();
            return s.life > 0;
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// SWORD SCROLL BAR
const sword = document.getElementById("scrollSword");

function updateSwordScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? scrollTop / docHeight : 0;
    const scabbardOffset = 135;
    const hiltClearance = 0;

    const trackHeight = window.innerHeight - scabbardOffset;
    let position = percent * trackHeight;

    const maxPosition = trackHeight - hiltClearance;
    if (position > maxPosition) position = maxPosition;

    sword.style.transform = `translate(-50%, ${position}px)`;

    const glowThreshold = maxPosition - 10;

    if (position >= glowThreshold) {
        sword.style.filter = "drop-shadow(0 0 3px red) drop-shadow(0 0 6px orange) drop-shadow(0 0 6px orange) drop-shadow(0 0 12px yellow)";
    } else {
        sword.style.filter = "none";
    }
}

window.addEventListener("scroll", updateSwordScroll);
updateSwordScroll();

// Scroll on Drag
sword.addEventListener("mousedown",(e)=>{
    e.preventDefault();

    function move(event){
        const percent = event.clientY/window.innerHeight;

        window.scrollTo({
            top: percent*(document.body.scrollHeight-window.innerHeight)
        });
    }

    window.addEventListener("mousemove",move);

    window.addEventListener("mouseup",()=>{
        window.removeEventListener("mousemove",move);
        document.body.style.userSelect = "auto";
    },{once:true});
});

document.body.style.userSelect = "none";

/* ABOUT PAGE */

const forgeSteps = document.querySelectorAll(".forge-step");

if (forgeSteps.length > 0) {
    forgeSteps.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.remove("hit");
            void card.offsetWidth; // reflow
            card.classList.add("hit");
        });
    });
}

/* FAQ PAGE */

const faqCards = document.querySelectorAll(".faq-card");

faqCards.forEach(card => {
    const question = card.querySelector(".faq-question");

    question.addEventListener("click", () => {
        faqCards.forEach(c => {
            if (c !== card) c.classList.remove("active");
        });

        card.classList.toggle("active");
    });
});