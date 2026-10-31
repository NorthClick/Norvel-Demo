/* ============================================================
   Norvel — cms-helpers.js
   Helpers para renderizar contenido gestionado con Decap CMS.
   Se ejecuta en páginas que usan colecciones del CMS.
   ============================================================ */

(function () {
  'use strict';

  /* ---- Renderizar tarjetas de equipo desde JSON ---- */
  function renderTeamCards(members, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !Array.isArray(members)) return;

    container.innerHTML = members.map(function (m, i) {
      const initials = (m.name || 'NN')
        .split(' ')
        .slice(0, 2)
        .map(function (w) { return w[0]; })
        .join('');

      const delay = i % 3 === 1 ? 'reveal-delay-1' : i % 3 === 2 ? 'reveal-delay-2' : '';
      const photo = m.photo
        ? '<img src="' + m.photo + '" alt="Foto de ' + m.name + '" class="team-card__photo" loading="lazy">'
        : '<div class="team-card__photo-placeholder" aria-hidden="true">' + initials + '</div>';

      return (
        '<article class="team-card reveal ' + delay + '">' +
          photo +
          '<h4>' + (m.name  || 'Nombre del Perito') + '</h4>' +
          '<p class="team-card__role">' + (m.role  || 'Perito Ajustador') + '</p>' +
          '<p class="team-card__office">📍 ' + (m.office || 'Querétaro, QRO') + '</p>' +
          (m.email ? '<a href="mailto:' + m.email + '" class="team-card__email">' + m.email + '</a>' : '') +
        '</article>'
      );
    }).join('');
  }

  /* ---- Renderizar logo strip de aseguradoras ---- */
  function renderInsurerStrip(insurers, trackId) {
    const track = document.getElementById(trackId);
    if (!track || !Array.isArray(insurers)) return;

    const active = insurers.filter(function (ins) { return ins.active !== false; });
    // Duplicar para carrusel infinito
    const all = active.concat(active);

    track.innerHTML = all.map(function (ins) {
      return ins.logo
        ? '<img src="' + ins.logo + '" alt="' + ins.name + '" class="logo-strip__logo" loading="lazy">'
        : '<span class="logo-strip__text">' + ins.name + '</span>';
    }).join('');
  }

  /* ---- Renderizar galería de siniestros desde colección CMS ---- */
  function renderSinisterGallery(items, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid || !Array.isArray(items)) return;

    grid.innerHTML = items.map(function (item, i) {
      return (
        '<div class="gallery-item" data-category="' + (item.category || 'otros') + '" data-title="' + item.title + '" role="listitem" tabindex="0" aria-label="Ver foto: ' + item.title + '">' +
          '<img src="' + item.image + '" alt="' + item.title + '" loading="' + (i < 6 ? 'eager' : 'lazy') + '">' +
          '<div class="gallery-item__overlay">' +
            '<div class="gallery-item__category">' + (item.category || '') + '</div>' +
            '<div class="gallery-item__title">' + item.title + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  /* ---- Actualizar textos del hero desde CMS ---- */
  function applyHeroContent(content) {
    if (!content) return;
    const headline    = document.querySelector('.hero__title');
    const subheadline = document.querySelector('.hero__desc');
    if (headline    && content.headline)    headline.innerHTML    = content.headline;
    if (subheadline && content.subheadline) subheadline.textContent = content.subheadline;

    if (Array.isArray(content.stats)) {
      const statEls = document.querySelectorAll('.hero__stat-number');
      content.stats.forEach(function (stat, i) {
        if (statEls[i]) {
          statEls[i].setAttribute('data-target', stat.value || 0);
          statEls[i].setAttribute('data-suffix', stat.suffix || '');
        }
      });
    }
  }

  /* Exponer helpers globalmente para uso desde templates/scripts inline */
  window.SiteCms = {
    renderTeamCards:      renderTeamCards,
    renderInsurerStrip:   renderInsurerStrip,
    renderSinisterGallery: renderSinisterGallery,
    applyHeroContent:     applyHeroContent,
  };

})();
