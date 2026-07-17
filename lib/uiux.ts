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
// done, and what would prove it worked. Optional — only projects with a
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
  honestNote?: string;
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
      'Food, laundry, groceries — three errands that usually mean three apps, three logins, three couriers circling the same block. Vélo folds them into one courier brand on one bike, on a single home screen where you pick the errand, not the category. The brief I set myself: prove a multi-service courier can feel like one calm product instead of three bolted together.',
    role: 'Solo — product concept, UI design, and the brand identity across the full flow.',
    roles: ['Product concept', 'UI design', 'Brand identity'],
    process: {
      userPain:
        'Campus students don’t have one problem to solve — they have three: hungry, out of clean clothes, out of milk. Solving that meant three different apps, three logins, three delivery windows to plan around, for errands that are really the same ask: someone bring me something, on a campus small enough that the wait shouldn’t be the bottleneck.',
      businessPain:
        'A single-category courier can’t survive on a campus alone — the order volume in any one vertical is too thin to keep a rider fleet busy. The only version of this business that works is one brand running one fleet across food, groceries, and laundry at once, which meant the product had to feel like one service, not three services sharing a logo.',
      competitors:
        'I ran a teardown of Swiggy, Zomato, and Blinkit — the category leaders for food delivery and quick-commerce — plus a broader look at the q-commerce market. Swiggy and Zomato have spent years optimizing a single-category home screen; Blinkit has spent years optimizing 10-minute delivery logistics. None of them had solved for one brand credibly running three categories on one fleet — which is exactly the gap a campus courier has to fill, and exactly why copying either playbook wholesale wouldn’t work.',
      approach:
        'As lead designer, I mapped every one of those apps’ onboarding, home, and cart flows before opening Figma — not to copy the patterns, but to find the one decision each of them had made that Vélo couldn’t afford to inherit: a home screen built around a single category. From there the brief got specific — one home screen, three service cards, one cart — and the coral-on-oxblood identity from the graphic design side carried straight through, so the app never reads like it’s borrowing someone else’s visual language.',
      kpis: [
        'Cross-category repeat usage — did a food order lead to a laundry order',
        'Cart-to-checkout completion rate',
        'Time from app open to order placed',
        'Delivery time against the promised window',
      ],
      outcome:
        'The result is the flow already in this case study — onboarding, home, categories, cart — built around the bet that one fast, focused app beats three slow, generic ones on a campus small enough that speed is the entire pitch.',
    },
    keyDecisions: [
      'One accent colour — coral against an oxblood backdrop. The same restraint instinct from my graphic work, now stretched across a whole product instead of a single poster.',
      'Three services, three cards, one home screen. No fourth option competing for the tap.',
      'The onboarding carousel narrates one specific person — someone who does not want to get off the couch — rather than a generic “fast and convenient” pitch.',
      'The wordmark was drawn to survive a splash screen, a cart badge, and a courier bag before a single screen was laid out, so it never breaks as it shrinks.',
    ],
    honestNote:
      'Every list in this flow still repeats itself — six identical vendor cards, three identical cart items, two identical delivery slots. And the login still greets “Welcome back Sid.” Both get fixed before this goes anywhere near a real user.',
    reflectionHeading: 'What I’d tell you if you asked',
    reflection:
      'Vélo taught me restraint scales. Cutting the fourth service card was harder — and better — than designing one. The night-sky hero is the piece I’d lead any review with.',
    sections: [
      {
        id: 'onboarding',
        label: 'Onboarding',
        blurb: 'A splash, a three-card carousel that narrates one couch-bound person, and a sign-up that gets out of the way.',
        device: 'iphone',
        screens: [
          { src: img('velo', 'loading.svg'), alt: 'Vélo splash screen' },
          { src: img('velo', 'carousel-1.svg'), alt: 'Onboarding carousel — first slide' },
          { src: img('velo', 'carousel-2.svg'), alt: 'Onboarding carousel — second slide' },
          { src: img('velo', 'carousel-3.svg'), alt: 'Onboarding carousel — third slide' },
          { src: img('velo', 'sign-up.svg'), alt: 'Sign-up screen' },
          { src: img('velo', 'login.svg'), alt: 'Login screen' },
          { src: img('velo', 'otp.svg'), alt: 'OTP verification screen' },
        ],
      },
      {
        id: 'home',
        label: 'Home',
        blurb: 'One home screen, three services. The errand is the choice — food, laundry, or groceries — not a category tree.',
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
        blurb: 'The cart got a second pass — a revamp that trimmed checkout down to the fields that actually decide the order.',
        device: 'iphone',
        screens: [
          { src: img('velo', 'cart.svg'), alt: 'Cart for snacks and food' },
          { src: img('velo', 'revamped-cart.svg'), alt: 'Revamped cart screen' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('velo', 'cover.png'), alt: 'Three Vélo phones on a night sky', caption: 'The hero — the wordmark surviving across three screens at once.' },
      { kind: 'board', src: img('velo', 'main-board.png'), alt: 'Vélo home screen presentation board', caption: 'Home, where three services share one calm surface.' },
      { kind: 'board', src: img('velo', 'food-board.png'), alt: 'Vélo food ordering presentation board', caption: 'Food — the busiest of the three services — in context.' },
    ],
  },

  // ─────────────────────────────────────────────────── Festember (app)
  {
    slug: 'festember',
    index: '02',
    title: 'Festember — App',
    tagline: 'The ticketing app 18,000 students actually use to attend the fest.',
    caption: '18,000 students, 500 colleges — and the app has to work on every single one of those four days.',
    discipline: 'Product Design',
    cover: img('festember', 'app/board-cover.svg'),
    coverAlt: 'Festember ticketing app presentation board',
    brief:
      'Festember is NIT Trichy’s flagship cultural fest — 18,000 students, 500 colleges, 11 event clusters, four days in September. This is the functional layer: the app people use to discover events, buy tickets, and manage payments. It stays visually neutral on purpose — thin red line-art and a simple cursive “F” — because unlike the website, the app is reused every year no matter what the theme is.',
    role: 'Solo — app UI across onboarding, event discovery, tickets, and payments.',
    roles: ['App UI', 'Discovery', 'Ticketing', 'Payments'],
    process: {
      userPain:
        'Getting into Festember used to mean juggling people, not screens — one person to ask about registration, another for tickets, a different WhatsApp group for accommodation, and a queue at a physical desk if any of that broke down. For 18,000 students arriving from 500 colleges over four days, that isn’t an edge case, it’s the default experience.',
      businessPain:
        'The organizing team was answering the same handful of questions hundreds of times a day, with no single source of truth for who had registered, who had paid, or who still needed a ticket. That doesn’t scale past a few thousand attendees, and Festember is an order of magnitude bigger than that.',
      competitors:
        'There isn’t a direct competitor for a single-college fest app, so I looked sideways — at general event-ticketing platforms and how they collapse registration, discovery, and payment into one flow without making any single step feel like a form. The pattern that mattered most: the fastest platforms treat payment confirmation as the product’s actual finish line, not an afterthought bolted onto a ticket page.',
      approach:
        'I sat with the organizing committee to map the actual manual process end to end — registration, event discovery across the fest’s eleven clusters, ticketing, payment — before designing a single screen for each step. The app deliberately stays visually neutral, because unlike the website it has to survive being reused year after year regardless of the theme, so the effort went into the flow being obviously correct rather than into a visual identity that would need rebuilding every September.',
      kpis: [
        'App adoption relative to total registered attendees',
        'Support-query volume before vs. after launch',
        'Ticket-purchase completion rate',
        'Time from opening the app to a completed booking',
      ],
      outcome:
        'What shipped replaces the scattered manual process with one flow — onboarding, discovery across real event clusters, a real ticket listing, and payment — with the honest gaps called out rather than hidden, because that’s the actual state of a fest-week build.',
    },
    keyDecisions: [
      'A neutral, theme-proof visual language — thin red line-art on white — because the app gets reused every year while the website gets rebuilt for each theme.',
      'Discovery is organised around the fest’s real structure: 11 event clusters, not an arbitrary grid of tiles.',
      'Real event content on the ticketing flow — an actual Fashionistas Gala listing with a real date, venue, and description — instead of lorem dressed up for a screenshot.',
      'Payments were designed as the screen that absolutely cannot break: one clear amount, one confirmation, a transaction record you can point to later.',
    ],
    honestNote:
      'The profile screen still shows a placeholder phone number (“+1234567890”) — swap it before this goes into any case study. And the vendor/event lists still repeat a few identical cards; real event data fills those, but the repetition has to go first.',
    reflectionHeading: 'Designing the layer nobody photographs',
    reflection:
      'The website gets the applause; the app gets the traffic on fest day. The interesting constraint was making something neutral enough to survive a decade of themes and still not feel generic.',
    sections: [
      {
        id: 'onboarding',
        label: 'Onboarding',
        blurb: 'Start, a themed carousel, sign-in and sign-up — the neutral, reusable entry that every year’s attendees pass through.',
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
        blurb: 'Home, search, and the 11 event clusters — the whole fest laid out the way it is actually organised.',
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
        blurb: 'A real listing — Fashionistas Gala, real date and venue — because the app had to work with real event data from day one.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'app/ticket-desc.svg'), alt: 'Event ticket detail — Fashionistas Gala' },
          { src: img('festember', 'app/anything-desc.svg'), alt: 'Event description screen' },
        ],
      },
      {
        id: 'payments',
        label: 'Payments',
        blurb: 'Buy the ticket, confirm the transaction, keep the record — the part that simply has to work on fest morning.',
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
      { kind: 'board', src: img('festember', 'app/board-onboarding.svg'), alt: 'Festember app onboarding board', caption: 'Onboarding — the reusable front door.' },
      { kind: 'board', src: img('festember', 'app/board-event.svg'), alt: 'Festember app event board', caption: 'Fashionistas Gala — the real event that anchored the ticketing flow.' },
      { kind: 'board', src: img('festember', 'app/board-ticketing.svg'), alt: 'Festember app ticketing board', caption: 'Ticketing, from listing to confirmation.' },
      { kind: 'board', src: img('festember', 'app/board-payments.svg'), alt: 'Festember app payments board', caption: 'Payments — one amount, one confirmation.' },
    ],
  },

  // ───────────────────────────────────────────── Festember (website)
  {
    slug: 'festember-website',
    index: '03',
    title: 'Festember — Website',
    tagline: 'The “Saga of Secrets” marketing site — a noir re-skin built for exactly one year.',
    caption: 'One theme, one year, one noir silhouette — the website that had to feel like a secret worth showing up for.',
    discipline: 'Web Design',
    cover: img('festember', 'web/cover.png'),
    coverAlt: 'Festember Saga of Secrets noir marketing hero',
    brief:
      'The same festival, the other half. Where the app is neutral infrastructure, the website is this year’s poster — re-skinned for the 2025 theme, “Saga of Secrets,” with a noir/silhouette aesthetic built to last one edition, not a decade. Its only job is to make 18,000 students from 500 colleges want to show up.',
    role: 'Solo — marketing website: hero, About, navigation, and the mobile-web treatment.',
    roles: ['Web design', 'Art direction', 'Responsive'],
    process: {
      userPain:
        'A fest website has one job — make someone want to show up — and a generic “events happening” page doesn’t do that. It has to earn attention against everything else competing for a student’s September.',
      businessPain:
        'The organizing team needed a site built around one specific, unifying idea — this year’s theme, “Saga of Secrets” — executed consistently by a team of contributors, not a grab-bag of sections each person interpreted differently. Inconsistent execution across a large contributor team is the real risk on a project like this, more than any single design decision.',
      competitors:
        'I looked at how other large student-run fests build hype on their marketing sites, and pulled reference from the noir and mystery-toned shows and films I kept coming across while researching the theme. The throughline in both: restraint — a small number of strong visual moves (a silhouette, a colour, a font) repeated consistently, rather than a page trying to say everything at once.',
      approach:
        'I worked with the team to lock the shared visual language — the noir/silhouette treatment — early enough that every contributor was building from the same reference instead of reconciling styles after the fact. My part was the hero, the About section, and making sure the navigation held the theme together as people moved through the site.',
      kpis: [
        'Time on site and scroll depth on the hero',
        'Click-through from the marketing site into the ticketing app',
        'Social shares of the hero visual',
        'Visual consistency across every contributor’s section',
      ],
      outcome:
        'The noir hero and About section that resulted are deliberately built for one year, not built to last — next year’s theme gets its own visual language, and that’s a feature of the approach, not a gap in it.',
    },
    keyDecisions: [
      'A noir, silhouette-led hero for “Saga of Secrets” — deliberately disposable art direction, because next year’s theme gets its own.',
      'The desktop hero was designed to survive folding down to a phone-width marketing page without losing the mood.',
      'The site and the app are intentionally different visual languages: one is a one-year poster, the other is a decade of infrastructure. Stating that on purpose beats pretending they match.',
    ],
    honestNote:
      'Urgent: the About headline still reads “…AND SMTH SMTH FOR YOU ONLY,” and the mobile pages still carry “THEME NAME” and “Lorem ipsum” placeholders. These are shorthand left in a nearly-live layout — fix them before anyone sees the page, portfolio or not.',
    reflectionHeading: 'The half that gets to chase a theme',
    reflection:
      'Deciding which layer is allowed to be trendy — the site — and which has to stay quiet for ten years — the app — was the actual design decision here. The noir treatment is the fun part; the discipline was not letting it leak into the app.',
    sections: [
      {
        id: 'desktop',
        label: 'Desktop',
        blurb: 'The full-size noir hero and the About section — the silhouette treatment given the real estate it was built for.',
        device: 'mac',
        url: 'festember.com',
        screens: [
          { src: img('festember', 'web/highlights.svg'), alt: 'Festember website hero — Saga of Secrets' },
          { src: img('festember', 'web/about.svg'), alt: 'Festember website About section' },
        ],
      },
      {
        id: 'mobile',
        label: 'Mobile',
        blurb: 'The same theme folded down to a phone — where most students actually open a fest site from.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'web/landing-1.svg'), alt: 'Mobile website landing — top' },
          { src: img('festember', 'web/landing-2.svg'), alt: 'Mobile website landing — middle' },
          { src: img('festember', 'web/landing-3.svg'), alt: 'Mobile website landing — bottom' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('festember', 'web/cover.png'), alt: 'Festember website cover', caption: 'Saga of Secrets — the year’s marketing face.' },
      {
        kind: 'compare',
        caption: 'The real live festember.com next to my hero — same theme, held to the same noir treatment.',
        before: { src: img('festember', 'web/live-site.jpg'), alt: 'Live festember.com Saga of Secrets homepage', label: 'festember.com — live' },
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
      'TuteDude is real — an IIT Delhi alumni initiative, 250k+ learners, a 4.5-star Google rating. Its whole pitch is a 90-day refund challenge: pay ₹699, finish the course in 90 days, get 100% of your fees back, and keep lifetime access anyway. Their live Python page buries that offer under generic course details. I didn’t wait for a brief — I rebuilt the page so the strongest trust signal is the first thing anyone sees.',
    role: 'Solo — full redesign of the landing page, the “Why TuteDude” value section, and the case study.',
    roles: ['Redesign', 'Landing page', 'Value section'],
    process: {
      userPain:
        'A prospective student landing on an ed-tech course page is trying to answer one question fast — is this worth my money and my time — and most course pages make them read six sections before they can even guess.',
      businessPain:
        'TuteDude’s real page had the strongest answer to that question — a 100% fee refund on completion — buried below generic course details, which means the page’s own best argument for enrolling almost never gets seen.',
      competitors:
        'I ran a competitor pass on Coursera, Udemy, BYJU’S, and Aakash. Coursera and Udemy lead with credibility and social proof — university branding, review counts, star ratings. BYJU’S and Aakash lean harder into urgency and mentor access. None of the four had TuteDude’s actual differentiator — a real, no-strings refund — so the redesign’s job wasn’t to copy any of them, it was to work out which of their tactics TuteDude could legitimately claim, and then rank the refund above all of them.',
      approach:
        'I thought about it in two passes — first as a student, what I’d actually want to see before trusting an unfamiliar platform with money; then as the business, which piece of information converts the highest number of those students. The refund won both questions, so it moved from a footnote to the hero headline, and the rest of the page got restructured into four scannable promises instead of one dense paragraph.',
      kpis: [
        'Enrol-CTA click-through rate',
        'Scroll depth to the CTA — lower is better once the CTA moved up',
        'Bounce rate on the landing page',
        'Time-to-decision — how fast a visitor reaches the enrol click',
      ],
      outcome:
        'The redesigned hero leads with the refund claim, backed by four scannable promises — the case study’s honest note (an unfinished logo strip) is the one piece I didn’t get to before calling this done.',
    },
    keyDecisions: [
      'Pulled the ₹699 → 100% refund offer into the hero as the headline claim — it is the single strongest objection-killer on the page, so it earns the best real estate.',
      'Framed urgency honestly (“only a few seats left”) rather than manufacturing a fake countdown.',
      'Broke the value prop into four scannable promises — free-on-completion learning, 1-on-1 mentor support, doubts solved fast, lifetime access — instead of one paragraph nobody reads past line two.',
      'Kept TuteDude’s real brand colour, price, and course facts, so it reads as their page improved — not a different company’s.',
    ],
    honestNote:
      'The “trusted by 4000+ organizations” logo strip currently repeats just Google and Meta, over and over. Next to a real company’s name that reads as an implied partnership, not a placeholder — swap in a real, varied set of logos, or cut the claim entirely.',
    reflectionHeading: 'Why I rebuilt a page nobody asked me to',
    reflection:
      'The best brief is a real page with a real problem. TuteDude’s refund offer was a gift buried three scrolls down — moving it up was less “design” and more “stop hiding the good part.”',
    sections: [
      {
        id: 'landing',
        label: 'Redesigned Landing',
        blurb: 'The full page, top to bottom — refund offer in the hero, four promises, honest urgency, real course facts.',
        device: 'mac',
        url: 'tutedude.com/category/python',
        screens: [
          { src: img('tutedude', 'screen-0.svg'), alt: 'Redesigned landing — hero with refund claim' },
          { src: img('tutedude', 'screen-1.svg'), alt: 'Redesigned landing — course value' },
          { src: img('tutedude', 'screen-2.svg'), alt: 'Redesigned landing — curriculum' },
          { src: img('tutedude', 'screen-3.svg'), alt: 'Redesigned landing — mentor support' },
          { src: img('tutedude', 'screen-4.webp'), alt: 'Redesigned landing — testimonials' },
          { src: img('tutedude', 'screen-5a.webp'), alt: 'Redesigned landing — blog and resources' },
          { src: img('tutedude', 'screen-5b.webp'), alt: 'Redesigned landing — FAQs and footer' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('tutedude', 'cover.svg'), alt: 'TuteDude redesign cover', caption: 'The redesign, refund offer leading.' },
      { kind: 'board', src: img('tutedude', 'why.svg'), alt: 'Why TuteDude four-promise value grid', caption: 'The value prop broken into four scannable promises.' },
      {
        kind: 'compare',
        caption: 'The real live tutedude.com next to my redesign — same brand and refund offer, restructured so the strongest signal leads.',
        before: { src: img('tutedude', 'live-homepage.jpg'), alt: 'Live tutedude.com homepage', label: 'tutedude.com — live' },
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
    coverAlt: 'TradeView landing page — a single green radial glow on black',
    brief:
      '“Trading app” is one of the most crowded categories on Behance. TradeView’s actual differentiator is the Tesla Stocks Drop screen — a stock-move prediction market with Buy/Sell odds pricing, not a generic buy/sell ticket. The brief I set myself: design a platform where people bet on whether a stock event happens, not just on where the price goes.',
    role: 'Solo — landing page, dashboard, and event/prediction flow.',
    roles: ['Landing page', 'Dashboard', 'Prediction flow'],
    keyDecisions: [
      'A single green radial glow on black for the landing — doing all the “serious fintech” work before a single chart appears.',
      'Odds framed as a plain Win/Loss price ($1 / $0.5) instead of percentages, so the mechanic reads at a glance.',
      'A visible Rules Summary on the event page — a small signal that this is a real market with real rules.',
      'The prediction event, not the dashboard, leads the story — it is the one screen this app has that a thousand other trading apps don’t.',
    ],
    honestNote:
      'The Home dashboard still has two identical chart cards showing the same balance, and cards that literally read “Placeholder Text.” It’s shown last, honestly labelled — the Tesla Stocks Drop screen is what should lead, and does.',
    reflectionHeading: 'The one screen that justified the whole app',
    reflection:
      'Most of TradeView looks like every other trading app because most trading apps do the same things. The prediction-market screen is the exception — and the only screen I’d open a portfolio review with.',
    sections: [
      {
        id: 'event',
        label: 'Prediction Event',
        blurb: 'Tesla Stocks Drop — Buy/Sell odds as a plain price, a visible Rules Summary. The whole reason the app exists.',
        device: 'mac',
        url: 'tradeview.app/event/tesla-drop',
        screens: [{ src: img('tradeview', 'event.svg'), alt: 'Tesla Stocks Drop prediction event page' }],
      },
      {
        id: 'landing',
        label: 'Landing',
        blurb: 'A single green radial glow on black — serious fintech before a chart ever loads.',
        device: 'mac',
        url: 'tradeview.app',
        screens: [{ src: img('tradeview', 'cover.svg'), alt: 'TradeView landing page' }],
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        blurb: 'Shown last, on purpose — the home dashboard is still unfinished, and the copy says so plainly.',
        device: 'mac',
        url: 'tradeview.app/home',
        screens: [{ src: img('tradeview', 'dashboard.svg'), alt: 'TradeView home dashboard (work in progress)' }],
      },
    ],
    extras: [
      { kind: 'board', src: img('tradeview', 'cover.svg'), alt: 'TradeView landing board', caption: 'The landing — the whole “serious fintech” pitch in one glow.' },
      { kind: 'board', src: img('tradeview', 'event.svg'), alt: 'TradeView Tesla Stocks Drop board', caption: 'Tesla Stocks Drop — the differentiator, full size.' },
    ],
  },

  // ─────────────────────────────────────────────────────── Cyberscape
  {
    slug: 'cyberscape',
    index: '06',
    title: 'Cyberscape',
    tagline: 'The web face of Pragyan — NIT Trichy’s techno-managerial fest, in full sci-fi.',
    caption: 'A student-run fest that reaches the whole world — the site had to look the part.',
    discipline: 'Web Design',
    cover: img('cyberscape', 'cover.webp'),
    coverAlt: 'Cyberscape — Pragyan techno-fest landing page',
    brief:
      'Pragyan is NIT Trichy’s international techno-managerial fest — one of India’s largest student-run events. “Cyberscape” was its theme: a realm of cutting-edge tech built to signal that this is where tomorrow’s builders show up. I designed the marketing site — a dark, futuristic landing that had to carry event clusters and a full event catalogue without losing the cinematic mood.',
    role: 'Solo — landing, event clusters, and the event catalogue.',
    roles: ['Web design', 'Art direction', 'Event catalogue'],
    keyDecisions: [
      'A dark, high-contrast sci-fi landing — the fest’s ambition stated visually before a single event is listed.',
      'Event clusters as the organising spine, so a huge catalogue stays navigable instead of a wall of tiles.',
      'A catalogue view that keeps individual events scannable at a glance — dates, tracks, and prizes without a click.',
    ],
    honestNote:
      'A concept web design rather than a shipped build — the landing and cluster views are the strongest pieces; the event catalogue still leans on placeholder listings that need real Pragyan event data before it reads as finished.',
    reflectionHeading: 'Designing for a fest that reaches everyone',
    reflection:
      'A student-run fest that runs events open to the entire world sets a high bar for how serious the site has to look. The fun was letting the theme go fully cinematic while keeping the catalogue usable underneath.',
    sections: [
      {
        id: 'landing',
        label: 'Landing',
        blurb: 'The sci-fi hero — the fest’s ambition stated before a single event is named.',
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
        blurb: 'The catalogue — individual events scannable at a glance, dates and tracks without a click.',
        device: 'mac',
        url: 'pragyan.org/events',
        screens: [{ src: img('cyberscape', 'events.svg'), alt: 'Cyberscape event catalogue' }],
      },
    ],
    extras: [
      { kind: 'board', src: img('cyberscape', 'cover.svg'), alt: 'Cyberscape landing board', caption: 'The landing — full cinematic mood.' },
      { kind: 'board', src: img('cyberscape', 'events.svg'), alt: 'Cyberscape events board', caption: 'The catalogue, kept scannable under the theme.' },
    ],
  },

  // ───────────────────────────────────────────────────────────── Apex
  {
    slug: 'apex',
    index: '07',
    title: 'Apex',
    tagline: 'Investment advisory, capital markets, wealth management — the institutional counterweight.',
    caption: 'One landing screen, positioned for the boardroom instead of the phone.',
    discipline: 'Web Design',
    cover: img('apex', 'cover.webp'),
    coverAlt: 'Apex investment advisory landing page hero',
    brief:
      'Apex is a fintech landing-page concept with a deliberately institutional, B2B tone — investment advisory, capital markets, wealth management. Where TradeView chases a consumer prediction-market thrill, Apex is the counterweight: quieter, heavier, built to be trusted with real money by people who wear suits to talk about it.',
    role: 'Solo — landing page concept and B2B/advisory positioning.',
    roles: ['Landing page', 'Positioning'],
    keyDecisions: [
      'An institutional tone — restrained type, generous whitespace, no consumer-app playfulness — so it reads as advisory, not app-store.',
      'Copy that leads with capability (advisory, capital markets, wealth management) rather than a single feature hook.',
      'A hero that sells credibility before it sells a product — the opposite move from a consumer landing page.',
    ],
    honestNote:
      'This is one landing screen, and I’ll say so plainly: a strong hero, not yet a full case study. It also has to earn its place next to TradeView — Apex proves an institutional, B2B register that TradeView’s consumer angle never tries for. That’s the one-sentence reason both exist.',
    reflectionHeading: 'What one screen can and can’t prove',
    reflection:
      'Apex exists to show range — that I can drop the consumer polish and design something that behaves like it manages a pension fund. It’s the tone I’m proudest of and the flow I most need to finish.',
    sections: [
      {
        id: 'landing',
        label: 'Landing',
        blurb: 'The single hero and the sections beneath it — institutional tone, credibility first, product second.',
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
      { kind: 'board', src: img('apex', 'main.svg'), alt: 'Apex landing board', caption: 'The hero — credibility before product.' },
    ],
  },
];

export function getUiuxProject(slug: string) {
  return uiuxProjects.find((p) => p.slug === slug);
}
