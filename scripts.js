const toggle = document.getElementById("forgeToggle");
const canvas = document.getElementById("embers");
const ctx = canvas.getContext("2d");

let particles = [];
let fireActive = true;

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


/* PARTICLE CLASS */

class Ember{
    constructor(){
        this.x = Math.random()*canvas.width;
        this.y = canvas.height + Math.random()*200;
        this.size = Math.random()*3 + 1;
        this.speedY = Math.random()*0.6 + 0.2;
        this.speedX = (Math.random()-0.5)*0.4;
        this.life = Math.random()*200;
    }

    update(){
        this.y -= this.speedY;
        this.x += this.speedX;
        this.life--;

        if(this.life <= 0 || this.y < -20){
            this.reset();
        }
    }

    reset(){
        this.x = Math.random()*canvas.width;
        this.y = canvas.height + 20;
        this.life = Math.random()*200;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fillStyle = "rgba(255,140,40,0.35)";
        ctx.fill();
    }
}


/* CREATE PARTICLES */

for(let i=0;i<60;i++){
    particles.push(new Ember());
}


/* ANIMATION */

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(fireActive){
        particles.forEach(p=>{
            p.update();
            p.draw();
        });
    }

    requestAnimationFrame(animate);
}

animate();


/* DARK MODE + FIRE TOGGLE */

toggle.onclick = () => {
    document.body.classList.toggle("dark-mode");
    fireActive = !document.body.classList.contains("dark-mode");

    /* button icon swap */
    toggle.textContent = fireActive ? "🔥" : "⚫";
};

const fireCanvas = document.getElementById("forgeFire");
const fireCtx = fireCanvas.getContext("2d");

fireCanvas.width = window.innerWidth;
fireCanvas.height = window.innerHeight;

let flames = [];

class Flame{
    constructor(){
        this.x = Math.random()*fireCanvas.width;
        this.y = fireCanvas.height-80;
        this.size = Math.random()*6+3;
        this.speed = Math.random()*1.2+0.4;
        this.life = Math.random()*60;
    }

    update(){
        this.y -= this.speed;
        this.life--;

        if(this.life<=0){
            this.y = fireCanvas.height-80;
            this.x = Math.random()*fireCanvas.width;
            this.life = 60;
        }
    }

    draw(){
        fireCtx.beginPath();
        fireCtx.arc(this.x,this.y,this.size,0,Math.PI*2);
        fireCtx.fillStyle="rgba(255,120,0,0.2)";
        fireCtx.fill();
    }
}

for(let i=0;i<120;i++){
    flames.push(new Flame());
}

function animateFire(){
    fireCtx.clearRect(0,0,fireCanvas.width,fireCanvas.height);

    flames.forEach(f=>{
        f.update();
        f.draw();
    });

    requestAnimationFrame(animateFire);
}

animateFire();

const sparkCanvas = document.getElementById("sparks");
const sparkCtx = sparkCanvas.getContext("2d");

sparkCanvas.width = window.innerWidth;
sparkCanvas.height = window.innerHeight;

let sparkParticles = [];

class Spark{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.vx = (Math.random()-0.5)*6;
        this.vy = (Math.random()-1.5)*6;
        this.life = 40;
    }

    update(){
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15;
        this.life--;
    }

    draw(){
        sparkCtx.beginPath();
        sparkCtx.arc(this.x,this.y,2,0,Math.PI*2);
        sparkCtx.fillStyle="orange";
        sparkCtx.fill();
    }

}

window.addEventListener("click",(e)=>{
    for(let i=0;i<25;i++){
        sparkParticles.push(new Spark(e.clientX,e.clientY));
    }
});

function animateSparks(){
    sparkCtx.clearRect(0,0,sparkCanvas.width,sparkCanvas.height);

    sparkParticles.forEach((s,i)=>{
        s.update();
        s.draw();

        if(s.life<=0){
            sparkParticles.splice(i,1);
        }
    });

    requestAnimationFrame(animateSparks);
}

animateSparks();