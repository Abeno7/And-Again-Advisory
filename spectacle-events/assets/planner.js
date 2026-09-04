/* ══════════════════════════════════════════════════════════════
   Spectacle Events® — Event Planner (plan-event.html)
   Five-step brief builder with validation, draft saving, and
   submission to Spectacle Events.

   SUBMISSION
   ----------
   Set PLAN_ENDPOINT below to a URL that accepts a JSON POST
   (a Formspree / Web3Forms / Getform endpoint, or your own API
   route) and briefs are delivered straight to your inbox.
   Leave it empty and the planner falls back to opening the
   visitor's mail client with the full brief pre-composed and
   addressed to PLAN_EMAIL — no backend required.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PLAN_ENDPOINT = '';                        // e.g. 'https://formspree.io/f/xxxxxxx'
  var PLAN_EMAIL    = 'info@spectacleevent.com';
  var DRAFT_KEY     = 'spectacle-plan-draft-v1';

  var form = document.getElementById('planForm');
  if (!form) return;

  var panes    = Array.prototype.slice.call(form.querySelectorAll('.pane'));
  var steps    = Array.prototype.slice.call(form.querySelectorAll('.pstep'));
  var bar      = document.getElementById('planBar');
  var note     = document.getElementById('planNote');
  var btnNext  = document.getElementById('btnNext');
  var btnBack  = document.getElementById('btnBack');
  var stage    = document.getElementById('planStage');
  var done     = document.getElementById('planDone');
  var review   = document.getElementById('reviewGrid');
  var TOTAL    = panes.length;
  var step     = 1;
  var lastBrief = '';

  /* ── field labels used in the review + email ── */
  var LABELS = [
    ['eventType',   'Event type'],
    ['eventName',   'Event name'],
    ['format',      'Format'],
    ['startDate',   'Preferred date'],
    ['altDate',     'Alternate date'],
    ['duration',    'Duration'],
    ['city',        'City / country'],
    ['venue',       'Venue'],
    ['guests',      'Expected attendance'],
    ['budget',      'Indicative budget'],
    ['services',    'Core services'],
    ['addons',      'Production add-ons'],
    ['languages',   'Languages required'],
    ['firstName',   'First name'],
    ['lastName',    'Last name'],
    ['email',       'Email'],
    ['phone',       'Phone / WhatsApp'],
    ['organization','Organization'],
    ['role',        'Role'],
    ['contactPref', 'Preferred contact'],
    ['source',      'Heard about us via'],
    ['message',     'Additional notes']
  ];

  /* ══════════ helpers ══════════ */
  function val(name) {
    var el = form.querySelector('[name="' + name + '"]');
    if (!el) return '';
    if (el.type === 'radio') {
      var picked = form.querySelector('[name="' + name + '"]:checked');
      return picked ? picked.value : '';
    }
    return (el.value || '').trim();
  }

  function multi(name) {
    return Array.prototype.slice
      .call(form.querySelectorAll('[name="' + name + '"]:checked'))
      .map(function (el) { return el.value; });
  }

  function isMulti(name) {
    var el = form.querySelector('[name="' + name + '"]');
    return !!el && el.type === 'checkbox' && name !== 'consent';
  }

  function get(name) { return isMulti(name) ? multi(name) : val(name); }

  function prettyDate(v) {
    if (!v) return '';
    var d = new Date(v + 'T00:00:00');
    if (isNaN(d.getTime())) return v;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function display(name) {
    var v = get(name);
    if (Array.isArray(v)) return v.join(', ');
    if (name === 'startDate' || name === 'altDate') return prettyDate(v);
    return v;
  }

  /* ══════════ selection chrome (cards + chips) ══════════ */
  function syncSelectable() {
    form.querySelectorAll('.opt, .chip').forEach(function (el) {
      var input = el.querySelector('input');
      if (input) el.classList.toggle('sel', input.checked);
    });
  }

  form.addEventListener('change', function () {
    syncSelectable();
    updateSummary();
    saveDraft();
  });

  /* keyboard support for the label-wrapped cards */
  form.querySelectorAll('.opt, .chip').forEach(function (el) {
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var input = el.querySelector('input');
        if (!input) return;
        if (input.type === 'radio') input.checked = true;
        else input.checked = !input.checked;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  /* ══════════ live summary ══════════ */
  function updateSummary() {
    document.querySelectorAll('[data-sum]').forEach(function (el) {
      var key = el.dataset.sum;
      var text;
      if (key === 'servicesCount') {
        var n = multi('services').length + multi('addons').length;
        text = n ? n + ' selected' : '';
      } else {
        text = display(key);
      }
      el.textContent = text || (key === 'servicesCount' ? 'None yet' : 'Not set');
      el.classList.toggle('empty', !text);
    });
  }

  /* ══════════ validation ══════════ */
  var RULES = {
    1: [
      { name: 'eventType', group: 'g-type',   err: 'e-type' },
      { name: 'eventName', field: 'f-eventName' },
      { name: 'format',    group: 'g-format', err: 'e-format' }
    ],
    2: [
      { name: 'startDate', field: 'f-startDate' },
      { name: 'city',      field: 'f-city' },
      { name: 'guests',    field: 'f-guests' }
    ],
    3: [],
    4: [
      { name: 'firstName', field: 'f-firstName' },
      { name: 'lastName',  field: 'f-lastName' },
      { name: 'email',     field: 'f-email', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); } },
      { name: 'phone',     field: 'f-phone', test: function (v) { return v.replace(/[^\d]/g, '').length >= 7; } }
    ],
    5: []
  };

  function clearErrors(n) {
    (RULES[n] || []).forEach(function (r) {
      if (r.field) { var f = document.getElementById(r.field); if (f) f.classList.remove('err'); }
      if (r.group) { var g = document.getElementById(r.group); if (g) g.classList.remove('err'); }
      if (r.err)   { var e = document.getElementById(r.err);   if (e) e.style.display = 'none'; }
    });
  }

  function validate(n) {
    clearErrors(n);
    var firstBad = null;

    (RULES[n] || []).forEach(function (r) {
      var v = val(r.name);
      var ok = r.test ? (v && r.test(v)) : !!v;
      if (ok) return;
      if (r.field) { var f = document.getElementById(r.field); if (f) { f.classList.add('err'); firstBad = firstBad || f; } }
      if (r.group) { var g = document.getElementById(r.group); if (g) { g.classList.add('err'); firstBad = firstBad || g; } }
      if (r.err)   { var e = document.getElementById(r.err);   if (e) e.style.display = 'block'; }
    });

    if (n === 5) {
      var c = document.getElementById('consent');
      var ce = document.getElementById('e-consent');
      var okc = c && c.checked;
      if (ce) ce.style.display = okc ? 'none' : 'block';
      if (!okc) firstBad = firstBad || document.getElementById('f-consent');
    }

    if (firstBad) {
      firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var input = firstBad.querySelector('input,select,textarea');
      if (input && input.type !== 'radio' && input.type !== 'checkbox') setTimeout(function () { input.focus(); }, 300);
      return false;
    }
    return true;
  }

  /* ══════════ step navigation ══════════ */
  function show(n, scroll) {
    step = n;
    panes.forEach(function (p) { p.classList.toggle('on', +p.dataset.pane === n); });
    steps.forEach(function (s) {
      var i = +s.dataset.step;
      s.classList.toggle('active', i === n);
      s.classList.toggle('done', i < n);
    });
    bar.style.width = (n / TOTAL * 100) + '%';
    btnBack.disabled = n === 1;
    btnNext.innerHTML = n === TOTAL
      ? 'Submit to Spectacle <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'
      : 'Continue <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    note.textContent = 'Step ' + n + ' of ' + TOTAL + ' · your progress is saved on this device';
    if (n === TOTAL) buildReview();
    if (scroll !== false) {
      requestAnimationFrame(function () {
        var top = document.getElementById('planner');
        if (!top) return;
        var y = top.getBoundingClientRect().top + window.scrollY - 90;
        if (Math.abs(window.scrollY - y) > 4) window.scrollTo({ top: y, behavior: 'smooth' });
      });
    }
    saveDraft();
  }

  steps.forEach(function (s) {
    s.addEventListener('click', function () {
      var target = +s.dataset.step;
      if (target <= step) { show(target); return; }
      for (var i = step; i < target; i++) { if (!validate(i)) { show(i); return; } }
      show(target);
    });
  });

  btnBack.addEventListener('click', function () { if (step > 1) show(step - 1); });

  btnNext.addEventListener('click', function () {
    if (!validate(step)) return;
    if (step < TOTAL) { show(step + 1); return; }
    submit();
  });

  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      btnNext.click();
    }
  });

  /* ══════════ review ══════════ */
  function buildReview() {
    review.innerHTML = '';
    LABELS.forEach(function (pair) {
      var v = display(pair[0]);
      var row = document.createElement('div');
      row.className = 'rev-row';
      var k = document.createElement('div');
      k.className = 'rev-k';
      k.textContent = pair[1];
      var d = document.createElement('div');
      d.className = 'rev-v' + (v ? '' : ' empty');
      d.textContent = v || 'Not provided';
      row.appendChild(k); row.appendChild(d);
      review.appendChild(row);
    });
  }

  /* ══════════ payload ══════════ */
  function reference() {
    var d = new Date();
    var p = function (x) { return ('0' + x).slice(-2); };
    var rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'SPE-' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + rand;
  }

  function payload(ref) {
    var data = { reference: ref, submittedAt: new Date().toISOString(), source: 'spectacle-events website planner' };
    LABELS.forEach(function (pair) { data[pair[0]] = get(pair[0]); });
    data._subject = 'New event brief ' + ref + ' — ' + (val('eventName') || val('eventType') || 'Untitled event');
    return data;
  }

  function asText(ref) {
    var lines = ['SPECTACLE EVENTS — NEW EVENT BRIEF', 'Reference: ' + ref, ''];
    LABELS.forEach(function (pair) {
      var v = display(pair[0]);
      lines.push(pair[1] + ': ' + (v || '—'));
    });
    lines.push('', 'Submitted from spectacleevent.com event planner.');
    return lines.join('\n');
  }

  /* ══════════ submit ══════════ */
  function finish(ref, message) {
    lastBrief = asText(ref);
    document.getElementById('doneRef').textContent = ref;
    if (message) document.getElementById('doneMsg').textContent = message;
    stage.style.display = 'none';
    done.classList.add('on');
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
    var top = document.getElementById('planner');
    if (top) window.scrollTo({ top: top.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  }

  function submit() {
    var ref = reference();
    btnNext.disabled = true;
    btnNext.textContent = 'Sending…';

    if (PLAN_ENDPOINT) {
      fetch(PLAN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload(ref))
      }).then(function (r) {
        if (!r.ok) throw new Error('Request failed: ' + r.status);
        finish(ref);
      }).catch(function () {
        mailtoFallback(ref);
      }).then(function () {
        btnNext.disabled = false;
      });
      return;
    }

    mailtoFallback(ref);
    btnNext.disabled = false;
  }

  function mailtoFallback(ref) {
    var subject = 'New event brief ' + ref + ' — ' + (val('eventName') || val('eventType') || 'Untitled event');
    var href = 'mailto:' + PLAN_EMAIL +
               '?subject=' + encodeURIComponent(subject) +
               '&body=' + encodeURIComponent(asText(ref));
    window.location.href = href;
    finish(ref, 'Your brief is ready to send. Your email app has opened with the full details addressed to ' + PLAN_EMAIL + ' — press send and we’ll reply within one working day. If nothing opened, copy the summary below and email it to us directly.');
  }

  var btnCopy = document.getElementById('btnCopy');
  if (btnCopy) {
    btnCopy.addEventListener('click', function () {
      var text = lastBrief || '';
      var mark = function () {
        btnCopy.textContent = 'Copied to clipboard';
        setTimeout(function () { btnCopy.textContent = 'Copy brief summary'; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(mark, function () {});
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); mark(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }

  /* ══════════ draft persistence ══════════ */
  function saveDraft() {
    var d = { step: step, fields: {} };
    LABELS.forEach(function (pair) { d.fields[pair[0]] = get(pair[0]); });
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch (e) {}
  }

  function loadDraft() {
    var raw;
    try { raw = localStorage.getItem(DRAFT_KEY); } catch (e) { return; }
    if (!raw) return;
    var d;
    try { d = JSON.parse(raw); } catch (e) { return; }
    if (!d || !d.fields) return;

    Object.keys(d.fields).forEach(function (name) { setField(name, d.fields[name]); });
    if (d.step && d.step >= 1 && d.step <= TOTAL) step = d.step;
  }

  function setField(name, value) {
    if (Array.isArray(value)) {
      form.querySelectorAll('[name="' + name + '"]').forEach(function (el) {
        el.checked = value.indexOf(el.value) !== -1;
      });
      return;
    }
    if (!value) return;
    var el = form.querySelector('[name="' + name + '"]');
    if (!el) return;
    if (el.type === 'radio') {
      var picked = form.querySelector('[name="' + name + '"][value="' + value.replace(/"/g, '\\"') + '"]');
      if (picked) picked.checked = true;
      return;
    }
    el.value = value;
  }

  /* ══════════ deep link: plan-event.html?type=Gala%20Dinner%20%2F%20Awards ══════════ */
  function applyQuery() {
    var params = new URLSearchParams(window.location.search);
    var t = params.get('type');
    if (t) {
      var match = null;
      form.querySelectorAll('[name="eventType"]').forEach(function (el) {
        if (el.value.toLowerCase() === t.toLowerCase()) match = el;
      });
      if (match) match.checked = true;
    }
    var n = params.get('name');
    if (n) setField('eventName', n);
  }

  /* ══════════ character counter ══════════ */
  var msg = document.getElementById('message'), msgCount = document.getElementById('msgCount');
  if (msg && msgCount) {
    var count = function () { msgCount.textContent = msg.value.length; };
    msg.addEventListener('input', function () { count(); saveDraft(); });
    count();
  }
  form.addEventListener('input', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') { updateSummary(); saveDraft(); }
  });

  /* ══════════ boot ══════════ */
  loadDraft();
  applyQuery();
  syncSelectable();
  updateSummary();
  show(step, false);
})();
