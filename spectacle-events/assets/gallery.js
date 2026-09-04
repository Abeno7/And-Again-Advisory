/* Spectacle Events® — gallery lightbox (gallery.html) */
(function () {
  'use strict';
  var items = Array.prototype.slice.call(document.querySelectorAll('.gal-item'));
  var lb = document.getElementById('lb');
  if (!items.length || !lb) return;

  var img = document.getElementById('lbImg');
  var count = document.getElementById('lbCount');
  var i = 0;

  function open(n) {
    i = (n % items.length + items.length) % items.length;
    var src = items[i].querySelector('img');
    img.src = src.getAttribute('src');
    img.alt = src.getAttribute('alt') || '';
    count.textContent = (i + 1) + ' / ' + items.length;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  items.forEach(function (el, n) {
    el.setAttribute('tabindex', '0');
    el.addEventListener('click', function () { open(n); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); }
    });
  });

  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); open(i - 1); });
  document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); open(i + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === img) close(); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(i - 1);
    if (e.key === 'ArrowRight') open(i + 1);
  });
})();
