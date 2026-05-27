// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Fade-up scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.outcome-card, .value-card, .feature-list li, .vc-step, .vc-item, .vc-metric').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Metric bar animation
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.metric-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.transition = 'width 1.2s ease'; bar.style.width = w; }, 200);
      });
      metricObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.vc-metrics').forEach(el => metricObserver.observe(el));

// ---- TRIAGE WIDGET ----
(function () {
  const widget = document.getElementById('triage-widget');
  if (!widget) return;

  const steps = widget.querySelectorAll('.tw-step');
  const pips  = widget.querySelectorAll('.tw-pip');
  let current = 0;

  function goTo(n) {
    steps[current].classList.remove('active');
    pips[current].classList.remove('active');
    pips[current].classList.add('done');
    current = n;
    steps[current].classList.add('active');
    pips[current].classList.add('active');
  }

  function reset() {
    steps[current].classList.remove('active');
    pips.forEach(p => { p.classList.remove('active', 'done'); });
    current = 0;
    steps[0].classList.add('active');
    pips[0].classList.add('active');
    widget.querySelectorAll('.tw-chip').forEach(c => c.classList.remove('selected'));
  }

  widget.querySelectorAll('.tw-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const siblings = chip.closest('.tw-chips').querySelectorAll('.tw-chip');
      siblings.forEach(s => s.classList.remove('selected'));
      chip.classList.add('selected');
      const next = parseInt(chip.dataset.next, 10);
      setTimeout(() => goTo(next), 320);
    });
  });

  const restartBtn = document.getElementById('tw-restart');
  if (restartBtn) restartBtn.addEventListener('click', reset);
})();

// Contact form (placeholder — wire to backend)
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Thank you! We\'ll be in touch soon.';
  btn.disabled = true;
  btn.style.background = '#6BAF92';
  btn.style.borderColor = '#6BAF92';
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.fontWeight = a.getAttribute('href') === '#' + current ? '700' : '';
  });
}, { passive: true });
