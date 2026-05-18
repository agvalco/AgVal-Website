/* AgVal — site behaviors
   - Mobile nav toggle
   - Smooth scroll for in-page anchors
   - Reveal-on-scroll
   - Contact form: friendly client-side handling
*/

(function () {
  'use strict';

  // ---------- Mobile nav toggle ----------
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // close menu on link click (mobile)
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (links.classList.contains('open')) {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ---------- Smooth scroll (in-page) ----------
  // CSS handles scroll-behavior: smooth, but offset for sticky header:
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const header = document.querySelector('.site-header');
      const offset = header ? header.offsetHeight + 12 : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in-view'));
  }

  // ---------- Contact form ----------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      // Build a mailto fallback so the message can be delivered without backend setup.
      const subject = encodeURIComponent(`AgVal Quote Request — ${data.name || 'New inquiry'}`);
      const bodyLines = [
        `Name: ${data.name || ''}`,
        `Email: ${data.email || ''}`,
        `Phone: ${data.phone || ''}`,
        `Service Type: ${data.service || ''}`,
        `Property Address / County: ${data.property || ''}`,
        `Intended Use: ${data.purpose || ''}`,
        '',
        'Message:',
        data.message || ''
      ];
      const body = encodeURIComponent(bodyLines.join('\n'));
      const mailto = `mailto:agvalco@gmail.com?subject=${subject}&body=${body}`;

      // Show success message, then trigger the user's mail client
      const success = document.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      window.location.href = mailto;
      form.reset();
    });
  }

  // ---------- Set current year in footer ----------
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
