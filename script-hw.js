/* ============================================
   CalioHealth — script-hw.js
   Headway-inspired patient site interactions
   ============================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════
     UTILITY: Scroll-fade observer
     Defined first so later modules can use it.
     Only fades elements below the fold — never
     flashes elements already visible on load.
  ══════════════════════════════════════════ */
  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  /** Register an element for fade-in only if it's below the fold. */
  function registerFade(el) {
    var rect = el.getBoundingClientRect();
    var alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return; // Leave elements in the initial viewport alone
    el.classList.add('fade-in');
    fadeObserver.observe(el);
  }

  // Wire up static page elements
  var fadeSelectors = [
    '.step-card',
    '.why-card',
    '.testi-card',
    '.section-header',
    '.ins-left',
    '.ins-right',
    '.eap-content',
    '.eap-visual',
    '.prov-left',
    '.prov-right',
    '.testi-stat-bar',
  ];
  fadeSelectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(registerFade);
  });


  /* ══════════════════════════════════════════
     NAV — scroll shadow
  ══════════════════════════════════════════ */
  var nav = document.getElementById('nav');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  /* ══════════════════════════════════════════
     HAMBURGER — mobile nav toggle
  ══════════════════════════════════════════ */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close menu when a nav link is tapped
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') && !nav.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });


  /* ══════════════════════════════════════════
     MATCH WIDGET — hero submit button
  ══════════════════════════════════════════ */
  var mwBtn = document.getElementById('mw-btn');

  // Maps the concern select value to a therapist filter tab
  var CONCERN_TO_FILTER = {
    'Anxiety':             'anxiety',
    'Depression':          'depression',
    'Trauma & PTSD':       'trauma',
    'Relationship issues': 'couples',
    'Grief & loss':        'all',
    'Life transitions':    'depression',
    'Stress & burnout':    'anxiety',
    'Self-esteem':         'all',
    'LGBTQ+ support':      'all',
    'Teen & adolescent':   'teen',
    'Not sure yet':        'all',
  };

  mwBtn.addEventListener('click', function () {
    var concern   = document.getElementById('mw-concern').value;
    var insurance = document.getElementById('mw-insurance').value;
    var original  = mwBtn.textContent;

    mwBtn.textContent = 'Finding your matches…';
    mwBtn.disabled    = true;

    setTimeout(function () {
      // Personalise the success message if the user picked an insurance plan
      var insMsg = (insurance && insurance !== "I'll pay out of pocket" && insurance !== 'Not sure')
        ? ' accepting ' + insurance
        : '';
      mwBtn.textContent = '✓ Therapists found' + insMsg + ' — see below';
      mwBtn.classList.add('success');
      mwBtn.disabled = false;

      // Activate the matching filter tab
      var filterTag = CONCERN_TO_FILTER[concern] || 'all';
      activateTherapistFilter(filterTag);

      // Smooth scroll to therapist grid
      var therapistsSection = document.getElementById('therapists');
      if (therapistsSection) {
        therapistsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Restore button after 5 s
      setTimeout(function () {
        mwBtn.textContent = original;
        mwBtn.classList.remove('success');
      }, 5000);

    }, 1300);
  });


  /* ══════════════════════════════════════════
     CONDITIONS DETAIL PANEL — chip clicks
  ══════════════════════════════════════════ */
  var CONDITIONS = {
    anxiety: {
      title: 'Anxiety',
      body:  'Anxiety is one of the most common and most treatable mental health conditions. Our CBT and mindfulness-trained therapists help you understand your anxiety patterns, build lasting coping tools, and reclaim your sense of calm — without waiting months for an appointment.',
    },
    depression: {
      title: 'Depression',
      body:  'Depression is more than feeling sad — it can drain your energy, disrupt sleep, and cloud your sense of self-worth. CalioHealth therapists use evidence-based approaches including CBT, behavioral activation, and interpersonal therapy to help you rediscover motivation and meaning.',
    },
    trauma: {
      title: 'Trauma & PTSD',
      body:  'Trauma changes how we experience the world. Our trauma-informed therapists use EMDR, CPT, and somatic approaches to help you safely process painful experiences, reduce distressing symptoms, and rebuild a genuine sense of safety in your body and your life.',
    },
    relationships: {
      title: 'Relationship Issues',
      body:  'Whether you’re navigating communication breakdowns, attachment wounds, or healing after betrayal — our therapists help individuals and couples rebuild trust, deepen intimacy, and break unhealthy cycles. You deserve relationships that nourish you.',
    },
    grief: {
      title: 'Grief & Loss',
      body:  'Grief doesn’t follow a schedule. Whether you’ve lost a person, a relationship, or a future you imagined — CalioHealth therapists provide compassionate, non-judgmental support to help you carry your loss while still moving forward.',
    },
    ocd: {
      title: 'OCD',
      body:  'OCD involves intrusive thoughts and compulsive behaviors that can quietly take over your life. Our ERP-trained therapists (Exposure and Response Prevention) deliver the gold-standard treatment for OCD — one of the most effective interventions in psychology.',
    },
    adhd: {
      title: 'ADHD',
      body:  'ADHD affects focus, time management, emotional regulation, and self-esteem. Our therapists help you build practical systems, challenge shame-based narratives, and work with your brain’s unique strengths — at work, in school, and in your closest relationships.',
    },
    bipolar: {
      title: 'Bipolar Disorder',
      body:  'Living with bipolar disorder requires specialized, consistent support. Our therapists collaborate with your psychiatric team to build mood stability, recognize early warning signs, and help you create a full, sustainable life between episodes.',
    },
    eating: {
      title: 'Eating Disorders',
      body:  'Eating disorders are serious and require expert, specialized care. CalioHealth connects you with therapists trained in FBT, CBT-E, and DBT for anorexia, bulimia, binge eating, and ARFID. We treat the whole person — not just the symptoms.',
    },
    addiction: {
      title: 'Addiction & Recovery',
      body:  'Recovery looks different for everyone. Our therapists are trained in motivational interviewing, CRAFT, and harm-reduction approaches. Whether you’re just starting out or navigating relapse, compassionate, shame-free support is available now.',
    },
    life: {
      title: 'Life Transitions',
      body:  'New job, divorce, graduation, parenthood, retirement — life’s pivots can shake your sense of who you are. Our therapists specialize in helping you navigate uncertainty, clarify your values, and build resilience through whatever comes next.',
    },
    stress: {
      title: 'Stress & Burnout',
      body:  'Chronic stress and burnout aren’t character flaws — they’re signals that something needs to change. Our therapists help you identify root causes, set meaningful boundaries, and redesign unsustainable patterns so you can reconnect with what matters.',
    },
    self: {
      title: 'Self-Esteem',
      body:  'Low self-esteem touches everything — how you work, love, and treat yourself. Through compassion-focused therapy, ACT, and schema work, our therapists help you challenge deeply held self-critical beliefs and build a kinder, more authentic relationship with yourself.',
    },
    lgbtq: {
      title: 'LGBTQ+ Support',
      body:  'CalioHealth connects LGBTQ+ individuals with affirming therapists who truly understand — identity exploration, coming out, family rejection, minority stress, and the joys and specific challenges of queer life. You deserve care from someone who genuinely gets it.',
    },
    teen: {
      title: 'Teen & Adolescent Therapy',
      body:  'Adolescence is formative and hard. Our teen-specialized therapists address anxiety, depression, social pressure, identity, ADHD, school stress, and family conflict in ways that actually connect with young people — not just talk at them.',
    },
    couples: {
      title: 'Couples Therapy',
      body:  'Healthy relationships take investment. Our Gottman-trained and EFT-certified couples therapists help partners rebuild trust, improve communication, repair after conflict, and deepen emotional intimacy — whether you’re in crisis or simply ready to grow.',
    },
    family: {
      title: 'Family Therapy',
      body:  'Families shape who we are — and sometimes need a reset. Our family therapists address communication breakdowns, parenting challenges, blended-family dynamics, and intergenerational patterns to help every member of your family thrive.',
    },
    sleep: {
      title: 'Sleep & Insomnia',
      body:  'Poor sleep makes everything harder. CBT-I (Cognitive Behavioral Therapy for Insomnia) is proven more effective than sleep medication for long-term results. Our trained therapists help you reset your sleep patterns without pills or perpetual exhaustion.',
    },
    anger: {
      title: 'Anger Management',
      body:  'Anger itself isn’t the problem — unmanaged anger is. Our therapists help you understand your triggers, challenge the beliefs that fuel explosive or suppressed anger, and build healthier expression skills before anger damages your relationships and wellbeing.',
    },
    phobias: {
      title: 'Phobias',
      body:  'Phobias — social, specific, or situational — can dramatically shrink your world. Graduated exposure therapy with a skilled CalioHealth therapist is among the most effective interventions in psychology, with most patients seeing major improvement in just a few weeks.',
    },
  };

  var chips    = document.querySelectorAll('.cond-chip');
  var cdDetail = document.getElementById('cond-detail');
  var cdTitle  = document.getElementById('cd-title');
  var cdBody   = document.getElementById('cd-body');
  var cdLink   = cdDetail ? cdDetail.querySelector('a.btn-primary') : null;

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      // Update active state
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');

      var data = CONDITIONS[chip.dataset.cond];
      if (!data || !cdDetail) return;

      // Cross-fade the detail panel
      cdDetail.style.transition = 'opacity .2s ease';
      cdDetail.style.opacity    = '0';

      setTimeout(function () {
        cdTitle.textContent = data.title;
        cdBody.textContent  = data.body;
        if (cdLink) {
          cdLink.textContent = 'Find a ' + data.title.toLowerCase() + ' therapist →';
        }
        cdDetail.style.opacity = '1';
      }, 200);
    });
  });


  /* ══════════════════════════════════════════
     THERAPIST GRID — data, render, filters
  ══════════════════════════════════════════ */
  var THERAPISTS = [
    {
      initials:    'SK',
      name:        'Dr. Sofia Kim',
      creds:       'PhD · Licensed Psychologist',
      avail:       'Available this week',
      bg:          '#EDE9FF',
      color:       '#7C6AF7',
      specialties: ['Anxiety', 'Trauma', 'CBT', 'Mindfulness'],
      insurance:   'Aetna, BCBS, Cigna',
      filters:     ['anxiety', 'trauma'],
    },
    {
      initials:    'MR',
      name:        'Marcus Reid',
      creds:       'LCSW · Licensed Clinical Social Worker',
      avail:       'Next opening: Mon',
      bg:          '#FFF0EC',
      color:       '#FF7C5C',
      specialties: ['Depression', 'Life Transitions', 'Grief'],
      insurance:   'Cigna, UHC, Humana',
      filters:     ['depression'],
    },
    {
      initials:    'AP',
      name:        'Anika Patel',
      creds:       'PhD · Marriage & Family Therapist',
      avail:       'Available this week',
      bg:          '#E8FBF4',
      color:       '#22C55E',
      specialties: ['Couples', 'Grief', 'DBT', 'Family'],
      insurance:   'Humana, Optum, Oscar',
      filters:     ['couples'],
    },
    {
      initials:    'JT',
      name:        'Jasmine Torres',
      creds:       'LPC · Licensed Professional Counselor',
      avail:       'Available tomorrow',
      bg:          '#FFF8E8',
      color:       '#FFB830',
      specialties: ['Teen Therapy', 'ADHD', 'Anxiety', 'School Stress'],
      insurance:   'Aetna, BCBS, Medicaid',
      filters:     ['teen', 'anxiety'],
    },
    {
      initials:    'DC',
      name:        'Dr. David Chen',
      creds:       'PsyD · Licensed Psychologist',
      avail:       'Next opening: Wed',
      bg:          '#EDE9FF',
      color:       '#5B4BD4',
      specialties: ['Depression', 'Anxiety', 'OCD', 'Perfectionism'],
      insurance:   'UHC, Aetna, BCBS, Cigna',
      filters:     ['anxiety', 'depression'],
    },
    {
      initials:    'NH',
      name:        'Nadia Hassan',
      creds:       'LMFT · EMDR Certified',
      avail:       'Available this week',
      bg:          '#F4F1FF',
      color:       '#7C6AF7',
      specialties: ['Trauma', 'PTSD', 'EMDR', 'Family Systems'],
      insurance:   'Cigna, Humana, Tricare',
      filters:     ['trauma'],
    },
  ];

  var therapistGrid = document.getElementById('therapist-grid');

  function buildTherapistCard(t) {
    var tags = t.specialties.map(function (s) {
      return '<span class="tc-tag">' + s + '</span>';
    }).join('');

    return (
      '<div class="tc-card fade-in" data-filters="' + t.filters.join(' ') + '">' +
        '<div class="tc-header">' +
          '<div class="tc-avatar" style="background:' + t.bg + ';color:' + t.color + '">' + t.initials + '</div>' +
          '<div>' +
            '<div class="tc-name">' + t.name + '</div>' +
            '<div class="tc-creds">' + t.creds + '</div>' +
            '<span class="tc-avail">' + t.avail + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="tc-tags">' + tags + '</div>' +
        '<div class="tc-ins"><strong>✓ Accepts:</strong> ' + t.insurance + '</div>' +
        '<button class="tc-book" onclick="document.getElementById(\'match\').scrollIntoView({behavior:\'smooth\'})">Book a session →</button>' +
      '</div>'
    );
  }

  function renderTherapistGrid(filter) {
    var list = filter === 'all'
      ? THERAPISTS
      : THERAPISTS.filter(function (t) { return t.filters.indexOf(filter) !== -1; });

    therapistGrid.innerHTML = list.map(buildTherapistCard).join('');

    // Register each freshly injected card with the fade observer
    therapistGrid.querySelectorAll('.tc-card').forEach(function (card) {
      registerFade(card);
    });
  }

  var tfBtns = document.querySelectorAll('.tf-btn');

  function activateTherapistFilter(filter) {
    tfBtns.forEach(function (b) {
      b.classList.toggle('active', b.dataset.filter === filter);
    });
    renderTherapistGrid(filter);
  }

  tfBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateTherapistFilter(btn.dataset.filter);
    });
  });

  // Initial render (all therapists)
  renderTherapistGrid('all');


  /* ══════════════════════════════════════════
     EAP LOOKUP — employer benefit check
  ══════════════════════════════════════════ */
  var EAP_DB = {
    google:      { name: 'Google EAP (Lyra Health)',        sessions: 16, remaining: 14, icon: '🔵' },
    microsoft:   { name: 'Microsoft EAP (Alight)',          sessions: 12, remaining: 10, icon: '🟦' },
    amazon:      { name: 'Amazon EAP (Health Advocate)',    sessions: 10, remaining:  8, icon: '🟠' },
    apple:       { name: 'Apple EAP (ComPsych)',            sessions:  8, remaining:  6, icon: '🍎' },
    meta:        { name: 'Meta EAP (Spring Health)',        sessions: 16, remaining: 12, icon: '🔵' },
    salesforce:  { name: 'Salesforce EAP',                  sessions: 12, remaining:  9, icon: '☁️' },
    walmart:     { name: 'Walmart EAP',                     sessions:  6, remaining:  5, icon: '🛒' },
    cvs:         { name: 'CVS Health EAP',                  sessions:  8, remaining:  7, icon: '🔴' },
    target:      { name: 'Target EAP (Optum)',              sessions:  8, remaining:  6, icon: '🎯' },
    deloitte:    { name: 'Deloitte EAP',                    sessions: 12, remaining: 10, icon: '🏢' },
    accenture:   { name: 'Accenture EAP',                   sessions: 10, remaining:  8, icon: '🏢' },
    acme:        { name: 'Acme Corp EAP',                   sessions:  8, remaining:  6, icon: '🏢' },
  };

  function buildEapDots(total, remaining) {
    var html = '';
    for (var i = 0; i < total; i++) {
      html += '<span class="dot' + (i < remaining ? ' active' : '') + '"></span>';
    }
    return html;
  }

  var eapInput = document.getElementById('eap-input');
  var eapBtn   = document.getElementById('eap-btn');
  var eapCard  = document.querySelector('.eap-card');

  if (eapBtn && eapInput && eapCard) {

    eapBtn.addEventListener('click', function () {
      var q = eapInput.value.trim().toLowerCase();

      if (!q) {
        eapInput.focus();
        eapInput.style.borderColor = 'rgba(255,80,80,.7)';
        setTimeout(function () { eapInput.style.borderColor = ''; }, 1600);
        return;
      }

      eapBtn.textContent = 'Checking…';
      eapBtn.disabled    = true;

      setTimeout(function () {
        eapBtn.textContent = 'Check benefits';
        eapBtn.disabled    = false;

        // Find the best match in our database
        var found = null;
        var keys  = Object.keys(EAP_DB);
        for (var i = 0; i < keys.length; i++) {
          if (q.indexOf(keys[i]) !== -1) {
            found = EAP_DB[keys[i]];
            break;
          }
        }

        // Generic fallback for unknown employers
        if (!found) {
          found = {
            name:      eapInput.value.trim() + ' EAP',
            sessions:  6,
            remaining: 6,
            icon:      '🏢',
          };
        }

        // Update the visual EAP card
        eapCard.querySelector('.eap-logo-circle').textContent                = found.icon;
        eapCard.querySelector('.eap-card-header strong').textContent         = found.name;
        eapCard.querySelector('.eap-sess-dots').innerHTML                    = buildEapDots(found.sessions, found.remaining);
        eapCard.querySelector('.eap-sess-count').textContent                 =
          found.remaining + ' of ' + found.sessions + ' sessions remaining';

      }, 1400);
    });

    eapInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') eapBtn.click();
    });
  }


  /* ══════════════════════════════════════════
     SMOOTH ANCHOR SCROLLING — offset for sticky nav
  ══════════════════════════════════════════ */
  var NAV_HEIGHT = 68; // matches --nav-h CSS variable

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return; // bare "#" links — let default behavior handle
      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - NAV_HEIGHT;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
