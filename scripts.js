const toggle = document.getElementById("forgeToggle");

const canvas = document.getElementById("embers");
const ctx = canvas.getContext("2d");

const sparkCanvas = document.getElementById("sparks");
const sparkCtx = sparkCanvas.getContext("2d");

const fireCanvas = document.getElementById("forgeFire");
const fireCtx = fireCanvas.getContext("2d");

let particles = [];
let sparkParticles = [];
let flames = [];

let fireActive = true;

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    sparkCanvas.width = window.innerWidth;
    sparkCanvas.height = window.innerHeight;

    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


/* EMBERS */

class Ember{
    constructor(){
        this.reset();
    }

    reset(){
        this.x = Math.random()*canvas.width;
        this.y = canvas.height + Math.random()*200;
        this.size = Math.random()*3+1;
        this.speedY = Math.random()*0.6+0.2;
        this.speedX = (Math.random()-0.5)*0.4;
        this.life = Math.random()*200;
    }

    update(){
        this.y -= this.speedY;
        this.x += this.speedX;
        this.life--;

        if(this.life<=0 || this.y<-20){
            this.reset();
        }
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fillStyle="rgba(255,140,40,0.35)";
        ctx.fill();
    }
}

for(let i=0;i<60;i++){
    particles.push(new Ember());
}


/* FLAMES */

class Flame{
    constructor(){
        this.reset();
    }

    reset(){
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
            this.reset();
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


/* SPARKS */

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


/* CLICK SPARKS */

window.addEventListener("click",(e)=>{
    for(let i=0;i<25;i++){
        sparkParticles.push(new Spark(e.clientX,e.clientY));
    }
});


/* ANIMATIONS */

function animate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);
    fireCtx.clearRect(0,0,fireCanvas.width,fireCanvas.height);
    sparkCtx.clearRect(0,0,sparkCanvas.width,sparkCanvas.height);

    if(fireActive){

        particles.forEach(p=>{
            p.update();
            p.draw();
        });

        flames.forEach(f=>{
            f.update();
            f.draw();
        });

    }

    sparkParticles = sparkParticles.filter(s=>{
        s.update();
        s.draw();
        return s.life>0;
    });

    requestAnimationFrame(animate);
}

animate();


/* DARK MODE */

toggle.onclick = ()=>{
    document.body.classList.toggle("dark-mode");
    fireActive = !document.body.classList.contains("dark-mode");
    toggle.textContent = fireActive ? "🔥" : "⚫";
};


/* SCROLL SWORD */

const sword = document.getElementById("scrollSword");

function updateSwordScroll(){

    const scrollTop = window.scrollY;

    const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;

    const percent = docHeight>0 ? scrollTop/docHeight : 0;

    const trackHeight = window.innerHeight - 120;

    const position = percent*trackHeight;

    sword.style.transform =
    `translate(-50%, ${position}px)`;
}

window.addEventListener("scroll", updateSwordScroll);
updateSwordScroll();


/* DRAG SCROLL */

sword.addEventListener("mousedown",()=>{

    function move(event){

        const percent = event.clientY/window.innerHeight;

        window.scrollTo({
            top: percent*(document.body.scrollHeight-window.innerHeight)
        });

    }

    window.addEventListener("mousemove",move);

    window.addEventListener("mouseup",()=>{
        window.removeEventListener("mousemove",move);
    },{once:true});

});