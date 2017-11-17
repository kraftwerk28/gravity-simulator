'use strict';

let mainClock;
let updateClock;

const canvas = document.getElementById('main-canvas');
canvas.width = window.innerWidth - 15;
canvas.height = window.innerHeight - 45;
const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext('2d');

let g = 0.001;
let sens = 0.1;

let particles = [];

let wheelValue = 0;
let mouseDown = false;
let startX;
let startY;
let mouseX;
let mouseY;
let index = 0;

//#region canvas events
canvas.onmousedown = (ev) => {
  mouseDown = true;
  startX = ev.x;
  startY = ev.y;
};
canvas.onmouseup = (ev) => {
  mouseDown = false;
  createParticle();
};
canvas.onmousemove = (ev) => {
  mouseX = ev.x;
  mouseY = ev.y;
}
canvas.onmousewheel = (ev) => {
  wheelValue += ev.deltaY / 57 * 10;
}
//#endregion

window.onload = () => {
  mainClock = setInterval(Tick, 20);
  updateClock = setInterval(Update, 10);
}

const Update = () => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  if (mouseDown) {
    circle(startX, startY, wheelValue, 'green', true);
    line(startX, startY, mouseX, mouseY, 'blue', 5);
  }
  particles.forEach(element => {
    // element.move();
    element.draw();
  });
}

const createParticle = () => {
  particles.push(
    new Particle(startX, startY, wheelValue, mouseX, mouseY, index)
  );
  index++;
  console.log(particles.length);
}

const Tick = () => {
  particles.forEach(element => {
    element.move();
    element.gravitate();
  });
}
