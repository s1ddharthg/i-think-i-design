// Content + asset map for the real UI/UX product case studies.
// Screens live in /public/images/ui-ux/<slug>/. Each study opens with its
// polished mockup boards, then a section-by-section walkthrough: the left menu
// pins while the screens flow up through a device frame on the right.

export type Device = 'iphone' | 'mac';

export type Screen = { src: string; alt: string };

export type Section = {
  id: string;
  label: string;
  blurb: string;
  device: Device;
  url?: string; // Mac-browser URL pill
  screens: Screen[];
};

// Non-walkthrough visuals. `board`s render up top as the mockup showcase;
// `compare`s render after the walkthrough as before/after against a live site.
export type Extra =
  | { kind: 'board'; src: string; alt: string; caption: string }
  | {
      kind: 'compare';
      caption: string;
      before: { src: string; alt: string; label: string };
      after: { src: string; alt: string; label: string };
    };

// The product-manager layer behind a project: the problem on both sides of
// the table, who else was already solving it, how the work actually got
// done, and what would prove it worked. Optional: only projects with a
// real research trail carry one.
export type ProcessNarrative = {
  userPain: string;
  businessPain: string;
  competitors: string;
  approach: string;
  kpis: string[];
  outcome: string;
};

export type UiuxProject = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  caption: string;
  discipline: string;
  cover: string;
  coverAlt: string;
  brief: string;
  role: string;
  roles: string[];
  process?: ProcessNarrative;
  keyDecisions: string[];
  reflectionHeading: string;
  reflection: string;
  sections: Section[];
  extras?: Extra[];
};

const img = (slug: string, file: string) => `/images/ui-ux/${slug}/${file}`;

