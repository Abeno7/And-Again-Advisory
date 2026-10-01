/* Incubator Monitor — browser-only simulation. All readings are synthetic. */
(() => {
  'use strict';

  const TZ = 'Africa/Nairobi';
  const TICK_MS = 2000;
  const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)'];
  const BARS = 36;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const M = {
    temp: { label: 'Temperature', short: 'Temp', unit: '°C', sp: 37.5, lo: 36.5, hi: 38.5, noise: 0.05, dp: 1 },
    hum:  { label: 'Humidity', short: 'Humidity', unit: '%RH', sp: 60, lo: 50, hi: 70, noise: 0.5, dp: 1 },
    co2:  { label: 'CO₂', short: 'CO₂', unit: 'ppm', sp: 3000, lo: 1500, hi: 5000, noise: 40, dp: 0 },
  };
  const KEYS = Object.keys(M);

  const SCENARIOS = {
    normal:   { text: 'Normal operation' },
    hightemp: { unit: 1, key: 'temp', target: 39.4, text: 'High temperature on Incubator 02' },
    lowhum:   { unit: 2, key: 'hum',  target: 42,   text: 'Low humidity on Incubator 03' },
    highco2:  { unit: 0, key: 'co2',  target: 5800, text: 'High CO₂ on Incubator 01' },
    sensor:   { unit: 3, key: 'hum',  fault: true,  text: 'Humidity sensor fault on Incubator 04' },
    power:    { power: true, text: 'Utility power failure' },
    comms:    { comms: true, text: 'Communication failure' },
  };

  // ---------- State ----------
  const units = [0, 1, 2, 3].map(i => ({
    id: `INC-0${i + 1}`, name: `Incubator 0${i + 1}`,
    v: { temp: 37.5, hum: 60, co2: 3000 }, shown: {}, q: { temp: 'good', hum: 'good', co2: 'good' },
  }));
  const history = units.map(() => ({ t: [], temp: [], hum: [], co2: [] }));
  let alarms = [];
  let scenario = 'normal';
  let role = 'operator';
  let lastUpdate = null;
  let alarmSeq = 0;
  let upsPct = 100;
  const ui = { view: 'overview', measure: 'temp', miniMeasure: 'temp', period: 1, unit: 'all', chartAnim: true };

  // ---------- Helpers ----------
  const $ = s => document.querySelector(s);
  const fmtTime = (t, withDate, noSec) => new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, hour: '2-digit', minute: '2-digit', ...(withDate ? { day: '2-digit', month: 'short' } : noSec ? {} : { second: '2-digit' }),
  }).format(t);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmtVal = (k, v) => v.toLocaleString('en-GB', { minimumFractionDigits: M[k].dp, maximumFractionDigits: M[k].dp });
  const level = (key, v) => {
    if (v == null) return 'na';
    const m = M[key];
    if (v > m.hi || v < m.lo) return 'critical';
    const band = (m.hi - m.sp) * 0.7;
    if (v > m.sp + band || v < m.sp - band) return 'warning';
    return 'normal';
  };
  const setHTML = (el, html) => { if (el._html !== html) { el.innerHTML = html; el._html = html; } };

  // ---------- Seed 7 days of synthetic history (1-minute samples) ----------
  (function seed() {
    const now = Date.now(), start = now - 7 * 864e5;
    units.forEach((u, i) => {
      const h = history[i];
      const v = { temp: M.temp.sp, hum: M.hum.sp, co2: M.co2.sp };
      for (let t = start; t < now; t += 60e3) {
        const day = Math.sin((t / 864e5) * 2 * Math.PI + i);
        KEYS.forEach(k => { const m = M[k]; v[k] += (m.sp + day * m.noise * 3 - v[k]) * 0.15 + gauss() * m.noise * 1.4; });
        const gap = i === 3 && t > now - 30 * 3600e3 && t < now - 29.4 * 3600e3; // a historic sensor dropout
        h.t.push(t);
        KEYS.forEach(k => h[k].push(gap && k === 'hum' ? null : +v[k].toFixed(3)));
      }
      Object.assign(u.v, v);
    });
  })();

  // ---------- Simulation step ----------
  function step() {
    const sc = SCENARIOS[scenario];
    const now = Date.now();
    units.forEach((u, i) => {
      KEYS.forEach(k => {
        const m = M[k], hit = sc.unit === i && sc.key === k;
        const target = hit && sc.target != null ? sc.target : m.sp;
        u.v[k] += (target - u.v[k]) * (hit ? 0.18 : 0.12) + gauss() * m.noise;
        u.q[k] = sc.comms ? 'stale' : (sc.fault && hit ? 'bad' : 'good');
      });
      const h = history[i];
      h.t.push(now);
      KEYS.forEach(k => h[k].push(u.q[k] === 'good' ? +u.v[k].toFixed(3) : null));
    });
    upsPct = sc.power ? Math.max(5, upsPct - 0.5) : Math.min(100, upsPct + 1);
    if (!sc.comms) lastUpdate = now;
    evaluateAlarms(now);
    render();
  }

  // ---------- Alarms ----------
  function evaluateAlarms(now) {
    const sc = SCENARIOS[scenario];
    const conditions = [];
    units.forEach(u => {
      KEYS.forEach(k => {
        if (u.q[k] === 'bad') conditions.push({ key: `${u.id}:${k}:bad`, source: u.name, sev: 'warning', desc: `${M[k].label} sensor unavailable (quality BAD)` });
        else if (u.q[k] === 'good' && level(k, u.v[k]) === 'critical') {
          const high = u.v[k] > M[k].hi;
          conditions.push({ key: `${u.id}:${k}:${high ? 'hi' : 'lo'}`, source: u.name, sev: 'critical',
            desc: `${M[k].label} ${high ? 'above high' : 'below low'} limit (${fmtVal(k, high ? M[k].hi : M[k].lo)} ${M[k].unit})` });
        }
      });
    });
    if (sc.comms) conditions.push({ key: 'GW:comms', source: 'Gateway', sev: 'critical', desc: 'PLC communication lost — values unavailable' });
    if (sc.power) conditions.push({ key: 'PWR:mains', source: 'Facility', sev: 'critical', desc: 'Utility power lost — PLC on UPS. Start generator.' });

    const activeKeys = new Set(conditions.map(c => c.key));
    alarms.forEach(a => { if (a.active && !activeKeys.has(a.key)) { a.active = false; a.cleared = now; } });
    conditions.forEach(c => {
      if (!alarms.some(a => a.active && a.key === c.key)) {
        alarms.unshift({ ...c, id: ++alarmSeq, time: now, active: true, acked: false, fresh: true });
        toast(`${c.sev === 'critical' ? 'Critical' : 'Warning'} · ${c.source} — ${c.desc}`);
      }
    });
    alarms = alarms.slice(0, 60);
  }

  // ---------- Number tween ----------
  function tween(el, from, to, k) {
    if (reduceMotion || from == null || from === to) { el.textContent = fmtVal(k, to); return; }
    const t0 = performance.now(), dur = 700;
    cancelAnimationFrame(el._raf);
    const f = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmtVal(k, from + (to - from) * e);
      if (p < 1) el._raf = requestAnimationFrame(f);
    };
    el._raf = requestAnimationFrame(f);
  }

  // ---------- KPI strip ----------
  function renderKpis() {
    const sc = SCENARIOS[scenario];
    const statuses = units.map(unitStatus);
    const normal = statuses.filter(s => s === 'normal').length;
    const active = alarms.filter(a => a.active).length;
    const temps = units.filter(u => u.q.temp === 'good').map(u => u.v.temp);
    const avg = temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
    const hourAgo = history.map(h => { const j = h.t.findIndex(t => t >= Date.now() - 3600e3); return j >= 0 ? h.temp[j] : null; }).filter(v => v != null);
    const prev = hourAgo.length ? hourAgo.reduce((a, b) => a + b, 0) / hourAgo.length : null;
    const d = avg != null && prev != null ? avg - prev : null;
    const html = `
      <div class="kpi"><div class="k">Incubators normal</div><div class="v">${sc.comms ? '—' : normal}<small>/ 4</small><span class="delta ${normal === 4 ? '' : statuses.includes('critical') ? 'crit' : 'warn'}">${normal === 4 ? 'All clear' : sc.comms ? 'No data' : `${4 - normal} need attention`}</span></div></div>
      <div class="kpi"><div class="k">Active alarms</div><div class="v">${active}<span class="delta ${active ? 'crit' : ''}">${active ? `${alarms.filter(a => a.active && !a.acked).length} unacknowledged` : 'None'}</span></div></div>
      <div class="kpi"><div class="k">Average temperature</div><div class="v">${avg == null ? '—' : avg.toFixed(1)}<small>°C</small>${d == null ? '' : `<span class="delta ${Math.abs(d) > 0.4 ? 'warn' : ''}">${d >= 0 ? '+' : ''}${d.toFixed(2)} vs 1h</span>`}</div></div>
      <div class="kpi"><div class="k">Utility power</div><div class="v">${sc.comms ? '—' : sc.power ? 'Lost' : 'On'}<span class="delta ${sc.comms ? 'warn' : sc.power ? 'crit' : ''}">${sc.comms ? 'No data' : sc.power ? `UPS ${Math.round(upsPct)}%` : 'Mains present'}</span></div></div>`;
    setHTML($('#kpis'), html);
  }

  // ---------- Unit cards ----------
  function buildUnits() {
    $('#units').innerHTML = units.map((u, i) => `
      <article class="card unit" style="--i:${i}" id="card-${i}" aria-labelledby="uh-${i}">
        <header class="unit-head">
          <h2 id="uh-${i}">${u.name}</h2><span class="id">${u.id}</span>
          <span class="pill normal" data-status>NORMAL</span>
        </header>
        <div class="readings">
          ${KEYS.map(k => `
          <div class="rd" data-k="${k}">
            <div class="val"><span class="n">—</span><span class="u">${M[k].unit}</span></div>
            <div class="lbl" style="color:${SERIES[i]}"><i></i><span style="color:var(--muted)">${M[k].short}</span></div>
            <div class="spv">SP ${fmtVal(k, M[k].sp)}<span class="rng"> · ${fmtVal(k, M[k].lo)}–${fmtVal(k, M[k].hi)}</span></div>
            <div class="bars" style="color:${SERIES[i]}" aria-hidden="true">${Array.from({ length: BARS }, (_, j) => `<i style="--j:${j};--i:${i};--h:30%"></i>`).join('')}</div>
          </div>`).join('')}
        </div>
        <footer class="unit-foot">
          <span class="quality" data-quality>Synthetic · Good quality</span>
          <span data-alarm></span>
          <button class="icon-btn" data-unit="${i}" aria-label="Open ${u.name} trends"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></button>
        </footer>
      </article>`).join('');
  }

  function unitStatus(u) {
    if (SCENARIOS[scenario].comms) return 'offline';
    let worst = 'normal';
    KEYS.forEach(k => {
      const lv = u.q[k] === 'good' ? level(k, +u.v[k].toFixed(M[k].dp)) : 'bad';
      if (lv === 'critical') worst = 'critical';
      else if ((lv === 'warning' || lv === 'bad') && worst !== 'critical') worst = 'warning';
    });
    return worst;
  }

  function renderUnits() {
    const comms = SCENARIOS[scenario].comms;
    units.forEach((u, i) => {
      const card = $(`#card-${i}`);
      KEYS.forEach(k => {
        const rd = card.querySelector(`[data-k="${k}"]`);
        const val = rd.querySelector('.val'), n = val.querySelector('.n'), unitEl = val.querySelector('.u');
        if (u.q[k] !== 'good') {
          val.className = 'val na'; n.textContent = 'Unavailable'; unitEl.hidden = true; u.shown[k] = null;
        } else {
          const v = +u.v[k].toFixed(M[k].dp);
          val.className = 'val' + (level(k, v) === 'critical' ? ' out' : '');
          unitEl.hidden = false;
          if (u.shown[k] !== v) {
            tween(n, u.shown[k], v, k);
            if (u.shown[k] != null) { val.classList.remove('tick'); void val.offsetWidth; val.classList.add('tick'); }
            u.shown[k] = v;
          }
        }
        // tick bars: most recent samples, scaled within the visible window
        const vals = history[i][k].slice(-BARS);
        const nums = vals.filter(x => x != null);
        const lo = Math.min(...nums, M[k].sp - M[k].noise * 3), hi = Math.max(...nums, M[k].sp + M[k].noise * 3);
        rd.querySelectorAll('.bars i').forEach((b, j) => {
          const x = vals[j];
          b.classList.toggle('gap', x == null);
          b.style.setProperty('--h', x == null ? '100%' : `${(22 + 78 * (x - lo) / (hi - lo || 1)).toFixed(1)}%`);
        });
      });
      const status = unitStatus(u);
      const pill = card.querySelector('[data-status]');
      if (pill.textContent !== status.toUpperCase()) { pill.className = `pill ${status}`; pill.textContent = status.toUpperCase(); }
      card.classList.toggle('is-critical', status === 'critical');
      card.classList.toggle('is-warning', status === 'warning');

      const anyBad = KEYS.some(k => u.q[k] === 'bad');
      const qEl = card.querySelector('[data-quality]');
      qEl.className = 'quality' + (comms || anyBad ? ' bad' : '');
      qEl.textContent = comms ? 'Synthetic · Stale data' : anyBad ? 'Synthetic · Sensor unavailable' : 'Synthetic · Good quality';

      const act = alarms.filter(a => a.active && a.source === u.name);
      setHTML(card.querySelector('[data-alarm]'), act.length
        ? `<span class="alarm-ctx ${act.every(a => a.sev === 'warning') ? 'warn' : ''}">${act.length} alarm${act.length > 1 ? 's' : ''} · ${act.some(a => !a.acked) ? 'unacknowledged' : 'acknowledged'}</span>` : '');
    });
  }

  // ---------- Power card (dotted ring) ----------
  const DOTS = 44;
  function buildPower() {
    const r = 80, c = 95;
    const dots = Array.from({ length: DOTS }, (_, k) => {
      const a = -Math.PI / 2 + (k / DOTS) * Math.PI * 2;
      return `<circle cx="${(c + r * Math.cos(a)).toFixed(2)}" cy="${(c + r * Math.sin(a)).toFixed(2)}" r="${k % 4 === 0 ? 4.6 : 3.6}"/>`;
    }).join('');
    $('#powerCard').innerHTML = `
      <div class="ph"><h2 id="h-power">Facility power</h2><span class="pill" data-pw>MAINS</span></div>
      <svg class="dots" viewBox="0 0 190 190" role="img" aria-label="UPS charge">${dots}
        <text class="big" x="95" y="100" data-pct>100</text><text class="small" x="95" y="124">% UPS charge</text></svg>
      <dl><dt>Utility supply</dt><dd data-mains>Present</dd><dt>UPS mode</dt><dd data-mode>On mains</dd><dt>Gateway</dt><dd data-gw>Heartbeat OK</dd></dl>
      <button class="btn-dark" data-goto="system">Open system</button>`;
  }
  function renderPower() {
    const sc = SCENARIOS[scenario], card = $('#powerCard');
    const lit = Math.round((upsPct / 100) * DOTS);
    card.querySelectorAll('.dots circle').forEach((d, k) => d.classList.toggle('off', k >= lit));
    card.classList.toggle('lost', !!sc.power);
    card.querySelector('[data-pct]').textContent = Math.round(upsPct);
    card.querySelector('[data-pw]').textContent = sc.comms ? 'NO DATA' : sc.power ? 'POWER LOST' : 'MAINS';
    card.querySelector('[data-mains]').textContent = sc.comms ? 'Unknown' : sc.power ? 'Lost — start generator' : 'Present';
    card.querySelector('[data-mode]').textContent = sc.comms ? 'Unknown' : sc.power ? 'On battery' : 'On mains';
    card.querySelector('[data-gw]').textContent = sc.comms ? 'No data' : 'Heartbeat OK';
  }

  // ---------- Chart ----------
  function bucket(i, key, hours, n) {
    const h = history[i], end = Date.now(), start = end - hours * 3600e3, w = (end - start) / n;
    const out = Array.from({ length: n }, (_, b) => ({ t: start + (b + 0.5) * w, s: 0, c: 0, bad: false }));
    for (let j = h.t.length - 1; j >= 0 && h.t[j] >= start; j--) {
      const b = Math.min(n - 1, Math.floor((h.t[j] - start) / w));
      const v = h[key][j];
      if (v == null) out[b].bad = true; else { out[b].s += v; out[b].c++; }
    }
    // empty buckets → undefined (dropped); bad-quality-only buckets → null (drawn as a gap)
    return out.map(o => [o.t, o.c ? o.s / o.c : (o.bad ? null : undefined)]);
  }

  // Smooth path through points (Catmull-Rom → cubic Bézier), broken at gaps
  function smooth(pts) {
    let d = '';
    const runs = []; let run = [];
    pts.forEach(p => { if (p[1] == null) { if (run.length) runs.push(run); run = []; } else run.push(p); });
    if (run.length) runs.push(run);
    runs.forEach(r => {
      d += `M${r[0][0].toFixed(1)} ${r[0][1].toFixed(1)}`;
      for (let k = 0; k < r.length - 1; k++) {
        const p0 = r[k - 1] || r[k], p1 = r[k], p2 = r[k + 1], p3 = r[k + 2] || p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
      }
    });
    return { d, runs };
  }

  function drawChart(el, { key, hours, animate, legend, only }) {
    const m = M[key];
    const W = Math.max(300, el.clientWidth - 40);
    const tall = el.classList.contains('tall'), small = innerWidth <= 600;
    const H = tall ? (small ? 270 : 360) : (small ? 210 : 250);
    const pad = { l: 46, r: small ? 64 : 92, t: 14, b: 34 };
    const idx = only === 'all' ? [0, 1, 2, 3] : [+only];
    let n = Math.min(small ? 40 : 72, Math.round(W / 9));
    const raw = idx.map(i => bucket(i, key, hours, n));
    const keep = raw[0].map((_, b) => raw.some(r => r[b][1] !== undefined));
    const series = idx.map((i, s) => ({ i, name: units[i].name, color: SERIES[i], pts: raw[s].filter((_, b) => keep[b]).map(([t, v]) => [t, v === undefined ? null : v]) }));
    n = series[0].pts.length;
    if (n < 2) { el.innerHTML = '<p class="empty">Not enough data yet.</p>'; return series; }
    const vals = series.flatMap(s => s.pts.map(p => p[1])).filter(v => v != null);
    let lo = Math.min(...vals, m.sp), hi = Math.max(...vals, m.hi);
    if (key === 'hum') lo = Math.min(lo, m.lo);
    const span = hi - lo || 1; lo -= span * 0.1; hi += span * 0.08;
    const t0 = series[0].pts[0][0], t1 = series[0].pts[n - 1][0];
    const x = t => pad.l + ((t - t0) / (t1 - t0)) * (W - pad.l - pad.r);
    const y = v => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);

    const gy = Array.from({ length: 5 }, (_, k) => lo + (hi - lo) * k / 4);
    const nx = small ? 3 : 5;
    const gx = Array.from({ length: nx + 1 }, (_, k) => t0 + (t1 - t0) * k / nx);
    const tickCount = Math.round((W - pad.l - pad.r) / 9);
    const limits = [{ v: m.hi, l: `High ${fmtVal(key, m.hi)}` }].concat(key === 'hum' ? [{ v: m.lo, l: `Low ${fmtVal(key, m.lo)}` }] : []);

    const ends = series.map(s => { const last = [...s.pts].reverse().find(p => p[1] != null); return last ? { s, x: x(last[0]), y: y(last[1]), v: last[1] } : null; }).filter(Boolean);
    const lab = ends.map(e => ({ ...e, ly: e.y })).sort((a, b) => a.ly - b.ly);
    for (let k = 1; k < lab.length; k++) if (lab[k].ly - lab[k - 1].ly < 15) lab[k].ly = lab[k - 1].ly + 15;

    const paths = series.map(s => smooth(s.pts.map(([t, v]) => [x(t), v == null ? null : y(v)])));
    const single = series.length === 1;
    const gid = `g${el.id}`;

    el.innerHTML = `
      ${legend ? `<ul class="legend">${series.map(s => `<li><i style="background:${s.color}"></i>${s.name}</li>`).join('')}<li><i class="dash"></i>Limit</li></ul>` : ''}
      <svg class="plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="${m.label}, ${single ? series[0].name : 'all incubators'}, last ${hours} hours">
        <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${series[0].color}" stop-opacity=".35"/><stop offset="1" stop-color="${series[0].color}" stop-opacity="0"/></linearGradient></defs>
        <g class="grid">
          ${gy.map(v => `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/>`).join('')}
          ${gx.map(t => `<line class="v" x1="${x(t)}" x2="${x(t)}" y1="${pad.t}" y2="${H - pad.b}"/>`).join('')}
        </g>
        <g class="ticks">${Array.from({ length: tickCount + 1 }, (_, k) => { const xx = pad.l + k * (W - pad.l - pad.r) / tickCount; return `<line x1="${xx}" x2="${xx}" y1="${H - pad.b - (k % 5 ? 6 : 10)}" y2="${H - pad.b}"/>`; }).join('')}</g>
        <g class="axis">
          ${gy.map(v => `<text x="${pad.l - 10}" y="${y(v) + 4}" text-anchor="end">${fmtVal(key, v)}</text>`).join('')}
          ${gx.map(t => `<text x="${x(t)}" y="${H - 10}" text-anchor="middle">${fmtTime(t, hours > 24, true)}</text>`).join('')}
        </g>
        ${limits.map(L => `<line class="limit" x1="${pad.l}" x2="${W - pad.r}" y1="${y(L.v)}" y2="${y(L.v)}"/><text class="limit-label" x="${W - pad.r + 8}" y="${y(L.v) + 4}">${L.l}</text>`).join('')}
        ${single ? paths[0].runs.map(r => `<path class="area${animate ? ' draw' : ''}" fill="url(#${gid})" d="${smooth(r).d}L${r[r.length - 1][0].toFixed(1)} ${H - pad.b}L${r[0][0].toFixed(1)} ${H - pad.b}Z"/>`).join('') : ''}
        ${series.map((s, k) => `<path class="series${animate ? ' draw' : ''}" stroke="${s.color}" d="${paths[k].d}"/>`).join('')}
        ${ends.map(e => `<circle class="end-dot" cx="${e.x}" cy="${e.y}" r="4.5" fill="${e.s.color}"/>`).join('')}
        ${lab.map(e => `<text class="end-label" x="${e.x + 10}" y="${e.ly + 4}">${single ? '' : `0${e.s.i + 1} · `}${fmtVal(key, e.v)}</text>`).join('')}
        <g class="hover" visibility="hidden"><line class="cross" y1="${pad.t}" y2="${H - pad.b}"/>${series.map(s => `<circle class="hover-dot" r="5" stroke="${s.color}"/>`).join('')}</g>
        <rect x="${pad.l}" y="${pad.t}" width="${W - pad.l - pad.r}" height="${H - pad.t - pad.b}" fill="transparent" stroke="none"/>
      </svg>
      <div class="tip"></div>`;

    if (animate && !reduceMotion) el.querySelectorAll('.series.draw').forEach(p => p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 2));

    const svg = el.querySelector('svg'), tip = el.querySelector('.tip'), hov = el.querySelector('.hover');
    svg.addEventListener('pointermove', ev => {
      const r = svg.getBoundingClientRect();
      const px = (ev.clientX - r.left) * (W / r.width);
      const k = Math.max(0, Math.min(n - 1, Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (n - 1))));
      const t = series[0].pts[k][0];
      hov.setAttribute('visibility', 'visible');
      const line = hov.querySelector('line'); line.setAttribute('x1', x(t)); line.setAttribute('x2', x(t));
      hov.querySelectorAll('circle').forEach((c, s) => {
        const v = series[s].pts[k][1];
        c.setAttribute('visibility', v == null ? 'hidden' : 'visible');
        if (v != null) { c.setAttribute('cx', x(t)); c.setAttribute('cy', y(v)); }
      });
      tip.innerHTML = `<div class="t">${fmtTime(t, true)}</div>` + series.map(s => {
        const v = s.pts[k][1];
        return `<div class="r"><span><i style="background:${s.color}"></i>${s.name}</span><b>${v == null ? 'Unavailable' : `${fmtVal(key, v)} ${m.unit}`}</b></div>`;
      }).join('');
      const cx = (x(t) / W) * r.width;
      tip.style.left = `${Math.max(8, Math.min(cx + (cx > r.width / 2 ? -200 : 26), r.width - 190))}px`;
      tip.style.top = `${legend ? 40 : 20}px`;
      tip.classList.add('on');
    });
    svg.addEventListener('pointerleave', () => { hov.setAttribute('visibility', 'hidden'); tip.classList.remove('on'); });
    return series;
  }

  // ---------- Trends ----------
  function renderTrends(animate) {
    const key = ui.measure, m = M[key];
    const series = drawChart($('#bigChart'), { key, hours: ui.period, animate, legend: true, only: ui.unit });

    // Time in range (raw samples, selected units & period)
    const start = Date.now() - ui.period * 3600e3;
    const c = { normal: 0, warning: 0, critical: 0, na: 0 };
    (ui.unit === 'all' ? [0, 1, 2, 3] : [+ui.unit]).forEach(i => {
      const h = history[i];
      for (let j = h.t.length - 1; j >= 0 && h.t[j] >= start; j--) c[level(key, h[key][j])]++;
    });
    const total = c.normal + c.warning + c.critical + c.na || 1;
    const parts = [
      { k: 'normal', name: 'In range', color: 'var(--ok)' },
      { k: 'warning', name: 'Near limit', color: 'var(--warn)' },
      { k: 'critical', name: 'Out of limit', color: 'var(--crit)' },
      { k: 'na', name: 'Unavailable', color: 'var(--off)' },
    ].map(p => ({ ...p, pct: (100 * c[p.k]) / total }));
    const shown = parts.filter(p => p.pct >= 0.05);
    $('#rangeCard').innerHTML = `
      <div class="range">
        <h2>Time in range</h2>
        <div class="big">${parts[0].pct.toFixed(1)}%<small>${m.label.toLowerCase()} within ${fmtVal(key, m.sp - (m.hi - m.sp) * 0.7)}–${fmtVal(key, m.sp + (m.hi - m.sp) * 0.7)} ${m.unit}</small></div>
        <div class="rbar">${shown.map(p => `<div class="part" style="flex-grow:${Math.max(p.pct, 7)}"><span>${p.pct < 1 ? '<1' : Math.round(p.pct)}%</span><em></em><b style="background:${p.color}"></b></div>`).join('')}</div>
        <div class="rlegend">${parts.map(p => `<span><i style="background:${p.color}"></i>${p.name}</span>`).join('')}</div>
      </div>`;

    $('#statsTable').innerHTML = `<thead><tr><th>Incubator</th><th class="num">Min</th><th class="num">Mean</th><th class="num">Max</th><th class="num">Latest</th></tr></thead><tbody>` +
      series.map(s => {
        const v = s.pts.map(p => p[1]).filter(x => x != null);
        const f = x => x == null ? '—' : `${fmtVal(key, x)} ${m.unit}`;
        const last = [...s.pts].reverse().find(p => p[1] != null);
        return `<tr><td><span class="dotname"><i style="background:${s.color}"></i>${s.name}</span></td><td class="num">${f(v.length ? Math.min(...v) : null)}</td><td class="num">${f(v.length ? v.reduce((a, b) => a + b, 0) / v.length : null)}</td><td class="num">${f(v.length ? Math.max(...v) : null)}</td><td class="num">${f(last && last[1])}</td></tr>`;
      }).join('') + '</tbody>';
  }

  // ---------- Alarm views ----------
  function renderAlarms() {
    const rows = alarms.map(a => `
      <tr class="${a.fresh ? 'new' : ''}">
        <td>${fmtTime(a.time, true)}</td><td>${esc(a.source)}</td><td>${esc(a.desc)}</td>
        <td><span class="sev ${a.sev}">${a.sev.toUpperCase()}</span></td>
        <td>${a.active ? 'Active' : `Cleared ${fmtTime(a.cleared, false, true)}`} · <span class="ack ${a.acked ? 'yes' : 'no'}">${a.acked ? 'Acknowledged' : 'Unacknowledged'}</span></td>
        <td>${a.acked ? '' : `<button class="btn-sm" data-ack="${a.id}">Acknowledge</button>`}</td>
      </tr>`).join('');
    setHTML($('#ledger'), rows || `<tr><td colspan="6" class="empty">No alarms recorded in this session. An empty list does not confirm normal conditions.</td></tr>`);

    const mini = alarms.filter(a => a.active).slice(0, 4).map(a =>
      `<li><span class="sev ${a.sev}">${a.sev === 'critical' ? 'CRIT' : 'WARN'}</span><span>${esc(a.source)} — ${esc(a.desc)}</span><span class="when">${fmtTime(a.time)} · ${a.acked ? 'acknowledged' : 'unacknowledged'}</span></li>`).join('');
    setHTML($('#miniLedger'), mini || `<li class="empty">No active alarms. Unavailable data would not confirm normal conditions.</li>`);
    alarms.forEach(a => { a.fresh = false; });

    const unacked = alarms.filter(a => !a.acked && a.active).length;
    const nc = $('#navCount'); nc.hidden = !unacked; nc.textContent = unacked;
  }

  function renderSystem() {
    const samples = history.reduce((s, h) => s + h.t.length * 3, 0);
    const sc = SCENARIOS[scenario];
    setHTML($('#diag'), `
      <dt>Data source</dt><dd>Browser simulation (synthetic)</dd>
      <dt>PLC link</dt><dd>${sc.comms ? '<span class="sev critical">LOST (SIMULATED)</span>' : 'Not connected — simulation only'}</dd>
      <dt>Utility power</dt><dd>${sc.power ? '<span class="sev critical">LOST (SIMULATED)</span>' : 'Present'}</dd>
      <dt>Active scenario</dt><dd>${sc.text}</dd>
      <dt>Poll interval</dt><dd>${TICK_MS / 1000} s</dd>
      <dt>Samples held</dt><dd>${samples.toLocaleString('en-GB')}</dd>
      <dt>Time zone</dt><dd>${TZ}</dd>`);
    document.querySelectorAll('#scenarios button').forEach(b => {
      b.disabled = role !== 'administrator';
      b.setAttribute('aria-pressed', b.dataset.s === scenario);
    });
    $('#scenarioHint').textContent = role === 'administrator'
      ? 'Pick a scenario. Readings drift toward it over the next few updates.'
      : 'Switch the role to Administrator (top right) to change scenarios.';
  }

  // ---------- Render loop ----------
  function render() {
    renderKpis();
    renderUnits();
    renderPower();
    renderAlarms();
    if (ui.view === 'overview') drawChart($('#miniChart'), { key: ui.miniMeasure, hours: 1, animate: ui.chartAnim, legend: false, only: 'all' });
    if (ui.view === 'trends') renderTrends(ui.chartAnim);
    if (ui.view === 'system') renderSystem();
    ui.chartAnim = false;

    $('#updated').textContent = lastUpdate ? fmtTime(lastUpdate) : '—';
    $('#connAlert').hidden = !SCENARIOS[scenario].comms;
    const ring = document.querySelector('.ring');
    ring.classList.remove('run'); void ring.getBoundingClientRect(); ring.classList.add('run');
  }

  // ---------- Navigation ----------
  function go(view) {
    ui.view = view; ui.chartAnim = true;
    document.querySelectorAll('.nav-item').forEach(b => {
      if (b.dataset.view === view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    document.querySelectorAll('.view').forEach(v => {
      const on = v.id === `view-${view}`;
      v.hidden = !on;
      if (on) { v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter'); }
    });
    render();
    $('#main').focus({ preventScroll: true });
    scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  const press = (group, btn) => group.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === btn));

  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 3800);
  }

  function exportCsv() {
    const start = Date.now() - ui.period * 3600e3;
    const lines = ['timestamp_utc,incubator,measurement,value,unit,quality,source'];
    history.forEach((h, i) => {
      if (ui.unit !== 'all' && +ui.unit !== i) return;
      for (let j = 0; j < h.t.length; j++) {
        if (h.t[j] < start) continue;
        KEYS.forEach(k => lines.push(`${new Date(h.t[j]).toISOString()},${units[i].id},${k},${h[k][j] ?? ''},${M[k].unit},${h[k][j] == null ? 'BAD' : 'GOOD'},SIMULATED`));
      }
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    a.download = `incubator-simulated-${ui.period}h.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(`Exported ${(lines.length - 1).toLocaleString('en-GB')} simulated samples`);
  }

  // ---------- Events ----------
  document.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    const d = t.dataset;
    if (d.view) go(d.view);
    else if (d.goto) go(d.goto);
    else if (d.unit) { ui.unit = d.unit; press($('#unitChips'), $(`#unitChips [data-u="${d.unit}"]`)); go('trends'); }
    else if (d.ack) {
      const a = alarms.find(x => x.id === +d.ack);
      if (a) { a.acked = true; toast(`Acknowledged as ${role} — condition remains ${a.active ? 'active' : 'cleared'}`); renderAlarms(); renderUnits(); renderKpis(); }
    } else if (d.s && role === 'administrator') {
      scenario = d.s; toast(`Scenario: ${SCENARIOS[scenario].text} (simulated)`); renderSystem();
    } else if (d.u) { ui.unit = d.u; press(t.parentElement, t); renderTrends(true); }
    else if (d.m) { ui.measure = d.m; press(t.parentElement, t); renderTrends(true); }
    else if (d.p) { ui.period = +d.p; press(t.parentElement, t); renderTrends(true); }
    else if (d.mm) { ui.miniMeasure = d.mm; press(t.parentElement, t); drawChart($('#miniChart'), { key: d.mm, hours: 1, animate: true, legend: false, only: 'all' }); }
    else if (t.id === 'exportCsv') exportCsv();
  });
  $('#role').addEventListener('change', e => { role = e.target.value; toast(`Role: ${e.target.selectedOptions[0].text} (demo control, not authentication)`); renderSystem(); });
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(render, 150); });

  // ---------- Start ----------
  buildUnits();
  buildPower();
  step();
  setInterval(step, TICK_MS);
})();
