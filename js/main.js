/* =========================================================
   Portfolio interactions — Md. Omar Sha Rafi
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme handling ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeLabel) themeLabel.textContent = theme === 'light' ? 'Academic' : 'Scientific';
    try { localStorage.setItem('theme', theme); } catch (e) {}
    // Refresh canvas palette after CSS variables settle
    if (window.__molecular) requestAnimationFrame(() => window.__molecular.refresh());
  }

  // Initial theme: stored -> default dark (scientific)
  let stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  applyTheme(stored === 'light' || stored === 'dark' ? stored : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  }

  /* ---------- Mobile navigation ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      const open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Nav scroll state, progress bar, back-to-top ---------- */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (scrollTop / docH) * 100 : 0;

    if (progress) progress.style.width = pct + '%';
    if (nav) nav.classList.toggle('is-scrolled', scrollTop > 30);
    if (toTop) toTop.classList.toggle('is-visible', scrollTop > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Active section highlight ---------- */
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navAnchors = Array.from(document.querySelectorAll('.nav__links a'));

  const spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------- Reveal on scroll (staggered) ---------- */
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  if (prefersReduced) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    const revObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          // stagger among siblings sharing a parent
          const siblings = Array.from(el.parentElement.querySelectorAll(':scope > [data-reveal]'));
          const idx = siblings.indexOf(el);
          el.style.transitionDelay = Math.min(idx, 6) * 70 + 'ms';
          el.classList.add('is-visible');
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { revObserver.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  const counters = Array.from(document.querySelectorAll('[data-count]'));
  const countObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const isFloat = target % 1 !== 0;
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = isFloat ? val.toFixed(2) : Math.round(val).toString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = isFloat ? target.toFixed(2) : target.toString();
      }
      if (prefersReduced) { el.textContent = target.toString(); }
      else requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(function (c) { countObserver.observe(c); });

  /* ---------- Certificate filtering ---------- */
  const filterBtns = Array.from(document.querySelectorAll('.cert-filter'));
  const certs = Array.from(document.querySelectorAll('.cert'));
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      const f = btn.getAttribute('data-filter');
      certs.forEach(function (c) {
        const show = f === 'all' || c.getAttribute('data-cat') === f;
        c.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Rotating headline word ---------- */
  const rotator = document.getElementById('rotator');
  if (rotator && !prefersReduced) {
    const words = ['Phytochemistry', 'Drug Discovery', 'Machine Learning', 'Cheminformatics', 'Medicinal Chemistry'];
    let ri = 0;
    setInterval(function () {
      ri = (ri + 1) % words.length;
      rotator.classList.remove('swap');
      // force reflow so the animation restarts
      void rotator.offsetWidth;
      rotator.textContent = words[ri];
      rotator.classList.add('swap');
    }, 2600);
  }

  /* ---------- Cursor spotlight + portrait tilt (fine pointers only) ---------- */
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    const spotEls = document.querySelectorAll('.rcard, .skillcard, .cert, .pub, .grant, .honor, .stat, .contact-card, .course');
    spotEls.forEach(function (el) {
      el.classList.add('has-spot');
      const s = document.createElement('i');
      s.className = 'spot';
      el.appendChild(s);
      el.addEventListener('pointermove', function (e) {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });

    const portrait = document.querySelector('.portrait');
    const frame = portrait ? portrait.querySelector('.portrait__frame') : null;
    if (portrait && frame) {
      portrait.addEventListener('pointermove', function (e) {
        const r = portrait.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        frame.style.transform =
          'perspective(700px) rotateY(' + (dx * 10).toFixed(2) + 'deg) rotateX(' + (dy * -10).toFixed(2) + 'deg)';
      }, { passive: true });
      portrait.addEventListener('pointerleave', function () { frame.style.transform = ''; });
    }
  }

  /* ---------- Molecular canvas ---------- */
  const canvas = document.getElementById('molecularCanvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, nodes = [], palette = {};
    const mouse = { x: -9999, y: -9999 };

    function readPalette() {
      const cs = getComputedStyle(root);
      palette.accent = cs.getPropertyValue('--accent').trim() || '#38bdf8';
      palette.accent2 = cs.getPropertyValue('--accent-2').trim() || '#34d399';
      palette.rgb = (cs.getPropertyValue('--accent-rgb').trim() || '56,189,248');
      palette.rgb2 = (cs.getPropertyValue('--accent-2-rgb').trim() || '52,211,153');
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth = window.innerWidth;
      h = canvas.clientHeight = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    function buildNodes() {
      const count = Math.round(Math.min(90, (w * h) / 20000));
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 2 + 1.2,
          hue: Math.random() > 0.5 ? 1 : 2
        });
      }
    }

    const LINK_DIST = 140;

    function frame() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;

        // gentle mouse repulsion
        const dxm = n.x - mouse.x, dym = n.y - mouse.y;
        const dm2 = dxm * dxm + dym * dym;
        if (dm2 < 14000) {
          const dm = Math.sqrt(dm2) || 1;
          const force = (120 - dm) / 120 * 0.8;
          n.x += (dxm / dm) * force;
          n.y += (dym / dm) * force;
        }

        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));

        // bonds
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.5;
            ctx.strokeStyle = 'rgba(' + palette.rgb + ',' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      // atoms drawn on top
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const rgb = n.hue === 1 ? palette.rgb : palette.rgb2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgb + ',0.9)';
        ctx.fill();
      }

      requestAnimationFrame(frame);
    }

    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseout', function () { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', resize);

    window.__molecular = { refresh: readPalette };

    readPalette();
    resize();
    frame();
  }
})();
