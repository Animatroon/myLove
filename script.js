const START = new Date('2025-08-03T00:00:00');

const els = {
  td: document.getElementById('td'),
  th: document.getElementById('th'),
  tm: document.getElementById('tm'),
  ts: document.getElementById('ts')
};

function setDigit(el, val) {
  if (!el || el.textContent === val) return;
  el.textContent = val;
  el.classList.remove('flip-anim');
  void el.offsetWidth;
  el.classList.add('flip-anim');
}

function tick() {
  const diff = Date.now() - START;
  const s = 1e3, m = 60 * s, h = 60 * m, day = 24 * h;
  setDigit(els.td, String(Math.floor(diff / day)).padStart(3, '0'));
  setDigit(els.th, String(Math.floor(diff % day / h)).padStart(2, '0'));
  setDigit(els.tm, String(Math.floor(diff % h / m)).padStart(2, '0'));
  setDigit(els.ts, String(Math.floor(diff % m / s)).padStart(2, '0'));
}
tick();
setInterval(tick, 1000);

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

document.getElementById('bucketList').addEventListener('click', e => {
  const btn = e.target.closest('.bucket-check');
  if (btn) {
    const item = btn.closest('.bucket-item');
    if (!item.classList.contains('done-locked')) item.classList.toggle('done');
  }
});

document.getElementById('heroArrow').addEventListener('click', () => {
  document.getElementById('storia').scrollIntoView({ behavior: 'smooth' });
});

const storiaSection = document.getElementById('storia');
const storiaCards = storiaSection ? [...storiaSection.querySelectorAll('.storia-card')] : [];
const isMobile = () => window.innerWidth <= 768;

function updateStoria() {
  if (!storiaSection) return;
  const rect = storiaSection.getBoundingClientRect();
  const scrolled = -rect.top;
  const vh = window.innerHeight;
  storiaCards.forEach((card, i) => {
    const progress = Math.max(0, Math.min(1, (scrolled - i * vh) / vh));
    if (i < storiaCards.length - 1) {
      card.style.transform = `scale(${1 - progress * 0.038}) translateY(${-progress * 1.2}%)`;
      card.style.filter = `brightness(${1 - progress * 0.13})`;
    }
  });
}

storiaCards.forEach((card, i) => {
  card.style.zIndex = i + 1;
  const colors = ['#ffffff', '#fde8e4', '#ffffff', '#fde8e4', '#ffffff'];
  card.style.background = colors[i] || '#ffffff';
});

const audio = document.getElementById('audio');
const btnPlay = document.getElementById('btnPlay');
const progressFill = document.getElementById('progressFill');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

function fmtTime(s) {
  const m = Math.floor(s / 60);
  return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
}

btnPlay.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(() => {});
    btnPlay.querySelector('.icon-play').style.display = 'none';
    btnPlay.querySelector('.icon-pause').style.display = 'block';
  } else {
    audio.pause();
    btnPlay.querySelector('.icon-play').style.display = 'block';
    btnPlay.querySelector('.icon-pause').style.display = 'none';
  }
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + '%';
  currentTimeEl.textContent = fmtTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = fmtTime(audio.duration);
});

audio.addEventListener('ended', () => {
  btnPlay.querySelector('.icon-play').style.display = 'block';
  btnPlay.querySelector('.icon-pause').style.display = 'none';
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
});

progressBar.addEventListener('click', e => {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
});

document.getElementById('btnPrev').addEventListener('click', () => {
  audio.currentTime = 0;
});

document.getElementById('btnNext').addEventListener('click', () => {
  audio.currentTime = 0;
  if (!audio.paused) audio.play().catch(() => {});
});

const gmodal = document.getElementById('gmodal');
const gmodalImg = document.getElementById('gmodalImg');
const gmodalClose = document.getElementById('gmodalClose');

function openModal(src, alt) {
  gmodalImg.src = src;
  gmodalImg.alt = alt;
  gmodal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  gmodal.classList.remove('open');
  document.body.style.overflow = '';
  gmodalImg.src = '';
}

document.querySelectorAll('.gimg').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) openModal(img.src, img.alt);
  });
});

gmodalClose.addEventListener('click', closeModal);
gmodal.querySelector('.gmodal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

const parallaxSec = document.getElementById('parallax');
const parallaxBg = document.getElementById('parallaxBg');

function updateParallax() {
  if (!parallaxBg || !parallaxSec || window.innerWidth > 768) return;
  const rect = parallaxSec.getBoundingClientRect();
  const shift = Math.max(-80, Math.min(80, -(rect.top * 0.4)));
  parallaxBg.style.transform = `translateY(${shift}px)`;
}

let rafId;
function onScroll() {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => { updateStoria(); updateParallax(); });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => { updateStoria(); updateParallax(); });
updateStoria();
updateParallax();
