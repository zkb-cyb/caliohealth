/* ============================================
   CalioHealth — script-rc.js
   Recovery.com-inspired directory site
   ============================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════
     SCROLL FADE-IN OBSERVER
  ══════════════════════════════════════════ */
  var fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  function registerFade(el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    el.classList.add('fade-in');
    fadeObserver.observe(el);
  }

  var fadeTargets = [
    '.cond-card', '.res-card', '.loc-card',
    '.stat-item', '.ins-logo-card',
    '.prov-visual', '.prov-content',
    '.quiz-card', '.pv-card',
    '.ins-left', '.ins-right',
  ];
  fadeTargets.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(registerFade);
  });


  /* ══════════════════════════════════════════
     NAV — scroll shadow
  ══════════════════════════════════════════ */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });


  /* ══════════════════════════════════════════
     HAMBURGER — mobile nav
  ══════════════════════════════════════════ */
  var hamburger  = document.getElementById('hamburger');
  var navLinks   = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') && !nav.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });


  /* ══════════════════════════════════════════
     SEARCH BAR — suggestions
  ══════════════════════════════════════════ */
  var SUGGESTIONS = [
    { label: 'Anxiety therapy near me',         tag: 'condition' },
    { label: 'Depression treatment',             tag: 'condition' },
    { label: 'Trauma & PTSD therapist',          tag: 'condition' },
    { label: 'Couples therapy',                  tag: 'condition' },
    { label: 'Therapists in California',         tag: 'location'  },
    { label: 'Therapists in New York',           tag: 'location'  },
    { label: 'Therapists in Texas',              tag: 'location'  },
    { label: 'Therapists accepting Aetna',       tag: 'condition' },
    { label: 'Therapists accepting BCBS',        tag: 'condition' },
    { label: 'Teen therapist near me',           tag: 'condition' },
    { label: 'OCD specialist',                   tag: 'condition' },
    { label: 'Addiction treatment centers',      tag: 'condition' },
    { label: 'Eating disorder specialist',       tag: 'condition' },
    { label: 'Virtual / telehealth therapy',     tag: 'location'  },
    { label: 'EMDR trauma therapist',            tag: 'condition' },
    { label: 'Grief counseling near me',         tag: 'condition' },
  ];

  var searchInput       = document.getElementById('search-input');
  var searchSuggestions = document.getElementById('search-suggestions');
  var sbSubmit          = document.getElementById('sb-submit');

  function buildSuggestions(query) {
    if (!query || query.length < 2) {
      searchSuggestions.classList.remove('show');
      searchSuggestions.innerHTML = '';
      return;
    }
    var q = query.toLowerCase();
    var matches = SUGGESTIONS.filter(function (s) {
      return s.label.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 6);

    if (matches.length === 0) {
      searchSuggestions.classList.remove('show');
      return;
    }

    searchSuggestions.innerHTML = matches.map(function (s) {
      return (
        '<button class="ss-item">' +
          '<span class="ss-tag ' + s.tag + '">' + (s.tag === 'condition' ? 'Condition' : 'Location') + '</span>' +
          '<span>' + s.label + '</span>' +
        '</button>'
      );
    }).join('');

    searchSuggestions.classList.add('show');

    // Wire suggestion clicks
    searchSuggestions.querySelectorAll('.ss-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var label = item.querySelector('span:last-child').textContent;
        searchInput.value = label;
        searchSuggestions.classList.remove('show');
        searchInput.focus();
      });
    });
  }

  searchInput.addEventListener('input', function () {
    buildSuggestions(searchInput.value.trim());
  });

  searchInput.addEventListener('focus', function () {
    if (searchInput.value.trim().length >= 2) {
      buildSuggestions(searchInput.value.trim());
    }
  });

  // Hide suggestions on click outside
  document.addEventListener('click', function (e) {
    var wrap = document.querySelector('.search-bar-wrap');
    if (wrap && !wrap.contains(e.target)) {
      searchSuggestions.classList.remove('show');
    }
  });

  sbSubmit.addEventListener('click', function () {
    var val = searchInput.value.trim();
    if (!val) {
      searchInput.focus();
      searchInput.style.outline = '2px solid #EF4444';
      setTimeout(function () { searchInput.style.outline = ''; }, 1400);
      return;
    }
    // Simulate search — scroll to conditions
    document.getElementById('conditions').scrollIntoView({ behavior: 'smooth', block: 'start' });
    searchSuggestions.classList.remove('show');
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') sbSubmit.click();
    if (e.key === 'Escape') { searchSuggestions.classList.remove('show'); }
  });

  // Quick filter chips
  document.querySelectorAll('.ql-chip').forEach(function (chip) {
    chip.addEventListener('click', function (e) {
      e.preventDefault();
      searchInput.value = chip.textContent;
      sbSubmit.click();
    });
  });


  /* ══════════════════════════════════════════
     MATCHING QUIZ — 3-step flow
  ══════════════════════════════════════════ */
  var step        = 1;
  var q1Answers   = [];
  var q2Answer    = null;

  var steps       = document.querySelectorAll('.qs-item');
  var lines       = document.querySelectorAll('.qs-line');

  // Step panels
  var panel1      = document.getElementById('quiz-step-1');
  var panel2      = document.getElementById('quiz-step-2');
  var panel3      = document.getElementById('quiz-step-3');
  var panelResult = document.getElementById('quiz-result');

  // Step 1
  var q1Chips     = document.querySelectorAll('#q1-chips .qc-chip');
  var q1Next      = document.getElementById('q1-next');

  q1Chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.classList.toggle('selected');
      var val = chip.dataset.val;
      var idx = q1Answers.indexOf(val);
      if (idx === -1) { q1Answers.push(val); }
      else { q1Answers.splice(idx, 1); }
      q1Next.disabled = q1Answers.length === 0;
    });
  });

  q1Next.addEventListener('click', function () {
    if (q1Answers.length === 0) return;
    goToStep(2);
  });

  // Step 2
  var q2Back      = document.getElementById('q2-back');
  var q2Next      = document.getElementById('q2-next');
  var q2Opts      = document.querySelectorAll('.q2-opt');

  q2Opts.forEach(function (opt) {
    var radio = opt.querySelector('input[type="radio"]');
    if (radio) {
      radio.addEventListener('change', function () {
        q2Answer = radio.value;
        q2Next.disabled = false;
      });
    }
  });

  q2Back.addEventListener('click', function () { goToStep(1); });
  q2Next.addEventListener('click', function () {
    if (!q2Answer) return;
    goToStep(3);
  });

  // Step 3
  var q3Back       = document.getElementById('q3-back');
  var q3Submit     = document.getElementById('q3-submit');
  var q3Yes        = document.getElementById('q3-yes');
  var q3Oop        = document.getElementById('q3-oop');
  var q3Eap        = document.getElementById('q3-eap');
  var q3InsSelect  = document.getElementById('q3-ins-select');

  q3Yes.addEventListener('click', function () {
    q3Yes.classList.add('active');
    q3Oop.classList.remove('active');
    q3Eap.classList.remove('active');
    q3InsSelect.classList.add('show');
  });
  q3Oop.addEventListener('click', function () {
    q3Oop.classList.add('active');
    q3Yes.classList.remove('active');
    q3Eap.classList.remove('active');
    q3InsSelect.classList.remove('show');
  });
  q3Eap.addEventListener('click', function () {
    q3Eap.classList.add('active');
    q3Yes.classList.remove('active');
    q3Oop.classList.remove('active');
    q3InsSelect.classList.remove('show');
  });

  q3Back.addEventListener('click', function () { goToStep(2); });
  q3Submit.addEventListener('click', function () {
    goToStep(4);
  });

  function goToStep(n) {
    step = n;

    // Update step indicators
    steps.forEach(function (s, i) {
      var sNum = i + 1;
      s.classList.remove('active', 'done');
      if (sNum === n) { s.classList.add('active'); }
      else if (sNum < n) { s.classList.add('done'); }
    });

    // Update lines
    lines.forEach(function (line, i) {
      line.classList.toggle('done', i + 1 < n);
    });

    // Show correct panel
    panel1.classList.add('hidden');
    panel2.classList.add('hidden');
    panel3.classList.add('hidden');
    panelResult.classList.add('hidden');

    if (n === 1) { panel1.classList.remove('hidden'); }
    else if (n === 2) { panel2.classList.remove('hidden'); }
    else if (n === 3) { panel3.classList.remove('hidden'); }
    else if (n === 4) { panelResult.classList.remove('hidden'); }
  }


  /* ══════════════════════════════════════════
     CONDITION CARDS — hover accent color on nav
  ══════════════════════════════════════════ */
  // Add aria labels to condition cards
  document.querySelectorAll('.cond-card').forEach(function (card) {
    var h3 = card.querySelector('h3');
    if (h3) card.setAttribute('aria-label', 'Find therapists for ' + h3.textContent);
  });


  /* ══════════════════════════════════════════
     SMOOTH ANCHOR SCROLLING — offset for nav
  ══════════════════════════════════════════ */
  var NAV_H = 64;

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - NAV_H;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ══════════════════════════════════════════
     LOCATION CARDS — subtle parallax tint on hover
  ══════════════════════════════════════════ */
  document.querySelectorAll('.loc-card').forEach(function (card) {
    var bg = card.querySelector('.lc-bg');
    if (!bg) return;
    card.addEventListener('mouseenter', function () {
      bg.style.transform = 'scale(1.06)';
    });
    card.addEventListener('mouseleave', function () {
      bg.style.transform = 'scale(1)';
    });
  });

})();
