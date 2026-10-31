/* ============================================================
   Norvel — main.js
   Navbar, hamburger, scroll reveal, contadores, formulario
   ============================================================ */

(function () {
  'use strict';

  /* ---- Page Loader ---- */
  var loader = document.getElementById('page-loader');
  if (loader) {
    var minDisplay = 1400; // ms mínimo visible para que la animación complete
    var loadedAt   = Date.now();

    function hideLoader() {
      var elapsed = Date.now() - loadedAt;
      var delay   = Math.max(0, minDisplay - elapsed);
      setTimeout(function () {
        loader.classList.add('hidden');
        loader.addEventListener('transitionend', function () {
          loader.remove();
        }, { once: true });
      }, delay);
    }

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader, { once: true });
      // Fallback: máximo 4 s en caso de recursos lentos
      setTimeout(hideLoader, 4000);
    }
  }

  /* ---- Navbar: transparente → sólido al hacer scroll ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const solidThreshold = 80;

    function updateNavbar() {
      if (window.scrollY > solidThreshold) {
        navbar.classList.remove('navbar--transparent');
        navbar.classList.add('navbar--solid');
      } else {
        navbar.classList.remove('navbar--solid');
        navbar.classList.add('navbar--transparent');
      }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  /* ---- Hamburger menu ---- */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {

    function openMenu() {
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.style.display = 'none';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.overscrollBehavior = 'none';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.style.display = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
      document.body.style.overscrollBehavior = '';
      if (navbar) updateNavbar();
    }

    hamburger.addEventListener('click', function () {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Cerrar menú al hacer clic en enlace o botón cerrar
    mobileMenu.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) closeMenu();
    });

    // Cerrar menú cuando el viewport pasa a desktop (zoom-out, resize)
    var desktopMQ = window.matchMedia('(min-width: 1101px)');
    desktopMQ.addEventListener('change', function (e) {
      if (e.matches) closeMenu();
    });
  }

  /* ---- Scroll Reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- Counter Animation ---- */
  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-target'), 10);
    const suffix  = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const step     = 16;
    const steps    = Math.floor(duration / step);
    let current    = 0;

    const timer = setInterval(function () {
      current++;
      const value = Math.round((current / steps) * target);
      el.textContent = value + suffix;
      if (current >= steps) {
        el.textContent = target + suffix;
        clearInterval(timer);
      }
    }, step);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* ---- Formulario de contacto (Formspree AJAX) ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const submitBtn  = document.getElementById('submitBtn');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg   = document.getElementById('formError');

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Validación básica
      const requiredFields = contactForm.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#ef4444';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;

      submitBtn.disabled    = true;
      submitBtn.textContent = 'Enviando…';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          contactForm.reset();
          if (successMsg) { successMsg.classList.add('success'); successMsg.style.display = 'block'; }
          if (errorMsg)   { errorMsg.style.display = 'none'; }
        } else {
          throw new Error('Error en el servidor');
        }
      } catch (_err) {
        if (errorMsg)   { errorMsg.style.display = 'block'; }
        if (successMsg) { successMsg.style.display = 'none'; }
      } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Enviar mensaje';
      }
    });

    // Limpiar estilo de error al escribir
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.style.borderColor = '';
      });
    });
  }

  /* ---- WhatsApp widget minimizar ---- */
  var waWidget = document.getElementById('whatsappWidget');
  var waToggle = document.getElementById('whatsappToggle');
  if (waWidget && waToggle) {
    if (localStorage.getItem('wa-minimized') === '1') {
      waWidget.classList.add('minimized');
      waToggle.setAttribute('aria-label', 'Mostrar WhatsApp');
    }
    waToggle.addEventListener('click', function () {
      waWidget.classList.toggle('minimized');
      var isMin = waWidget.classList.contains('minimized');
      localStorage.setItem('wa-minimized', isMin ? '1' : '0');
      waToggle.setAttribute('aria-label', isMin ? 'Mostrar WhatsApp' : 'Minimizar WhatsApp');
    });
  }

  /* ---- Marcar enlace activo en navbar según página actual ---- */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.navbar__nav a, .navbar__mobile a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace(/^\//, ''))) {
      link.classList.add('active');
    }
  });

})();
