var ctx;
var audio;

var fireworks = [];
var explosions = [];

var counter = 0;

function render() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, 800, 800);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.font = "30px Arial";
    ctx.fillText("Amount Of Fireworks: " + counter, 5, 40);
    ctx.font = "30px Arial";
    ctx.fillText("Thank you for 400 subscribers!", 5, 100);
    for(let i = 0; i < fireworks.length; i++) {
        if(fireworks[i].remove) {
            fireworks.splice(i, 1);
        } else {
            fireworks[i].update();
            fireworks[i].render();
        }
    }
    for(let i = 0; i < explosions.length; i++) {
        if(explosions[i].remove) {
            explosions.splice(i, 1);
        } else {
            explosions[i].update();
            explosions[i].render();
        }
    }
}

function loop() {
    render();
    counter = fireworks.length;
    window.requestAnimationFrame(loop);
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

window.onload = function() {
    let canvas = document.getElementById("canvas");
    audio = document.getElementById("audio");
    ctx = canvas.getContext('2d');
    for(let i = 0; i < 20; i++) {
        let random_x = Math.floor(Math.random() * 800);
        let random_y = Math.floor(Math.random() * 200);
        fireworks.push(new Rocket(random_x, 800 + random_y + 100, random_x, 800 + random_y, 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')', 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')'));
    }
    loop();
}

window.onclick = function(e) {
    let mx = e.x;
    let my = e.y;
    fireworks.push(new Rocket(mx, my+100, mx, my, 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')', 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')'));
}

class Rocket {
    constructor(x1, y1, x2, y2, color_start, color_end) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.speed = Math.round(Math.random() * 30);
        this.color_start = color_start;
        this.color_end = color_end;
        if(this.speed < 20) {
            this.speed = 20;
        }
        this.remove = false;
    }

    update() {
        this.speed -= 0.4;
        this.y1 -= this.speed;
        this.y2 -= this.speed - 1;
        if(this.speed <= -2) {
            for(let i = 0; i < 360; i+=7) {
                explosions.push(new Explosion(this.x1, this.y1, this.x2, this.y2, i, this.color_start, this.color_end));
            }
            if(Math.round(Math.random() * 2) == 1) {
                let random_x = Math.floor(Math.random() * 800);
                let random_y = Math.floor(Math.random() * 200);
                fireworks.push(new Rocket(random_x, 800 + random_y + 100, random_x, 800 + random_y, 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')', 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')'));
            }
            this.remove = true;
        }
    }

    render() {
        ctx.globalAlpha = 1;
        var gradient = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
        gradient.addColorStop(0, this.color_start);
        gradient.addColorStop(1, this.color_end);

        ctx.strokeStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}

class Explosion {
    constructor(x1, y1, x2, y2, degrees, color_start, color_end) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.degrees = toRadians(degrees);
        this.color_start = color_start;
        this.color_end = color_end;
        this.remove = false;
        this.direction_speed = 7;
        this.alpha = 2;
        this.direction = 0;
        this.length = 45;
        this.rotation();
    }

    rotation() {
        this.x2 = this.x1 + Math.sin(this.degrees) * this.length;
        this.y2 = this.y1 + Math.cos(this.degrees) * this.length;
    }

    update() {
        this.speed += 0.2;
        this.x1 += (Math.sin(this.degrees) * this.direction_speed);
        this.y1 += (Math.cos(this.degrees) * this.direction_speed);
        this.x2 += Math.sin(this.degrees) * this.direction_speed;
        this.y2 += Math.cos(this.degrees) * this.direction_speed;
        this.alpha-=0.04;
        if(this.alpha < 0.3) {
            audio.play();
            this.remove = true;
        }
    } 

    render() {
        ctx.globalAlpha = this.alpha;
        var gradient = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
        gradient.addColorStop(0, this.color_start);
        gradient.addColorStop(1, this.color_end);

        ctx.strokeStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}
