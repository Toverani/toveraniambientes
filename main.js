/* ═══════════════════════════════════════════════
   FORMA & MADEIRA — Scripts
   main.js
═══════════════════════════════════════════════ */

/* ── CURSOR PERSONALIZADO ── */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  }, 60);
});

/* ── NAV: EFEITO SCROLL ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('up'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── SLIDER DE DEPOIMENTOS (responsivo) ── */
let depIdx = 0;
const depTrack = document.getElementById('depTrack');
const depCards = depTrack.querySelectorAll('.dep-card');

function getCardStep() {
  // Mede a largura real do primeiro card + o gap definido no CSS (.dep-track)
  const card = depCards[0];
  const cardWidth = card.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(depTrack).gap) || 16;
  return cardWidth + gap;
}

function getMaxIndex() {
  // Quantos cards cabem na área visível, para não deslizar além do necessário
  const sliderWidth = depTrack.parentElement.getBoundingClientRect().width;
  const step = getCardStep();
  const visibleCards = Math.max(1, Math.floor(sliderWidth / step));
  return Math.max(0, depCards.length - visibleCards);
}

function slideDep(dir) {
  const maxIdx = getMaxIndex();
  depIdx = Math.max(0, Math.min(maxIdx, depIdx + dir));
  const step = getCardStep();
  depTrack.style.transform = `translateX(-${depIdx * step}px)`;
}

document.getElementById('depNext').addEventListener('click', () => slideDep(1));
document.getElementById('depPrev').addEventListener('click', () => slideDep(-1));

// Recalcula a posição ao redimensionar (rotação de tela, resize de janela)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    depIdx = Math.min(depIdx, getMaxIndex());
    const step = getCardStep();
    depTrack.style.transform = `translateX(-${depIdx * step}px)`;
  }, 150);
});

/* ── FILTRO DE PORTFÓLIO ── */
function filterPort(btn, cat) {
  // Atualiza botão ativo
  document.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Filtra cards
  document.querySelectorAll('.pc').forEach(card => {
    const show = cat === 'todos' || card.dataset.cat === cat;
    card.style.opacity    = show ? '1'       : '.25';
    card.style.transform  = show ? ''        : 'scale(.97)';
    card.style.transition = 'opacity .35s, transform .35s';
  });
}

// Expõe globalmente para os atributos onclick inline no HTML
window.filterPort = filterPort;
