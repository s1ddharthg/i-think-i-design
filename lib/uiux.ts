// Content + asset map for the real UI/UX product case studies.
// Screens live in /public/images/ui-ux/<slug>/. Each study segments a product's
// screens into labelled sections (Onboarding, Home, Cart, Payments…) that render
// inside an auto-scrolling device mockup — an iPhone for mobile, a Mac browser
// for web.

export type Device = 'iphone' | 'mac';

export type Screen = { src: string; alt: string };

export type Section = {
  id: string;
  label: string;
  blurb: string;
  device: Device;
  // Mac-browser URL pill. Ignored for iPhone sections.
  url?: string;
  screens: Screen[];
};

// Non-filmstrip visuals shown after the walkthrough — hero boards, and the
// before/after comparisons against a real live site.
export type Extra =
  | { kind: 'board'; src: string; alt: string; caption: string; device?: Device }
  | {
      kind: 'compare';
      caption: string;
      before: { src: string; alt: string; label: string } | { placeholder: string; label: string };
      after: { src: string; alt: string; label: string };
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
      'Food, laundry, and groceries usually mean three apps, three logins, three couriers circling the same block. Vélo folds them into one courier brand on one bike — a single home screen where the errand, not the category, is the thing you choose. The design brief I set myself: prove a multi-service courier can feel like one calm product, not three bolted together.',
    role: 'Solo — product concept, UI design, and the brand identity across the full flow.',
    roles: ['Product concept', 'UI design', 'Brand identity'],
    keyDecisions: [
      'One accent colour (coral/peach) against an oxblood backdrop — the same restraint instinct from my graphic work, now applied to a full product instead of one poster.',
      'Three services, three cards, one home screen. No fourth option competing for attention.',
      'The onboarding carousel narrates a specific person — someone who doesn’t want to leave the couch — instead of a generic “fast and convenient” pitch.',
      'The wordmark had to survive from a splash screen to a cart badge to a courier bag, so it was drawn tight and legible at every size before a single screen was laid out.',
    ],
    honestNote:
      'Every list in this flow still repeats itself — six identical vendor cards, three identical cart items, two identical delivery slots. And the login screen still says “Welcome back Sid.” Both get fixed before this goes anywhere near a real user.',
    reflectionHeading: 'What I’d tell you if you asked',
    reflection:
      'Vélo is where I learned that restraint scales. Cutting the fourth service card was harder — and better — than designing a fourth one. The night-sky hero is the piece I’d put first in any review.',
    sections: [
      {
        id: 'onboarding',
        label: 'Onboarding',
        blurb: 'A splash, a three-card carousel, and a sign-up that gets out of the way.',
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
        blurb: 'One home screen. Three services. The errand is the choice, not the category.',
        device: 'iphone',
        screens: [
          { src: img('velo', 'home.svg'), alt: 'Vélo home screen with three service cards' },
          { src: img('velo', 'mez.svg'), alt: 'Vélo menu / services screen' },
          { src: img('velo', 'profile.svg'), alt: 'Vélo profile screen' },
        ],
      },
      {
        id: 'categories',
        label: 'Categories',
        blurb: 'Food, groceries, and laundry each get their own browse view, same skeleton.',
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
        blurb: 'The cart got a second pass — a revamp that trimmed the checkout to what matters.',
        device: 'iphone',
        screens: [
          { src: img('velo', 'cart.svg'), alt: 'Cart for snacks and food' },
          { src: img('velo', 'revamped-cart.svg'), alt: 'Revamped cart screen' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('velo', 'main-board.png'), alt: 'Vélo home screen presentation board', caption: 'The wordmark surviving from splash to home screen.' },
      { kind: 'board', src: img('velo', 'food-board.png'), alt: 'Vélo food ordering presentation board', caption: 'Food, the busiest of the three services, in context.' },
    ],
  },

  // ─────────────────────────────────────────────────────── Festember
  {
    slug: 'festember',
    index: '02',
    title: 'Festember',
    tagline: '18,000 students, 500 colleges, one festival — held together across two products.',
    caption: '18,000 students, 500 colleges, one festival — and the app has to work every single one of those days.',
    discipline: 'Product + Web Design',
    cover: img('festember', 'web/cover.png'),
    coverAlt: 'Festember “Saga of Secrets” noir marketing hero',
    brief:
      'Festember is NIT Trichy’s flagship cultural fest — 18,000 students, 500 colleges, 12 event clusters. I designed both layers: the ticketing app people actually use to attend — discover events, buy tickets, manage payments — and the marketing website that gets them excited to show up, re-skinned this year for the theme “Saga of Secrets.”',
    role: 'Solo — app UI (onboarding, discovery, tickets, payments) and website (hero, About, navigation).',
    roles: ['App UI', 'Ticketing flow', 'Marketing website'],
    keyDecisions: [
      'The app stays visually neutral — thin red line-art, a simple cursive “F” — because it’s the layer reused every year regardless of theme.',
      'The website gets re-skinned for this year’s theme, “Saga of Secrets,” with a noir/silhouette aesthetic built for one year, not built to last.',
      'Real event content on the ticketing flow — an actual “Fashionistas Gala” listing with a real date, venue, and description — instead of lorem dressed up for a screenshot.',
      'The neutral app and the themed website are deliberately different visual languages: one is infrastructure, one is a poster. Stating that on purpose beats pretending they match.',
    ],
    honestNote:
      'Urgent: the About page headline still reads “…AND SMTH SMTH FOR YOU ONLY” — placeholder shorthand left in a live headline, fix immediately. The profile screen shows a placeholder phone number (“+1234567890”). And decide on purpose: the poster (vintage collage), website (noir), and app (line art) are three visual languages for one brand — the app staying neutral is defensible; the poster and website disagreeing this year is not.',
    reflectionHeading: 'What I learned holding two products together',
    reflection:
      'A festival isn’t one design problem, it’s two with a shared name. The interesting work was deciding which layer gets to chase a theme and which one has to survive a decade of them.',
    sections: [
      {
        id: 'app-onboarding',
        label: 'App · Onboarding',
        blurb: 'Start screen, a themed carousel, sign-in and sign-up — the neutral, reusable layer.',
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
        id: 'app-discover',
        label: 'App · Discover',
        blurb: 'Home, search, and the 12 event clusters — the map of everything happening.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'app/main.svg'), alt: 'App home screen' },
          { src: img('festember', 'app/search.svg'), alt: 'Event search screen' },
          { src: img('festember', 'app/clusters.svg'), alt: 'Event clusters overview' },
          { src: img('festember', 'app/menu-expanded.svg'), alt: 'Expanded navigation menu' },
        ],
      },
      {
        id: 'app-event',
        label: 'App · Event',
        blurb: 'A real listing — Fashionistas Gala, real date and venue — not lorem in a frame.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'app/ticket-desc.svg'), alt: 'Event ticket detail — Fashionistas Gala' },
          { src: img('festember', 'app/anything-desc.svg'), alt: 'Event description screen' },
        ],
      },
      {
        id: 'app-payments',
        label: 'App · Payments',
        blurb: 'Buy the ticket, confirm the transaction — the part that actually has to work.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'app/payments.svg'), alt: 'Payment screen' },
          { src: img('festember', 'app/transaction.svg'), alt: 'Transaction confirmation screen' },
          { src: img('festember', 'app/profile.svg'), alt: 'Profile screen' },
        ],
      },
      {
        id: 'web-desktop',
        label: 'Website · Desktop',
        blurb: 'The “Saga of Secrets” re-skin — noir hero, silhouettes, an About built for one year.',
        device: 'mac',
        url: 'festember.com',
        screens: [
          { src: img('festember', 'web/highlights.svg'), alt: 'Festember website hero — Saga of Secrets' },
          { src: img('festember', 'web/about.svg'), alt: 'Festember website About section' },
        ],
      },
      {
        id: 'web-mobile',
        label: 'Website · Mobile',
        blurb: 'The same noir treatment folded down to a phone-width marketing page.',
        device: 'iphone',
        screens: [
          { src: img('festember', 'web/landing-1.svg'), alt: 'Mobile website landing — top' },
          { src: img('festember', 'web/landing-2.svg'), alt: 'Mobile website landing — middle' },
          { src: img('festember', 'web/landing-3.svg'), alt: 'Mobile website landing — bottom' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('festember', 'app/board-cover.svg'), alt: 'Festember app presentation board', caption: 'The neutral app, presented on its own terms.' },
      { kind: 'board', src: img('festember', 'app/board-event.svg'), alt: 'Festember app event board', caption: 'Fashionistas Gala — the real event that anchored the flow.' },
      {
        kind: 'compare',
        caption: 'The real live festember.com next to my marketing hero — the “Saga of Secrets” theme, held to the same noir treatment.',
        before: { src: img('festember', 'web/live-site.jpg'), alt: 'Live festember.com Saga of Secrets homepage', label: 'festember.com — live' },
        after: { src: img('festember', 'web/highlights.svg'), alt: 'Redesigned Festember hero', label: 'Saga of Secrets re-skin' },
      },
    ],
  },

  // ──────────────────────────────────────────────────────── TuteDude
  {
    slug: 'tutedude',
    index: '03',
    title: 'TuteDude',
    tagline: 'A real course page, rebuilt uninvited to answer the one question keeping people from enrolling.',
    caption: 'TuteDude’s real course page, rebuilt to answer the one question keeping people from clicking enroll.',
    discipline: 'Web Design',
    cover: img('tutedude', 'cover.svg'),
    coverAlt: 'TuteDude Python course landing page redesign cover',
    brief:
      'TuteDude is real — an IIT Delhi alumni-founded ed-tech company. I didn’t wait for a brief. Their live Python course page buries its strongest selling point — a 100% fee refund on completion — under generic course details. I rebuilt the page so the strongest trust signal is the first thing anyone sees.',
    role: 'Solo — full redesign of the landing page, the “Why TuteDude” value section, and the case study presentation.',
    roles: ['Redesign', 'Landing page', 'Value section'],
    keyDecisions: [
      'Pulled the refund offer up into the hero as a headline claim instead of leaving it in the fine print — it’s the single strongest objection-killer on the page, so it earns the best real estate.',
      'Framed urgency honestly (“only a few seats left”) instead of manufacturing false scarcity.',
      'Broke the value proposition into four scannable promises — free learning, 1:1 mentor support, doubts solved in 10 minutes, lifetime access — instead of one dense paragraph nobody reads past line two.',
      'Kept TuteDude’s real brand colour and course facts so the redesign reads as their page improved, not a different company’s.',
    ],
    honestNote:
      'The “trusted by 4000+ organizations” logo strip currently repeats just Google and Meta over and over. Next to a real company’s name, that reads as an implied partnership, not a placeholder. Swap in a real, varied set of logos, or cut the claim entirely.',
    reflectionHeading: 'Why I rebuilt a page nobody asked me to',
    reflection:
      'The best redesign brief is a real page with a real problem. TuteDude’s refund offer was a gift buried three scrolls down — moving it up was less “design” and more “stop hiding the good part.”',
    sections: [
      {
        id: 'landing',
        label: 'Redesigned Landing',
        blurb: 'The full page, top to bottom — refund claim in the hero, four promises, honest urgency.',
        device: 'mac',
        url: 'tutedude.com/courses/python',
        screens: [
          { src: img('tutedude', 'screen-0.svg'), alt: 'Redesigned landing — hero with refund claim' },
          { src: img('tutedude', 'screen-1.svg'), alt: 'Redesigned landing — course value' },
          { src: img('tutedude', 'screen-2.svg'), alt: 'Redesigned landing — curriculum' },
          { src: img('tutedude', 'screen-3.svg'), alt: 'Redesigned landing — mentor support' },
          { src: img('tutedude', 'screen-4.svg'), alt: 'Redesigned landing — testimonials' },
          { src: img('tutedude', 'screen-5.svg'), alt: 'Redesigned landing — enrolment CTA' },
        ],
      },
    ],
    extras: [
      { kind: 'board', src: img('tutedude', 'why.svg'), alt: 'Why TuteDude four-promise value grid', caption: 'The value prop, broken into four scannable promises.' },
      {
        kind: 'compare',
        caption: 'The real live tutedude.com next to my course-page redesign — same brand and refund offer, restructured so the strongest signal leads.',
        before: { src: img('tutedude', 'live-homepage.jpg'), alt: 'Live tutedude.com homepage', label: 'tutedude.com — live' },
        after: { src: img('tutedude', 'screen-0.svg'), alt: 'Redesigned TuteDude hero', label: 'Redesign' },
      },
    ],
  },

  // ─────────────────────────────────────────────────────── TradeView
  {
    slug: 'tradeview',
    index: '04',
    title: 'TradeView',
    tagline: 'A prediction market, not just another trading app.',
    caption: 'Not “will the stock go up.” “Will this exact thing happen.”',
    discipline: 'Web Design',
    cover: img('tradeview', 'event.svg'),
    coverAlt: 'TradeView Tesla Stocks Drop prediction event screen',
    brief:
      '“Trading app” is one of the most crowded categories on Behance. TradeView’s actual differentiator is the “Tesla Stocks Drop” screen — a stock-move prediction market with Buy/Sell odds pricing, not a generic buy/sell ticket. The brief I set myself: design a platform where people bet on whether a stock event happens, not just on the stock price itself.',
    role: 'Solo — landing page, dashboard, and event/prediction flow.',
    roles: ['Landing page', 'Dashboard', 'Prediction flow'],
    keyDecisions: [
      'A single green radial glow on black for the landing page, doing all the “this is serious fintech” work before a single chart appears.',
      'Odds framed as a plain Win/Loss price ($1 / $0.5) instead of percentages, so the mechanic reads at a glance.',
      'A visible Rules Summary on the event page — a small trust signal that this is a real market with real rules.',
      'The prediction event, not the dashboard, leads the whole story — it’s the one screen this app has that the other thousand trading apps don’t.',
    ],
    honestNote:
      'The Home dashboard has two identical chart cards showing the same balance, and cards that literally say “Placeholder Text.” The case study leads with the Tesla Stocks Drop screen on purpose — the unfinished dashboard is not the first thing anyone should see.',
    reflectionHeading: 'The one screen that justified the whole app',
    reflection:
      'Most of TradeView looks like every other trading app because most trading apps do the same things. The prediction-market screen is the exception — and it’s the only screen I’d lead a portfolio review with.',
    sections: [
      {
        id: 'event',
        label: 'Prediction Event',
        blurb: 'Tesla Stocks Drop — Buy/Sell odds as a plain price, a visible Rules Summary. The differentiator.',
        device: 'mac',
        url: 'tradeview.app/event/tesla-drop',
        screens: [
          { src: img('tradeview', 'event.svg'), alt: 'Tesla Stocks Drop prediction event page' },
        ],
      },
      {
        id: 'landing',
        label: 'Landing',
        blurb: 'A single green radial glow on black — serious fintech before a chart ever loads.',
        device: 'mac',
        url: 'tradeview.app',
        screens: [
          { src: img('tradeview', 'cover.svg'), alt: 'TradeView landing page' },
        ],
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        blurb: 'Shown honestly last — the home dashboard is still unfinished, and the copy says so.',
        device: 'mac',
        url: 'tradeview.app/home',
        screens: [
          { src: img('tradeview', 'dashboard.svg'), alt: 'TradeView home dashboard (work in progress)' },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────── Apex
  {
    slug: 'apex',
    index: '05',
    title: 'Apex',
    tagline: 'Investment advisory, capital markets, wealth management — the institutional counterweight.',
    caption: 'One landing screen, positioned for the boardroom instead of the phone.',
    discipline: 'Web Design',
    cover: img('apex', 'main.svg'),
    coverAlt: 'Apex investment advisory landing page hero',
    brief:
      'Apex is a fintech landing-page concept with a deliberately institutional, B2B tone — investment advisory, capital markets, wealth management. Where TradeView chases a consumer prediction-market thrill, Apex is the counterweight: quieter, heavier, built to be trusted with real money by people who wear suits to talk about it.',
    role: 'Solo — landing page concept and B2B/advisory positioning.',
    roles: ['Landing page', 'Positioning'],
    keyDecisions: [
      'An institutional tone — restrained type, generous whitespace, no consumer-app playfulness — so the page reads as advisory, not app-store.',
      'Copy that leads with capability (advisory, capital markets, wealth management) rather than a single feature hook.',
      'A hero that sells credibility before it sells a product — the opposite move from a consumer landing page.',
    ],
    honestNote:
      'This is one landing screen, and I’ll say so plainly: it’s a strong hero, not yet a full case study. Before it’s written up properly it needs the rest of the flow. It also has to earn its place next to TradeView — Apex proves an institutional, B2B register that TradeView’s consumer prediction-market angle never tries for. That’s the one-sentence reason both exist.',
    reflectionHeading: 'What one screen can and can’t prove',
    reflection:
      'Apex exists to show range — that I can drop the consumer polish and design something that behaves like it manages a pension fund. It’s the tone I’m proudest of and the flow I most need to finish.',
    sections: [
      {
        id: 'landing',
        label: 'Landing',
        blurb: 'The single hero — institutional tone, credibility first, product second.',
        device: 'mac',
        url: 'apex.capital',
        screens: [
          { src: img('apex', 'main.svg'), alt: 'Apex landing hero' },
          { src: img('apex', 'highlights.svg'), alt: 'Apex highlights section' },
          { src: img('apex', 'footer.svg'), alt: 'Apex footer' },
        ],
      },
    ],
  },
];

export function getUiuxProject(slug: string) {
  return uiuxProjects.find((p) => p.slug === slug);
}
