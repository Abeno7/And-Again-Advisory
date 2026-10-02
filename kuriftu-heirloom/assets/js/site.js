/* Kuriftu — interaction layer. Quiet by default; motion only where it earns its place. */
(() => {
  const doc = document.documentElement;
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* Destination page content */
  const places = {
    'bishoftu': {
      name: 'Bishoftu', kind: 'Lakeside', region: 'Oromia', distance: '45 km from Addis Ababa',
      hero: 'bishoftu-dock', alt: 'Kayaks at the dock on the crater lake at Bishoftu at sunset',
      lede: 'The first Kuriftu, and still the one guests return to. A crater lake held in green hills, a dock of quiet kayaks, and <em>the spa where it all began.</em>',
      body: 'Lodges of stone and timber step down to the water’s edge. Mornings start on the lake, afternoons in the spa, evenings with coffee poured in three rounds on the terrace.',
      facts: [['Setting', 'A volcanic crater lake'], ['Signature', 'The original Kuriftu spa'], ['Also here', 'Peacock Water Park'], ['Best light', 'Late afternoon over the water']],
      gallery: ['still-water', 'spa-interior', 'stone-bath', 'misty-lake-trees'],
      next: 'entoto'
    },
    'entoto': {
      name: 'Entoto', kind: 'Forest', region: 'Entoto Hills', distance: 'Above Addis Ababa',
      hero: 'entoto-tent', alt: 'A timber-framed tented lodge raised among eucalyptus trees at Entoto',
      lede: 'High above the capital, the air turns cool and smells of eucalyptus. Lodges are raised among the trees, <em>and the city falls quiet below.</em>',
      body: 'Tented lodges on timber decks, forest paths and long views over Addis Ababa. A place for walking, for slow mornings in a hammock, and for nights by the fire.',
      facts: [['Setting', 'Eucalyptus forest'], ['Signature', 'Tented lodges on timber decks'], ['Pace', 'Walks, fire, open air'], ['Best light', 'Mist at first light']],
      gallery: ['eucalyptus-forest', 'hammock-forest', 'eucalyptus-timber', 'timber-bench'],
      next: 'awash-falls'
    },
    'awash-falls': {
      name: 'Awash Falls', kind: 'River gorge', region: 'Awash National Park', distance: 'Afar',
      hero: 'awash-dusk', alt: 'Dusk over the plains and pools of the Awash valley',
      lede: 'Stone lodges at the edge of a gorge, with the sound of falling water <em>always somewhere close.</em>',
      body: 'Built from the stone of the valley, the lodge looks out over the Awash River and the wide plains of the national park. Days follow the wildlife, evenings the sound of the falls.',
      facts: [['Setting', 'The Awash River gorge'], ['Signature', 'Lodges of local stone'], ['Nearby', 'Awash National Park'], ['Best light', 'Dusk across the plains']],
      gallery: ['basalt', 'arch-light', 'stone-lodge-night', 'still-water'],
      next: 'lake-tana'
    },
    'lake-tana': {
      name: 'Lake Tana', kind: 'Lakeshore', region: 'Bahir Dar', distance: 'Amhara',
      hero: 'lake-dawn', alt: 'Mist lifting off Lake Tana at dawn',
      lede: 'Where the Blue Nile begins. A lake of island monasteries and papyrus boats, <em>held in a long, low light.</em>',
      body: 'On the shore at Bahir Dar, rooms open to the lake and the gardens around it. Mornings for the water and the island churches, evenings for the terrace and the sky.',
      facts: [['Setting', 'Ethiopia’s largest lake'], ['Signature', 'Rooms that open to the shore'], ['Nearby', 'Island monasteries, Blue Nile Falls'], ['Best light', 'Dawn on still water']],
      gallery: ['misty-lake-trees', 'fingertip-water', 'raw-linen', 'hand-water-sunset'],
      next: 'african-village'
    },
    'african-village': {
      name: 'African Village', kind: 'Heritage', region: 'Addis Ababa', distance: 'Minutes from the capital',
      hero: 'arrival-building', alt: 'The stone and mosaic facade of Kuriftu African Village at dusk',
      lede: 'Architecture drawn from across a continent, made by hand in earth, stone and mosaic. <em>A whole journey, in one place.</em>',
      body: 'Each suite is shaped by a different African tradition of building and craft. Close to Addis Ababa, it is a place for gathering, celebrating and seeing the work of makers up close.',
      facts: [['Setting', 'Hillside near the capital'], ['Signature', 'Suites shaped by African craft'], ['For', 'Gatherings and celebrations'], ['Best light', 'The facade at dusk']],
      gallery: ['stone-lodge-night', 'grass-weave', 'fired-clay', 'arches'],
      next: 'bishoftu'
    }
  };

  const dPage = $('#destPage');
  if (dPage) {
    const key = new URLSearchParams(location.search).get('place');
    const p = places[key] || places.bishoftu;
    const n = places[p.next];
    const img = (k) => `assets/img/${k}.webp`;
    document.title = `Kuriftu ${p.name} — Kuriftu Resorts & Spa`;
    $('#dHeroImg').src = img(p.hero);
    $('#dHeroImg').alt = p.alt;
    $('#dKind').textContent = `Kuriftu · ${p.kind}`;
    $('#dName').textContent = p.name;
    $('#dMeta').innerHTML = `${p.region}<br>${p.distance}`;
    $('#dLede').innerHTML = p.lede;
    $('#dBody').textContent = p.body;
    $('#dFacts').innerHTML = p.facts.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('');
    $('#dGallery').innerHTML = p.gallery.map((g, i) => `<div class="mask" data-reveal style="--d:${(i % 2) * .15}s"><img src="${img(g)}" alt="" loading="lazy"></div>`).join('');
    $('#dWordSub').textContent = p.name;
    $('#dNext').href = `destination.html?place=${p.next}`;
    $('#dNextImg').src = img(n.hero);
    $('#dNextName').textContent = n.name;
    const sel = $('#bk-place');
    if (sel) sel.value = p.name;
  }

  /* Loader */
  const finishLoad = () => {
    doc.classList.add('is-loaded');
    body.classList.remove('is-locked');
  };
  if (reduce) finishLoad();
  else {
    const heroImg = $('.hero__media img');
    const start = performance.now();
    const go = () => setTimeout(finishLoad, Math.max(0, 1500 - (performance.now() - start)));
    if (heroImg && !heroImg.complete) { heroImg.addEventListener('load', go, { once: true }); heroImg.addEventListener('error', go, { once: true }); setTimeout(finishLoad, 4000); }
    else go();
  }

  /* Header */
  const header = $('#header');
  let lastY = 0;
  const darkSel = '.on-dark, .on-ink2, .statement, .reserve, .hero, .next-dest, .buna__media';
  const onScrollHeader = () => {
    const y = window.scrollY;
    const threshold = window.innerHeight * .82;
    header.classList.toggle('is-solid', y > threshold);
    const under = document.elementFromPoint(window.innerWidth / 2, header.offsetHeight + 2);
    header.classList.toggle('is-dark-solid', !!(under && under.closest(darkSel)));
    header.classList.toggle('is-hidden', y > threshold && y > lastY + 4 && !body.classList.contains('menu-open'));
    if (y < lastY - 4) header.classList.remove('is-hidden');
    lastY = y;
  };

  /* Menu */
  const menu = $('#menu');
  const openBtn = $('#menuOpen');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
    body.classList.toggle('is-locked', open);
    body.classList.toggle('menu-open', open);
    if (open) $('.menu__item', menu).focus({ preventScroll: true });
  };
  openBtn.addEventListener('click', () => setMenu(true));
  $('#menuClose').addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false); });
  const menuImgs = $$('.menu__media img');
  $$('.menu__item').forEach((a, i) => {
    a.style.transitionDelay = `${.25 + i * .06}s`;
    a.addEventListener('mouseenter', () => {
      const idx = +a.dataset.img;
      menuImgs.forEach((im, j) => im.classList.toggle('is-active', j === idx));
    });
    a.addEventListener('click', () => setMenu(false));
  });

  /* Word lighting on scroll */
  $$('[data-words]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(' ');
  });
  const wordBlocks = $$('[data-words]');
  const lightWords = () => {
    const vh = window.innerHeight;
    wordBlocks.forEach((el) => {
      const r = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
      const ws = el.children;
      const lit = Math.round(progress * ws.length);
      for (let i = 0; i < ws.length; i++) ws[i].classList.toggle('is-lit', reduce || i < lit);
    });
  };

  /* Reveals */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .08 });
  const observeReveals = () => $$('[data-reveal]:not(.is-in), .scatter:not(.is-in)').forEach((el) => io.observe(el));
  observeReveals();

  /* Parallax */
  const para = $$('[data-parallax]');
  const parallax = () => {
    if (reduce) return;
    const vh = window.innerHeight;
    para.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const speed = parseFloat(el.dataset.parallax) || .15;
      const center = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`;
    });
  };

  /* Destination hover image */
  const float = $('#destFloat');
  const list = $('#destList');
  if (float && list && window.matchMedia('(hover: hover)').matches) {
    const imgs = $$('img', float);
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    const loop = () => {
      cx += (tx - cx) * .12; cy += (ty - cy) * .12;
      float.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .3 ? requestAnimationFrame(loop) : null;
    };
    list.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(loop); });
    list.addEventListener('mouseenter', (e) => { cx = tx = e.clientX; cy = ty = e.clientY; float.classList.add('is-on'); });
    list.addEventListener('mouseleave', () => { float.classList.remove('is-on'); if (!raf) raf = requestAnimationFrame(loop); });
    $$('a', list).forEach((a) => a.addEventListener('mouseenter', () => {
      imgs.forEach((im, j) => im.classList.toggle('is-active', j === +a.dataset.img));
    }));
  }

  /* Materials drag + progress */
  const track = $('#matTrack');
  const bar = $('#matBar');
  if (track) {
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.classList.add('is-drag'); });
    window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; track.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { down = false; track.classList.remove('is-drag'); });
    track.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);
    const upd = () => {
      const max = track.scrollWidth - track.clientWidth;
      const vis = track.clientWidth / track.scrollWidth;
      bar.style.width = `${vis * 100}%`;
      bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0}%)`;
    };
    track.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  /* The Scatter: dots released from the oval. One gold, never touching, never more than one size step apart. */
  const scatter = $('#scatter svg.dots');
  if (scatter) {
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const dots = [];
    const ns = 'http://www.w3.org/2000/svg';
    let tries = 0;
    while (dots.length < 150 && tries < 6000) {
      tries++;
      const a = rnd() * Math.PI * 2;
      const band = 210 + (rnd() - .5) * 2 * 62 * Math.sqrt(rnd());
      const x = 300 + Math.cos(a) * band * .86;
      const y = 300 + Math.sin(a) * band;
      const r = rnd() < .5 ? 4.2 : 6;
      if (dots.some((d) => Math.hypot(d.x - x, d.y - y) < d.r + r + 6)) continue;
      dots.push({ x, y, r, rot: rnd() * 180, a });
    }
    dots.forEach((d) => {
      const e = document.createElementNS(ns, 'ellipse');
      e.setAttribute('cx', d.x.toFixed(1)); e.setAttribute('cy', d.y.toFixed(1));
      e.setAttribute('rx', (d.r * 1.25).toFixed(1)); e.setAttribute('ry', d.r.toFixed(1));
      e.setAttribute('transform', `rotate(${d.rot.toFixed(0)} ${d.x.toFixed(1)} ${d.y.toFixed(1)})`);
      e.setAttribute('fill', 'currentColor');
      e.setAttribute('class', 'dot');
      e.style.transitionDelay = `${((d.a / (Math.PI * 2)) * 1.6).toFixed(2)}s`;
      scatter.appendChild(e);
    });
  }

  /* Booking defaults */
  const din = $('#bk-in'), dout = $('#bk-out');
  if (din && dout) {
    const iso = (d) => d.toISOString().slice(0, 10);
    const t = new Date(); t.setDate(t.getDate() + 14);
    const t2 = new Date(t); t2.setDate(t2.getDate() + 3);
    din.min = iso(new Date()); din.value = iso(t); dout.value = iso(t2); dout.min = iso(t);
    din.addEventListener('change', () => {
      dout.min = din.value;
      if (dout.value <= din.value) { const n = new Date(din.value); n.setDate(n.getDate() + 2); dout.value = iso(n); }
    });
  }

  /* Frame loop */
  let ticking = false;
  const frame = () => { onScrollHeader(); parallax(); lightWords(); ticking = false; };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener('resize', frame);
  frame();
})();
