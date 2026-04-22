/* ================================================
   GENTLEMEN'S BARBER — MAIN SCRIPT
   ================================================ */

(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const isHomePage = !!document.getElementById('home');


  /* ---------- Navbar scroll effect ---------- */
  function handleScroll() {
    if (!isHomePage) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (isHomePage) {
    handleScroll();
  } else {
    // Inner pages: navbar always shows with background
    navbar.classList.add('scrolled');
  }


  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = themeToggle ? themeToggle.querySelector('i') : null;
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  // Apply saved theme (also set icon to match)
  setTheme(localStorage.getItem('theme') || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }


  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });


  /* ---------- Scroll reveal for [data-reveal] ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


  /* ---------- Service cards staggered reveal ---------- */
  const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.index, 10) || 0;
        setTimeout(() => entry.target.classList.add('revealed'), index * 90);
        serviceObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.dataset.index = i;
    serviceObserver.observe(card);
  });


  /* ---------- Testimonial cards staggered reveal ---------- */
  const testObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.tIndex, 10) || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 120);
        testObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.testimonial-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    card.dataset.tIndex = i;
    testObserver.observe(card);
  });


  /* ---------- Active nav link ---------- */
  const navLinks = document.querySelectorAll('.nav-links a');

  if (isHomePage) {
    // Scroll-based active state on home page
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
  } else {
    // URL-based active state on inner pages
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === currentFile);
    });
  }


  /* ---------- Smooth scroll for same-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ---------- Gallery image lazy load fade ---------- */
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => { img.style.opacity = '1'; });
    }
  });

})();
