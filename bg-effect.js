const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let t = 0;

// Particle config
const particles = [];
const PARTICLE_NUM = 40;
for (let i = 0; i < PARTICLE_NUM; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 1.2 + Math.random() * 2.5,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    alpha: 0.3 + Math.random() * 0.5
  });
}

function drawBackground() {
  t += 0.002;
  // Gradient động
  const x1 = canvas.width * (0.5 + 0.4 * Math.sin(t));
  const y1 = canvas.height * (0.5 + 0.4 * Math.cos(t));
  const x2 = canvas.width * (0.5 + 0.4 * Math.sin(t + 2));
  const y2 = canvas.height * (0.5 + 0.4 * Math.cos(t + 2));
  let grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, "#181a20");
  grad.addColorStop(0.5, "#232946");
  grad.addColorStop(1, "#232946");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Particle effect
  for (let p of particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
    ctx.fillStyle = "#00e0d6";
    ctx.shadowColor = "#00e0d6";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();

    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
}

function animate() {
  drawBackground();
  requestAnimationFrame(animate);
}
animate();

// --- Project Slider ---
const sliderTrack = document.querySelector('.slider-track');
const projectCards = document.querySelectorAll('.project-card');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let currentIndex = 0;

function updateSlider() {
  sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
  updateSlider();
});
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % projectCards.length;
  updateSlider();
});

// Optional: swipe for mobile
let startX = 0;
sliderTrack.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});
sliderTrack.addEventListener('touchend', (e) => {
  let endX = e.changedTouches[0].clientX;
  if (endX - startX > 50) prevBtn.click();
  else if (startX - endX > 50) nextBtn.click();
});

document.addEventListener('DOMContentLoaded', function () {
  const sliderTrack = document.querySelector('.slider-track');
  const projectCards = document.querySelectorAll('.project-card');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  let currentIndex = 0;
  let autoSlideInterval;
  let isDragging = false;
  let startX = 0;

  function updateSlider(index = currentIndex) {
    sliderTrack.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % projectCards.length;
    updateSlider();
  }
  function prevSlide() {
    currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
    updateSlider();
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  // Auto slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }
  startAutoSlide();

  // Drag/Swipe support
  sliderTrack.addEventListener('mousedown', dragStart);
  sliderTrack.addEventListener('touchstart', dragStart);

  sliderTrack.addEventListener('mouseup', dragEnd);
  sliderTrack.addEventListener('mouseleave', dragEnd);
  sliderTrack.addEventListener('touchend', dragEnd);

  sliderTrack.addEventListener('mousemove', dragMove);
  sliderTrack.addEventListener('touchmove', dragMove);

  function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    sliderTrack.style.transition = 'none';
  }
  function dragMove(e) {
    if (!isDragging) return;
    const currentPosition = getPositionX(e);
    const diff = currentPosition - startX;
    sliderTrack.style.transform = `translateX(${-currentIndex * 100 + diff / sliderTrack.offsetWidth * 100}%)`;
  }
  function dragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    sliderTrack.style.transition = 'transform 0.5s cubic-bezier(.77,0,.18,1)';
    const endX = getPositionX(e);
    const diff = endX - startX;
    if (diff > 60) {
      prevSlide();
      resetAutoSlide();
    } else if (diff < -60) {
      nextSlide();
      resetAutoSlide();
    } else {
      updateSlider();
    }
  }
  function getPositionX(e) {
    return e.type && e.type.includes('touch') ? e.touches[0].clientX : (e.clientX || 0);
  }

  // Prevent image/text selection while dragging
  sliderTrack.addEventListener('dragstart', e => e.preventDefault());
});

window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if(window.scrollY > 10) {
    header.style.boxShadow = '0 4px 24px #0008';
  } else {
    header.style.boxShadow = '0 2px 16px #0004';
  }
});