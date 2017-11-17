'use strict';

function Particle(positionX, positionY, mass, velVectorX, velVectorY, index) {
  this.index = index;
  this.pos = {
    x: positionX, y: positionY
  };
  this.mass = Math.abs(mass);
  this.velVector = {
    x: (positionX - velVectorX) * sens,
    y: (positionY - velVectorY) * sens
  }
  this.move = () => {
    this.pos.x += this.velVector.x;
    this.pos.y += this.velVector.y;

    if (this.pos.x - this.mass < 0 || this.pos.x + this.mass > canvas.width)
      this.velVector.x = -this.velVector.x;

    if (this.pos.y - this.mass < 0 || this.pos.y + this.mass > canvas.height)
      this.velVector.y = -this.velVector.y;
  }
  this.draw = () => {
    circle(this.pos.x, this.pos.y, this.mass, 'green', true);
  }
  this.detectColl = () => {

  }
  this.gravitate = () => {
    // console.log(this.pos);
    for (let i = 0; i < particles.length; i++) {
      if (this.index !== i) {
        let squareDistance = Math.pow(this.pos.x - particles[i].pos.x, 2) + Math.pow(this.pos.y - particles[i].pos.y, 2);
        // console.log(Math.pow(this.pos.x - particles[i].pos.x, 2));
        if (squareDistance > 3 && squareDistance !== NaN) {
          this.velVector.x += (g * (particles[i].pos.x - this.pos.x) * particles[i].mass) / squareDistance;
          this.velVector.y += (g * (particles[i].pos.y - this.pos.y) * particles[i].mass) / squareDistance;
        }
      }

    }
  }
}

const normalize = (x, y) => {
  let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return { X: x / length, Y: y / length };
}
