const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const UPDATE_LOAD_COEFF = 0.5;
let targetInterval = 1000 / 60;
let prevTime = Date.now() - targetInterval;

const faceSize = 64;
let widthPieces = 1;
let heightPieces = 1;
let faceCount = 1;
let flowers = [];
const gap = 0;
let mouse = {x: 0, y: 0};

function s(size) {
    return faceSize * (1.2 / 32) * size;
}

class Flower {
    constructor(posX, posY, size) {
        this.center = { x: posX, y: posY };
        this.size = size;
        this.eye = { x: 0, y: 0 };
        this.angle = Math.PI / 4;
    }

    update() {
            this.angle = Math.atan2(mouse.x - this.center.x, -(mouse.y - this.center.y));
            this.eye = {
                x: this.eye.x += (Math.sin(this.angle) * s(2) - this.eye.x) / 5,
                y: this.eye.y += (Math.cos(this.angle) * s(-4.4) - this.eye.y) / 5
            }
    }

    draw() {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineWidth = s(1.7);
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, s(26.5), 0, Math.PI * 2, false);
        ctx.fillStyle = "#CFBB50";
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, s(23.5), 0, Math.PI * 2, false);
        ctx.fillStyle = "#FFE763";
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.center.x - s(6), this.center.y + s(10));
        ctx.quadraticCurveTo(this.center.x, this.center.y + s(14.5), this.center.x + s(6), this.center.y + s(10));
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#000";
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(this.center.x + s(7), this.center.y - s(4.8), s(3.2), s(6.5), 0, 0, Math.PI * 2, false);
        ctx.ellipse(this.center.x - s(7), this.center.y - s(4.8), s(3.2), s(6.5), 0, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.clip();
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.arc(this.center.x + s(7) + this.eye.x, this.center.y + this.eye.y - s(4.8), s(3), 0, Math.PI * 2, false);
        ctx.arc(this.center.x - s(7) + this.eye.x, this.center.y + this.eye.y - s(4.8), s(3), 0, Math.PI * 2, false);
        ctx.fill();
        ctx.lineWidth = s(1);
        ctx.beginPath();
        ctx.ellipse(this.center.x + s(7), this.center.y - s(4.8), s(3.2), s(6.5), 0, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(this.center.x - s(7), this.center.y - s(4.8), s(3.2), s(6.5), 0, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.restore()
    }

}

function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio; //2 -> window.devicePixelRatio
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    widthPieces = Math.ceil(canvas.width / (s(26.5)*window.devicePixelRatio));
    heightPieces = Math.ceil(canvas.height / (s(26.5)*window.devicePixelRatio));
    faceCount = widthPieces * heightPieces;
    flowers = [];
    for (let i = 0; i < heightPieces; i++) {
        for (let j = 0; j < widthPieces; j++) {
            flowers.push(new Flower(s(26.5+gap) + s(26.5+gap)*2 * j, s(26.5+gap) + s(26.5+gap)*2 * i, s(26.5+gap)*2));
        }
    }
}

window.onload = function () {
    document.body.addEventListener("mousemove", (e) => {
        mouse = {x: e.clientX*window.devicePixelRatio, y: e.clientY*window.devicePixelRatio};
    });
}

window.onresize = function () {
    resize();
}

function mainUpdate() {
    for (let i = 0; i < flowers.length; i++) {
        flowers[i].update();
    }
}

function mainDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < flowers.length; i++) {
        flowers[i].draw();
    }
}

function mainLoop() {
    let currentTime = Date.now();
    let updated = false;
    while (currentTime - prevTime > targetInterval * 0.5) {
        mainUpdate();
        updated = true;
        prevTime += targetInterval;
        const now = Date.now();
        const updateTime = now - currentTime;
        if (updateTime > targetInterval * UPDATE_LOAD_COEFF) {
            if (prevTime < now - targetInterval) {
                prevTime = now - targetInterval;
            }
            break;
        }
    }
    if (updated) {
        mainDraw();
    }
    requestAnimationFrame(mainLoop);
}
resize();
mainLoop();