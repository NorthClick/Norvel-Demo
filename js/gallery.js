/* ============================================================
   Norvel — gallery.js
   Galería filtrable + lightbox nativo (sin jQuery)
   ============================================================ */

(function () {
  'use strict';

  const grid        = document.getElementById('galleryGrid');
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCaption');
  const closeBtn    = document.getElementById('lightboxClose');
  const prevBtn     = document.getElementById('lightboxPrev');
  const nextBtn     = document.getElementById('lightboxNext');

  if (!grid) return;

  const items      = Array.from(grid.querySelectorAll('.gallery-item'));
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  let visibleItems = items.slice();
  let currentIndex = 0;

  /* ---- Filtrado por categoría ---- */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      visibleItems = [];

      items.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          visibleItems.push(item);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ---- Abrir lightbox ---- */
  function openLightbox(index) {
    if (!lightbox || index < 0 || index >= visibleItems.length) return;
    currentIndex = index;

    const item  = visibleItems[index];
    const img   = item.querySelector('img');
    const title = item.getAttribute('data-title') || '';

    lightboxImg.src = img ? img.src : '';
    lightboxImg.alt = img ? img.alt : title;
    if (lightboxCap) lightboxCap.textContent = title;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    openLightbox((currentIndex - 1 + visibleItems.length) % visibleItems.length);
  }

  function showNext() {
    openLightbox((currentIndex + 1) % visibleItems.length);
  }

  /* ---- Listeners de apertura ---- */
  items.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(visibleItems.indexOf(item));
      }
    });
  });

  /* ---- Listeners de navegación ---- */
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn)  prevBtn.addEventListener('click', showPrev);
  if (nextBtn)  nextBtn.addEventListener('click', showNext);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ---- Teclado ---- */
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

})();
