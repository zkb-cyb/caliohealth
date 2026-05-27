// ===================== NAV SCROLL =====================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ===================== MOBILE HAMBURGER =====================
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ===================== TRIAGE WIDGET =====================
(function () {
  const widget = document.getElementById('triage');
  if (!widget) return;

  const steps = widget.querySelectorAll('.wstep');
  const pips  = widget.querySelectorAll('.pip');
  let current = 0;

  function goTo(n) {
    steps[current].classList.remove('wstep-active');
    pips[current].classList.remove('pip-active');
    pips[current].classList.add('pip-done');
    current = n;
    steps[current].classList.add('wstep-active');
    pips[current].classList.add('pip-active');
  }

  function resetWidget() {
    steps[current].classList.remove('wstep-active');
    pips.forEach(p => p.classList.remove('pip-active', 'pip-done'));
    current = 0;
    steps[0].classList.add('wstep-active');
    pips[0].classList.add('pip-active');
    widget.querySelectorAll('.wchip').forEach(c => c.classList.remove('selected'));
  }

  widget.querySelectorAll('.wchip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.closest('.wchips').querySelectorAll('.wchip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const next = parseInt(chip.dataset.next, 10);
      setTimeout(() => goTo(next), 280);
    });
  });

  const restartBtn = document.getElementById('wrestart');
  if (restartBtn) restartBtn.addEventListener('click', resetWidget);
})();

// ===================== EAP CHECK =====================
const eapBtn = document.getElementById('eap-check-btn');
const eapInput = document.getElementById('eap-company');
if (eapBtn && eapInput) {
  eapBtn.addEventListener('click', () => {
    const val = eapInput.value.trim();
    if (!val) { eapInput.focus(); return; }
    eapBtn.textContent = 'Checking…';
    eapBtn.disabled = true;
    setTimeout(() => {
      eapBtn.textContent = '✓ Benefits Found!';
      eapBtn.style.background = '#3ECFAC';
      eapBtn.style.borderColor = '#3ECFAC';
      eapBtn.style.color = '#fff';
    }, 1400);
  });
}

// ===================== CONTACT FORM =====================
const fcForm   = document.getElementById('fc-form');
const fcSubmit = document.getElementById('fc-submit');
if (fcForm) {
  fcForm.addEventListener('submit', e => {
    e.preventDefault();
    fcSubmit.textContent = 'Finding your matches…';
    fcSubmit.disabled = true;
    setTimeout(() => {
      fcSubmit.textContent = '✓ We\'ll be in touch within the hour!';
      fcSubmit.style.background = '#3ECFAC';
      fcSubmit.style.borderColor = '#3ECFAC';
    }, 1600);
  });
}

// ===================== SCROLL FADE-IN =====================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

const animTargets = [
  '.step-card', '.service-card', '.testi-card', '.oc-card',
  '.eap-card', '.an-card', '.av-item', '.prov-list li', '.pay-list li',
  '.reassure-stats .rs-item'
];
animTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
});

// ===================== METRIC BARS ANIMATION =====================
const metricsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.pm-fill').forEach(bar => {
        const finalW = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bar.style.transition = 'width 1.4s ease';
            bar.style.width = finalW;
          });
        });
      });
      metricsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.pay-metrics').forEach(el => metricsObserver.observe(el));

// ===================== ACTIVE NAV HIGHLIGHT =====================
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) cur = s.id; });
  navAnchors.forEach(a => {
    const isActive = a.getAttribute('href') === '#' + cur;
    a.style.fontWeight = isActive ? '700' : '';
    a.style.color = isActive ? 'var(--violet-dark)' : '';
  });
}, { passive: true });