export const uiuxProjects: UiuxProject[] = [
  // ─────────────────────────────────────────────────────────── Vélo
  {
    slug: 'velo-app',
    index: '01',
    title: 'Vélo',
    tagline: 'Three errands, one bike, one app I actually wanted to open.',
    caption: 'Three errands. One bike. One app I actually wanted to open.',
    discipline: 'Product Design',
    cover: img('velo', 'cover.png'),
    coverAlt: 'Three phones on a night sky showing the Vélo onboarding, home, and cart screens',
    brief:
      '6,000 students, 30+ vendors, spread across a 300-acre campus. Three apps for three chores is two apps too many — Vélo bets that food, laundry, and groceries can share one courier, one app, and one "wait, that’s already done?"',
    role: 'Solo: product concept, UI design, and the brand identity across the full flow.',
    roles: ['Product concept', 'UI design', 'Brand identity'],
    process: {
      userPain:
        'Hostel and student life means outsourcing errands across three unrelated apps — three logins, three different waiting experiences, three separate deliveries showing up on three separate schedules. None of Swiggy, Zomato, or Blinkit currently treat a non-food errand like laundry as part of their core loop; it’s food-first, everything else bolted on and buried.',
      businessPain: '',
      competitors:
        'Pulled up Swiggy, Zomato, and Blinkit side by side and mapped exactly where each one’s flow breaks the moment you need something that isn’t food — category depth, checkout friction, how many taps it takes to find anything that isn’t a restaurant.',
      approach: '',
      kpis: [
        'Cross-category repeat usage: did a food order lead to a laundry order',
        'Cart-to-checkout completion rate',
        'Time from app open to order placed',
        'Delivery time against the promised window',
      ],
      outcome:
        'What shipped is the flow in this case study: onboarding, home, categories, cart, built on one bet, a fast, focused app beats three slow, generic ones on a campus small enough that speed is the entire pitch.',
    },
    keyDecisions: [
      'An onboarding carousel narrates a specific person, someone who doesn’t want to leave the couch, not a generic "fast and convenient" pitch.',
      'Three services, three cards, one home screen. Just what you need, in front of you, nothing else competing for attention.',
      'Bundling exactly food, laundry, and groceries under one brand — the actual thesis being that these are the three things a hostel student outsources most, and no one delivery brand currently owns all three.',
      'Simplistic and minimal, with just enough flair to feel fun without losing the serious, get-it-done core.',
    ],
    reflectionHeading: 'The restraint lesson',
    reflection:
      'Vélo taught me restraint scales past a single poster. Cutting the fourth service card was harder, and better, than designing one. The night-sky hero is the piece I’d lead any review with.',
    sections: [
      {
        id: 'onboarding',
        label: 'Onboarding',
        blurb: 'A splash, a three-card carousel that narrates one couch-bound person, and a sign-up that gets out of the way.',
        device: 'iphone',
        screens: [
          { src: img('velo', 'loading.svg'), alt: 'Vélo splash screen' },
          { src: img('velo', 'carousel-1.svg'), alt: 'Onboarding carousel: first slide' },
          { src: img('velo', 'carousel-2.svg'), alt: 'Onboarding carousel: second slide' },
          { src: img('velo', 'carousel-3.svg'), alt: 'Onboarding carousel: third slide' },
          { src: img('velo', 'sign-up.svg'), alt: 'Sign-up screen' },
          { src: img('velo', 'login.svg'), alt: 'Login screen' },
          { src: img('velo', 'otp.svg'), alt: 'OTP verification screen' },
        ],
      },
      {
        id: 'categories',
        label: 'Categories',
        blurb: 'One home screen, three services, and a browse view for each: food, groceries, and laundry share the same skeleton, so nothing feels bolted on.',
        device: 'iphone',
        screens: [
          { src: img('velo', 'home.svg'), alt: 'Vélo home screen with three service cards' },
          { src: img('velo', 'food-category.svg'), alt: 'Food category screen' },
          { src: img('velo', 'groceries-category.svg'), alt: 'Groceries category screen' },
          { src: img('velo', 'laundry.svg'), alt: 'Laundry service screen' },
        ],
      },
      {
        id: 'cart',
        label: 'Cart & Checkout',
        blurb: 'The cart got a second pass: a revamp that trimmed checkout down to the fields that actually decide the order.',
        device: 'iphone',
        screens: [
          { src: img('velo', 'revamped-cart.svg'), alt: 'Revamped cart screen' },
          { src: img('velo', 'add-groceries.svg'), alt: 'Add groceries to cart screen' },
          { src: img('velo', 'mez.svg'), alt: 'Vélo services screen' },
          { src: img('velo', 'profile.svg'), alt: 'Vélo profile screen' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('velo', 'main-board.png'), alt: 'Vélo home screen presentation board', caption: 'Home, where three services share one calm surface.' },
      { kind: 'board', src: img('velo', 'food-board.png'), alt: 'Vélo food ordering presentation board', caption: 'Food, the busiest of the three services, in context.' },
    ],
  },

  // ─────────────────────────────────────────────────── Festember (app)
  {
    slug: 'festember',
    index: '02',
    title: 'Festember App',
    tagline: 'The ticketing app 18,000 students actually use to attend the fest.',
    caption: 'The website gets applause. The app gets the traffic on fest day, built to sustain and deliver.',
    discipline: 'Product Design',
    cover: img('festember', 'app/board-cover.svg'),
    coverAlt: 'Festember ticketing app presentation board',
    brief:
      '18,000 students, 500 colleges, four days, and an app that gets exactly one shot a year to not break. Live now on the Play Store.',
    role: 'Solo: app UI across onboarding, event discovery, tickets, and payments.',
    roles: ['App UI', 'Discovery', 'Ticketing', 'Payments'],
    process: {
      userPain:
        'Students need to discover events, navigate the fest, buy tickets for workshops and guest lectures, and manage payments without getting lost inside a fest that’s genuinely chaotic by design. The harder business problem: the app has to survive being handed a completely new visual theme every single year without the underlying product breaking underneath it.',
      businessPain: '',
      competitors:
        'How event-discovery apps at similar scale — Insider, BookMyShow, District by Zomato — structure their discovery-to-ticket flow, and where they lose people between "browsing" and "bought."',
      approach: '',
      kpis: [
        'Ticket-purchase completion rate',
        'Time from opening the app to a completed booking',
        'App adoption relative to total registered attendees',
        'Support-query volume before vs. after launch',
        'Day-of-fest crash-free sessions, the one metric that actually matters more than any of the others: an app that goes down on day two of a four-day fest has failed regardless of how it looks.',
      ],
      outcome:
        'What shipped replaces the scattered manual process with one flow: onboarding, discovery across real event clusters, a real ticket listing, and payment. It’s the app 18,000 students actually use to get into the fest.',
    },
    keyDecisions: [
      'The app stays visually neutral on purpose, so it gets reused every year regardless of theme — bold, modern, and stylish enough that people still want to be part of the experience.',
      'Real event content from day one: actual event listings with a real date, venue, and description, not lorem text dressed up for a screenshot.',
      'Discovery, ticketing, and payments all live inside the same app instead of three separate destinations, since fest-goers are usually deciding and buying in the same five minutes between classes.',
      'Familiar navigation, ticketing, and payment experiences throughout — people look for familiarity, not a new pattern to learn.',
    ],
    reflectionHeading: 'Designing the layer nobody photographs',
    reflection:
      'The website gets the applause; the app gets the traffic on fest day. The interesting constraint was making something neutral enough to survive a decade of themes and still not feel generic.',
    sections: [
      {
        id: 'onboarding',
        label: 'Onboarding',
        blurb: 'Start, a themed carousel, sign-in and sign-up: the neutral, reusable entry that every year’s attendees pass through.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'app/start.svg'), alt: 'Festember app start screen' },
          { src: img('festember', 'app/carousel-2.svg'), alt: 'Onboarding carousel slide' },
          { src: img('festember', 'app/carousel-3.svg'), alt: 'Onboarding carousel slide' },
          { src: img('festember', 'app/carousel-4.svg'), alt: 'Onboarding carousel slide' },
          { src: img('festember', 'app/sign-in.svg'), alt: 'Sign-in screen' },
          { src: img('festember', 'app/sign-up-1.svg'), alt: 'Sign-up step one' },
          { src: img('festember', 'app/sign-up-2.svg'), alt: 'Sign-up step two' },
          { src: img('festember', 'app/loading.svg'), alt: 'Loading screen' },
        ],
      },
      {
        id: 'discover',
        label: 'Discover',
        blurb: 'Home, search, and the 11 event clusters: the whole fest laid out the way it is actually organised.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'app/main.svg'), alt: 'App home screen' },
          { src: img('festember', 'app/search.svg'), alt: 'Event search screen' },
          { src: img('festember', 'app/clusters.svg'), alt: 'Event clusters overview' },
          { src: img('festember', 'app/menu-expanded.svg'), alt: 'Expanded navigation menu' },
        ],
      },
      {
        id: 'event',
        label: 'Event',
        blurb: 'A real listing, Fashionistas Gala, real date and venue, because the app had to work with real event data from day one.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'app/ticket-desc.svg'), alt: 'Event ticket detail: Fashionistas Gala' },
          { src: img('festember', 'app/anything-desc.svg'), alt: 'Event description screen' },
        ],
      },
      {
        id: 'payments',
        label: 'Payments',
        blurb: 'Buy the ticket, confirm the transaction, keep the record: the part that simply has to work on fest morning.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'app/payments.svg'), alt: 'Payment screen' },
          { src: img('festember', 'app/transaction.svg'), alt: 'Transaction confirmation screen' },
          { src: img('festember', 'app/profile.svg'), alt: 'Profile screen' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('festember', 'app/board-onboarding.svg'), alt: 'Festember app onboarding board', caption: 'Onboarding: the reusable front door.' },
      { kind: 'board', src: img('festember', 'app/board-event.svg'), alt: 'Festember app event board', caption: 'Fashionistas Gala: the real event that anchored the ticketing flow.' },
      { kind: 'board', src: img('festember', 'app/board-ticketing.svg'), alt: 'Festember app ticketing board', caption: 'Ticketing, from listing to confirmation.' },
      { kind: 'board', src: img('festember', 'app/board-payments.svg'), alt: 'Festember app payments board', caption: 'Payments: one amount, one confirmation.' },
    ],
  },

  // ───────────────────────────────────────────── Festember (website)
  {
    slug: 'festember-website',
    index: '03',
    title: 'Festember Website',
    tagline: 'The “Saga of Secrets” marketing site: a noir re-skin built for exactly one year.',
    caption: 'One festival. A theme that gets one year to matter.',
    discipline: 'Web Design',
    cover: img('festember', 'web/cover.png'),
    coverAlt: 'Festember Saga of Secrets noir marketing hero',
    brief:
      'The website built for NIT Trichy’s annual inter-college cultural festival. The website’s only job is to make this year’s theme, "Saga of Secrets," look worth showing up for — a new line of thought every year.',
    role: 'Solo. Marketing website: hero, About, navigation, and the mobile-web treatment.',
    roles: ['Web design', 'Art direction', 'Responsive'],
    process: {
      userPain:
        'To design a website that symbolises this edition’s theme without seeming overly dramatic. A marketing site that looks the same as last year’s doesn’t do the job — it needs great UX to inform people while still looking fun and creative, like a fest website should.',
      businessPain: '',
      competitors:
        'I flipped the script. This year’s theme was different enough that instead of Dribbble or Behance, I looked at elements from popular video games like GTA V and Assassin’s Creed, and TV show intro sequences that fit the mood.',
      approach: '',
      kpis: [
        'Time on site and scroll depth on the hero',
        'Click-through from the marketing site into the ticketing app',
        'Social shares of the hero visual',
        'Visual consistency across every contributor’s section',
      ],
      outcome:
        'The noir hero and About section that resulted are built for one year, not built to last. Next year’s theme gets its own visual language, and that’s a feature of the approach, not a gap in it.',
    },
    keyDecisions: [
      'A noir, silhouette-driven aesthetic built specifically for one year’s theme.',
      '"Saga of Secrets" communicated through a minimalist aesthetic that gives the user room to sit with the theme instead of skimming past it.',
      'A full responsive pass, since most of the traffic this page gets is someone checking event timings from their phone, not a desktop.',
    ],
    reflectionHeading: 'The half that gets to chase a theme',
    reflection:
      'Deciding which layer is allowed to be trendy (the site) and which has to stay quiet for ten years (the app) was the actual design decision here. The noir treatment is the fun part; the discipline was not letting it leak into the app.',
    sections: [
      {
        id: 'desktop',
        label: 'Desktop',
        blurb: 'The full-size noir hero and the About section: the silhouette treatment given the real estate it was built for.',
        device: 'mac',
        screens: [
          { src: img('festember', 'web/highlights.svg'), alt: 'Festember website hero: Saga of Secrets' },
          { src: img('festember', 'web/about.svg'), alt: 'Festember website About section' },
        ],
      },
      {
        id: 'mobile',
        label: 'Mobile',
        blurb: 'The same theme folded down to a phone, where most students actually open a fest site from.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'web/landing-1.svg'), alt: 'Mobile website landing, top' },
          { src: img('festember', 'web/landing-2.svg'), alt: 'Mobile website landing, middle' },
          { src: img('festember', 'web/landing-3.svg'), alt: 'Mobile website landing, bottom' },
        ],
      },
    ],
    extras: [],
  },

  // ──────────────────────────────────────────────────────── TuteDude
  {
    slug: 'tutedude',
    index: '04',
    title: 'TuteDude',
    tagline: 'A real course page, rebuilt uninvited to answer the one question keeping people from enrolling.',
    caption: 'TuteDude’s real course page, rebuilt to answer the one question keeping people from clicking enroll.',
    discipline: 'Web Design',
    cover: img('tutedude', 'cover.svg'),
    coverAlt: 'TuteDude Python course landing page redesign cover',
    brief:
      'TuteDude is real: 250,000+ learners, a 4.5-star rating, an IIT Delhi alumni team behind it, and a course page that buries the single best reason to sign up two scrolls down. I didn’t wait for an invitation to fix that.',
    role: 'Solo: full redesign of the landing page, the “Why TuteDude” value section, and the case study.',
    roles: ['Redesign', 'Landing page', 'Value section'],
    process: {
      userPain:
        'The site looks cluttered and disorganised. TuteDude’s real Python course page leads with course details before it leads with its strongest trust signal: a 100% fee refund on completion. Anyone who bounces in the first ten seconds never sees the one thing that kills their biggest objection, and a lot of the data a student or educator would want to see stays buried.',
      businessPain: '',
      competitors:
        'Coursera, Udemy, BYJU’S, and Aakash — specifically how each one handles pricing anxiety and urgency, since that’s the exact moment TuteDude’s page was losing people.',
      approach: '',
      kpis: [
        'Enrol-CTA click-through rate',
        'Scroll depth to the CTA (lower is better once the CTA moved up)',
        'Bounce rate on the landing page',
        'Time-to-decision: how fast a visitor reaches the enrol click',
      ],
      outcome:
        'The redesigned hero leads with the refund claim, backed by four scannable promises, the value proposition TuteDude already had, finally given the real estate it earned.',
    },
    keyDecisions: [
      'Visual infographics and illustrations in place of paragraphs, so the offer and the curriculum explain themselves faster and the page looks cleaner doing it.',
      'A cleaner, more modern, professional design overall — the kind of polish that signals a company worth trusting with your money.',
      'Pulled the refund offer into the hero as the headline claim instead of leaving it in the fine print. It’s the strongest objection-killer on the page, so it earns the best real estate.',
      'Framed urgency honestly ("only a few seats left") instead of manufacturing false scarcity with a countdown timer that resets every time you refresh.',
      'Broke the value proposition into four scannable promises — free-on-completion learning, 1-on-1 mentor support, doubts solved in 10 minutes, lifetime access — instead of one paragraph nobody reads past line two.',
    ],
    reflectionHeading: 'Why I rebuilt a page nobody asked me to',
    reflection:
      'The best brief is a real page with a real problem. TuteDude’s refund offer was a gift buried three scrolls down. Moving it up was less “design” and more “stop hiding the good part.”',
    sections: [
      {
        id: 'landing',
        label: 'Redesigned Landing',
        blurb: 'The full page, top to bottom: refund offer in the hero, four promises, honest urgency, real course facts.',
        device: 'mac',
        url: 'tutedude.com/category/python',
        screens: [
          { src: img('tutedude', 'screen-0.svg'), alt: 'Redesigned landing: hero with refund claim' },
          { src: img('tutedude', 'screen-1.svg'), alt: 'Redesigned landing: course value' },
          { src: img('tutedude', 'screen-2.svg'), alt: 'Redesigned landing: curriculum' },
          { src: img('tutedude', 'screen-3.svg'), alt: 'Redesigned landing: mentor support' },
          { src: img('tutedude', 'screen-4.webp'), alt: 'Redesigned landing: testimonials' },
          { src: img('tutedude', 'screen-5a.webp'), alt: 'Redesigned landing: blog and resources' },
          { src: img('tutedude', 'screen-5b.webp'), alt: 'Redesigned landing: FAQs and footer' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('tutedude', 'why.svg'), alt: 'Why TuteDude four-promise value grid', caption: 'The value prop broken into four scannable promises.' },
      {
        kind: 'compare',
        caption: 'The real live tutedude.com next to my redesign, same brand and refund offer, restructured so the strongest signal leads.',
        before: { src: img('tutedude', 'live-homepage.jpg'), alt: 'Live tutedude.com homepage', label: 'tutedude.com, live' },
        after: { src: img('tutedude', 'screen-0.svg'), alt: 'Redesigned TuteDude hero', label: 'My redesign' },
      },
    ],
  },

  // ─────────────────────────────────────────────────────── TradeView
  {
    slug: 'tradeview',
    index: '05',
    title: 'TradeView',
    tagline: 'A prediction market, not just another trading app.',
    caption: 'Not “will the stock go up.” “Will this exact thing happen.”',
    discipline: 'Web Design',
    cover: img('tradeview', 'cover.svg'),
    coverAlt: 'TradeView landing page: a single green radial glow on black',
    brief:
      '"Trading app" might be the single most crowded category in every design portfolio on the internet. TradeView only earns its place here because it isn’t really one.',
    role: 'Solo: landing page, dashboard, and event/prediction flow.',
    roles: ['Landing page', 'Dashboard', 'Prediction flow'],
    process: {
      userPain:
        'TradeView is not a standard trading application — it’s a concept for a trading platform where stocks are based on real-world events. The more interesting question, and the one nobody’s core product is built around: will this specific thing happen. A prediction market on stock-moving events, not the stock price itself.',
      businessPain: '',
      competitors:
        'Polymarket and Kalshi for how prediction markets frame odds in a way a first-time user actually understands, next to mainstream trading apps like Zerodha and Groww, to find the exact gap between "trade the stock" and "bet on the event."',
      approach: '',
      kpis: [],
      outcome: '',
    },
    keyDecisions: [
      'A premium dark theme with glassmorphism, for that expensive, glassy-black feel a platform handling real money should have.',
      'A single green radial glow on black for the landing page, doing all the "serious fintech" work before a single chart appears.',
      'Odds framed as a plain Win/Loss price ($1 / $0.5) instead of a percentage, so the mechanic reads in one glance instead of requiring math.',
      'A visible Rules Summary on every event page, a small trust signal that this is a real market with real rules, not a UI mockup pretending to be one.',
    ],
    reflectionHeading: 'The one screen that justified the whole app',
    reflection:
      'Most of TradeView looks like every other trading app because most trading apps do the same things. The prediction-market screen is the exception, and the only screen I’d open a portfolio review with.',
    sections: [
      {
        id: 'event',
        label: 'Prediction Event',
        blurb: 'Tesla Stocks Drop: Buy/Sell odds as a plain price, a visible Rules Summary. The whole reason the app exists.',
        device: 'mac',
        url: 'tradeview.app/event/tesla-drop',
        screens: [{ src: img('tradeview', 'event.svg'), alt: 'Tesla Stocks Drop prediction event page' }],
      },
      {
        id: 'landing',
        label: 'Landing',
        blurb: 'A single green radial glow on black: serious fintech before a chart ever loads.',
        device: 'mac',
        url: 'tradeview.app',
        screens: [{ src: img('tradeview', 'cover.svg'), alt: 'TradeView landing page' }],
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        blurb: 'The home base: balances, activity, and a way back into every open position.',
        device: 'mac',
        url: 'tradeview.app/home',
        screens: [{ src: img('tradeview', 'dashboard.svg'), alt: 'TradeView home dashboard' }],
      },
    ],
    extras: [
      { kind: 'board', src: img('tradeview', 'event.svg'), alt: 'TradeView Tesla Stocks Drop board', caption: 'Tesla Stocks Drop: the differentiator, full size.' },
    ],
  },

  // ─────────────────────────────────────────────────────── Cyberscape
  {
    slug: 'cyberscape',
    index: '06',
    title: 'Cyberscape',
    tagline: 'The web face of Pragyan: NIT Trichy’s techno-managerial fest, in full sci-fi.',
    caption: 'Pragyan doesn’t want to look friendly. It wants to look like it knows something you don’t yet.',
    discipline: 'Web Design',
    cover: img('cyberscape', 'cover.webp'),
    coverAlt: 'Cyberscape: Pragyan techno-fest landing page',
    brief:
      'Cyberscape sits in the event-marketing industry: the web face of Pragyan, NIT Trichy’s international techno-managerial fest and one of India’s largest student-run events. Pragyan draws a more technical, slightly older crowd than a cultural fest, industry sponsors, workshop-goers, people deciding whether this fest is worth their company’s name on a banner, and a typical cultural-fest visual language would have undersold that completely. I looked at cyberpunk and gaming-event sites, the kind that show up on Awwwards for exactly this reason, to find how much “dangerous” a college fest site can get away with before it stops being legible to a sponsor scanning it on a phone. What I designed: a dark, futuristic landing that carries event clusters and a full event catalogue across several navigable pages without losing the cinematic mood.',
    role: 'Solo: landing, event clusters, and the event catalogue.',
    roles: ['Web design', 'Art direction', 'Event catalogue'],
    process: {
      userPain:
        'Pragyan draws a more technical, slightly older crowd than Festember — industry sponsors, workshop-goers, people evaluating whether this fest is worth their company’s name on a banner. A cultural-fest visual language would undersell that entirely. The site needed to look serious and slightly unsettling, on purpose.',
      businessPain: '',
      competitors:
        'Cyberpunk and gaming-event sites, the kind that show up on Awwwards for exactly this reason, to find how much "dangerous" a college fest website can get away with before it stops being legible to a sponsor scanning it on a phone.',
      approach: '',
      kpis: [],
      outcome: '',
    },
    keyDecisions: [
      'A cyborg hero illustration with red accent lighting against near-black, doing the same "serious tech" work the Pragyan Hackathon poster does in print, translated to a full site.',
      'Numbered nav ticks (001 / 002 / 003) instead of plain text links, a small detail borrowed from sci-fi interface design that makes even a simple menu feel in-universe.',
      'An artist/DJ-style credit line on the hero, so even a lineup announcement reads like an event poster instead of a schedule.',
    ],
    reflectionHeading: 'Designing for a fest that reaches everyone',
    reflection:
      'A student-run fest that runs events open to the entire world sets a high bar for how serious the site has to look. The fun was letting the theme go fully cinematic while keeping the catalogue usable underneath. If I were shipping this for real, I’d watch two numbers: time on the Events/Clusters page, a proxy for whether the theme holds attention or gets in the way, and sponsor-page click-through from the hero.',
    sections: [
      {
        id: 'landing',
        label: 'Landing',
        blurb: 'The sci-fi hero: the fest’s ambition stated before a single event is named.',
        device: 'mac',
        url: 'pragyan.org',
        screens: [{ src: img('cyberscape', 'cover.svg'), alt: 'Cyberscape landing hero' }],
      },
      {
        id: 'clusters',
        label: 'Clusters',
        blurb: 'Event clusters as the organising spine, keeping a huge catalogue navigable.',
        device: 'mac',
        url: 'pragyan.org/clusters',
        screens: [{ src: img('cyberscape', 'cluster.svg'), alt: 'Cyberscape event clusters' }],
      },
      {
        id: 'events',
        label: 'Events',
        blurb: 'The catalogue: individual events scannable at a glance, dates and tracks without a click.',
        device: 'mac',
        url: 'pragyan.org/events',
        screens: [{ src: img('cyberscape', 'events.svg'), alt: 'Cyberscape event catalogue' }],
      },
    ],
    extras: [
      { kind: 'board', src: img('cyberscape', 'cover.svg'), alt: 'Cyberscape landing board', caption: 'The landing: full cinematic mood.' },
      { kind: 'board', src: img('cyberscape', 'events.svg'), alt: 'Cyberscape events board', caption: 'The catalogue, kept scannable under the theme.' },
    ],
  },

  // ───────────────────────────────────────────────────────────── Apex
  {
    slug: 'apex',
    index: '07',
    title: 'Apex',
    tagline: 'Investment advisory, capital markets, wealth management: the institutional counterweight.',
    caption: 'Positioned for the boardroom.',
    discipline: 'Web Design',
    cover: img('apex', 'cover.webp'),
    coverAlt: 'Apex investment advisory landing page hero',
    brief:
      'Not every project needs to sound like it’s talking to a 22-year-old. Apex is what happens when I try to sound like I’m talking to someone’s CFO instead.',
    role: 'Solo: landing page concept and B2B/advisory positioning.',
    roles: ['Landing page', 'Positioning'],
    process: {
      userPain:
        'Investment advisory clients aren’t buying delight, they’re buying calm authority. A landing page for a wealth-management platform that looks like a consumer app undermines the one thing it’s selling: the sense that these people are careful with your money.',
      businessPain: '',
      competitors:
        'How institutional finance sites, the kind built for board members, not retail traders, use restraint, near-silence, and typography instead of charts and color to signal seriousness.',
      approach: '',
      kpis: [],
      outcome: '',
    },
    keyDecisions: [
      'Near-black background, restrained white type, no dashboard chrome up front, so the first impression is trust and authority, not data density.',
      'A copy-led hero instead of a product screenshot — the words "we help investors and businesses make confident financial decisions" have to do the convincing before any UI shows up.',
      'One visual flourish only, an isometric card stack, so restraint doesn’t tip into blankness.',
    ],
    reflectionHeading: 'What one screen can prove',
    reflection:
      'Apex exists to show range: that I can drop the consumer polish and design something that behaves like it manages a pension fund. It’s the tone I’m proudest of on this site.',
    sections: [
      {
        id: 'landing',
        label: 'Landing',
        blurb: 'The single hero and the sections beneath it: institutional tone, credibility first, product second.',
        device: 'mac',
        url: 'apex.capital',
        screens: [
          { src: img('apex', 'main.svg'), alt: 'Apex landing hero' },
          { src: img('apex', 'highlights.svg'), alt: 'Apex highlights section' },
          { src: img('apex', 'footer.svg'), alt: 'Apex footer' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('apex', 'main.svg'), alt: 'Apex landing board', caption: 'The hero: credibility before product.' },
    ],
  },
];

export function getUiuxProject(slug: string) {
  return uiuxProjects.find((p) => p.slug === slug);
}
