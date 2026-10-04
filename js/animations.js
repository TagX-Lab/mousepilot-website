/**
 * MousePilot by TAGX Labs™ — High-Performance 120 FPS Scroll & Animation Engine
 * Zero Wheel Hijacking • Hardware Accelerated Transitions • Cached Layout Offsets
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hardware Native Smooth Anchor Navigation (-85px offset for floating navbar)
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const mobileBackdrop = document.getElementById('mobileNavBackdrop');

  navLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - 85;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          if (mobileBackdrop && mobileBackdrop.classList.contains('open')) {
            mobileBackdrop.classList.remove('open');
          }
        }
      }
    });
  });

  // 2. Cached Section Offsets for Zero-Layout-Reflow ScrollSpy
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const spyLinks = document.querySelectorAll('.nav-link');
  let sectionCache = [];

  function recalculateOffsets() {
    sectionCache = sections.map((sec) => {
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.pageYOffset;
      return {
        id: sec.getAttribute('id'),
        top: top,
        bottom: top + rect.height
      };
    });
  }

  recalculateOffsets();
  window.addEventListener('resize', recalculateOffsets, { passive: true });

  // 3. RAF-Throttled Scroll Handler
  let isTicking = false;

  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(() => {
        const scrollPosition = window.pageYOffset + 120;
        let currentId = '';

        for (let i = 0; i < sectionCache.length; i++) {
          const s = sectionCache[i];
          if (scrollPosition >= s.top && scrollPosition < s.bottom) {
            currentId = s.id;
            break;
          }
        }

        if (currentId) {
          spyLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }

        isTicking = false;
      });
      isTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // 4. Staggered Intersection Observer (Hardware Accelerated)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
});
