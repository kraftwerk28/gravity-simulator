'use strict';
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
}, false);

let particles = [];
const k = 10;
let gravitate = false;
let showG = false;
let showCl = false;
const maxClVal = 10;

let isTouch = false;
const maxTouch = 500;

const canvas = document.getElementById('canv');
const ctx = canvas.getContext('2d');
// const halo = document.getElementById('halo');
canvas.width = window.innerWidth - 25;
canvas.height = window.innerHeight - 25;
canvas.onmousedown = (e) => {
  if (e.button === 0)
    particles.push(new Particle(e.x, e.y, 1));
  else if (e.button === 2) {
    gravitone.x = e.x;
    gravitone.y = e.y;
    gravitate = true;
  }
}
canvas.onmouseup = (e) => {
  if (e.button === 2) {
    gravitate = false;
    gravitone.x = -100;
    gravitone.y = -100;
  }
}
canvas.onmousemove = (e) => {
  if (gravitate) {
    gravitone.x = e.x;
    gravitone.y = e.y;
  }
}
canvas.ontouchstart = (e) => {
  isTouch = true;
  setTimeout(() => {
    if (isTouch) {
      gravitone.x = e.x;
      gravitone.y = e.y;
      gravitate = true;
    } else {
      gravitate = false;
      gravitone.x = -100;
      gravitone.y = -100;
    }
  }, maxTouch);
}
canvas.ontouchend = (e) => {
  isTouch = false;
}

const w = canvas.width;
const h = canvas.height;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, w, h);
ctx.fillStyle = 'white';


window.onload = () => {
  alert('use left click to create a particle\nuse a right click to simulate a black hole');
  setInterval(Tick, 20);
}

const Tick = () => {
  // ctx.fillStyle = 'black';
  // ctx.fillRect(0, 0, w, h);
  particles.forEach(element => {
    element.move();
    element.draw();
    if (gravitate) {
      gravitone.attract();
    }
  });
}

function Particle(posX, posY, mass) {
  this.x = posX;
  this.y = posY;
  this.m = mass;
  this.vx = 0;
  this.vy = 0;
  this.draw = () => {
    if (showCl) {
      let val = map(Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2)), 0, maxClVal, 0, 255);
      let cl = rgb(val > 127 ? 0 : 2 * (127 - val), val < 127 ? val : 255 - val, val < 127 ? 0 : 2 * (val - 127));
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
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.m, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
  }
  this.move = () => {
    for (let i = 0; i < particles.length; i++) {
      // console.log(particles.indexOf(this));
      if (i !== particles.indexOf(this)) {
        let d = Math.pow(particles[i].x - this.x, 2) + Math.pow(particles[i].y - this.y, 2);
        if (d > 1) {
          this.vx += (k * (particles[i].x - this.x) * particles[i].m) / d;
          this.vy += (k * (particles[i].y - this.y) * particles[i].m) / d;
        }
      }
    }
    this.x += this.vx;
    this.y += this.vy;
  }
}
const gravitone = {
  x: 0,
  y: 0,
  m: 5,
  attract: () => {
    for (let i = 0; i < particles.length; i++) {
      let d = Math.pow(particles[i].x - gravitone.x, 2) + Math.pow(particles[i].y - gravitone.y, 2);
      if (d > 1) {
        particles[i].vx += (k * (gravitone.x - particles[i].x) * gravitone.m) / d;
        particles[i].vy += (k * (gravitone.y - particles[i].y) * gravitone.m) / d;
      }
    }
  }
}
const map = (x, begin1, end1, begin2, end2) => { // begin1, end1 - input values; begin2, end2 - output
  return ((x - begin1) / (end1 - begin1)) * (end2 - begin2) + begin2;
}
const rgb = (R, G, B) => {
  return 'rgb(' + Math.round(Math.abs(R)) + ', ' + Math.round(Math.abs(G)) + ', ' + Math.round(Math.abs(B)) + ')';
}