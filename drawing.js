const circle = (x, y, radius, color, doFill) => {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, Math.abs(radius), 0, Math.PI * 2);
  if (doFill) {
    ctx.fill();
  }
  else {
    ctx.stroke();
  }
}

const line = (x1, y1, x2, y2, color, width) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
