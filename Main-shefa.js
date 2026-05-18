/* ============================================================
   SHEFA v2 — main.js (corrigé)
   ============================================================ */

// ---- UTILITAIRES ----
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ---- PRELOADER ----
document.body.style.overflow = 'hidden';

(function initPreloader() {
  const preloader = $('preloader');
  const fill      = $('preFill');
  const counter   = $('preCounter');
  const logo      = $('preLogo');
  if (!preloader || !fill || !counter) {
    document.body.style.overflow = '';
    return;
  }

  let progress = 0;
  const tick = setInterval(() => {
    progress += Math.max(0.4, (100 - progress) * 0.045);
    if (progress >= 100) { progress = 100; clearInterval(tick); }

    const val = Math.floor(progress);
    fill.style.width    = val + '%';
    counter.textContent = val + '%';

    if (progress === 100) {
      counter.style.color = 'var(--teal)';
      counter.textContent = '100% ✦';
      if (logo) {
        logo.style.transition = 'transform 0.4s ease, filter 0.4s ease';
        logo.style.transform  = 'scale(1.06)';
        logo.style.filter     = 'drop-shadow(0 0 18px rgba(201,146,42,0.4))';
      }
      setTimeout(() => {
        preloader.classList.add('done');
        document.body.style.overflow = '';
      }, 520);
    }
  }, 30);
})();

// ---- CUSTOM CURSOR (desktop uniquement) ----
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor     = $('cursor');
  const cursorRing = $('cursorRing');

  if (cursor && cursorRing) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    $$('a, button, .svc-card, .about-pillar, .pts-bubble').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.cssText += 'width:20px;height:20px;background:var(--teal);';
        cursorRing.style.cssText += 'width:48px;height:48px;';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.cssText += 'width:10px;height:10px;background:var(--gold);';
        cursorRing.style.cssText += 'width:32px;height:32px;';
      });
    });
  }
}

// ---- SCROLL UNIQUE (progress + navbar) ----
const scrollProgressEl = $('scrollProgress');
const navbar           = $('navbar');
const totalH = () => document.body.scrollHeight - window.innerHeight;

