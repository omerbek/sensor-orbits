'use strict';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const mint = '#9ef4dc';
const amber = '#ffcb7d';
const ink = '#152129';
const duration = 8;

function rect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function line(points, color = mint, width = 3) {
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function dot(x, y, radius, color = mint) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => clamp(value) ** 2 * (3 - 2 * clamp(value));
const range = length => Array.from({length}, (_, index) => index);

function render(t) {
  line(range(81).map(i => [360 + 221 * Math.cos(i * Math.PI / 40), 202 + 110 * Math.sin(i * Math.PI / 40)]), '#40535a');
  range(3).forEach(i => {
    const a = 2 * Math.PI * smooth((t - .55 * i) / 6);
    dot(360 + 221 * Math.cos(a), 202 + 110 * Math.sin(a), 10 + i * 3, i === 1 ? amber : mint);
  });
}

const seek = document.querySelector('#seek');
const play = document.querySelector('#play');
const time = document.querySelector('#time');
let position = 0;
let playing = false;
let previous = null;
let animationId = null;

function draw() {
  rect(0, 0, canvas.width, canvas.height, ink);
  render(position);
  seek.value = position;
  time.value = `${position.toFixed(2)} sn`;
}

function frame(timestamp) {
  if (!playing) return;
  if (previous !== null) position = (position + (timestamp - previous) / 1000) % duration;
  previous = timestamp;
  draw();
  animationId = requestAnimationFrame(frame);
}

play.addEventListener('click', () => {
  playing = !playing;
  play.textContent = playing ? 'Duraklat' : 'Oynat';
  if (playing) {
    previous = null;
    animationId = requestAnimationFrame(frame);
  } else {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
});

seek.addEventListener('input', () => {
  position = Number(seek.value);
  draw();
});

draw();
