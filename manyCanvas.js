const canvasCount = 220;
let canvas = [];
let center = [];
let eye = [];
let angle = [];

const faceSize = 64;

for (let i = 1; i <= canvasCount; i++) {
    const newCanvas = document.createElement('canvas');
    newCanvas.id = `canvas${i}`;
    newCanvas.verticalAlign = 'middle';
    newCanvas.border = 0;
    newCanvas.margin = 0;
    newCanvas.padding = 0;
    newCanvas.overflow = 'hidden';
    newCanvas.top = 0;
    newCanvas.left = 0;
    newCanvas.right = 0;
    newCanvas.bottom = 0;
    newCanvas.webkitTouchCallout = 'none';// iOS Safari
    newCanvas.userSelect = 'none';// Chrome, Opera, Firefox
    document.body.appendChild(newCanvas);
    canvas.push(newCanvas);
    center.push({x: 0, y: 0});
    eye.push({x: 0, y: 0});
    angle.push(Math.PI/4);
}


const UPDATE_LOAD_COEFF = 0.5;
let targetInterval = 1000 / 60;
let prevTime = Date.now() - targetInterval;

function s(size) {
    return faceSize*(1.2/32)*size;
}

let canvasSize = {
    w: faceSize,
    h: faceSize
}


function drawFlower(ctx, center, eye) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineCap = "round";
    ctx.lineWidth = s(1.7);
    ctx.beginPath();
    ctx.arc(center.x, center.y, s(26.5), 0, Math.PI*2, false);
    ctx.fillStyle = "#CFBB50";
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(center.x, center.y, s(23.5), 0, Math.PI*2, false);
    ctx.fillStyle = "#FFE763";
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(center.x-s(6), center.y+s(10));
    ctx.quadraticCurveTo(center.x, center.y+s(14.5), center.x+s(6), center.y+s(10));
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(center.x+s(7), center.y-s(4.8), s(3.2), s(6.5), 0, 0, Math.PI*2, false);
    ctx.ellipse(center.x-s(7), center.y-s(4.8), s(3.2), s(6.5), 0, 0, Math.PI*2, false);
    ctx.fill();
    ctx.clip();
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(center.x+s(7)+eye.x, center.y+eye.y-s(4.8), s(3), 0, Math.PI*2, false);
    ctx.arc(center.x-s(7)+eye.x, center.y+eye.y-s(4.8), s(3), 0, Math.PI*2, false);
    ctx.fill();
    ctx.lineWidth = s(1);
    ctx.beginPath();
    ctx.ellipse(center.x+s(7), center.y-s(4.8), s(3.2), s(6.5), 0, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(center.x-s(7), center.y-s(4.8), s(3.2), s(6.5), 0, 0, Math.PI*2, false);
    ctx.stroke();
}

window.onload = function(){
    document.body.addEventListener("mousemove", (e)=>{
        for (let i = 1; i <= canvasCount; i++) {
            angle[i-1] = Math.atan2((e.pageX-window.pageXOffset-canvas[i-1].getBoundingClientRect().x)*2-center[i-1].x, 
            -((e.pageY-window.pageYOffset-canvas[i-1].getBoundingClientRect().y)*2-center[i-1].y));
        }   
    });
}


function mainUpdate() {
    for (let i = 1; i <= canvasCount; i++) {
        canvas[i-1].width = canvasSize.w * 2;
        canvas[i-1].height = canvasSize.h * 2;
        canvas[i-1].style.width = canvasSize.w + "px";
        canvas[i-1].style.height = canvasSize.h + "px";
        center[i-1] = {
            x: canvas[i-1].width/2,
            y: canvas[i-1].height/2
        }
        eye[i-1] = {
            x: eye[i-1].x+=(Math.sin(angle[i-1])*s(2)-eye[i-1].x)/5,
            y: eye[i-1].y+=(Math.cos(angle[i-1])*s(-4.4)-eye[i-1].y)/5
        }
    }
}

function mainDraw() {
    for (let i = 1; i <= canvasCount; i++) {
        drawFlower(canvas[i-1].getContext("2d"), center[i-1], eye[i-1]);
    }
}

function mainloop() {
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
    requestAnimationFrame(mainloop);
}

mainloop();