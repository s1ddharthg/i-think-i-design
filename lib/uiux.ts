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
      'Vélo is a quick-commerce concept for the campus food-delivery and grocery industry: food, laundry, and groceries, folded into one courier brand on one bike instead of three separate apps circling the same block. The setup: 6,000 students and 30+ vendors spread across a 300-acre campus, where outsourcing an errand means three logins, three different waiting experiences, three deliveries showing up on three separate schedules. The question I set out to answer: can a multi-service courier feel like one calm product, not three bolted together?',
    role: 'Solo: product concept, UI design, and the brand identity across the full flow.',
    roles: ['Product concept', 'UI design', 'Brand identity'],
    process: {
      userPain:
        'Campus students don’t have one problem, they have three: hungry, out of clean clothes, out of milk. Each one used to mean a different app, a different login, a different delivery window to plan around, for errands that are really the same ask: bring me something, on a campus small enough that waiting shouldn’t be the bottleneck.',
      businessPain:
        'A single-category courier can’t survive on a campus alone. Order volume in any one vertical is too thin to keep a rider fleet busy, so the only version of this business that works is one brand running one fleet across food, groceries, and laundry at once. That’s a product problem as much as an operations one: the app has to feel like one service, not three sharing a logo.',
      competitors:
        'I pulled up Swiggy, Zomato, and Blinkit side by side and mapped exactly where each one’s flow breaks the moment you need something that isn’t food, category depth, checkout friction, how many taps it takes to find anything that isn’t a restaurant. None of the three currently treat a non-food errand like laundry as part of the core loop; it’s food-first, everything else bolted on and buried. That gap, one brand credibly running three categories on one fleet, is exactly what a campus courier has to fill.',
      approach:
        'Before opening Figma, I mapped onboarding, home, and cart across all three apps, not to copy their patterns but to find the one decision each had made that Vélo couldn’t afford to inherit: a home screen built around a single category. From there the brief got specific: one home screen, three service cards, one cart. The coral-on-oxblood identity carries straight through from the brand work, so the app never reads like it borrowed someone else’s visual language.',
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
      'One accent colour, coral against an oxblood backdrop, simplistic and minimal with just enough flair to feel fun without losing the serious, get-it-done core.',
      'Three services, three cards, one home screen. Just what you need, in front of you, nothing else competing for the tap.',
      'The onboarding carousel narrates one specific person, someone who doesn’t want to get off the couch, instead of a generic “fast and convenient” pitch.',
      'Bundling exactly food, laundry, and groceries under one brand, the actual thesis being that these are the three things a hostel student outsources most, and no delivery brand currently owns all three.',
      'The wordmark was drawn to survive a splash screen, a cart badge, and a courier bag before a single screen was laid out, so it holds up at every size it gets used at.',
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
        id: 'home',
        label: 'Home',
        blurb: 'One home screen, three services. The errand is the choice: food, laundry, or groceries, not a category tree.',
        device: 'iphone',
        screens: [
          { src: img('velo', 'home.svg'), alt: 'Vélo home screen with three service cards' },
          { src: img('velo', 'mez.svg'), alt: 'Vélo services screen' },
          { src: img('velo', 'profile.svg'), alt: 'Vélo profile screen' },
        ],
      },
      {
        id: 'categories',
        label: 'Categories',
        blurb: 'Food, groceries, and laundry each get their own browse view built on the same skeleton, so nothing feels bolted on.',
        device: 'iphone',
        screens: [
          { src: img('velo', 'food-category.svg'), alt: 'Food category screen' },
          { src: img('velo', 'groceries-category.svg'), alt: 'Groceries category screen' },
          { src: img('velo', 'add-groceries.svg'), alt: 'Add groceries to cart screen' },
          { src: img('velo', 'laundry.svg'), alt: 'Laundry service screen' },
        ],
      },
      {
        id: 'cart',
        label: 'Cart & Checkout',
        blurb: 'The cart got a second pass: a revamp that trimmed checkout down to the fields that actually decide the order.',
        device: 'iphone',
        screens: [
          { src: img('velo', 'cart.svg'), alt: 'Cart for snacks and food' },
          { src: img('velo', 'revamped-cart.svg'), alt: 'Revamped cart screen' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('velo', 'cover.png'), alt: 'Three Vélo phones on a night sky', caption: 'The hero: the wordmark surviving across three screens at once.' },
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
      'Festember App sits in the event-ticketing industry: it’s the functional layer behind NIT Trichy’s flagship cultural fest, 18,000 students, 500 colleges, four days, and an app that gets exactly one shot a year to not break. People use it to discover events, navigate the fest, buy tickets for workshops and guest lectures, and manage payments without getting lost inside a fest that’s genuinely chaotic by design. It stays visually neutral on purpose, thin red line-art and a simple cursive “F”, because the app has to survive being handed a completely new visual theme every single year without the product underneath it breaking, while staying bold and modern enough that people still want to be part of it. Live now on the Play Store.',
    role: 'Solo: app UI across onboarding, event discovery, tickets, and payments.',
    roles: ['App UI', 'Discovery', 'Ticketing', 'Payments'],
    process: {
      userPain:
        'Getting into Festember used to mean juggling people, not screens: one person to ask about registration, another for tickets, a different WhatsApp group for accommodation, and a queue at a physical desk if any of that broke down. For 18,000 students arriving from 500 colleges over four days, that isn’t an edge case. It’s the default experience.',
      businessPain:
        'The organizing team fielded the same handful of questions hundreds of times a day, with no single source of truth for who had registered, who had paid, or who still needed a ticket. That doesn’t scale past a few thousand attendees, and Festember is an order of magnitude bigger than that.',
      competitors:
        'There’s no direct competitor for a single-college fest app, so I looked at event-discovery apps operating at similar scale, Insider, BookMyShow, and District by Zomato, and mapped exactly how each one structures the flow from browsing to buying, and precisely where each one loses people between the two. The pattern that mattered most: the fastest platforms treat payment confirmation as the actual finish line, not an afterthought bolted onto a ticket page.',
      approach:
        'I sat with the organizing committee and mapped the manual process end to end, registration, discovery across the fest’s eleven clusters, ticketing, payment, before designing a single screen. The app stays visually neutral on purpose: it has to survive being reused every September regardless of theme, so the effort went into the flow being obviously correct rather than into a visual identity that would need rebuilding every year.',
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
      'A neutral, theme-proof visual language, thin red line-art on white, since the app gets reused every year while the marketing site gets rebuilt for each one, kept bold and modern enough that people still want to be part of it.',
      'Real event content from day one: an actual Fashionistas Gala listing with a real date, venue, and description, not lorem text dressed up for a screenshot.',
      'Discovery, ticketing, and payments live inside the same app instead of three separate destinations, since a fest-goer is usually deciding and buying in the same five minutes between classes.',
      'Discovery is organised around the fest’s real structure, 11 event clusters, not an arbitrary grid of tiles.',
      'Familiar navigation, ticketing, and payment patterns throughout. People look for familiarity, not a new pattern to learn, when they’re deciding fast.',
      'Payments were designed as the screen that absolutely cannot break: one clear amount, one confirmation, a transaction record you can point to later.',
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
      { kind: 'board', src: img('festember', 'app/board-cover.svg'), alt: 'Festember app presentation board', caption: 'The neutral app, presented on its own terms.' },
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
      'Festember Website sits in the event-marketing industry: the other half of the same festival as the ticketing app, but built to a completely different brief. Where the app is neutral infrastructure, the website is this year’s poster, re-skinned for the 2025 theme, “Saga of Secrets,” with a noir/silhouette aesthetic built to last one edition, not a decade. Its only job is making 18,000 students from 500 colleges want to show up.',
    role: 'Solo. Marketing website: hero, About, navigation, and the mobile-web treatment.',
    roles: ['Web design', 'Art direction', 'Responsive'],
    process: {
      userPain:
        'A fest website has one job: make someone want to show up. A generic “events happening” page doesn’t do that. It has to earn attention against everything else competing for a student’s September.',
      businessPain:
        'The organizing team needed a site built around one unifying idea, this year’s theme, “Saga of Secrets,” executed consistently by a team of contributors, not a grab-bag of sections each person interpreted differently. Inconsistent execution across a large contributor team is the real risk on a project like this.',
      competitors:
        'For this one I flipped the script. The theme was different enough from a typical fest aesthetic that Dribbble and Behance stopped being useful references, so I pulled from popular video games instead, GTA V, Assassin’s Creed, and the way TV show intro sequences build a whole mood in twenty seconds flat. The throughline across all three: restraint, a small number of strong visual moves, a silhouette, a colour, a font, repeated consistently rather than a page trying to say everything at once.',
      approach:
        'I worked with the team to lock the shared visual language early, the noir/silhouette treatment, so every contributor built from the same reference instead of reconciling styles after the fact. My part was the hero, the About section, and holding the theme together through the navigation as people moved through the site.',
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
      'A noir, silhouette-led hero for “Saga of Secrets,” deliberately disposable art direction, since next year’s theme gets its own.',
      '“Saga of Secrets” is communicated through a minimalist aesthetic on purpose, fewer visual moves, more room for the user to sit with the theme instead of skimming past it.',
      'A full responsive pass, since most of the traffic this page gets is someone checking event timings from their phone, not a desktop.',
      'The site and the app run intentionally different visual languages, one a one-year poster, the other a decade of infrastructure. Stating that on purpose beats pretending they match.',
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
        url: 'festember.com',
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
    extras: [
      { kind: 'board', src: img('festember', 'web/cover.png'), alt: 'Festember website cover', caption: 'Saga of Secrets: the year’s marketing face.' },
      {
        kind: 'compare',
        caption: 'The real live festember.com next to my hero, same theme, held to the same noir treatment.',
        before: { src: img('festember', 'web/live-site.jpg'), alt: 'Live festember.com Saga of Secrets homepage', label: 'festember.com, live' },
        after: { src: img('festember', 'web/highlights.svg'), alt: 'Redesigned Festember hero', label: 'My re-skin' },
      },
    ],
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
      'TuteDude is real: 250,000+ learners, a 4.5-star rating, an IIT Delhi alumni team behind it, and a course page that buries the single best reason to sign up two scrolls down. Its whole pitch is a 90-day refund challenge, pay ₹699, finish the course in 90 days, get 100% of your fees back, and keep lifetime access anyway. Their live Python page leads with course details before it leads with that offer, so I rebuilt the page, uninvited, to put the strongest trust signal first and clear the clutter around it.',
    role: 'Solo: full redesign of the landing page, the “Why TuteDude” value section, and the case study.',
    roles: ['Redesign', 'Landing page', 'Value section'],
    process: {
      userPain:
        'A prospective student landing on an EdTech course page is trying to answer one question fast: is this worth my money and my time. Most course pages make them read six sections before they can even guess. TuteDude’s real page adds to that with its layout, cluttered and disorganised, with the exact data a student or educator would want to see buried under sections that didn’t earn the real estate.',
      businessPain:
        'TuteDude’s real page had the strongest answer to that question, a 100% fee refund on completion, buried below generic course details. The page’s own best argument for enrolling almost never got seen.',
      competitors:
        'I ran a competitor pass on Coursera, Udemy, BYJU’S, and Aakash. Coursera and Udemy lead with credibility and social proof, university branding, review counts, star ratings. BYJU’S and Aakash lean harder into urgency and mentor access. None of the four had TuteDude’s actual differentiator, a real, no-strings refund. So the redesign’s job wasn’t copying any of them, it was working out which of their tactics TuteDude could legitimately claim, then ranking the refund above all of them.',
      approach:
        'I thought about it in two passes: first as a student, what would make me trust an unfamiliar platform with money; then as the business, which piece of information converts the highest number of those students. The refund won both questions, so it moved from a footnote to the hero headline, and the rest of the page got restructured into four scannable promises instead of one dense paragraph.',
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
      'Visual infographics and illustrations in place of paragraphs, so the offer and the curriculum explain themselves faster, and the page just looks cleaner doing it.',
      'A cleaner, more modern, professional design overall, the kind of polish that signals a company worth trusting with your money, not just a good refund policy.',
      'Pulled the ₹699 → 100% refund offer into the hero as the headline claim, the single strongest objection-killer on the page, so it earns the best real estate.',
      'Framed urgency honestly (“only a few seats left”) rather than manufacturing a fake countdown.',
      'Broke the value prop into four scannable promises, free-on-completion learning, 1-on-1 mentor support, doubts solved fast, lifetime access, instead of one paragraph nobody reads past line two.',
      'Kept TuteDude’s real brand colour, price, and course facts, so it reads as their page improved, not a different company’s.',
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
      { kind: 'board', src: img('tutedude', 'cover.svg'), alt: 'TuteDude redesign cover', caption: 'The redesign, refund offer leading.' },
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
      '"Trading app" might be the single most crowded category in every design portfolio on the internet. TradeView earns its place here only because it isn’t really one. It’s a fintech concept in the prediction-markets industry: stocks based on real-world events, where the interesting question isn’t "will the stock go up" but "will this specific thing happen," a prediction market on stock-moving events rather than the stock price itself. I looked at Polymarket and Kalshi for how a prediction market frames odds a first-time user actually understands, next to mainstream trading apps like Zerodha and Groww, to find the exact gap between "trade the stock" and "bet on the event." The brief I set myself: make betting on a real-world event feel as modern, rich, and premium as the best fintech products.',
    role: 'Solo: landing page, dashboard, and event/prediction flow.',
    roles: ['Landing page', 'Dashboard', 'Prediction flow'],
    keyDecisions: [
      'A premium dark theme with glassmorphism, for that expensive, glassy-black feel a platform handling real money should have.',
      'A single green radial glow on black for the landing, doing all the “serious fintech” work before a single chart appears.',
      'Odds framed as a plain Win/Loss price ($1 / $0.5) instead of percentages, so the mechanic reads at a glance.',
      'A visible Rules Summary on the event page, a small signal that this is a real market with real rules.',
      'The prediction event, not the dashboard, leads the story. It’s the one screen this app has that most trading apps don’t.',
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
      { kind: 'board', src: img('tradeview', 'cover.svg'), alt: 'TradeView landing board', caption: 'The landing: the whole “serious fintech” pitch in one glow.' },
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
    keyDecisions: [
      'A cyborg hero illustration with red accent lighting against near-black, doing the same “serious tech” work the Pragyan Hackathon poster does in print, translated to a full site.',
      'Numbered nav ticks (001 / 002 / 003) instead of plain text links, a small detail borrowed from sci-fi interface design that makes even a simple menu feel in-universe.',
      'An artist/DJ-style credit line on the hero, so even a lineup announcement reads like an event poster instead of a schedule.',
      'Event clusters as the organising spine, so a huge catalogue stays navigable instead of a wall of tiles.',
      'A catalogue view that keeps individual events scannable at a glance: dates, tracks, and prizes without a click.',
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
    caption: 'One landing screen, positioned for the boardroom instead of the phone.',
    discipline: 'Web Design',
    cover: img('apex', 'cover.webp'),
    coverAlt: 'Apex investment advisory landing page hero',
    brief:
      'Not every project needs to sound like it’s talking to a 22-year-old. Apex is what happens when I try to sound like I’m talking to someone’s CFO instead. It’s a fintech landing-page concept for the institutional investment-advisory industry: capital markets and wealth management, built minimalist and numbers-forward rather than feature-led. Investment-advisory clients aren’t buying delight, they’re buying calm authority, and a landing page that looks like a consumer app undermines the one thing it’s selling: the sense that these people are careful with your money. I looked at how institutional finance sites, the kind built for board members, not retail traders, use restraint, near-silence, and typography instead of charts and colour to signal seriousness.',
    role: 'Solo: landing page concept and B2B/advisory positioning.',
    roles: ['Landing page', 'Positioning'],
    keyDecisions: [
      'An institutional tone: restrained type, generous whitespace, no consumer-app playfulness, so it reads as advisory, not app-store.',
      'Copy that leads with capability, advisory, capital markets, wealth management, rather than a single feature hook.',
      'A hero that sells credibility before it sells a product, the opposite move from a consumer landing page.',
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