window.addEventListener('scroll', () => {
  const pct = totalH() > 0 ? (window.scrollY / totalH()) * 100 : 0;
  if (scrollProgressEl) scrollProgressEl.style.width = Math.min(pct, 100) + '%';
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---- HAMBURGER ----
const hamburger = $('hamburger');
const navLinks  = $('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ---- REVEAL ON SCROLL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
    entry.target.style.transitionDelay = (siblings.indexOf(entry.target) * 0.1) + 's';
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

$$('.reveal').forEach(el => revealObserver.observe(el));

// ---- COUNTER ANIMATION ----
function animateCount(el, target, duration = 1800) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p    = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = p < 1 ? Math.floor(ease * target) : target;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const target = parseInt(e.target.dataset.target, 10);
    if (!isNaN(target)) animateCount(e.target, target);
    cntObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

$$('.hs-num[data-target]').forEach(el => cntObs.observe(el));

// ---- SERVICE CARD MOUSE GLOW + TILT ----
$$('.svc-card').forEach(card => {
  const glow = card.querySelector('.svc-glow');

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (glow) {
      glow.style.setProperty('--mx', x + 'px');
      glow.style.setProperty('--my', y + 'px');
    }

    const rx = ((y - rect.height / 2) / rect.height) * -4;
    const ry = ((x - rect.width  / 2) / rect.width)  *  4;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease';
    card.style.transform  = '';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// ---- ACTIVE NAV LINKS ----
const sections   = $$('section[id]');
const navAnchors = $$('.nav-link');

if (sections.length && navAnchors.length) {
  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => activeObs.observe(s));
}

// ---- INPUT FOCUS GLOW ----
$$('input, textarea').forEach(el => {
  el.addEventListener('focus', () => {
    el.closest('.cf-group')?.style.setProperty('filter', 'drop-shadow(0 0 8px rgba(201,146,42,0.15))');
  });
  el.addEventListener('blur', () => {
    el.closest('.cf-group')?.style.removeProperty('filter');
  });
});

// ---- ABOUT CARD PARALLAX (desktop uniquement) ----
const avCard = document.querySelector('.av-card');
if (avCard && window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX - window.innerWidth  / 2) / window.innerWidth  * 6;
    const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight * 6;
    avCard.style.transform = `perspective(800px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
  }, { passive: true });
}

// ---- ORBS PARALLAX (desktop uniquement) ----
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX - window.innerWidth  / 2) / window.innerWidth;
    const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    $$('.hdc-1').forEach(o => {
      o.style.transform = `translate(${dx * 20}px,${dy * 20}px) rotate(${dx * 2}deg)`;
    });
    $$('.hdc-2').forEach(o => {
      o.style.transform = `translate(${dx * -15}px,${dy * -15}px) rotate(${dy * 2}deg)`;
    });
  }, { passive: true });
}

// ---- SPARKLING DOTS (actif seulement quand hero visible) ----
const heroEl = document.querySelector('.hero');
if (heroEl) {
  function spawnSpark() {
    const sp      = document.createElement('div');
    const isGold  = Math.random() > 0.5;
    const size    = 1.5 + Math.random() * 2.5;
    const alpha   = 0.3 + Math.random() * 0.5;
    const color   = isGold
      ? `rgba(201,146,42,${alpha})`
      : `rgba(0,188,188,${alpha})`;

    Object.assign(sp.style, {
      position:      'absolute',
      width:         size + 'px',
      height:        size + 'px',
      borderRadius:  '50%',
      background:    color,
      left:          Math.random() * 100 + '%',
      top:           Math.random() * 100 + '%',
      pointerEvents: 'none',
      zIndex:        '1',
    });

    heroEl.appendChild(sp);

    sp.animate(
      [
        { opacity: 0, transform: 'scale(0)' },
        { opacity: 1, transform: 'scale(1)', offset: 0.3 },
        { opacity: 0, transform: `translateY(-${40 + Math.random() * 60}px) scale(.3)` }
      ],
      { duration: 3000 + Math.random() * 3000, easing: 'ease-out' }
    ).onfinish = () => sp.remove();
  }

  // Démarre/arrête selon la visibilité du hero
  let sparkInterval = null;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      sparkInterval ??= setInterval(spawnSpark, 350);
    } else {
      clearInterval(sparkInterval);
      sparkInterval = null;
    }
  }, { threshold: 0.1 }).observe(heroEl);
}

// ---- ERREURS PHP (retour depuis shefa.php) ----
const params = new URLSearchParams(window.location.search);
const phpErrors = params.get('errors');
if (phpErrors) {
  showToast(decodeURIComponent(phpErrors), 'error');
  // Nettoie l'URL sans recharger la page
  window.history.replaceState({}, '', window.location.pathname + '#contact');
}
// ---- TOAST ----
function showToast(msg, type = 'success') {
  document.querySelector('.toast')?.remove();

  const t = document.createElement('div');
  t.className = 'toast';
  Object.assign(t.style, {
    position:   'fixed',
    bottom:     '32px',
    right:      '32px',
    padding:    '14px 22px',
    background: type === 'success'
      ? 'linear-gradient(135deg,#C9922A,#E8B84B)'
      : 'linear-gradient(135deg,#e55,#f88)',
    color:        '#fff',
    borderRadius: '12px',
    fontFamily:   "'Outfit', sans-serif",
    fontSize:     '.88rem',
    fontWeight:   '600',
    boxShadow:    '0 8px 30px rgba(0,0,0,.15)',
    zIndex:       '9999',
    maxWidth:     '320px',
    transform:    'translateY(16px)',
    opacity:      '0',
    transition:   'all .4s cubic-bezier(.25,.8,.25,1)',
  });

  t.textContent = msg;
  document.body.appendChild(t);

  requestAnimationFrame(() => {
    t.style.transform = 'translateY(0)';
    t.style.opacity   = '1';
  });

  setTimeout(() => {
    t.style.transform = 'translateY(16px)';
    t.style.opacity   = '0';
    setTimeout(() => t.remove(), 400);
  }, 4000);
}

// ---- DEBUG ----
console.log('%cSHEFA ✦ Créativité en Abondance', 'color:#C9922A;font-family:Georgia;font-size:1.1rem;font-weight:bold;');
console.log('%cOr · Turquoise · Excellence',      'color:#00BCBC;font-family:sans-serif;font-size:.85rem;');
