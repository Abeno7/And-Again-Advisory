/* Incubator Monitor — browser-only simulation. All readings are synthetic. */
(() => {
  'use strict';

  const TZ = 'Africa/Nairobi';
  const TICK_MS = 2000;
  const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)'];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const M = {
    temp: { label: 'Temperature', unit: '°C', sp: 37.5, lo: 36.5, hi: 38.5, noise: 0.05, dp: 1, icon: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>' },
    hum:  { label: 'Humidity',    unit: '%RH', sp: 60,  lo: 50,   hi: 70,   noise: 0.5,  dp: 1, icon: '<path d="M12 2.7s6 6.4 6 11.3a6 6 0 0 1-12 0c0-4.9 6-11.3 6-11.3z"/>' },
    co2:  { label: 'CO₂',         unit: 'ppm', sp: 3000, lo: 1500, hi: 5000, noise: 40, dp: 0, icon: '<circle cx="8" cy="12" r="4"/><circle cx="16.5" cy="9" r="3"/><circle cx="16" cy="16.5" r="2.5"/>' },
  };
  const KEYS = Object.keys(M);

  const SCENARIOS = {
    normal:   { text: 'Normal operation' },
    hightemp: { unit: 1, key: 'temp', target: 39.4, text: 'High temperature on Incubator 02' },
    lowhum:   { unit: 2, key: 'hum',  target: 42,   text: 'Low humidity on Incubator 03' },
    highco2:  { unit: 0, key: 'co2',  target: 5800, text: 'High CO₂ on Incubator 01' },
    power:    { power: true, text: 'Utility power failure' },
    sensor:   { unit: 3, key: 'hum',  fault: true,  text: 'Humidity sensor fault on Incubator 04' },
    comms:    { comms: true, text: 'Communication failure' },
  };

  // ---------- State ----------
  const units = [0, 1, 2, 3].map(i => ({
    id: `INC-0${i + 1}`, name: `Incubator 0${i + 1}`,
    v: { temp: 37.5 + (i - 1.5) * 0.06, hum: 60 + (i - 1.5) * 0.8, co2: 3000 + (i - 1.5) * 60 },
    shown: {}, q: { temp: 'good', hum: 'good', co2: 'good' },
  }));
  const history = units.map(() => ({ t: [], temp: [], hum: [], co2: [] }));
  let alarms = [];
  let scenario = 'normal';
  let role = 'operator';
  let lastUpdate = null;
  let alarmSeq = 0;
  const ui = { view: 'overview', measure: 'temp', period: 1, chartAnim: true };

  // ---------- Helpers ----------
  const $ = s => document.querySelector(s);
  const fmtTime = (t, withDate, noSec) => new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ, hour: '2-digit', minute: '2-digit', ...(withDate ? { day: '2-digit', month: 'short' } : noSec ? {} : { second: '2-digit' }),
  }).format(t);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const level = (key, v) => {
    if (v == null) return 'na';
    const m = M[key];
    if (v > m.hi || v < m.lo) return 'critical';
    const band = (m.hi - m.sp) * 0.7;
    if (v > m.sp + band || v < m.sp - band) return 'warning';
    return 'normal';
  };

  // ---------- Seed 7 days of synthetic history (1-minute samples) ----------
  (function seed() {
    const now = Date.now(), start = now - 7 * 864e5;
    units.forEach((u, i) => {
      const h = history[i];
      const v = { temp: M.temp.sp, hum: M.hum.sp, co2: M.co2.sp };
      for (let t = start; t < now; t += 60e3) {
        const day = Math.sin((t / 864e5) * 2 * Math.PI + i);
        KEYS.forEach(k => {
          const m = M[k];
          v[k] += (m.sp + day * m.noise * 3 - v[k]) * 0.15 + gauss() * m.noise * 1.4;
        });
        // A few historic sensor dropouts appear as gaps
        const gap = (i === 3 && t > now - 30 * 3600e3 && t < now - 29.4 * 3600e3);
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
        const m = M[k];
        const target = sc.unit === i && sc.key === k && sc.target != null ? sc.target : m.sp;
        const pull = sc.unit === i && sc.key === k ? 0.18 : 0.12;
        u.v[k] += (target - u.v[k]) * pull + gauss() * m.noise;
        u.q[k] = sc.comms ? 'stale' : (sc.fault && sc.unit === i && sc.key === k ? 'bad' : 'good');
      });
      const h = history[i];
      h.t.push(now);
      KEYS.forEach(k => h[k].push(u.q[k] === 'good' ? +u.v[k].toFixed(3) : null));
    });
    lastUpdate = sc.comms ? lastUpdate : now;
    evaluateAlarms(now);
    render();
  }

  // ---------- Alarms ----------
  function evaluateAlarms(now) {
    const sc = SCENARIOS[scenario];
    const conditions = [];
    units.forEach((u, i) => {
      KEYS.forEach(k => {
        if (u.q[k] === 'bad') conditions.push({ key: `${u.id}:${k}:bad`, source: u.name, sev: 'warning', desc: `${M[k].label} sensor unavailable (quality BAD)` });
        else if (u.q[k] === 'good' && level(k, u.v[k]) === 'critical') {
          const high = u.v[k] > M[k].hi;
          conditions.push({ key: `${u.id}:${k}:${high ? 'hi' : 'lo'}`, source: u.name, sev: 'critical',
            desc: `${M[k].label} ${high ? 'above high' : 'below low'} limit (${high ? M[k].hi : M[k].lo} ${M[k].unit})` });
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
        toast(`${c.sev === 'critical' ? 'Critical' : 'Warning'}: ${c.source} — ${c.desc}`);
      }
    });
    alarms = alarms.slice(0, 60);
  }

  // ---------- Number tween ----------
  function tween(el, from, to, dp) {
    if (reduceMotion || from == null || Math.abs(to - from) < 1e-9) { el.textContent = to.toFixed(dp); return; }
    const t0 = performance.now(), dur = 650;
    cancelAnimationFrame(el._raf);
    const f = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (from + (to - from) * e).toFixed(dp);
      if (p < 1) el._raf = requestAnimationFrame(f);
    };
    el._raf = requestAnimationFrame(f);
  }

  // ---------- Overview ----------
  function buildUnits() {
    $('#units').innerHTML = units.map((u, i) => `
      <article class="unit" style="--i:${i}" id="card-${i}" aria-labelledby="uh-${i}">
        <header class="unit-head">
          <h2 id="uh-${i}">${u.name}<span class="id">${u.id}</span></h2>
          <span class="pill normal" data-status>NORMAL</span>
        </header>
        <div class="rows">
          ${KEYS.map(k => `
          <div class="row" data-k="${k}">
            <svg viewBox="0 0 24 24" aria-hidden="true">${M[k].icon}</svg>
            <div>
              <div class="label">${M[k].label}</div>
              <span class="reading"><span class="n">—</span><span class="u">${M[k].unit}</span></span>
              <svg class="spark" viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true"><path class="area" fill="${SERIES[i]}"/><path class="line" stroke="${SERIES[i]}"/></svg>
            </div>
            <div class="sp">Setpoint<b>${M[k].sp.toFixed(M[k].dp)} ${M[k].unit}</b>${M[k].lo}–${M[k].hi}</div>
          </div>`).join('')}
        </div>
        <div class="quality" data-quality>Synthetic · Good quality</div>
        <div data-alarm></div>
        <div class="unit-foot"><button class="btn btn-outline" data-details="${i}">View trends</button></div>
      </article>`).join('');
  }

  function sparkPath(vals, lo, hi) {
    let d = '', pen = false;
    const n = vals.length;
    vals.forEach((v, j) => {
      if (v == null) { pen = false; return; }
      const x = (j / (n - 1)) * 100, y = 24 - ((v - lo) / (hi - lo || 1)) * 22;
      d += `${pen ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; pen = true;
    });
    return d;
  }

  function renderUnits() {
    units.forEach((u, i) => {
      const card = $(`#card-${i}`);
      let worst = 'normal';
      KEYS.forEach(k => {
        const row = card.querySelector(`[data-k="${k}"]`);
        const reading = row.querySelector('.reading'), n = reading.querySelector('.n'), unitEl = reading.querySelector('.u');
        const ok = u.q[k] === 'good';
        const val = ok ? +u.v[k].toFixed(M[k].dp) : null;
        const lv = level(k, val);
        if (!ok) {
          reading.className = 'reading na'; n.textContent = 'Unavailable'; unitEl.hidden = true; u.shown[k] = null;
        } else {
          reading.className = 'reading' + (lv === 'critical' ? ' out' : '');
          unitEl.hidden = false;
          if (u.shown[k] !== val) {
            tween(n, u.shown[k], val, M[k].dp);
            if (u.shown[k] != null) { void reading.offsetWidth; reading.classList.add('tick'); }
            u.shown[k] = val;
          }
        }
        if (lv === 'critical') worst = 'critical';
        else if ((lv === 'warning' || u.q[k] === 'bad') && worst !== 'critical') worst = 'warning';
        // sparkline: last 15 minutes
        const h = history[i], vals = h[k].slice(-90);
        const nums = vals.filter(v => v != null);
        const lo = Math.min(...nums, M[k].sp - M[k].noise * 4), hi = Math.max(...nums, M[k].sp + M[k].noise * 4);
        const d = sparkPath(vals, lo, hi);
        row.querySelector('.line').setAttribute('d', d);
        row.querySelector('.area').setAttribute('d', d ? `${d}L100 26L0 26Z` : '');
      });
      const comms = SCENARIOS[scenario].comms;
      if (comms) worst = 'offline';
      const pill = card.querySelector('[data-status]');
      pill.className = `pill ${worst}`; pill.textContent = worst.toUpperCase();
      card.classList.toggle('is-critical', worst === 'critical');
      card.classList.toggle('is-warning', worst === 'warning');

      const qEl = card.querySelector('[data-quality]');
      const anyBad = KEYS.some(k => u.q[k] === 'bad');
      qEl.className = 'quality' + (comms || anyBad ? ' bad' : '');
      qEl.textContent = comms ? 'Synthetic · Stale data' : anyBad ? 'Synthetic · Sensor unavailable' : 'Synthetic · Good quality';

      const act = alarms.filter(a => a.active && a.source === u.name);
      const aEl = card.querySelector('[data-alarm]');
      const html = act.length ? `<div class="alarm-ctx ${act[0].sev === 'warning' ? 'warn' : ''}">${act.length} active alarm${act.length > 1 ? 's' : ''} · ${act.some(a => !a.acked) ? 'unacknowledged' : 'acknowledged'}</div>` : '';
      if (aEl.innerHTML !== html) aEl.innerHTML = html;
    });

    const counts = { normal: 0, warning: 0, critical: 0, offline: 0 };
    document.querySelectorAll('[data-status]').forEach(p => counts[p.textContent.toLowerCase()]++);
    $('#summary').innerHTML = Object.entries(counts).filter(([, c]) => c).map(([k, c]) => `<span class="pill ${k}">${c} ${k.toUpperCase()}</span>`).join('');
  }

  // ---------- Facility ----------
  let upsPct = 100;
  function renderFacility() {
    const sc = SCENARIOS[scenario];
    upsPct = sc.power ? Math.max(5, upsPct - 0.4) : Math.min(100, upsPct + 0.8);
    const item = (label, cls, text, extra = '') => `<li><span>${label}</span><span class="pill ${cls}">${text}</span>${extra}</li>`;
    const html = [
      item('Utility power', sc.power ? 'critical' : 'normal', sc.power ? 'LOST' : 'PRESENT'),
      item('UPS', sc.power ? 'warning' : 'normal', sc.power ? 'ON BATTERY' : 'ON MAINS',
        `<span class="meter" aria-label="UPS charge ${Math.round(upsPct)}%"><i style="width:${upsPct}%"></i></span><span class="muted small">${Math.round(upsPct)}%</span>`),
      item('PLC link', sc.comms ? 'critical' : 'offline', sc.comms ? 'LOST' : 'SIMULATED'),
      item('Gateway', sc.comms ? 'offline' : 'normal', sc.comms ? 'NO DATA' : 'HEARTBEAT OK'),
    ].join('');
    const el = $('#facility'); if (el._html !== html) { el.innerHTML = html; el._html = html; }
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
    // empty buckets (no samples) are marked undefined and dropped; bad-quality buckets stay null → gap
    return out.map(o => [o.t, o.c ? o.s / o.c : (o.bad ? null : undefined)]);
  }

  function drawChart(el, { key, hours, animate, legend }) {
    const m = M[key];
    const W = Math.max(320, el.clientWidth - 30), H = el.classList.contains('tall') ? (innerWidth <= 760 ? 260 : 340) : (innerWidth <= 760 ? 200 : 230);
    const pad = { l: 44, r: 92, t: 12, b: 26 };
    let n = Math.min(240, Math.max(60, Math.round(W / 4)));
    const raw = units.map((u, i) => bucket(i, key, hours, n));
    const keep = raw[0].map((_, b) => raw.some(r => r[b][1] !== undefined));
    const series = units.map((u, i) => ({ name: u.name, color: SERIES[i], pts: raw[i].filter((_, b) => keep[b]).map(([t, v]) => [t, v === undefined ? null : v]) }));
    n = series[0].pts.length;
    const vals = series.flatMap(s => s.pts.map(p => p[1])).filter(v => v != null);
    let lo = Math.min(...vals, m.sp), hi = Math.max(...vals, m.hi);
    if (key === 'hum') lo = Math.min(lo, m.lo);
    const span = hi - lo || 1; lo -= span * 0.08; hi += span * 0.08;
    const t0 = series[0].pts[0][0], t1 = series[0].pts[n - 1][0];
    const x = t => pad.l + ((t - t0) / (t1 - t0)) * (W - pad.l - pad.r);
    const y = v => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);

    const ticksY = 4, gy = [];
    for (let k = 0; k <= ticksY; k++) gy.push(lo + (hi - lo) * k / ticksY);
    const ticksX = innerWidth <= 760 ? 3 : 5, gx = [];
    for (let k = 0; k <= ticksX; k++) gx.push(t0 + (t1 - t0) * k / ticksX);

    const path = pts => { let d = '', pen = false; pts.forEach(([t, v]) => { if (v == null) { pen = false; return; } d += `${pen ? 'L' : 'M'}${x(t).toFixed(1)} ${y(v).toFixed(1)}`; pen = true; }); return d; };
    const limits = [{ v: m.hi, l: `High ${m.hi}` }].concat(key === 'hum' ? [{ v: m.lo, l: `Low ${m.lo}` }] : []);

    // direct end labels, nudged apart
    const ends = series.map((s, i) => { const last = [...s.pts].reverse().find(p => p[1] != null); return last ? { i, x: x(last[0]), y: y(last[1]), v: last[1] } : null; }).filter(Boolean);
    const lab = ends.map(e => ({ ...e, ly: e.y })).sort((a, b) => a.ly - b.ly);
    for (let k = 1; k < lab.length; k++) if (lab[k].ly - lab[k - 1].ly < 14) lab[k].ly = lab[k - 1].ly + 14;

    el.innerHTML = `
      ${legend ? `<ul class="legend">${series.map(s => `<li><i style="background:${s.color}"></i>${s.name}</li>`).join('')}<li><i style="background:var(--red);height:0;border-top:2px dashed var(--red)"></i>Limit</li></ul>` : ''}
      <svg class="plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="${m.label} for all incubators over the last ${hours} hours">
        <g class="grid">${gy.map(v => `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/>`).join('')}</g>
        <g class="axis">
          ${gy.map(v => `<text x="${pad.l - 8}" y="${y(v) + 4}" text-anchor="end">${v.toFixed(m.dp)}</text>`).join('')}
          ${gx.map(t => `<text x="${x(t)}" y="${H - 6}" text-anchor="middle">${fmtTime(t, hours > 24, true)}</text>`).join('')}
        </g>
        ${limits.map(L => `<line class="limit" x1="${pad.l}" x2="${W - pad.r}" y1="${y(L.v)}" y2="${y(L.v)}"/><text class="limit-label" x="${W - pad.r + 6}" y="${y(L.v) + 4}">${L.l}</text>`).join('')}
        ${series.map(s => `<path class="series${animate ? ' draw' : ''}" stroke="${s.color}" d="${path(s.pts)}"/>`).join('')}
        ${ends.map(e => `<circle class="end-dot" cx="${e.x}" cy="${e.y}" r="4" fill="${SERIES[e.i]}"/>`).join('')}
        ${lab.map(e => `<text class="end-label" x="${e.x + 8}" y="${e.ly + 4}">0${e.i + 1} · ${e.v.toFixed(m.dp)}</text>`).join('')}
        <g class="hover" visibility="hidden"><line class="cross" y1="${pad.t}" y2="${H - pad.b}"/>${series.map(s => `<circle class="hover-dot" r="4.5" fill="${s.color}"/>`).join('')}</g>
        <rect x="${pad.l}" y="${pad.t}" width="${W - pad.l - pad.r}" height="${H - pad.t - pad.b}" fill="transparent" stroke="none" class="hit"/>
      </svg>
      <div class="tip"></div>`;

    if (animate && !reduceMotion) el.querySelectorAll('.series.draw').forEach(p => p.style.setProperty('--len', Math.ceil(p.getTotalLength())));

    const svg = el.querySelector('svg'), tip = el.querySelector('.tip'), hov = el.querySelector('.hover');
    const move = ev => {
      const r = svg.getBoundingClientRect();
      const px = (ev.clientX - r.left) * (W / r.width);
      const idx = Math.max(0, Math.min(n - 1, Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (n - 1))));
      const t = series[0].pts[idx][0];
      hov.setAttribute('visibility', 'visible');
      hov.querySelector('line').setAttribute('x1', x(t)); hov.querySelector('line').setAttribute('x2', x(t));
      hov.querySelectorAll('circle').forEach((c, i) => {
        const v = series[i].pts[idx][1];
        c.setAttribute('visibility', v == null ? 'hidden' : 'visible');
        if (v != null) { c.setAttribute('cx', x(t)); c.setAttribute('cy', y(v)); }
      });
      tip.innerHTML = `<div class="t">${fmtTime(t, true)}</div>` + series.map(s => {
        const v = s.pts[idx][1];
        return `<div class="r"><span><i style="background:${s.color}"></i>${s.name}</span><b>${v == null ? 'Unavailable' : v.toFixed(m.dp) + ' ' + m.unit}</b></div>`;
      }).join('');
      const tx = (x(t) / W) * r.width + 15;
      tip.style.left = `${Math.min(tx + 16, r.width - 170)}px`;
      tip.style.top = `${18}px`;
      tip.classList.add('on');
    };
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerleave', () => { hov.setAttribute('visibility', 'hidden'); tip.classList.remove('on'); });
    return series;
  }

  // ---------- Trends ----------
  function renderTrends(animate) {
    const series = drawChart($('#bigChart'), { key: ui.measure, hours: ui.period, animate, legend: true });
    const m = M[ui.measure];
    $('#statsTable').innerHTML = `<thead><tr><th>Incubator</th><th class="num">Min</th><th class="num">Mean</th><th class="num">Max</th><th class="num">Latest</th><th class="num">Unavailable</th></tr></thead><tbody>` +
      series.map(s => {
        const v = s.pts.map(p => p[1]).filter(x => x != null);
        const f = x => x == null ? '—' : `${x.toFixed(m.dp)} ${m.unit}`;
        const last = [...s.pts].reverse().find(p => p[1] != null);
        const gaps = s.pts.length - v.length;
        return `<tr><td><span class="sev" style="color:${s.color}"></span> ${s.name}</td><td class="num">${f(v.length ? Math.min(...v) : null)}</td><td class="num">${f(v.length ? v.reduce((a, b) => a + b, 0) / v.length : null)}</td><td class="num">${f(v.length ? Math.max(...v) : null)}</td><td class="num">${f(last && last[1])}</td><td class="num">${gaps ? `${Math.round(100 * gaps / s.pts.length)}%` : '0%'}</td></tr>`;
      }).join('') + '</tbody>';
  }

  // ---------- Alarm views ----------
  function renderAlarms() {
    const canAck = true; // every demo role may acknowledge
    const rows = alarms.map(a => `
      <tr class="${a.fresh ? 'new' : ''}">
        <td>${fmtTime(a.time, true)}</td><td>${esc(a.source)}</td><td>${esc(a.desc)}</td>
        <td><span class="sev ${a.sev}">${a.sev.toUpperCase()}</span></td>
        <td>${a.active ? 'Active' : `Cleared ${fmtTime(a.cleared)}`} · <span class="ack ${a.acked ? 'yes' : 'no'}">${a.acked ? 'Acknowledged' : 'Unacknowledged'}</span></td>
        <td>${!a.acked && canAck ? `<button class="btn btn-sm" data-ack="${a.id}">Acknowledge</button>` : ''}</td>
      </tr>`).join('');
    const body = $('#ledger');
    const next = rows || `<tr><td colspan="6" class="empty">No alarms recorded in this session. An empty list does not confirm normal conditions.</td></tr>`;
    if (body._html !== next) { body.innerHTML = next; body._html = next; }

    const active = alarms.filter(a => a.active);
    const mini = active.slice(0, 5).map(a => `<li class="${a.fresh ? '' : 'old'}"><span class="sev ${a.sev}">${a.sev === 'critical' ? 'CRIT' : 'WARN'}</span><span>${esc(a.source)} — ${esc(a.desc)}</span><span class="when">${fmtTime(a.time)}</span></li>`).join('');
    const miniHtml = mini || `<li class="empty">No active alarms. Unavailable data would not confirm normal conditions.</li>`;
    const ml = $('#miniLedger'); if (ml._html !== miniHtml) { ml.innerHTML = miniHtml; ml._html = miniHtml; }
    alarms.forEach(a => { a.fresh = false; });

    const unacked = alarms.filter(a => !a.acked && a.active).length;
    const nc = $('#navCount'); nc.hidden = !unacked; nc.textContent = unacked;
  }

  function renderSystem() {
    const samples = history.reduce((s, h) => s + h.t.length * 3, 0);
    const sc = SCENARIOS[scenario];
    $('#diag').innerHTML = `
      <dt>Data source</dt><dd>Browser simulation (synthetic)</dd>
      <dt>PLC link</dt><dd>${sc.comms ? '<span class="sev critical">LOST (simulated)</span>' : 'Not connected — simulation only'}</dd>
      <dt>Active scenario</dt><dd>${sc.text}</dd>
      <dt>Poll interval</dt><dd>${TICK_MS / 1000} s</dd>
      <dt>Samples held</dt><dd>${samples.toLocaleString('en-GB')}</dd>
      <dt>Time zone</dt><dd>${TZ}</dd>`;
    document.querySelectorAll('#scenarios .btn').forEach(b => {
      b.disabled = role !== 'administrator';
      b.classList.toggle('active', b.dataset.s === scenario);
      b.setAttribute('aria-pressed', b.dataset.s === scenario);
    });
    $('#scenarioHint').textContent = role === 'administrator' ? 'Select a scenario. Readings drift toward it over the next few updates.' : 'Switch the role to Administrator to change scenarios.';
  }

  // ---------- Render loop ----------
  function render() {
    renderUnits();
    renderAlarms();
    renderFacility();
    if (ui.view === 'overview') drawChart($('#miniChart'), { key: 'temp', hours: 1, animate: ui.chartAnim, legend: false });
    if (ui.view === 'trends') renderTrends(ui.chartAnim);
    if (ui.view === 'system') renderSystem();
    ui.chartAnim = false;

    $('#updated').textContent = lastUpdate ? fmtTime(lastUpdate) : '—';
    $('#connAlert').hidden = !SCENARIOS[scenario].comms;
    const ring = document.querySelector('.ring');
    ring.classList.remove('run'); void ring.getBoundingClientRect(); ring.classList.add('run');
  }

  // ---------- Navigation ----------
  function go(view, focus = true) {
    ui.view = view; ui.chartAnim = true;
    document.querySelectorAll('.nav-item').forEach(b => b.toggleAttribute('aria-current', b.dataset.view === view) || b.removeAttribute('aria-current'));
    document.querySelectorAll('.nav-item').forEach(b => { if (b.dataset.view === view) b.setAttribute('aria-current', 'page'); });
    document.querySelectorAll('.view').forEach(v => {
      const on = v.id === `view-${view}`;
      v.hidden = !on;
      if (on) { v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter'); }
    });
    $('#crumb').textContent = { overview: 'Overview', trends: 'Trends', alarms: 'Alarms', system: 'System' }[view];
    closeDrawer();
    render();
    if (focus) $('#main').focus({ preventScroll: true });
    scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function openDrawer() { $('#rail').classList.add('open'); $('#scrim').hidden = false; $('#menuBtn').setAttribute('aria-expanded', 'true'); $('.shell').inert = true; $('#rail .nav-item').focus(); }
  function closeDrawer() { $('#rail').classList.remove('open'); $('#scrim').hidden = true; $('#menuBtn').setAttribute('aria-expanded', 'false'); $('.shell').inert = false; }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 3800);
  }

  function exportCsv() {
    const end = Date.now(), start = end - ui.period * 3600e3;
    const lines = ['timestamp_utc,incubator,measurement,value,unit,quality,source'];
    history.forEach((h, i) => {
      for (let j = 0; j < h.t.length; j++) {
        if (h.t[j] < start) continue;
        KEYS.forEach(k => lines.push(`${new Date(h.t[j]).toISOString()},${units[i].id},${k},${h[k][j] ?? ''},${M[k].unit},${h[k][j] == null ? 'BAD' : 'GOOD'},SIMULATED`));
      }
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    a.download = `incubator-simulated-${ui.period}h.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(`Exported ${lines.length - 1} simulated samples`);
  }

  // ---------- Events ----------
  document.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.view) go(t.dataset.view);
    else if (t.dataset.goto) go(t.dataset.goto);
    else if (t.dataset.details) { go('trends'); }
    else if (t.dataset.ack) {
      const a = alarms.find(x => x.id === +t.dataset.ack);
      if (a) { a.acked = true; toast(`Acknowledged by ${role} — condition remains ${a.active ? 'active' : 'cleared'}`); renderAlarms(); renderUnits(); }
    } else if (t.dataset.s && role === 'administrator') {
      scenario = t.dataset.s; toast(`Scenario: ${SCENARIOS[scenario].text} (simulated)`); renderSystem();
    } else if (t.dataset.m || t.dataset.p) {
      const seg = t.parentElement;
      seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === t));
      if (t.dataset.m) ui.measure = t.dataset.m; else ui.period = +t.dataset.p;
      renderTrends(true);
    } else if (t.id === 'exportCsv') exportCsv();
    else if (t.id === 'menuBtn') openDrawer();
  });
  $('#scrim').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#rail').classList.contains('open')) { closeDrawer(); $('#menuBtn').focus(); } });
  $('#role').addEventListener('change', e => { role = e.target.value; toast(`Role: ${e.target.selectedOptions[0].text} (demo control, not authentication)`); renderSystem(); });
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(render, 150); });

  // ---------- Start ----------
  buildUnits();
  step();
  setInterval(step, TICK_MS);
})();
