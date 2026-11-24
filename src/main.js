import { aboutGroup, businesses, careersData, contact, getBusiness, newsUpdates, socialFoundation } from './data.js';
import './styles.css';

const app = document.querySelector('#app');

const icon = (name, size = 18) => {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUp: '<path d="M7 17 17 7M7 7h10v10"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    phone: '<path d="M6.7 3.5 9 3l2 4-1.8 1.4a13.2 13.2 0 0 0 6.4 6.4L17 13l4 2-.5 2.3A2.4 2.4 0 0 1 18.2 19C10.4 18.1 5.9 13.6 5 5.8A2.4 2.4 0 0 1 6.7 3.5Z"/>',
    mail: '<path d="M4 6h16v12H4zM4 7l8 6 8-6"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.2 5.1 3.2 8.5s-1 6.2-3.2 8.5c-2.2-2.3-3.2-5.1-3.2-8.5s1-6.2 3.2-8.5Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12h12M6 7h12M6 17h12"/>',
    badge: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    factory: '<path d="M2 20h20M4 20V9l4 3V9l4 3V4h8v16M14 8h2M14 12h2M14 16h2"/>',
    sprout: '<path d="M7 20h10M12 20v-8M12 12c-3 0-6-3-6-7 4 0 6 3 6 7ZM12 12c3 0 6-3 6-7-4 0-6 3-6 7Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    signal: '<path d="M4.9 19.1C1.1 15.3 1.1 9 4.9 5.2M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5M12 12h.01M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5M19.1 5.2c3.8 3.8 3.8 10.1 0 13.9"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    heart: '<path d="M12 20.5s-7-4.35-9.2-8.4A5.4 5.4 0 0 1 12 6.6a5.4 5.4 0 0 1 9.2 5.5c-2.2 4.05-9.2 8.4-9.2 8.4z"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};

const routeLink = (href, label, className = '') => `<a class="${className}" href="${href}" data-route>${label}</a>`;

const renderParagraphs = (paragraphs) => paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');

const renderCheckList = (items, className, iconSize = 16) => `
  <ul class="${className}">
    ${items.map((item) => `<li>${icon('check', iconSize)} <span>${item}</span></li>`).join('')}
  </ul>
`;

const header = (active = '') => `
  <header class="site-header">
    <div class="container header-inner">
      ${routeLink('/', `<span class="brand-lockup"><img src="/bhojraj-logo.png" alt="Bhojraj India Group logo" /><span class="brand-lockup__words"><strong>BHOJRAJ</strong><small>INDIA GROUP</small></span></span>`, 'brand')}
      <nav class="desktop-nav" aria-label="Primary navigation">
        ${routeLink('/', 'Home', active === 'home' ? 'is-active' : '')}
        ${routeLink('/businesses', 'Divisions', active === 'businesses' ? 'is-active' : '')}
        ${routeLink('/about', 'About Group', active === 'about' ? 'is-active' : '')}
        ${routeLink('/social-foundation', 'Social Foundation', active === 'foundation' ? 'is-active' : '')}
        ${routeLink('/careers', 'Careers', active === 'careers' ? 'is-active' : '')}
      </nav>
      <div class="header-actions">
        <a class="header-contact" href="tel:${contact.phone}">${icon('phone', 14)} <span>${contact.phoneDisplay}</span></a>
        <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">${icon('menu', 22)}</button>
      </div>
    </div>
    <div class="mobile-nav" aria-hidden="true">
      <div class="mobile-nav__inner">
        ${routeLink('/', 'Home', 'mobile-nav__link')}
        ${routeLink('/businesses', 'Divisions', 'mobile-nav__link')}
        ${routeLink('/about', 'About Group', 'mobile-nav__link')}
        ${routeLink('/social-foundation', 'Social Foundation', 'mobile-nav__link')}
        ${routeLink('/careers', 'Careers', 'mobile-nav__link')}
        <a class="button button--gold mobile-nav__cta" href="${contact.whatsapp}" target="_blank" rel="noreferrer">WhatsApp us ${icon('arrow', 16)}</a>
      </div>
    </div>
  </header>
`;

const footer = () => `
  <footer class="site-footer">
    <div class="container footer-top">
      <div class="footer-brand">
        <div class="eyebrow eyebrow--gold">BHOJRAJ INDIA GROUP</div>
        <h2>Where Enterprise<br /><em>Meets Excellence.</em></h2>
        <p class="footer-meta-lead">Headquartered in Indore, Madhya Pradesh, India · Connecting Domestic & Global Markets</p>
        <div class="footer-brochure-bar">
          <span class="footer-badge">${contact.website}</span>
          <span class="footer-badge">${contact.socialHandle}</span>
        </div>
      </div>
      <div class="footer-cta">
        <p>For trade partnerships, distribution, and corporate inquiries.</p>
        <a class="button button--gold" href="${contact.whatsapp}" target="_blank" rel="noreferrer">WhatsApp Us ${icon('arrow', 16)}</a>
        <div class="footer-social-links">
          ${contact.socials.map(s => `<a href="${s.url}" target="_blank" rel="noreferrer" class="social-chip">${s.name}</a>`).join('')}
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© 2026 Bhojraj India Group · ${contact.location}</span>
      <div class="footer-links">
        <span class="footer-credit">Built by <a href="https://growitate.com" target="_blank" rel="noopener noreferrer"><strong>GROWITATE</strong></a></span>
        <a href="mailto:${contact.email}">${contact.email}</a>
        <a href="tel:${contact.phone}">${contact.phoneDisplay}</a>
      </div>
    </div>
  </footer>
`;

const businessCard = (business, compact = false) => {
  const title = business.divisionName || business.label;
  const cardClasses = `business-card ${compact ? 'business-card--compact' : ''} accent-${business.accent}`;
  const cardBody = `
    <div class="business-card__media ${business.imageContain ? 'business-card__media--contain' : ''} ${business.imageDark ? 'business-card__media--navy' : ''}">
      <img src="${business.image}" alt="${title} — Bhojraj India Group" class="business-card__img ${business.imageContain ? 'business-card__img--contain' : ''}" loading="lazy" />
      <div class="business-card__badge">
        <span class="business-card__index">${business.index}</span>
        <span class="business-card__glyph">${business.glyph}</span>
      </div>
    </div>
    <div class="business-card__body">
      ${business.pillars && business.pillars.length ? `
        <div class="business-card__pillars">
          ${business.pillars.slice(0, 2).map(p => `<span class="card-pillar">${p}</span>`).join('')}
        </div>
      ` : ''}
      <span class="eyebrow">${business.divisionName || `Bhojraj India ${business.label}`}</span>
      <h3>${business.tagline || business.label}</h3>
      <p>${business.short}</p>
    </div>
  `;

  if (business.externalUrl) {
    return `
      <article class="${cardClasses}">
        <a class="business-card__stretched-link" href="/business/${business.slug}" data-route aria-label="Explore ${title} division details"></a>
        ${cardBody}
        <div class="business-card__foot">
          <span>Explore division details</span>
          <a class="business-card__ext-link" href="${business.externalUrl}" target="_blank" rel="noopener noreferrer">${business.externalLabel || 'Watch on YouTube'} ${icon('arrowUp', 13)}</a>
        </div>
      </article>
    `;
  }

  return `
    <a class="${cardClasses}" href="/business/${business.slug}" data-route>
      ${cardBody}
      <div class="business-card__foot">
        <span>Explore division details</span>${icon('arrowUp', 16)}
      </div>
    </a>
  `;
};

const heroOrb = () => `
  <div class="hero-orb" aria-hidden="true">
    <div class="orb-core"></div>
    <span class="orb-label orb-label--one">GLOBAL TRADE</span>
    <span class="orb-label orb-label--two">INDUSTRIES</span>
    <span class="orb-label orb-label--three">FOODS</span>
    <div class="orb-ring orb-ring--one"></div>
    <div class="orb-ring orb-ring--two"></div>
    <div class="orb-ring orb-ring--three"></div>
  </div>
`;

const renderHome = () => `
  ${header('home')}
  <main>
    <section class="hero hero--home">
      <div class="container hero-grid">
        <div class="hero-copy reveal">
          <div class="eyebrow eyebrow--gold"><span class="eyebrow-dot"></span>${contact.location}</div>
          <h1>Connecting Indian Enterprise<br />with <em>Global Markets.</em></h1>
          <p class="hero-lede">Bhojraj India Group is a multidisciplinary corporate enterprise operating across Global Trade, Manufacturing & Industrial Products, Food Processing, Media, Infrastructure, and Human Capital.</p>
          <div class="hero-actions">
            <a class="button button--gold" href="/businesses" data-route>Explore Our Divisions ${icon('arrow', 16)}</a>
            <a class="text-link" href="/about" data-route>About the Group ${icon('arrow', 16)}</a>
          </div>
        </div>
        <div class="hero-visual reveal reveal--delay">
          ${heroOrb()}
          <div class="hero-showcase">
            <img src="/images/bhojraj-india-group-banner.jpg.jpeg" alt="Bhojraj India Group — Indore, Madhya Pradesh" class="hero-showcase__img" />
          </div>
          <div class="hero-note">
            <span>01</span>
            <p>Where enterprise<br />meets excellence.</p>
          </div>
        </div>
      </div>
      <div class="container hero-foot">
        <span class="hero-foot__line"></span>
        <span>${contact.website} · ${contact.socialHandle}</span>
        <span class="hero-foot__line hero-foot__line--short"></span>
        <span class="hero-foot__year">2026 <b>↗</b></span>
      </div>
    </section>

    <section class="section section--intro" id="intro">
      <div class="container intro-grid">
        <div class="section-index reveal">/ 01 · About The Group</div>
        <div class="intro-copy reveal reveal--delay">
          <div class="eyebrow eyebrow--gold">${aboutGroup.eyebrow}</div>
          <h2>${aboutGroup.titleLine1}<br /><span>${aboutGroup.titleLine2}</span></h2>
          ${renderParagraphs(aboutGroup.paragraphs)}
          <a class="text-link" href="/about" data-route>Read our group story ${icon('arrow', 16)}</a>
        </div>
        <div class="intro-stat reveal reveal--delay-2">
          <strong>09</strong>
          <span>Strategic Divisions</span>
          <small>Trade · Industries · Foods · Infrastructure · Media</small>
        </div>
      </div>

      <div class="container intro-banner reveal">
        <div class="intro-banner__inner">
          <img src="/images/intro-feature.jpg" alt="Bhojraj India Group Infrastructure" class="intro-banner__img" loading="lazy" />
          <div class="intro-banner__content">
            <span class="eyebrow">Strategic Foundation</span>
            <h3>Local to Global Market: Promoting Indian Agriculture, Manufacturing & Trade</h3>
            <p>Headquartered in Indore, Madhya Pradesh, we empower Indian producers, farmers, and manufacturers with organized supply networks and global reach.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--businesses">
      <div class="container">
        <div class="section-heading reveal">
          <div>
            <div class="eyebrow eyebrow--gold">The Divisions</div>
            <h2>Commercial Divisions.<br /><span>One Unified Standard.</span></h2>
          </div>
          <a class="text-link text-link--desktop" href="/businesses" data-route>View all 09 divisions ${icon('arrow', 16)}</a>
        </div>
        <div class="business-grid">
          ${businesses.slice(0, 6).map((business) => businessCard(business)).join('')}
        </div>
        <a class="button button--outline mobile-only" href="/businesses" data-route>View all 09 divisions ${icon('arrow', 16)}</a>
      </div>
    </section>

    <section class="signal-section" id="ecosystem">
      <div class="container">
        <div class="signal-grid">
          <div class="signal-copy reveal">
            <div class="eyebrow eyebrow--gold">
              <span class="eyebrow-pill-dot"></span>
              A Connected Way of Working
            </div>
            <h2>Every vertical adds<br /><em>a new signal.</em></h2>
            <p class="signal-lead">From farm sourcing and hygienic food processing to industrial manufacturing and global export shipping — the group’s competitive advantage lives in the seamless connections between our businesses.</p>
            
            <div class="signal-synergies">
              <div class="signal-synergy-item">
                <span class="synergy-check">${icon('check', 15)}</span>
                <div>
                  <strong>Farm-to-Port Pipeline</strong>
                  <p>In-house agro processing directly connected to Global Trade international export corridors.</p>
                </div>
              </div>
              <div class="signal-synergy-item">
                <span class="synergy-check">${icon('check', 15)}</span>
                <div>
                  <strong>Industrial & Manufacturing Scalability</strong>
                  <p>Custom fabrication and industrial packaging powering civil infrastructure & commercial clients.</p>
                </div>
              </div>
              <div class="signal-synergy-item">
                <span class="synergy-check">${icon('check', 15)}</span>
                <div>
                  <strong>Unified Global Quality Standard</strong>
                  <p>Centralized compliance (ISO 9001, APEDA, FSSAI, Spice Board) across all 09 operating verticals.</p>
                </div>
              </div>
            </div>

            <div class="signal-actions">
              <a class="button button--gold" href="/businesses" data-route>Explore All 09 Divisions ${icon('arrow', 16)}</a>
              <a class="button button--outline" href="/about" data-route>About The Group</a>
            </div>
          </div>

          <div class="signal-visual-wrapper reveal reveal--delay">
            <div class="ecosystem-stage" id="ecosystemStage">
              <!-- Radar Concentric Circles -->
              <div class="radar-circle radar-circle--outer"></div>
              <div class="radar-circle radar-circle--mid"></div>
              <div class="radar-circle radar-circle--inner"></div>

              <!-- SVG Network Connections -->
              <svg class="ecosystem-svg" viewBox="0 0 600 520" preserveAspectRatio="none">
                <!-- Center to Nodes Base and Flow Paths -->
                <!-- Media (Top Left: 140, 75) -->
                <path class="eco-path eco-path--base" d="M300,260 Q210,160 140,75" />
                <path class="eco-path eco-path--flow" d="M300,260 Q210,160 140,75" />

                <!-- Workforce (Mid Left: 120, 260) -->
                <path class="eco-path eco-path--base" d="M300,260 L120,260" />
                <path class="eco-path eco-path--flow" d="M300,260 L120,260" />

                <!-- Constructions (Bottom Left: 140, 445) -->
                <path class="eco-path eco-path--base" d="M300,260 Q210,360 140,445" />
                <path class="eco-path eco-path--flow" d="M300,260 Q210,360 140,445" />

                <!-- Global Trade (Top Right: 460, 75) -->
                <path class="eco-path eco-path--base" d="M300,260 Q390,160 460,75" />
                <path class="eco-path eco-path--flow" d="M300,260 Q390,160 460,75" />

                <!-- Industries (Mid Right: 480, 260) -->
                <path class="eco-path eco-path--base" d="M300,260 L480,260" />
                <path class="eco-path eco-path--flow" d="M300,260 L480,260" />

                <!-- Foods & Agro (Bottom Right: 460, 445) -->
                <path class="eco-path eco-path--base" d="M300,260 Q390,360 460,445" />
                <path class="eco-path eco-path--flow" d="M300,260 Q390,360 460,445" />

                <!-- Inter-division synergy arcs -->
                <path class="eco-synergy-arc" d="M460,445 C540,360 540,160 460,75" />
                <path class="eco-synergy-arc" d="M480,260 C380,320 220,380 140,445" />
              </svg>

              <!-- Central Operating Hub -->
              <div class="ecosystem-hub">
                <div class="hub-ripple"></div>
                <div class="hub-ripple hub-ripple--delay"></div>
                <div class="hub-card">
                  <div class="hub-logo-wrap">
                    <img src="/bhojraj-logo.png" alt="Bhojraj India Group Emblem" />
                  </div>
                  <div class="hub-brand-name">BHOJRAJ INDIA GROUP</div>
                  <div class="hub-subtitle">OPERATING CORE</div>
                  <div class="hub-status">
                    <span class="hub-dot"></span>
                    <span>09 Synergistic Verticals</span>
                  </div>
                </div>
              </div>

              <!-- Satellite Division Nodes -->
              <!-- Node 1: Media -->
              <a href="/business/media" data-route class="eco-node eco-node--media">
                <div class="eco-node__icon eco-node__icon--gold">
                  ${icon('signal', 18)}
                </div>
                <div class="eco-node__content">
                  <span class="eco-node__kicker">COMMUNICATIONS</span>
                  <strong class="eco-node__title">Media & Reach</strong>
                  <span class="eco-node__metric">Publishing & PR</span>
                </div>
                <span class="eco-node__arrow">${icon('arrow', 13)}</span>
              </a>

              <!-- Node 2: Workforce -->
              <a href="/business/workforce" data-route class="eco-node eco-node--workforce">
                <div class="eco-node__icon eco-node__icon--navy">
                  ${icon('users', 18)}
                </div>
                <div class="eco-node__content">
                  <span class="eco-node__kicker">HUMAN CAPITAL</span>
                  <strong class="eco-node__title">Workforce</strong>
                  <span class="eco-node__metric">Specialized Talent</span>
                </div>
                <span class="eco-node__arrow">${icon('arrow', 13)}</span>
              </a>

              <!-- Node 3: Constructions -->
              <a href="/business/constructions" data-route class="eco-node eco-node--constructions">
                <div class="eco-node__icon eco-node__icon--navy">
                  ${icon('building', 18)}
                </div>
                <div class="eco-node__content">
                  <span class="eco-node__kicker">INFRASTRUCTURE</span>
                  <strong class="eco-node__title">Constructions</strong>
                  <span class="eco-node__metric">Industrial Projects</span>
                </div>
                <span class="eco-node__arrow">${icon('arrow', 13)}</span>
              </a>

              <!-- Node 4: Global Trade -->
              <a href="/business/global-trade" data-route class="eco-node eco-node--trade">
                <div class="eco-node__icon eco-node__icon--gold">
                  ${icon('globe', 18)}
                </div>
                <div class="eco-node__content">
                  <span class="eco-node__kicker">EXPORT & IMPORT</span>
                  <strong class="eco-node__title">Global Trade</strong>
                  <span class="eco-node__metric">40+ Countries Network</span>
                </div>
                <span class="eco-node__arrow">${icon('arrow', 13)}</span>
              </a>

              <!-- Node 5: Industries -->
              <a href="/business/industries" data-route class="eco-node eco-node--industries">
                <div class="eco-node__icon eco-node__icon--navy">
                  ${icon('factory', 18)}
                </div>
                <div class="eco-node__content">
                  <span class="eco-node__kicker">MANUFACTURING</span>
                  <strong class="eco-node__title">Industries</strong>
                  <span class="eco-node__metric">Packaging & Scale</span>
                </div>
                <span class="eco-node__arrow">${icon('arrow', 13)}</span>
              </a>

              <!-- Node 6: Foods -->
              <a href="/business/foods" data-route class="eco-node eco-node--foods">
                <div class="eco-node__icon eco-node__icon--gold">
                  ${icon('sprout', 18)}
                </div>
                <div class="eco-node__content">
                  <span class="eco-node__kicker">AGRO & FMCG</span>
                  <strong class="eco-node__title">Foods Division</strong>
                  <span class="eco-node__metric">Farm-to-Port Quality</span>
                </div>
                <span class="eco-node__arrow">${icon('arrow', 13)}</span>
              </a>
            </div>

            <!-- Mobile Ecosystem Showcase (Clean Responsive Stack) -->
            <div class="ecosystem-mobile-card">
              <div class="ecosystem-mobile-hub">
                <img src="/bhojraj-logo.png" alt="Bhojraj Logo" class="eco-mobile-logo" />
                <div class="eco-mobile-info">
                  <strong>Bhojraj India Group Core</strong>
                  <span class="eco-mobile-badge"><span class="hub-dot"></span> 09 Unified Divisions</span>
                </div>
              </div>
              <div class="ecosystem-mobile-grid">
                <a href="/business/global-trade" data-route class="eco-mobile-pill">
                  <span class="eco-mobile-icon">${icon('globe', 16)}</span>
                  <span class="eco-mobile-text"><strong>Global Trade</strong><small>40+ Countries Export</small></span>
                  <span class="eco-mobile-arrow">${icon('arrow', 12)}</span>
                </a>
                <a href="/business/industries" data-route class="eco-mobile-pill">
                  <span class="eco-mobile-icon">${icon('factory', 16)}</span>
                  <span class="eco-mobile-text"><strong>Industries</strong><small>Manufacturing & Scale</small></span>
                  <span class="eco-mobile-arrow">${icon('arrow', 12)}</span>
                </a>
                <a href="/business/foods" data-route class="eco-mobile-pill">
                  <span class="eco-mobile-icon">${icon('sprout', 16)}</span>
                  <span class="eco-mobile-text"><strong>Foods & Agro</strong><small>Farm-to-Port Quality</small></span>
                  <span class="eco-mobile-arrow">${icon('arrow', 12)}</span>
                </a>
                <a href="/business/constructions" data-route class="eco-mobile-pill">
                  <span class="eco-mobile-icon">${icon('building', 16)}</span>
                  <span class="eco-mobile-text"><strong>Constructions</strong><small>Civil Infrastructure</small></span>
                  <span class="eco-mobile-arrow">${icon('arrow', 12)}</span>
                </a>
                <a href="/business/workforce" data-route class="eco-mobile-pill">
                  <span class="eco-mobile-icon">${icon('users', 16)}</span>
                  <span class="eco-mobile-text"><strong>Workforce</strong><small>Human Capital Solutions</small></span>
                  <span class="eco-mobile-arrow">${icon('arrow', 12)}</span>
                </a>
                <a href="/business/media" data-route class="eco-mobile-pill">
                  <span class="eco-mobile-icon">${icon('signal', 16)}</span>
                  <span class="eco-mobile-text"><strong>Media & News</strong><small>Publishing & Reach</small></span>
                  <span class="eco-mobile-arrow">${icon('arrow', 12)}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--contact">
      <div class="container contact-card">
        <div>
          <div class="eyebrow eyebrow--gold">Let’s Take India to the World</div>
          <h2>Building Quality.<br /><em>Creating Opportunities.</em></h2>
        </div>
        <div class="contact-card__right">
          <p>Whether you are an overseas buyer, a domestic manufacturer, a farmer collective, or looking for reliable supply partnerships — Bhojraj India Group is ready to collaborate.</p>
          <div class="contact-card__actions">
            <a class="button button--gold" href="${contact.whatsapp}" target="_blank" rel="noreferrer">WhatsApp Conversation ${icon('arrow', 16)}</a>
            <a class="text-link" href="mailto:${contact.email}">Send an Email ${icon('arrow', 16)}</a>
          </div>
        </div>
      </div>
    </section>
  </main>
  ${footer()}
`;

const renderBusinesses = () => `
  ${header('businesses')}
  <main>
    <section class="page-hero">
      <div class="container page-hero__inner">
        <div class="eyebrow eyebrow--gold">/ 02 · Business Portfolio</div>
        <h1>Our Strategic<br /><em>Divisions.</em></h1>
        <p>Explore the specialized corporate divisions of Bhojraj India Group — each with its dedicated operations, market focus, and shared commitment to excellence.</p>
      </div>
      <div class="page-hero__mark">B/IG</div>
    </section>

    <section class="section section--directory">
      <div class="container">
        <div class="directory-tools">
          <div class="eyebrow">09 Divisions · Indore, Madhya Pradesh</div>
          <div class="filter-set" role="group" aria-label="Filter businesses">
            <button class="filter-button is-active" data-filter="all">All</button>
            <button class="filter-button" data-filter="trade">Trade & Industry</button>
            <button class="filter-button" data-filter="agro">Agro & Foods</button>
            <button class="filter-button" data-filter="media">Media & People</button>
          </div>
        </div>
        <div class="directory-grid">
          ${businesses.map((business) => businessCard(business)).join('')}
        </div>
      </div>
    </section>

    <section class="section section--directory-note">
      <div class="container note-grid">
        <div class="section-index">/ 03 · Operational Synergy</div>
        <div>
          <div class="eyebrow eyebrow--gold">Integrated Capabilities</div>
          <h2>The power of<br /><span>connected execution.</span></h2>
          <p>Our divisions operate with independent operational focus while leveraging group-wide resources in compliance, logistics, quality management, and international market development.</p>
        </div>
      </div>
    </section>
  </main>
  ${footer()}
`;

const renderAbout = () => `
  ${header('about')}
  <main>
    <section class="page-hero page-hero--about">
      <div class="container page-hero__inner">
        <div class="eyebrow eyebrow--gold">/ 03 · The Group</div>
        <h1>Enterprise Built on<br /><em>Trust & Excellence.</em></h1>
        <p>Bhojraj India Group is an Indian multi-business conglomerate dedicated to connecting domestic capability with global opportunity.</p>
      </div>
      <div class="page-hero__stamp">EST.<br /><strong>INDIA</strong><br />2026</div>
    </section>

    <section class="section section--story">
      <div class="container story-grid">
        <div class="story-aside">
          <div class="eyebrow">Group Identity</div>
          <span class="story-quote">“Where Enterprise Meets Excellence.”</span>
          <div class="story-media">
            <img src="/images/about-story.jpg" alt="Bhojraj India Group Strategic Collaboration" class="story-media__img" loading="lazy" />
            <span class="story-media__caption">${contact.location} · ${contact.website}</span>
          </div>
        </div>
        <div class="story-body">
          <div class="eyebrow eyebrow--gold">${aboutGroup.eyebrow}</div>
          <h2>${aboutGroup.titleLine1}<br /><em>${aboutGroup.titleLine2}</em></h2>
          ${renderParagraphs(aboutGroup.paragraphs)}
          <div class="story-values">
            ${aboutGroup.pillars.map((pillar) => `
              <div><span>${pillar.number}</span><strong>${pillar.title}</strong><p>${pillar.description}</p></div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="section section--group-purpose">
      <div class="container purpose-grid">
        <div class="purpose-vision-col">
          <div class="eyebrow eyebrow--gold">${aboutGroup.purpose.eyebrow}</div>
          <h2>${aboutGroup.purpose.headingLine1}<br /><em>${aboutGroup.purpose.headingLine2}</em></h2>
          <div class="division-vision-box">
            <span class="vision-badge">${aboutGroup.purpose.visionTitle}</span>
            <h3>${aboutGroup.purpose.vision}</h3>
          </div>
        </div>
        <div class="purpose-mission-card">
          <span class="mission-badge">${aboutGroup.purpose.missionTitle}</span>
          ${renderCheckList(aboutGroup.purpose.mission, 'division-mission-list')}
        </div>
      </div>
    </section>

    <section class="statement-section">
      <div class="container leadership-grid">
        <div class="leadership-card">
          <div class="leadership-card__top">
            <div class="leadership-monogram">
              <img src="/bhojraj-logo.png" alt="Bhojraj India Group emblem" />
            </div>
            <span class="leadership-role-pill">${aboutGroup.leadership.role}</span>
          </div>
          <h3 class="leadership-name">${aboutGroup.leadership.founder}</h3>
          <p class="leadership-org">${aboutGroup.leadership.organization}</p>
          <div class="leadership-quote-wrap">
            <blockquote class="leadership-quote">
              ${aboutGroup.leadership.quoteLine1} <em>${aboutGroup.leadership.quoteLine2}</em>
            </blockquote>
          </div>
        </div>
        <div class="leadership-copy">
          <div class="eyebrow eyebrow--gold"><span class="eyebrow-dot"></span>${aboutGroup.leadership.eyebrow}</div>
          <h2>${aboutGroup.leadership.headingLine1}<br /><em>${aboutGroup.leadership.headingLine2}</em></h2>
          ${renderParagraphs(aboutGroup.leadership.paragraphs)}
          <div class="leadership-pillars">
            ${aboutGroup.leadership.commitments.map((item) => `<span class="detail-pillar-tag">${item}</span>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <section class="section section--contact section--contact-about">
      <div class="container contact-card">
        <div>
          <div class="eyebrow eyebrow--gold">Official Headquarters</div>
          <h2>Connect with<br /><em>Our Leadership.</em></h2>
        </div>
        <div class="contact-card__right">
          <p>Based in Indore, connected across India and worldwide. Reach out to discuss international trade, contract manufacturing, agro-sourcing, or institutional supply.</p>
          <div class="contact-list">
            <a href="tel:${contact.phone}">${icon('phone', 16)} ${contact.phoneDisplay}</a>
            <a href="mailto:${contact.email}">${icon('mail', 16)} ${contact.email}</a>
            <a href="${contact.websiteUrl}" target="_blank" rel="noreferrer">${icon('globe', 16)} ${contact.website}</a>
            <a href="${contact.whatsapp}" target="_blank" rel="noreferrer">${icon('arrow', 16)} WhatsApp Chat (${contact.phoneDisplay})</a>
          </div>
        </div>
      </div>
    </section>
  </main>
  ${footer()}
`;

const renderDetailHeroCard = (business) => {
  const title = business.divisionName || business.label;
  const badgeLeft = business.externalUrl
    ? `<span class="detail-hero__card-cta">${icon('arrowUp', 15)} ${business.externalLabel || 'Visit Channel'}</span>`
    : `<span>${business.glyph}</span>`;
  const cardInner = `
    <img src="${business.image}" alt="${title} Showcase" class="detail-hero__card-img ${business.imageContain ? 'detail-hero__card-img--contain' : ''} ${business.imageDark ? 'detail-hero__card-img--navy' : ''}" />
    <div class="detail-hero__card-badge">
      ${badgeLeft}
      <b>${title.toUpperCase()}</b>
    </div>
  `;
  if (business.externalUrl) {
    return `<a class="detail-hero__card detail-hero__card--link" href="${business.externalUrl}" target="_blank" rel="noopener noreferrer" aria-label="${business.externalLabel || 'Open link'} — ${title}">${cardInner}</a>`;
  }
  return `<div class="detail-hero__card">${cardInner}</div>`;
};

const renderBusiness = (business) => `
  ${header('businesses')}
  <main class="page-business-detail">
    <!-- Division Hero -->
    <section class="detail-hero accent-${business.accent}" style="--detail-bg: url('${business.image}');">
      <div class="container detail-hero__grid">
        <div class="detail-hero__copy">
          <a class="back-link" href="/businesses" data-route>${icon('arrow', 14)} Back to all divisions</a>
          <div class="eyebrow eyebrow--gold">A Business Division of Bhojraj India Group · Vertical ${business.index}</div>
          <h1>${business.divisionName || business.label}<br /><em>${business.tagline || business.kicker}</em></h1>
          <p class="detail-hero-lead">${business.subtitle || business.short}</p>
          
          ${business.pillars && business.pillars.length ? `
            <div class="detail-pillars-row">
              ${business.pillars.map(p => `<span class="detail-pillar-tag">${p}</span>`).join('')}
            </div>
          ` : ''}

          <div class="detail-hero-actions">
            <a class="button button--gold" href="${contact.whatsapp}" target="_blank" rel="noreferrer">
              Inquire with this division ${icon('arrow', 16)}
            </a>
            <a class="text-link" href="mailto:${contact.email}">Email Coordinator ${icon('arrow', 16)}</a>
          </div>
        </div>

        <div class="detail-hero__visual">
          ${renderDetailHeroCard(business)}
          <div class="detail-hero__shape">
            <span>${business.glyph}</span>
            <b>${business.index}</b>
          </div>
        </div>
      </div>
    </section>

    <!-- Who We Are & Vision/Mission -->
    <section class="section section--division-about">
      <div class="container division-about-grid">
        <div class="division-about-left">
          <div class="eyebrow eyebrow--gold">Division Profile</div>
          <h2>Who We Are</h2>
          <p class="division-lead-p">${business.about || business.description}</p>
          
          ${business.coreValues && business.coreValues.length ? `
            <div class="division-commitments">
              <h4>Core Commitments & Values</h4>
              <div class="commitments-tags">
                ${business.coreValues.map(v => `<span class="commitment-pill">${v}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="division-about-right">
          ${business.vision ? `
            <div class="division-vision-box">
              <span class="vision-badge">OUR VISION</span>
              <h3>“${business.vision}”</h3>
            </div>
          ` : ''}

          ${business.mission && business.mission.length ? `
            <div class="division-mission-box">
              <span class="mission-badge">OUR MISSION</span>
              ${renderCheckList(business.mission, 'division-mission-list')}
            </div>
          ` : ''}
        </div>
      </div>
    </section>

    <!-- Product Categories (Direct from brochure) -->
    ${business.productCategories && business.productCategories.length ? `
      <section class="section section--division-products">
        <div class="container">
          <div class="section-heading">
            <div>
              <div class="eyebrow eyebrow--gold">${business.slug === 'global-trade' ? 'What We Trade' : business.slug === 'industries' ? 'What We Make & Supply' : 'What We Process & Supply'}</div>
              <h2>Product Categories</h2>
            </div>
            <p class="section-heading-sub">${business.slug === 'global-trade' ? 'A diversified portfolio of quality Indian products and international merchandise, sourced from reliable manufacturers, farmers and suppliers.' : business.slug === 'industries' ? 'A comprehensive portfolio across industrial, electrical, packaging, and engineering categories.' : 'Cleaned, graded, and hygienically processed agro-commodities and consumer food items.'}</p>
          </div>
          <div class="products-grid">
            ${business.productCategories.map(p => `
              <div class="product-category-card">
                <div class="product-card-head">
                  <span class="product-card-index">${p.number}</span>
                  <span class="product-card-line"></span>
                </div>
                <h3>${p.title}</h3>
                <p>${p.description}</p>
              </div>
            `).join('')}
          </div>
          <div class="category-footnote">
            <small>Note: These product categories reflect the division's commercial portfolio. Actual manufacturing and trade activities comply with applicable licenses, technical capabilities, and statutory permissions.</small>
          </div>
        </div>
      </section>
    ` : ''}

    <!-- Services (Direct from brochure) -->
    ${business.services && business.services.length ? `
      <section class="section section--division-services">
        <div class="container">
          <div class="section-heading">
            <div>
              <div class="eyebrow eyebrow--gold">What We Offer</div>
              <h2>Our Services & Capabilities</h2>
            </div>
          </div>
          <div class="services-grid">
            ${business.services.map(s => `
              <div class="service-block">
                <span class="service-block-num">${s.number}</span>
                <h4>${s.title}</h4>
                <p>${s.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    ` : ''}

    <!-- News & Updates (Bhojraj Digital News Network — Context Over Noise) -->
    ${business.slug === 'news' && newsUpdates.length ? `
      <section class="section section--news-updates" id="news-updates">
        <div class="container">
          <div class="section-heading">
            <div>
              <div class="eyebrow eyebrow--gold"><span class="eyebrow-dot"></span>Latest Briefings · News &amp; Updates</div>
              <h2>Announcements &amp;<br /><span>Group Briefings.</span></h2>
            </div>
            <a class="text-link text-link--desktop" href="/contact" data-route>News &amp; Media Enquiry ${icon('arrow', 16)}</a>
          </div>
          <div class="news-grid">
            ${newsUpdates.map((post) => `
              <article class="news-card">
                <div class="news-card__meta">
                  <span class="news-card__cat">${post.category}</span>
                  <time class="news-card__date">${post.date}</time>
                </div>
                <span class="news-card__division">${post.division}</span>
                <h3>${post.title}</h3>
                <p>${post.summary}</p>
                <button class="news-card__more" type="button" data-news-id="${post.id}">
                  Read full briefing ${icon('arrow', 14)}
                </button>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <div class="news-modal" id="newsModal" hidden role="dialog" aria-modal="true" aria-labelledby="newsModalTitle">
        <div class="news-modal__backdrop" data-news-close></div>
        <div class="news-modal__dialog">
          <button class="news-modal__close" type="button" aria-label="Close briefing" data-news-close>${icon('close', 18)}</button>
          <div class="news-modal__meta">
            <span class="news-card__cat" id="newsModalCat"></span>
            <span class="news-card__date" id="newsModalDate"></span>
          </div>
          <div class="news-card__division" id="newsModalDivision"></div>
          <h3 class="news-modal__title" id="newsModalTitle"></h3>
          <div class="news-modal__body" id="newsModalBody"></div>
          <div class="news-modal__foot">
            <a class="button button--gold" href="/contact" data-route>Contact Editorial Desk ${icon('arrow', 15)}</a>
            <button class="button button--light" type="button" data-news-close>Close</button>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Annual Print & Digital Magazine Series -->
    ${business.magazineSeries && business.magazineSeries.issues?.length ? `
      <section class="section section--magazine-series" id="annual-series">
        <div class="container">
          <div class="magazine-series__header">
            <div class="magazine-series__title-wrap">
              <div class="magazine-series__eyebrow">${business.magazineSeries.eyebrow}</div>
              <h2 class="magazine-series__heading">${business.magazineSeries.heading} <em>${business.magazineSeries.headingAccent}</em></h2>
            </div>
            <a class="magazine-series__cta" href="/contact?inquiry=subscription" data-route>
              <span>${business.magazineSeries.ctaLabel}</span>
              ${icon('arrow', 14)}
            </a>
          </div>
          <div class="magazine-series__grid">
            ${business.magazineSeries.issues.map(issue => `
              <article class="magazine-issue-card">
                <div class="magazine-issue-card__frame">
                  <picture>
                    <source srcset="${issue.webp}" type="image/webp" />
                    <img src="${issue.image}" alt="Bhojraj India Magazine — Issue ${issue.number} (${issue.month}): ${issue.theme}" class="magazine-issue-card__img" width="680" height="962" loading="eager" decoding="async" />
                  </picture>
                </div>
                <div class="magazine-issue-card__meta">
                  <span class="magazine-issue-card__label"><strong>${issue.number}</strong> · ${issue.month}</span>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    ` : ''}

    <!-- Business Approach / How We Operate -->
    ${business.approach && business.approach.length ? `
      <section class="section section--division-approach">
        <div class="container">
          <div class="section-heading">
            <div>
              <div class="eyebrow eyebrow--gold">How We Operate</div>
              <h2>Our Business Approach</h2>
            </div>
          </div>
          <div class="approach-track">
            ${business.approach.map(a => `
              <div class="approach-node">
                <div class="approach-step-num">${a.step}</div>
                <div class="approach-step-body">
                  <h4>${a.title}</h4>
                  <p>${a.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    ` : ''}

    <!-- Target Customers & Compliance Framework -->
    ${(business.targetCustomers || business.compliance) ? `
      <section class="section section--division-framework">
        <div class="container framework-grid">
          ${business.targetCustomers && business.targetCustomers.length ? `
            <div class="framework-card">
              <div class="eyebrow eyebrow--gold">${business.slug === 'global-trade' ? 'Target Markets' : 'Target Customers & Industries'}</div>
              <h3>${business.slug === 'global-trade' ? 'Global Footprint' : 'Commercial Partnerships'}</h3>
              <p class="framework-desc">${business.slug === 'global-trade' ? 'Establishing reliable trade conduits connecting Indian supply with prominent international regions:' : 'Serving diversified institutional buyers, industrial facilities, and retail networks:'}</p>
              <div class="target-pills-wrap">
                ${business.targetCustomers.map(tc => `<span class="target-pill">${tc}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          ${business.compliance && business.compliance.length ? `
            <div class="framework-card">
              <div class="eyebrow eyebrow--gold">Corporate Framework</div>
              <h3>Structure & Compliance</h3>
              <p class="framework-desc">Operating in full adherence to statutory, trade, and safety registration standards:</p>
              ${renderCheckList(business.compliance, 'compliance-checklist', 15)}
            </div>
          ` : ''}
        </div>

        ${business.governmentSupport && business.governmentSupport.length ? `
          <div class="container gov-support-box">
            <div class="gov-support-top">
              <div class="eyebrow eyebrow--gold">Subject to Eligibility</div>
              <h3>Government Schemes & Policy Alignment</h3>
              <p>Relevant state and central initiatives supporting MSME development, agro-processing, and export manufacturing:</p>
            </div>
            <div class="gov-schemes-list">
              ${business.governmentSupport.map(g => `
                <div class="gov-scheme-item">
                  <strong>${g.scheme}</strong>
                  <span>${g.benefit}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </section>
    ` : ''}

    <!-- Division Contact Card -->
    <section class="section section--division-cta">
      <div class="container division-cta-banner">
        <div class="division-cta-left">
          <div class="eyebrow eyebrow--gold">Connect with ${business.divisionName || business.label}</div>
          <h2>${business.tagline || 'Building Quality. Creating Opportunities.'}</h2>
          <p>Indore, Madhya Pradesh, India · www.bhojrajgroup.in · @bhojrajindiagroup</p>
        </div>
        <div class="division-cta-actions">
          <a class="button button--gold" href="${contact.whatsapp}" target="_blank" rel="noreferrer">
            Start WhatsApp Chat ${icon('arrow', 16)}
          </a>
          <a class="button button--light" href="mailto:${contact.email}">
            Email Arjun Bhojraj ${icon('arrow', 16)}
          </a>
        </div>
      </div>
    </section>

    <!-- Keep Exploring Other Divisions -->
    <section class="section section--next">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow">The Complete Ecosystem</div>
            <h2>Explore other divisions<br /><span>in Bhojraj India Group.</span></h2>
          </div>
          <a class="text-link text-link--desktop" href="/businesses" data-route>See all 09 divisions ${icon('arrow', 16)}</a>
        </div>
        <div class="next-businesses">
          ${businesses.filter((item) => item.slug !== business.slug).slice(0, 3).map((item) => businessCard(item, true)).join('')}
        </div>
      </div>
    </section>
  </main>
  ${footer()}
`;

const renderSocialFoundation = () => `
  ${header('foundation')}
  <main class="page-social-foundation">
    <!-- Section 1: Hero & Foundation Identity -->
    <section class="detail-hero foundation-hero">
      <div class="container detail-hero__grid">
        <div class="detail-hero__copy">
          <div class="eyebrow eyebrow--gold"><span class="eyebrow-dot"></span>${socialFoundation.initiativeLabel} · ${socialFoundation.motto}</div>
          <h1>${socialFoundation.name}<br /><em>${socialFoundation.tagline}</em></h1>
          <p class="detail-hero-lead">${socialFoundation.intro}</p>
          <div class="detail-pillars-row">
            ${socialFoundation.pillars.map((pillar) => `<span class="detail-pillar-tag">${pillar}</span>`).join('')}
          </div>
          <p class="foundation-focus-line">${socialFoundation.focusAreas}</p>
          <div class="detail-hero-actions">
            <a class="button button--gold" href="${contact.whatsapp}" target="_blank" rel="noreferrer">
              Connect with Foundation ${icon('arrow', 16)}
            </a>
            <a class="text-link" href="mailto:${contact.email}">Email Foundation Desk ${icon('arrow', 16)}</a>
          </div>
        </div>
        <div class="detail-hero__visual">
          <div class="detail-hero__card foundation-logo-card">
            <img src="${socialFoundation.logo}" alt="${socialFoundation.name} logo" class="foundation-logo-card__img" />
            <div class="detail-hero__card-badge">
              <span>${icon('heart', 16)}</span>
              <b>${socialFoundation.motto}</b>
            </div>
          </div>
          <div class="detail-hero__shape"></div>
        </div>
      </div>
    </section>

    <!-- Section 2: Objectives & Long-Term Goals -->
    <section class="section section--foundation-objectives">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow eyebrow--gold">01 · Core Mandate</div>
            <h2>Objectives of<br /><span>${socialFoundation.name}.</span></h2>
          </div>
          <p class="section-heading-sub">${socialFoundation.subtitle}</p>
        </div>
        <div class="products-grid">
          ${socialFoundation.objectives.map((obj) => `
            <div class="product-category-card">
              <div class="product-card-head">
                <span class="product-card-index">${obj.number}</span>
                <span class="product-card-line"></span>
              </div>
              <h3>${obj.title}</h3>
              <p>${obj.description}</p>
            </div>
          `).join('')}
        </div>
        <div class="division-vision-box foundation-goals-card">
          <div class="foundation-goals-head">
            <span class="vision-badge">LONG-TERM GOALS</span>
            <h3>Sustained Social Impact Roadmap</h3>
          </div>
          ${renderCheckList(socialFoundation.longTermGoals, 'foundation-goals-list', 16)}
        </div>
      </div>
    </section>

    <!-- Section 3: Services & Special Social Initiatives -->
    <section class="section section--foundation-services">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow eyebrow--gold">02 · Services &amp; Programmes</div>
            <h2>Services Offered &amp;<br /><span>Special Social Initiatives.</span></h2>
          </div>
          <p class="section-heading-sub">Comprehensive community programmes spanning education, healthcare, women empowerment, youth skills, rural upliftment, and environmental conservation.</p>
        </div>
        <div class="services-grid">
          ${socialFoundation.services.map((service) => `
            <div class="service-block">
              <span class="service-block-num">${service.number}</span>
              <h4>${service.title}</h4>
              ${renderCheckList(service.items, 'service-checklist', 14)}
            </div>
          `).join('')}
        </div>
        <div class="gov-support-box">
          <div class="gov-support-top">
            <div class="eyebrow eyebrow--gold">Flagship Programmes</div>
            <h3>Special Social Initiatives</h3>
            <p>Targeted national and community missions driving measurable grass-roots impact:</p>
          </div>
          <div class="gov-schemes-list">
            ${socialFoundation.initiatives.map((initiative) => `
              <div class="gov-scheme-item">
                <strong>${initiative.name}</strong>
                <span>${initiative.purpose}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: Partnerships, Geographical Outreach & Official Statement CTA -->
    <section class="section section--foundation-outreach">
      <div class="container framework-grid">
        <div class="framework-card">
          <div class="eyebrow eyebrow--gold">03 · Partnerships &amp; Collaborations</div>
          <h3>Collaborative Network</h3>
          <p class="framework-desc">Working in partnership with public institutions, corporate CSR initiatives, and civil society:</p>
          ${renderCheckList(socialFoundation.partnerships, 'compliance-checklist', 15)}
        </div>
        <div class="framework-card">
          <div class="eyebrow eyebrow--gold">04 · Geographical Reach</div>
          <h3>Areas of Operation</h3>
          <div class="foundation-geo-group">
            <h4>India</h4>
            <div class="target-pills-wrap">
              ${socialFoundation.geography.india.map((region) => `<span class="target-pill">${region}</span>`).join('')}
            </div>
          </div>
          <div class="foundation-geo-group">
            <h4>International Outreach</h4>
            <div class="target-pills-wrap">
              ${socialFoundation.geography.international.map((country) => `<span class="target-pill">${country}</span>`).join('')}
            </div>
          </div>
          <p class="foundation-geo-footnote">${socialFoundation.geography.note}</p>
        </div>
      </div>
      <div class="container foundation-cta-wrap">
        <div class="division-cta-banner">
          <div class="division-cta-left">
            <div class="eyebrow eyebrow--gold">Official Foundation Profile · ${socialFoundation.motto}</div>
            <h2>${socialFoundation.tagline}</h2>
            <p>${socialFoundation.profileStatement}</p>
          </div>
          <div class="division-cta-actions">
            <a class="button button--gold" href="${contact.whatsapp}" target="_blank" rel="noreferrer">
              Collaborate via WhatsApp ${icon('arrow', 16)}
            </a>
            <a class="button button--light" href="mailto:${contact.email}">
              Email Foundation Desk ${icon('arrow', 16)}
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
  ${footer()}
`;

const renderContact = () => {
  const params = new URLSearchParams(window.location.search);
  const inquiryType = params.get('inquiry');
  const issueNumber = params.get('issue');
  const magazine = getBusiness('magazine');
  const selectedIssue = issueNumber && magazine?.magazineSeries?.issues
    ? magazine.magazineSeries.issues.find((item) => item.number === issueNumber)
    : null;
  const isSubscription = inquiryType === 'subscription';

  let enquiryTitle = 'Corporate, Trade & Media Enquiries';
  let enquirySummary = 'Connect directly with Bhojraj India Group in Indore for global trade partnerships, manufacturing contracts, institutional supply, magazine subscriptions, or media collaborations.';
  let whatsappUrl = contact.whatsapp;
  let mailHref = `mailto:${contact.email}`;

  if (selectedIssue) {
    enquiryTitle = `Bhojraj India Magazine — Issue ${selectedIssue.number} (${selectedIssue.month})`;
    enquirySummary = `${selectedIssue.volume} · Feature Theme: ${selectedIssue.theme}. Reach out below to request a copy, institutional placement, or edition partnership.`;
    const msg = `Hello Bhojraj India Group, I would like to enquire about Bhojraj India Magazine — ${selectedIssue.volume} (${selectedIssue.theme}).`;
    whatsappUrl = `${contact.whatsapp}?text=${encodeURIComponent(msg)}`;
    mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(`Enquiry: Bhojraj India Magazine Issue ${selectedIssue.number} (${selectedIssue.month})`)}&body=${encodeURIComponent(msg)}`;
  } else if (isSubscription) {
    enquiryTitle = 'Bhojraj India Magazine — 1-Year Subscription (12 Issues)';
    enquirySummary = 'Annual Print & Digital Series covering all 12 monthly editions (January – December 2027). Reach out via WhatsApp, email, or phone to activate your subscription.';
    const msg = 'Hello Bhojraj India Group, I would like to subscribe to the 1-Year Subscription (12 Issues) of Bhojraj India Magazine.';
    whatsappUrl = `${contact.whatsapp}?text=${encodeURIComponent(msg)}`;
    mailHref = `mailto:${contact.email}?subject=${encodeURIComponent('1-Year Subscription Enquiry — Bhojraj India Magazine')}&body=${encodeURIComponent(msg)}`;
  }

  return `
    ${header()}
    <main>
      <section class="page-hero page-hero--contact">
        <div class="container page-hero__inner">
          <div class="eyebrow eyebrow--gold">/ Contact Desk · ${contact.location}</div>
          <h1>Connect with<br /><em>Bhojraj India Group.</em></h1>
          <p>Headquartered in Indore, Madhya Pradesh — connecting Indian enterprise, publications, and supply chains with domestic and global partners.</p>
        </div>
        <div class="page-hero__mark">B/IG</div>
      </section>

      <section class="section section--contact-page">
        <div class="container">
          ${(selectedIssue || isSubscription) ? `
            <div class="contact-enquiry-banner">
              ${selectedIssue ? `<picture class="contact-enquiry-banner__media"><source srcset="${selectedIssue.webp}" type="image/webp" /><img src="${selectedIssue.image}" alt="${selectedIssue.volume}" class="contact-enquiry-banner__cover" width="680" height="962" decoding="async" /></picture>` : ''}
              <div class="contact-enquiry-banner__body">
                <div class="eyebrow eyebrow--gold">${selectedIssue ? 'Selected Magazine Edition' : 'Annual Magazine Subscription'}</div>
                <h2>${enquiryTitle}</h2>
                <p>${enquirySummary}</p>
                <a class="text-link" href="/business/magazine#annual-series" data-route>Back to 12-Issue Series ${icon('arrow', 14)}</a>
              </div>
            </div>
          ` : ''}

          <div class="contact-card contact-page-card">
            <div>
              <div class="eyebrow eyebrow--gold">Direct Communication Desk</div>
              <h2>Start a<br /><em>Conversation.</em></h2>
            </div>
            <div class="contact-card__right">
              <p>${enquirySummary}</p>
              <div class="contact-card__actions">
                <a class="button button--gold" href="${whatsappUrl}" target="_blank" rel="noreferrer">WhatsApp Conversation ${icon('arrow', 16)}</a>
                <a class="text-link" href="${mailHref}">Send an Email ${icon('arrow', 16)}</a>
              </div>
              <div class="contact-list contact-page-list">
                <a href="tel:${contact.phone}">${icon('phone', 16)} ${contact.phoneDisplay}</a>
                <a href="${mailHref}">${icon('mail', 16)} ${contact.email}</a>
                <a href="${contact.websiteUrl}" target="_blank" rel="noreferrer">${icon('globe', 16)} ${contact.website}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${footer()}
  `;
};

const renderCareers = () => `
  ${header('careers')}
  <main class="page-careers">
    <section class="page-hero page-hero--careers">
      <div class="container page-hero__inner">
        <div class="eyebrow eyebrow--gold">${careersData.eyebrow}</div>
        <h1>${careersData.titleLine1}<br /><em>${careersData.titleLine2}</em></h1>
        <p>${careersData.intro}</p>
        <div class="detail-hero-actions">
          <a class="button button--gold" href="#open-positions">Explore Open Positions ${icon('arrow', 16)}</a>
          <a class="text-link" href="#career-application">Submit Application ${icon('arrow', 16)}</a>
        </div>
      </div>
      <div class="page-hero__mark">B/IG</div>
    </section>

    <section class="section section--careers-intro">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow eyebrow--gold">Working With Us</div>
            <h2>Why Join<br /><span>Bhojraj India Group.</span></h2>
          </div>
          <p class="section-heading-sub">Operating out of Indore, Madhya Pradesh across trade, manufacturing, food processing, workforce staffing, and digital media.</p>
        </div>
        <div class="careers-benefits-grid">
          ${careersData.highlights.map((item) => `
            <div class="service-block">
              <span class="service-block-num">${item.number}</span>
              <h4>${item.title}</h4>
              <p>${item.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section section--careers-openings" id="open-positions">
      <div class="container">
        <div class="directory-tools careers-tools">
          <div>
            <div class="eyebrow eyebrow--gold">Current Opportunities</div>
            <h2 class="careers-section-title">Open Positions</h2>
          </div>
          <div class="filter-set careers-filter-set" role="group" aria-label="Filter job openings">
            ${careersData.filters.map((f, idx) => `
              <button class="filter-button careers-filter-btn ${idx === 0 ? 'is-active' : ''}" type="button" data-career-filter="${f.key}">${f.label}</button>
            `).join('')}
          </div>
        </div>
        <div class="careers-openings-grid">
          ${careersData.openings.map((job) => `
            <article class="career-card" data-career-cat="${job.category}">
              <div class="career-card__head">
                <span class="career-card__division">${job.division}</span>
                <span class="career-card__type">${job.type}</span>
              </div>
              <h3>${job.title}</h3>
              <div class="career-card__meta">
                <span>${job.location}</span>
                <span>${job.experience}</span>
                <span>${job.posted}</span>
              </div>
              <p>${job.summary}</p>
              <div class="career-card__skills">
                ${job.skills.map((skill) => `<span class="card-pillar">${skill}</span>`).join('')}
              </div>
              <div class="career-card__foot">
                <button class="button button--gold career-apply-btn" type="button" data-apply-role="${job.title} (${job.division})">
                  Apply for Role ${icon('arrow', 15)}
                </button>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section section--careers-apply" id="career-application">
      <div class="container careers-apply-grid">
        <div class="careers-apply-copy">
          <div class="eyebrow eyebrow--gold">Candidate Desk · Indore HQ</div>
          <h2>Submit Your<br /><em>Application.</em></h2>
          <p>Interested in one of the open roles above or exploring future opportunities across our 09 business verticals? Share your profile details below to route your application directly to HR at <strong>${contact.email}</strong>.</p>
          <div class="careers-direct-box">
            <strong>Direct HR Contact</strong>
            <a href="mailto:${contact.email}">${icon('mail', 15)} ${contact.email}</a>
            <a href="tel:${contact.phone}">${icon('phone', 15)} ${contact.phoneDisplay}</a>
            <a href="${contact.whatsapp}" target="_blank" rel="noreferrer">${icon('arrow', 15)} WhatsApp Talent Desk</a>
          </div>
        </div>
        <form class="careers-form" id="careerApplicationForm" novalidate>
          <div class="careers-form__row">
            <div class="careers-field">
              <label for="careerName">Full Name *</label>
              <input id="careerName" name="name" type="text" required placeholder="Your full name" />
            </div>
            <div class="careers-field">
              <label for="careerPhone">Phone Number *</label>
              <input id="careerPhone" name="phone" type="tel" required placeholder="+91 98XXX XXXXX" />
            </div>
          </div>
          <div class="careers-form__row">
            <div class="careers-field">
              <label for="careerEmail">Email Address *</label>
              <input id="careerEmail" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div class="careers-field">
              <label for="careerRole">Position / Division *</label>
              <select id="careerRole" name="role" required>
                ${careersData.openings.map((job) => `<option value="${job.title} (${job.division})">${job.title} — ${job.division}</option>`).join('')}
                <option value="General / Future Opening (Bhojraj India Group)">General Application — Other Verticals</option>
              </select>
            </div>
          </div>
          <div class="careers-form__row">
            <div class="careers-field">
              <label for="careerExp">Years of Experience</label>
              <input id="careerExp" name="experience" type="text" placeholder="e.g. 2 years in B2B Sales / Fresher" />
            </div>
            <div class="careers-field">
              <label for="careerPortfolio">Resume / LinkedIn / Portfolio URL</label>
              <input id="careerPortfolio" name="portfolio" type="url" placeholder="https://linkedin.com/in/... or Google Drive link" />
            </div>
          </div>
          <div class="careers-field">
            <label for="careerNote">Brief Introduction / Cover Note *</label>
            <textarea id="careerNote" name="note" rows="4" required placeholder="Share your key skills, preferred Indore/regional location, and notice period."></textarea>
          </div>
          <div class="careers-form__actions">
            <button class="button button--gold" type="submit">Prepare Email Application ${icon('arrow', 16)}</button>
          </div>
          <div class="career-form-status" id="careerFormStatus" hidden aria-live="polite"></div>
        </form>
      </div>
    </section>
  </main>
  ${footer()}
`;

const renderNotFound = () => `${header()}<main class="not-found"><div class="container"><div class="eyebrow eyebrow--gold">404 / Detour</div><h1>That page took<br /><em>a different route.</em></h1><a class="button button--gold" href="/" data-route>Return home ${icon('arrow', 16)}</a></div></main>${footer()}`;

const getRoute = () => window.location.pathname.replace(/\/$/, '') || '/';

let activeRevealObserver = null;

const setMobileMenuState = (open) => {
  document.body.classList.toggle('menu-open', open);
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (toggle) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = icon(open ? 'close' : 'menu', 22);
  }
  if (mobileNav) mobileNav.setAttribute('aria-hidden', String(!open));
};

const render = () => {
  setMobileMenuState(false);
  document.body.classList.remove('modal-open');
  const path = getRoute();
  if (path === '/') app.innerHTML = renderHome();
  else if (path === '/businesses') app.innerHTML = renderBusinesses();
  else if (path === '/about') app.innerHTML = renderAbout();
  else if (path === '/social-foundation') app.innerHTML = renderSocialFoundation();
  else if (path === '/careers') app.innerHTML = renderCareers();
  else if (path === '/contact') app.innerHTML = renderContact();
  else if (path.startsWith('/business/')) {
    const business = getBusiness(path.split('/')[2]);
    app.innerHTML = business ? renderBusiness(business) : renderNotFound();
  } else app.innerHTML = renderNotFound();
  const hashId = window.location.hash?.slice(1);
  const hashTarget = hashId ? document.getElementById(hashId) : null;
  if (hashTarget) {
    hashTarget.scrollIntoView({ behavior: 'instant' });
  } else {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  }
  bindInteractions();
};

const bindInteractions = () => {
  document.querySelectorAll('[data-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      event.preventDefault();
      window.history.pushState({}, '', href);
      render();
    });
  });

  const toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      setMobileMenuState(!document.body.classList.contains('menu-open'));
    });
  }

  document.querySelectorAll('.directory-grid').length && document.querySelectorAll('.filter-button[data-filter]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button[data-filter]').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.directory-grid .business-card').forEach((card) => {
      const href = card.getAttribute('href') || card.querySelector('[data-route]')?.getAttribute('href') || '';
      const slug = href.replace('/business/', '');
      let bucket = 'media';
      if (['global-trade', 'industries', 'constructions'].includes(slug)) bucket = 'trade';
      else if (['foods'].includes(slug)) bucket = 'agro';
      else bucket = 'media';

      card.style.display = filter === 'all' || filter === bucket ? '' : 'none';
    });
  }));

  const newsModal = document.getElementById('newsModal');
  if (newsModal) {
    const closeNewsModal = () => {
      newsModal.hidden = true;
      document.body.classList.remove('modal-open');
    };
    document.querySelectorAll('[data-news-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const post = newsUpdates.find((item) => item.id === btn.dataset.newsId);
        if (!post) return;
        document.getElementById('newsModalCat').textContent = post.category;
        document.getElementById('newsModalDate').textContent = post.date;
        document.getElementById('newsModalDivision').textContent = post.division;
        document.getElementById('newsModalTitle').textContent = post.title;
        const bodyEl = document.getElementById('newsModalBody');
        bodyEl.replaceChildren(...post.content.map((text) => {
          const p = document.createElement('p');
          p.textContent = text;
          return p;
        }));
        newsModal.hidden = false;
        document.body.classList.add('modal-open');
      });
    });
    newsModal.querySelectorAll('[data-news-close]').forEach((el) => {
      el.addEventListener('click', closeNewsModal);
    });
  }

  document.querySelectorAll('[data-career-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-career-filter]').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      const filter = button.dataset.careerFilter;
      document.querySelectorAll('.career-card').forEach((card) => {
        card.style.display = filter === 'all' || card.dataset.careerCat === filter ? '' : 'none';
      });
    });
  });

  const careerRoleSelect = document.getElementById('careerRole');
  const careerApplySection = document.getElementById('career-application');
  document.querySelectorAll('[data-apply-role]').forEach((button) => {
    button.addEventListener('click', () => {
      if (careerRoleSelect) {
        careerRoleSelect.value = button.dataset.applyRole;
      }
      if (careerApplySection) {
        careerApplySection.scrollIntoView({ behavior: 'smooth' });
      }
      document.getElementById('careerName')?.focus();
    });
  });

  const careerForm = document.getElementById('careerApplicationForm');
  const careerStatus = document.getElementById('careerFormStatus');
  if (careerForm && careerStatus) {
    careerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(careerForm);
      const name = String(formData.get('name') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const role = String(formData.get('role') || '').trim();
      const experience = String(formData.get('experience') || '').trim();
      const portfolio = String(formData.get('portfolio') || '').trim();
      const note = String(formData.get('note') || '').trim();

      if (!name || !phone || !email || !note) {
        careerStatus.className = 'career-form-status career-form-status--error';
        careerStatus.textContent = 'Please complete your Name, Phone, Email, and Introduction before submitting.';
        careerStatus.hidden = false;
        return;
      }

      const subject = `Career Application: ${role} — ${name}`;
      const bodyText = [
        `Role Applied For: ${role}`,
        `Full Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        experience ? `Experience: ${experience}` : '',
        portfolio ? `Resume / LinkedIn: ${portfolio}` : '',
        '',
        'Cover Note:',
        note
      ].filter(Boolean).join('\n');

      const mailtoHref = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      const waHref = `${contact.whatsapp}?text=${encodeURIComponent(bodyText)}`;

      const msg = document.createElement('p');
      msg.textContent = `Thank you, ${name}. Your application for "${role}" is ready to send to ${contact.email}:`;
      const actions = document.createElement('div');
      actions.className = 'career-status-actions';

      const mailLink = document.createElement('a');
      mailLink.className = 'button button--gold';
      mailLink.href = mailtoHref;
      mailLink.textContent = `Open Email App (${contact.email})`;

      const waLink = document.createElement('a');
      waLink.className = 'button button--light';
      waLink.href = waHref;
      waLink.target = '_blank';
      waLink.rel = 'noreferrer';
      waLink.textContent = 'Send via WhatsApp';

      actions.append(mailLink, waLink);
      careerStatus.className = 'career-form-status career-form-status--ok';
      careerStatus.replaceChildren(msg, actions);
      careerStatus.hidden = false;
      window.location.href = mailtoHref;
    });
  }

  if (activeRevealObserver) {
    activeRevealObserver.disconnect();
    activeRevealObserver = null;
  }

  const revealEls = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  activeRevealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      activeRevealObserver?.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  revealEls.forEach((el) => activeRevealObserver.observe(el));
};

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (document.body.classList.contains('menu-open')) {
      setMobileMenuState(false);
    }
    const newsModal = document.getElementById('newsModal');
    if (newsModal && !newsModal.hidden) {
      newsModal.hidden = true;
      document.body.classList.remove('modal-open');
    }
  }
});

document.addEventListener('click', (event) => {
  if (!document.body.classList.contains('menu-open')) return;
  if (event.target instanceof Node && !event.target.isConnected) return;
  const headerEl = document.querySelector('.site-header');
  if (headerEl && !headerEl.contains(event.target)) {
    setMobileMenuState(false);
  }
});

window.addEventListener('popstate', render);
render();
