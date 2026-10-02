(() => {
  const doc = document.documentElement;
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Arrival
  const ready = () => body.classList.add('is-ready');
  if (document.readyState === 'complete') setTimeout(ready, 400);
  else window.addEventListener('load', () => setTimeout(ready, 400));
  setTimeout(ready, 2500); // never hold the guest at the door

  // Header: transparent over hero, solid after, hides on scroll down
  const hdr = $('[data-hdr]');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    const heroH = window.innerHeight * 0.85;
    hdr.classList.toggle('is-top', y < heroH);
    hdr.classList.toggle('is-solid', y > heroH);
    hdr.classList.toggle('is-hidden', y > heroH && y > lastY + 4 && !body.classList.contains('is-locked'));
    if (y < lastY - 4 || y <= heroH) hdr.classList.remove('is-hidden');
    lastY = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  $$('.reveal').forEach((el) => io.observe(el));

  // Parallax on the heirloom moment
  const par = $('[data-parallax]');
  if (par && !reduce) {
    const sec = par.parentElement;
    const tick = () => {
      const r = sec.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        par.style.transform = `translate3d(0, ${p * -8}%, 0)`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // The Scatter — the dots inside the oval, released. One gold, never touching.
  const ring = $('[data-scatter]');
  if (ring) {
    let seed = 2002;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const dots = [];
    const placed = [];
    let tries = 0;
    while (dots.length < 170 && tries < 6000) {
      tries++;
      const a = rnd() * Math.PI * 2;
      const rad = 380 + (rnd() - 0.5) * 120 + Math.sin(a * 3) * 14;
      const x = 500 + Math.cos(a) * rad * 0.82;
      const y = 500 + Math.sin(a) * rad;
      const rx = 4 + Math.floor(rnd() * 3) * 2.2;
      if (placed.some((p) => Math.hypot(p[0] - x, p[1] - y) < p[2] + rx + 6)) continue;
      placed.push([x, y, rx]);
      const ry = rx * (0.62 + rnd() * 0.2);
      const rot = Math.round(rnd() * 180);
      dots.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`);
    }
    ring.innerHTML = `<svg viewBox="0 0 1000 1000" fill="#C9A86C">${dots.join('')}</svg>`;
  }

  // Focus trap helper
  const trap = (root, e) => {
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button:not([disabled]), input, select', root).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // Menu
  const menu = $('#menu');
  const menuBtn = $('[data-menu-open]');
  const menuImg = $('[data-menu-img]');
  const openMenu = () => {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    body.classList.add('is-locked');
    menuBtn.setAttribute('aria-expanded', 'true');
    $('[data-menu-close]').focus();
  };
  const closeMenu = (focus = true) => {
    menu.classList.remove('is-open');
    menu.hidden = true;
    body.classList.remove('is-locked');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (focus) menuBtn.focus();
  };
  menuBtn.addEventListener('click', openMenu);
  $('[data-menu-close]').addEventListener('click', () => closeMenu());
  menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); trap(menu, e); });
  $$('a', menu).forEach((a) => {
    a.addEventListener('click', () => closeMenu(false));
    const src = a.dataset.img;
    if (!src) return;
    const swap = () => {
      if (menuImg.getAttribute('src') === src) return;
      menuImg.classList.add('is-swap');
      setTimeout(() => { menuImg.src = src; menuImg.classList.remove('is-swap'); }, 220);
    };
    a.addEventListener('mouseenter', swap);
    a.addEventListener('focus', swap);
  });

  // Reserve drawer
  const drawer = $('#reserve');
  const dForm = $('[data-drawer-form]');
  const dDone = $('.drawer__done');
  let lastFocus = null;
  const openDrawer = (opts = {}) => {
    lastFocus = document.activeElement;
    dForm.hidden = false; dDone.hidden = true;
    if (opts.destination) dForm.destination.value = opts.destination;
    if (opts.type) dForm.type.value = opts.type;
    if (opts.arrive) dForm.arrive.value = opts.arrive;
    if (opts.depart) dForm.depart.value = opts.depart;
    if (opts.guests) dForm.guests.value = opts.guests;
    drawer.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add('is-open')));
    body.classList.add('is-locked');
    setTimeout(() => $('.drawer__close', drawer).focus(), 50);
  };
  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    body.classList.remove('is-locked');
    setTimeout(() => { drawer.hidden = true; }, reduce ? 0 : 600);
    if (lastFocus) lastFocus.focus();
  };
  $$('[data-reserve]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    if (!menu.hidden) closeMenu(false);
    openDrawer({ destination: el.dataset.dest, type: el.dataset.type || 'stay' });
  }));
  $$('[data-drawer-close]', drawer).forEach((el) => el.addEventListener('click', closeDrawer));
  drawer.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); trap(drawer, e); });

  // Dates: sensible defaults and guards
  const iso = (d) => d.toISOString().slice(0, 10);
  const today = new Date();
  const plus = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };
  $$('input[name="arrive"]').forEach((i) => { i.min = plus(0); if (!i.value) i.value = plus(14); });
  $$('input[name="depart"]').forEach((i) => { i.min = plus(1); if (!i.value) i.value = plus(17); });
  $$('form').forEach((f) => {
    const a = f.arrive, d = f.depart;
    if (!a || !d) return;
    a.addEventListener('change', () => {
      const next = new Date(a.value); next.setDate(next.getDate() + 1);
      d.min = iso(next);
      if (d.value <= a.value) d.value = iso(next);
    });
  });

  // Booking bar hands off to the drawer
  const book = $('[data-book]');
  book.addEventListener('submit', (e) => {
    e.preventDefault();
    openDrawer({
      destination: book.destination.value, type: 'stay',
      arrive: book.arrive.value, depart: book.depart.value, guests: book.guests.value,
    });
  });

  const fmt = (v) => v ? new Date(v + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : '';
  dForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = dForm;
    const when = f.arrive.value ? ` from ${fmt(f.arrive.value)} to ${fmt(f.depart.value)}` : '';
    $('[data-done-text]').textContent =
      `${f.name.value.split(' ')[0] || 'Thank you'}, your request for Kuriftu ${f.destination.value}${when} has been received. A reply will reach ${f.email.value} within one day.`;
    dForm.hidden = true; dDone.hidden = false;
  });

  // Newsletter
  const letter = $('[data-letter]');
  letter.addEventListener('submit', (e) => {
    e.preventDefault();
    letter.hidden = true;
    $('.letter__ok').hidden = false;
  });

  // Notes from the house
  const quotes = $$('.quote');
  const count = $('[data-q-count]');
  let qi = 0, qTimer;
  const show = (n) => {
    quotes[qi].classList.remove('is-on');
    qi = (n + quotes.length) % quotes.length;
    quotes[qi].classList.add('is-on');
    count.textContent = `${String(qi + 1).padStart(2, '0')} / ${String(quotes.length).padStart(2, '0')}`;
  };
  const auto = () => { clearInterval(qTimer); if (!reduce) qTimer = setInterval(() => show(qi + 1), 7000); };
  $$('[data-q]').forEach((b) => b.addEventListener('click', () => { show(qi + +b.dataset.q); auto(); }));
  auto();

  const y = $('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
