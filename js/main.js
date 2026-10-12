/* =========================================================
   PUBLIC SITE BOOTSTRAP
   Wires up the interactive bits (nav, scroll reveal, active
   link tracking) and calls the shared renderer (shared/render.js)
   to paint content from shared/store.js (localStorage). Also
   listens for changes made in the Admin Panel (in another tab)
   and updates live, instantly.
   ========================================================= */

// Opening the site from the Admin Panel's "View live site" button adds ?preview so it
// always shows your latest local edits, even if this folder already holds a published copy.
const FORCE_LIVE = /[?&]preview\b/.test(location.search);

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Scroll reveal (re-run after dynamic content is injected) ----------
let revealObserver = null;

function initReveal() {
  const revealEls = document.querySelectorAll('.reveal:not(.in-view)');
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  }
  revealEls.forEach(el => revealObserver.observe(el));
}

// ---------- Active nav link on scroll ----------
function setActive() {
  const sections = document.querySelectorAll('main section[id], #top');
  const navAnchors = document.querySelectorAll('.nav-link');
  let currentId = 'top';
  const scrollPos = window.scrollY + 120;

  sections.forEach(sec => {
    if (sec.offsetTop <= scrollPos) currentId = sec.id;
  });

  navAnchors.forEach(a => {
    a.style.color = a.dataset.nav === currentId ? 'var(--text)' : '';
  });
}
window.addEventListener('scroll', setActive, { passive: true });

// ---------- Project filters ----------
// Delegated, so it keeps working after the renderer re-paints the grid
// and on a published (baked) page where nothing is re-rendered.
document.addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  const filter = chip.dataset.filter;
  document.querySelectorAll('.filter-chip').forEach(c => {
    const on = c === chip;
    c.classList.toggle('active', on);
    c.setAttribute('aria-pressed', String(on));
  });
  let shown = 0;
  document.querySelectorAll('#projectGrid .project-card').forEach(card => {
    const match = filter === 'All' || card.dataset.category === filter;
    card.hidden = !match;
    if (match) {
      shown++;
      card.classList.add('in-view');
      card.classList.remove('filter-in');
      void card.offsetWidth; // restart the entrance animation
      card.classList.add('filter-in');
    }
  });
  const empty = document.getElementById('projectEmpty');
  if (empty) empty.hidden = shown > 0;
});

// ---------- Project video player ----------
const videoModal = document.getElementById('videoModal');
const videoStage = document.getElementById('videoModalStage');
const videoTitle = document.getElementById('videoModalTitle');
let lastFocused = null;

function videoSource(src) {
  src = (src || '').trim();
  let m;
  if ((m = src.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)))
    return { iframe: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0' };
  if ((m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
    return { iframe: 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1' };
  if ((m = src.match(/drive\.google\.com\/file\/d\/([\w-]+)/)))
    return { iframe: 'https://drive.google.com/file/d/' + m[1] + '/preview' };
  if ((m = src.match(/loom\.com\/(?:share|embed)\/(\w+)/)))
    return { iframe: 'https://www.loom.com/embed/' + m[1] + '?autoplay=1' };
  return { video: src };
}

function openVideo(src, title) {
  if (!videoModal || !src) return;
  lastFocused = document.activeElement;
  videoStage.textContent = '';
  const s = videoSource(src);
  let el;
  if (s.iframe) {
    el = document.createElement('iframe');
    el.src = s.iframe;
    el.title = title || 'Project video';
    el.allow = 'autoplay; fullscreen; picture-in-picture';
    el.allowFullscreen = true;
  } else {
    el = document.createElement('video');
    el.src = s.video;
    el.controls = true;
    el.autoplay = true;
    el.playsInline = true;
  }
  videoStage.appendChild(el);
  videoTitle.textContent = title || '';
  videoModal.hidden = false;
  document.body.classList.add('modal-open');
  document.getElementById('videoModalClose').focus();
}

function closeVideo() {
  if (!videoModal || videoModal.hidden) return;
  videoStage.textContent = ''; // removing the element stops playback
  videoModal.hidden = true;
  document.body.classList.remove('modal-open');
  if (lastFocused && lastFocused.focus) lastFocused.focus();
}

document.addEventListener('click', (e) => {
  const play = e.target.closest('[data-play]');
  if (play) {
    const card = play.closest('.project-card');
    if (card && card.dataset.video) openVideo(card.dataset.video, card.dataset.title);
    return;
  }
  if (e.target.closest('[data-close-video]')) closeVideo();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeVideo(); });

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  // A page exported via the Admin Panel's "Publish" feature has real content
  // baked directly into the HTML and is marked with data-static="1". It must
  // NOT be overwritten by a visitor's own (empty) local storage.
  if (document.body.dataset.static === '1' && !FORCE_LIVE) {
    initReveal();
    setActive();
    return;
  }
  Store.applyTheme(Store.getTheme());
  SiteRenderer.renderContent(Store.getContent(), document);
  initReveal();
  setActive();
});

// ---------- Live sync from the Admin Panel (other tab) ----------
if ((document.body.dataset.static !== '1' || FORCE_LIVE) && typeof Store !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === Store.KEYS.content) {
      SiteRenderer.renderContent(Store.getContent(), document);
      initReveal();
    }
    if (e.key === Store.KEYS.theme) {
      Store.applyTheme(Store.getTheme());
    }
  });
}
