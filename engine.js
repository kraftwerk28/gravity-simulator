'use strict';

let particles = [];
const k = 0.1;
let gravitate = false;
let showG = false;
let showCl = false;
const maxClVal = 10;

let isTouch = false;
const maxTouch = 1000;

const canvas = document.getElementById('gravity-simulator');
const color = document.getElementById('color');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
color.onchange = () => {
  showCl = color.checked;
};
canvas.onmousedown = (e) => {
  if (e.button === 0)
    particles.push(new Particle(e.x, e.y, 1));
  else if (e.button === 2) {
    gravitone.x = e.x;
    gravitone.y = e.y;
    gravitate = true;
  }
};
canvas.onmouseup = (e) => {
  if (e.button === 2) {
    gravitate = false;
    gravitone.x = -100;
    gravitone.y = -100;
  }
};
canvas.onmousemove = (e) => {
  if (gravitate) {
    gravitone.x = e.x;
    gravitone.y = e.y;
  }
};
canvas.ontouchstart = (e) => {
  isTouch = true;
  setTimeout(() => {
    if (isTouch) {
      gravitone.x = e.touches[0].clientX;
      gravitone.y = e.touches[0].clientY;
      gravitate = true;
    } else {
      isTouch = gravitate = false;
      // gravitone.x = -100;
      // gravitone.y = -100;
    }
  }, maxTouch);
};
canvas.ontouchend = (e) => {
  if (!gravitate) {
    particles.push(new Particle(e.changedTouches[0].clientX, e.changedTouches[0].clientY, 1));
  }
  isTouch = gravitate = false;
};
canvas.ontouchmove = (e) => {
  if (isTouch && gravitate) {
    gravitone.x = e.changedTouches[0].clientX;
    gravitone.y = e.changedTouches[0].clientY;
  }
};

canvas.oncontextmenu = () => false;

const w = canvas.width;
const h = canvas.height;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, w, h);
ctx.fillStyle = 'white';


window.onload = () => {
  // alert('use left click to create a particle\nuse a right click to simulate a black hole');
  setInterval(Tick, 20);
}

const Tick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = 'black';
  // ctx.fillRect(0, 0, w, h);
  particles.forEach((element, i) => {
    if (element.x < 0 || element.x > canvas.width ||
      element.y < 0 || element.y > canvas.height) {
      particles.splice(i, 1);
      return;
    }
    element.move();
    element.draw();
    if (gravitate) {
      gravitone.attract();
    }
  });
};

function Particle(posX, posY, mass) {
  this.x = posX;
  this.y = posY;
  this.m = mass;
  this.vx = 0;
  this.vy = 0;
  this.trail = [];
  this.trailLength = 10;
  this.draw = () => {
    if (showCl) {
      let val = map(Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2)), 0, maxClVal, 0, 255);
      let cl = rgb(val > 127 ? 0 : 2 * (127 - val), 127, val < 127 ? 0 : 2 * (val - 127));
      ctx.fillStyle = cl;
      ctx.strokeStyle = cl;
    }
    else {
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';
    }
    if (showG) {
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    }
    else {
      this.trail.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, i, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
      });
    }
  }
  this.move = () => {
    for (let i = 0; i < particles.length; i++) {
      // console.log(particles.indexOf(this));
      if (i !== particles.indexOf(this)) {
        let d = Math.sqrt(Math.pow(particles[i].x - this.x, 2) + Math.pow(particles[i].y - this.y, 2));
        if (d > 1) {
          this.vx += (k * (particles[i].x - this.x) * particles[i].m) / d;
          this.vy += (k * (particles[i].y - this.y) * particles[i].m) / d;
        }
      }
    }
    this.trail.push({ x: this.x, y: this.y });
    while (this.trail.length > this.trailLength) {
      this.trail.shift();
    }
    this.x += this.vx;
    this.y += this.vy;
  }
};
const gravitone = {
  x: 0,
  y: 0,
  m: 500,
  attract: () => {
    for (let i = 0; i < particles.length; i++) {
      let d = Math.pow(particles[i].x - gravitone.x, 2) + Math.pow(particles[i].y - gravitone.y, 2);
      if (d > 1) {
        particles[i].vx += (k * (gravitone.x - particles[i].x) * gravitone.m) / d;
        particles[i].vy += (k * (gravitone.y - particles[i].y) * gravitone.m) / d;
      }
    }
  }
};
const map = (x, begin1, end1, begin2, end2) => { // begin1, end1 - input values; begin2, end2 - output
  return ((x - begin1) / (end1 - begin1)) * (end2 - begin2) + begin2;
};
const rgb = (R, G, B) => {
  return 'rgb(' + Math.round(Math.abs(R)) + ', ' + Math.round(Math.abs(G)) + ', ' + Math.round(Math.abs(B)) + ')';
};