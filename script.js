document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     1. Header Scroll Effect
     ===================================================== */
  const header = document.getElementById('header');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check

  /* =====================================================
     2. Mobile Menu Toggle
     ===================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);

      // Animate hamburger → X
      const lines = menuToggle.querySelectorAll('line');
      if (isOpen) {
        lines[0].setAttribute('y1', '12'); lines[0].setAttribute('y2', '12');
        lines[0].setAttribute('x1', '5');  lines[0].setAttribute('x2', '19');
        lines[0].style.transform = 'rotate(45deg)';
        lines[0].style.transformOrigin = 'center';
        lines[1].style.opacity = '0';
        lines[2].setAttribute('y1', '12'); lines[2].setAttribute('y2', '12');
        lines[2].setAttribute('x1', '5');  lines[2].setAttribute('x2', '19');
        lines[2].style.transform = 'rotate(-45deg)';
        lines[2].style.transformOrigin = 'center';
      } else {
        lines[0].setAttribute('y1', '7');  lines[0].setAttribute('y2', '7');
        lines[0].setAttribute('x1', '4');  lines[0].setAttribute('x2', '20');
        lines[0].style.transform = '';
        lines[1].style.opacity = '1';
        lines[2].setAttribute('y1', '17'); lines[2].setAttribute('y2', '17');
        lines[2].setAttribute('x1', '4');  lines[2].setAttribute('x2', '20');
        lines[2].style.transform = '';
      }
    });

    // Close on nav-link click (mobile)
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        // Reset hamburger icon
        const lines = menuToggle.querySelectorAll('line');
        lines[0].setAttribute('y1', '7');  lines[0].setAttribute('y2', '7');
        lines[0].setAttribute('x1', '4');  lines[0].setAttribute('x2', '20');
        lines[0].style.transform = '';
        lines[1].style.opacity = '1';
        lines[2].setAttribute('y1', '17'); lines[2].setAttribute('y2', '17');
        lines[2].setAttribute('x1', '4');  lines[2].setAttribute('x2', '20');
        lines[2].style.transform = '';
      });
    });
  }

  /* =====================================================
     3. FAQ Accordion
     ===================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* =====================================================
     4. Scroll Reveal
     ===================================================== */
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));

  // Immediate reveal for elements already visible on load
  requestAnimationFrame(() => {
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top <= window.innerHeight) {
        el.classList.add('active');
      }
    });
  });

  /* =====================================================
     5. Smooth Scroll (fallback for browsers without CSS)
     ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
