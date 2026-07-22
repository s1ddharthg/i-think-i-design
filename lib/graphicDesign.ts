// Content + asset map for the 8 real graphic-design case studies.
// Images live in /public/images/graphic-design/<slug>/. No image is ever
// used twice inside its own case study. The cover is the cover, nothing
// else reuses it as a "visual."

// Every image carries its real pixel width/height so it can render at its
// true aspect ratio where that matters. `size: 'lg'` marks a visual as a
// full-width feature break: the wide, "out in the world" shots (billboards,
// standees, signage) that would lose their frame cropped into an Instagram
// ratio. Everything else that reads as a portrait/near-square shot renders
// as an actual Instagram mockup at Instagram's own post dimensions.
export type Visual =
  | { kind: 'image'; src: string; alt: string; caption: string; width: number; height: number; size?: 'lg' }
  | {
      kind: 'ig-post';
      src: string;
      alt: string;
      postCaption: string;
      caption: string;
      size?: 'lg';
    }
  | {
      kind: 'ig-grid';
      images: { src: string; alt: string }[];
      caption: string;
      fullBleed?: boolean;
    }
  | {
      // Two to four photos, shown together. A duo side by side, or a bento
      // mosaic once there are enough shots to earn one.
      kind: 'gallery';
      images: { src: string; alt: string }[];
      caption: string;
    }
  | {
      // A standalone beat of copy between image groups. The process detail
      // that doesn't fit in a one-line caption.
      kind: 'text';
      body: string;
    };

export type GraphicProject = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
  caption: string;
  cover: string;
  coverAlt: string;
  coverWidth: number;
  coverHeight: number;
  brief: string;
  role: string;
  roles: string[];
  keyDecisions: string[];
  reflectionHeading: string;
  reflection: string;
  visuals: Visual[];
  externalLink?: { label: string; url: string };
};

const img = (slug: string, file: string) => `/images/graphic-design/${slug}/${file}`;

export const graphicProjects: GraphicProject[] = [
  {
    slug: 'less-is-more',
    index: '01',
    title: 'Less Is More',
    tagline: 'Three questions, three brands, one shape, one color, one line each.',
    caption: 'Can Airbnb redefine booking workspaces? One question, one shape, one color.',
    cover: img('less-is-more', '01-cover.png'),
    coverAlt: 'Airbnb, Amazon, and YouTube posters, each reduced to one silhouette and one color',
    coverWidth: 1500,
    coverHeight: 1125,
    brief:
      'A speculative brand-strategy poster series spanning three industries at once: hospitality (Airbnb), ecommerce and logistics (Amazon), and media (YouTube). My goal: pick a question big enough that each company’s own board would argue about it, then answer it with as little as possible. One color, one black silhouette, one line of type. No props to hide behind.',
    role: 'Solo. Concept, illustration, and type, across all three.',
    roles: ['Concept', 'Illustration', 'Type'],
    keyDecisions: [
      'Airbnb got coral because the question was about workspaces people actually live in, and coral feels domestic in a way a tech blue never would.',
      'Amazon got amber, the color of every delivery box that’s ever shown up at your door. The poster is delivery boxes, so the color had to be too.',
      'YouTube got a flat sports-jersey green to push against expectations. A platform so strongly associated with red felt more interesting when viewed through a completely different lens.',
      'Every poster gets exactly one silhouette. If an idea couldn’t survive being reduced to a single human shape, it wasn’t finished yet.',
    ],
    reflectionHeading: 'The harder constraint',
    reflection:
      'This is the project I’d defend without notes in an interview. It also taught me that "less" is a harder constraint than "more." Cutting the fourth color is a lot harder than adding it.',
    visuals: [
      { kind: 'ig-post', src: img('less-is-more', '05-airbnb-poster.png'), alt: 'Airbnb poster: a coral building silhouette', postCaption: 'Can Airbnb redefine booking workspaces? One question, one shape, one color. 🧡', caption: 'Poster one, the workspace question.' },
      { kind: 'ig-post', src: img('less-is-more', '06-amazon-poster.png'), alt: 'Amazon poster: stacked delivery boxes in amber', postCaption: 'Can Amazon crack repair & refurbish? A stack of boxes says more than a paragraph.', caption: 'Poster two, the delivery question.' },
      { kind: 'ig-post', src: img('less-is-more', '07-youtube-poster.png'), alt: 'YouTube poster: a green silhouette at a desk', postCaption: 'Can YouTube make learning collaborative? A desk, a green field, no question mark needed.', caption: 'Poster three, the learning question.' },
      {
        kind: 'text',
        body: 'Each of these started as a paragraph, a real debate a product team could plausibly be having. The rule I set was brutal on purpose: strip the paragraph down to a single question, then answer that question with one silhouette and one color, nothing else allowed to carry meaning. Most drafts died at the second color. The ones that survived are the ones where the shape alone told a stranger what the poster was about before they read a word.',
      },
      { kind: 'image', src: img('less-is-more', '02-outdoor-billboard.png'), alt: 'The Amazon poster painted across the side of a building', caption: 'One poster, taken outdoor, wrapped across the corner of a building.', width: 1500, height: 1125, size: 'lg' },
      {
        kind: 'gallery',
        images: [
          { src: img('less-is-more', '03-magazine.png'), alt: 'The three posters stacked like a magazine run' },
          { src: img('less-is-more', '04-notebooks-flatlay.png'), alt: 'The three posters as a spread of notebooks' },
        ],
        caption: 'Stacked like a print run, and swiped through like a carousel. The same three posters, two different physical lives.',
      },
    ],
  },
  {
    slug: 'moxie',
    index: '02',
    title: 'Moxie',
    tagline: 'A real Indian haircare brand, six pieces I made for them, uninvited.',
    caption: 'Meet Moxie: beauty with attitude, built to earn a spot in the cart.',
    cover: img('moxie', '00-cover.svg'),
    coverAlt: 'Moxie brand cover artwork, the wordmark and packaging system on a yellow field',
    coverWidth: 1440,
    coverHeight: 1080,
    brief:
      'Moxie is a real Indian haircare brand. Six pieces of it are mine, made uninvited, and by the fourth one, I’d basically invented a real brand’s problems for myself to solve. My goal: build a set spanning a shelf’s-eye view, packaging, a hero shot, a review post, an ingredient callout, an ad, and a printed extension, and make all six look like they came out of the same studio, not six separate weekends.',
    role: 'Solo, brand to backend: naming direction, packaging design, campaign art direction, and the copy on every piece.',
    roles: ['Naming Direction', 'Packaging Design', 'Campaign Art Direction', 'Copywriting'],
    keyDecisions: [
      'Yellow instead of the lilac-and-sage every haircare brand defaults to, because I wanted Moxie to win the "which bottle do I see first" test on a shelf full of soft pastels.',
      'A wordmark with a hard period: MOXIE. Because "beauty with attitude" in a soft script typeface would’ve been lying.',
      'One recurring sticker shape, reused on the ad, the ingredient graphic, and the review post, so someone scrolling fast still clocks all six as one brand.',
    ],
    reflectionHeading: 'A brand is a habit, not a logo',
    reflection:
      'Six connected pieces taught me something one poster never could: a brand isn’t a logo, it’s a set of decisions you keep making the same way on purpose.',
    visuals: [
      { kind: 'ig-post', src: img('moxie', '01-cover-cart.png'), alt: 'Moxie product lineup in a shopping cart', postCaption: 'Beauty with attitude, built to earn a spot in the cart. 🛒', caption: 'The full lineup, staged the way it’d actually get discovered: mid-scroll, mid-cart.' },
      { kind: 'ig-post', src: img('moxie', '04-hero-bubbles.png'), alt: 'Moxie conditioner bottle with water droplets and a soap bubble', postCaption: 'Beyond beauty, built to last. 🧴', caption: 'The product-in-hand hero shot, the one piece that has to look real, not designed.' },
      {
        kind: 'text',
        body: 'By the third piece I stopped designing individual assets and started designing a studio: one lighting setup, one sticker shape, one way of cropping a bottle, reused on purpose instead of reinvented per post. That’s the actual skill this project was testing: not whether I could make one good shot, but whether I could make six that all look like the same person made them on the same afternoon, for a brand I don’t work for and was never asked to design for.',
      },
      { kind: 'ig-post', src: img('moxie', '03-review-post.png'), alt: 'Moxie Instagram post with five-star review callouts', postCaption: 'Voices that matter. Real reviews, no filter. 🧡', caption: 'The review post that makes the shelf story feel lived-in, not launched.' },
      { kind: 'ig-post', src: img('moxie', '05-ingredient-callout.png'), alt: 'Moxie shampoo bottle with ingredient callouts for yacón root, tomato, and almond', postCaption: 'Science meets beauty: every ingredient gets credited, not just claimed.', caption: 'The ingredient callout, the one post that has to work as hard as a label.' },
      { kind: 'ig-post', src: img('moxie', '06-ad-campaign.png'), alt: 'Moxie campaign ad, "Beauty That Talks Back"', postCaption: 'Beauty that talks back. 💬', caption: 'The campaign ad: attitude first, product second.' },
      { kind: 'ig-post', src: img('moxie', '02-zine-postcard.png'), alt: 'A hand holding a fan of Moxie postcards, "Visual Storytelling Vol. 1"', postCaption: 'Visual Storytelling, Vol. 1: the brand, printed and held. 📌', caption: 'The printed extension, proof the system survives leaving the screen.' },
    ],
  },
  {
    slug: 'fifteen-days-of-ui',
    index: '03',
    title: '15 Days of UI',
    tagline: 'One loud cover, built to stop a scroll before day one.',
    caption: '15 days, 15 screens, because 30 is just too much, isn’t it?',
    cover: img('fifteen-days-of-ui', '01-cover-flat.png'),
    coverAlt: '"15 Days of UI" poster covered in stickers on a black concrete texture',
    coverWidth: 6220,
    coverHeight: 2700,
    brief:
      'Launch key art for the design-community challenge space on Dribbble and Behance: a self-initiated, 15-day, one-screen-a-day UI challenge. My goal: announce it with a cover loud enough to stop a scroll on day one.',
    role: 'Solo.',
    roles: ['Art Direction', 'Cover Design', 'Typography'],
    externalLink: { label: 'View on Instagram', url: 'https://www.instagram.com/p/DLkMgtGSrUp/?igsh=dXhxZDFkdzFiOGw3' },
    keyDecisions: [
      'Leaned on Figma-native elements to stay tied to the actual software the project was built in.',
      'Went maximalist on purpose (stickers, arrows, a distressed concrete texture) because a quiet cover for a "challenge" post reads as an apology, not an invitation.',
      'Kept the tool credit and handle visible, since a challenge post is basically a tiny brand launch.',
    ],
    reflectionHeading: 'Designing the invitation first',
    reflection:
      'I built the cover before the challenge itself, on purpose: a test of whether a launch asset could earn attention on its own merits. Loud, sticker-heavy, impossible to scroll past, it does exactly the job a challenge cover is supposed to do.',
    visuals: [
      { kind: 'image', src: img('fifteen-days-of-ui', '02-wall-mockup.png'), alt: '"15 Days of UI" poster pinned to a concrete wall', caption: 'The announcement, pinned to a wall instead of buried in a feed.', width: 1500, height: 1125, size: 'lg' },
      {
        kind: 'text',
        body: 'The cover came before the challenge on purpose: a test of whether the launch itself could earn attention before a single screen behind it existed. Stickers, arrows, a distressed concrete texture, loud enough that a quiet minimal treatment would’ve read as an apology instead of an invitation.',
      },
      {
        kind: 'gallery',
        images: [
          { src: img('fifteen-days-of-ui', '03-billboard-mockup.png'), alt: '"15 Days of UI" poster on a lit street billboard' },
          { src: img('fifteen-days-of-ui', '04-ooh-street.png'), alt: '"15 Days of UI" poster on a street billboard among trees' },
        ],
        caption: 'Out in the world, two ways: the same cover has to survive both a night shot and a daylight one.',
      },
    ],
  },
  {
    slug: 'pragyan-hackathon',
    index: '04',
    title: 'Pragyan Hackathon × Kanini',
    tagline: 'A poster with a real client, a real deadline, and zero patience for instincts that didn’t fit.',
    caption: 'A 2-day AI hackathon needed to look like it belonged in a Chennai tech park, not a college hallway.',
    cover: img('pragyan-hackathon', '01-cover.png'),
    coverAlt: 'Pragyan Hackathon poster, framed, leaning against a wall',
    coverWidth: 1500,
    coverHeight: 1125,
    brief:
      'A poster for the enterprise-software industry: Kanini Software Solutions sponsored a 2-day AI hackathon for Pragyan, and I got a non-negotiable list, dates, prize, domain, sponsor logos, and a registration deadline, all of it legible on a phone screen. The job was making it look like a real company would want its name on it.',
    role: 'Solo poster designer, briefed directly by Pragyan’s sponsor liaison team.',
    roles: ['Poster Design', 'Client Briefing', 'Typography'],
    externalLink: { label: 'View on Instagram', url: 'https://www.instagram.com/p/DUZ3KDXEZph/?igsh=dWNkc2RmcXZzYWVt' },
    keyDecisions: [
      'AI/ML-coded elements with emphasis on deep learning and image processing, to symbolise the hackathon’s main theme.',
      'Near-black with a scanline texture, so it felt like it belonged in a data center.',
      'A slab typeface heavy enough to hold its ground on a busy dark background.',
      'One yellow, reserved for exactly four things: date, city, prize, deadline.',
    ],
    reflectionHeading: 'A two-day constraint is a good discipline',
    reflection:
      'A sponsor brief with a hard deadline leaves no room to fall in love with an idea that isn’t converging. That pressure produced a better poster faster than an open-ended brief would have, and it’s a constraint worth setting on purpose even when nobody’s forcing it.',
    visuals: [
      { kind: 'image', src: img('pragyan-hackathon', '02-standee-street.png'), alt: 'Pragyan Hackathon poster on an A-frame street standee', caption: 'A 2-day AI hackathon needed to look like it belonged in a Chennai tech park, not a college hallway.', width: 1500, height: 1125, size: 'lg' },
      { kind: 'ig-post', src: img('pragyan-hackathon', '03-instagram-post.png'), alt: 'Pragyan Hackathon Instagram announcement post', postCaption: 'Pragyan × Kanini: 2 days, one prize, zero excuses to sit this one out. 💻', caption: 'The Instagram announcement, the version most people actually saw.' },
      {
        kind: 'text',
        body: 'A sponsor brief is a different kind of constraint than a self-set one: every fact on this poster was non-negotiable before I opened the file. The design job wasn’t inventing a concept, it was making a checklist of dates and logos feel like a decision instead of a form. The scanline texture and the "scan window" photo chips did that work: they gave the poster a reason to look the way it does, instead of just a place to put the required text.',
      },
      {
        kind: 'gallery',
        images: [
          { src: img('pragyan-hackathon', '05-flat-poster.png'), alt: 'Pragyan Hackathon poster, flat, with designer credits' },
          { src: img('pragyan-hackathon', '06-standee-studio.png'), alt: 'Pragyan Hackathon poster on an A-frame standee in a studio setting' },
        ],
        caption: 'Flat file and standee cut, side by side, credits included on both.',
      },
      { kind: 'image', src: img('pragyan-hackathon', '04-whatsapp-forward.png'), alt: 'Pragyan Hackathon poster forwarded in a WhatsApp chat', caption: 'Phone screen, WhatsApp forward: how these actually spread.', width: 2140, height: 1600 },
    ],
  },
  {
    slug: 'pragyan-podcast',
    index: '05',
    title: 'The Pragyan Podcast',
    tagline: 'A cover for a season that sounds different on purpose.',
    caption: 'Season 6, Episode 1. Superstitions and I.',
    cover: img('pragyan-podcast', '01-cover-spotify.png'),
    coverAlt: 'The Pragyan Podcast Season 6 cover, shown in a Spotify now-playing screen',
    coverWidth: 2460,
    coverHeight: 1536,
    brief:
      'New season, new mood, though I’ll admit I didn’t plan for it to look this different from the last one. The goal: the new season needed cover art that said "new energy" without losing "still the same show."',
    role: 'Solo cover designer, also this episode’s guest.',
    roles: ['Cover Design', 'Podcast Guest'],
    keyDecisions: [
      'Spray-paint blue and citron, because the show’s whole appeal is that it doesn’t sound rehearsed, and the art needed to match.',
      'The "out now!" speech bubble is hand-drawn on purpose. A podcast is a voice medium, the art should sound a little like one too.',
      'Split the wordmark across white and yellow so it still reads at the size it’ll actually be seen at: a podcast app thumbnail, not a poster.',
      'Designed to survive leaving the app entirely: the same three moves read just as clearly printed flat, taped to a wall, or folded on a table.',
    ],
    reflectionHeading: 'What changes between seasons, what doesn’t',
    reflection:
      'Put next to last season’s sticker-collage cover, this one shares almost no visual DNA with it. That’s either a strength, each season gets its own mood, or a gap, nothing ties the show together across seasons, depending on how you look at it. If I kept building this system, I’d add one small element, a corner mark or a mini logo, that survives every season so a returning listener recognizes the show at a glance.',
    visuals: [
      { kind: 'image', src: img('pragyan-podcast', '03-standee-outdoor.png'), alt: 'Pragyan Podcast poster on an outdoor standee', caption: 'Out in the world: an outdoor standee cut.', width: 4000, height: 3000, size: 'lg' },
      {
        kind: 'gallery',
        images: [
          { src: img('pragyan-podcast', '04-flyer-ground.png'), alt: 'Pragyan Podcast flyer folded on a table' },
          { src: img('pragyan-podcast', '08-wall-taped.png'), alt: 'Pragyan Podcast poster taped to an outdoor wall' },
        ],
        caption: 'A flyer on a table, a poster on a wall: the same cover, two ways people actually run into it.',
      },
      {
        kind: 'text',
        body: 'Last season’s cover was a sticker collage: busy, dense, collected. This one is three spray-paint marks and a hand-drawn speech bubble, and I let it be that different on purpose. The reasoning: a podcast that prides itself on not sounding rehearsed shouldn’t have art that looks focus-grouped into consistency. The tradeoff is real, though: a listener scrolling past both seasons back to back has no visual thread to grab onto, and that’s the next problem worth solving, not this one.',
      },
      { kind: 'ig-post', src: img('pragyan-podcast', '05-flat-cover.png'), alt: 'Pragyan Podcast Season 6 cover art', postCaption: 'Season 6, Episode 1: Superstitions and I, out now 🎙️', caption: 'The announcement post, cover art doing double duty as the launch asset.' },
      {
        kind: 'gallery',
        images: [
          { src: img('pragyan-podcast', '06-table-phone.png'), alt: 'Pragyan Podcast on a phone lying on a wooden table' },
          { src: img('pragyan-podcast', '07-pouch-hanging.png'), alt: 'Pragyan Podcast cover art in a hanging plastic pouch mockup' },
        ],
        caption: 'On a phone, browsing the directory, and printed, packed, and hung as a physical takeaway.',
      },
    ],
  },
  {
    slug: 'pixalette',
    index: '06',
    title: 'Pixalette',
    tagline: 'The typography is the poster. Everything else holds it up.',
    caption: 'Pixalette. Where the headline does all the talking.',
    cover: img('pixalette', '01-cover-macro.png'),
    coverAlt: 'Macro crop of the Pixalette 3D neon-tube lettering',
    coverWidth: 2818,
    coverHeight: 1344,
    brief:
      'Everything else on this poster exists to hold up the type. That’s the whole idea. The goal: design key art for Pixalette, a design event built on a theme of retro-futurism.',
    role: 'Solo. The 3D render, the layout, the info cards.',
    roles: ['3D Render', 'Layout', 'Info Cards'],
    externalLink: { label: 'View on Instagram', url: 'https://www.instagram.com/p/DUzuj1gEY1k/?igsh=MTl3eDhoMm5tcnM0MQ==' },
    keyDecisions: [
      'Built the letters as physical 3D neon tubes, lit like an arcade cabinet, because a flat neon text effect would’ve looked like a font choice, not a place.',
      'Amber instead of the blue-and-pink every gaming poster reaches for by default.',
      'Torn-paper info cards for the event list and contacts, so they read like flyers pinned to a board, not a slide pulled from a deck.',
      'Rendered every letter from a slightly different camera angle across the layout, so the sign reads as one continuous space instead of a flat logo repeated at different sizes.',
    ],
    reflectionHeading: 'Cutting the default palette',
    reflection:
      'Amber instead of the blue-and-pink almost every gaming poster defaults to was the riskier call in the room, and it’s the reason this reads as its own place instead of genre wallpaper. The default palette in any category is usually the first thing worth cutting.',
    visuals: [
      { kind: 'image', src: img('pixalette', '02-banner-grid.png'), alt: 'Pixalette key art: 3D neon lettering with event info cards', caption: 'Large-format OOH/banner, the full layout, info cards included.', width: 3110, height: 1350, size: 'lg' },
      {
        kind: 'text',
        body: 'The goal was basically "make the name feel like a place you could walk into," so the type had to stop behaving like type. Modeling the letters as lit neon tubes instead of applying a neon effect to flat text meant every letterform had to survive being seen from an angle, with real shadow falloff, a much harder constraint than picking a glow filter, and the reason this reads as key art instead of a poster with a cool font.',
      },
      { kind: 'image', src: img('pixalette', '03-ooh-fence.png'), alt: 'Pixalette banner mounted on an outdoor construction fence', caption: 'Out in the world: the banner in context.', width: 1500, height: 1125 },
    ],
  },
  {
    slug: 'festy-highlights',
    index: '07',
    title: 'Festember Highlights',
    tagline: 'One poster, a dozen different phones.',
    caption: 'A season, told in one frame. Sourced from a dozen phones, unified into one look.',
    cover: img('festy-highlights', '01-cover-flat.png'),
    coverAlt: 'Festember Highlights poster: a halftone duotone photo composite in a film-strip frame',
    coverWidth: 3110,
    coverHeight: 4050,
    brief:
      'Twelve phones, a dozen different lighting setups, one poster that had to look like it came from a single camera. The goal: recap a season of Festember in one shareable image, built from real event photos that had nothing in common except the event.',
    role: 'Solo. Sourced and selected the photos, built the composite.',
    roles: ['Photo Curation', 'Composite Design'],
    externalLink: { label: 'View on Instagram', url: 'https://www.instagram.com/p/DVL6ZfdCEko/?igsh=MW1jMzh1N2JxZHVpMA==' },
    keyDecisions: [
      'Film-strip framing and sprocket holes, so casual phone photos read as memories, not screenshots.',
      'One halftone duotone treatment across every photo, the actual heavy lifting that made a dozen mismatched shots look like they belonged together.',
      'A large central "F" mark, the one place for the eye to land in an otherwise busy grid.',
      'Cropped every source photo to the same aspect ratio before laying out the grid, so twelve unrelated shots read as one deliberate sequence instead of a scrapbook.',
    ],
    reflectionHeading: 'Curation is a skill too',
    reflection:
      'Most of this section is illustration built from scratch. This one’s different. The skill on display is curation, taking messy reality and color-matching it into one system, and that’s a muscle worth showing separately.',
    visuals: [
      { kind: 'image', src: img('festy-highlights', '02-framed-print.png'), alt: 'Festember Highlights poster in a floating acrylic frame', caption: 'Framed print / physical poster.', width: 1500, height: 1125, size: 'lg' },
      {
        kind: 'text',
        body: 'None of the source photos were shot for this. They were phone snaps from a dozen different people, in a dozen different lighting conditions, and the actual design problem was making them agree with each other: one halftone duotone treatment, one film-strip frame, one grid. The skill here isn’t generating imagery, it’s editorial: knowing which twelve photos out of two hundred tell one story, and what treatment makes them look like they always belonged together.',
      },
      { kind: 'image', src: img('festy-highlights', '03-poster-wall.png'), alt: 'Festember Highlights poster taped to an outdoor wall', caption: 'Instagram story / out in the world.', width: 1500, height: 1125 },
    ],
  },
  {
    slug: 'velo',
    index: '08',
    title: 'Vélo',
    tagline: 'A wordmark for cycle couriers, built to survive a bag, a cup, and a building sign.',
    caption: 'Vélo. Where the wordmark and the wheel are the same shape.',
    cover: img('velo', '01-cover-bag-hand.png'),
    coverAlt: 'A hand holding a Vélo courier delivery bag',
    coverWidth: 4000,
    coverHeight: 3000,
    brief:
      'The goal: design a cycling brand mark that doesn’t lean on a literal bike icon to prove it’s about cycling.',
    role: 'Solo.',
    roles: ['Brand Identity', 'Wordmark Design', 'Applications'],
    keyDecisions: [
      'The "l" doubles as a handlebar and seat post, the "o" closes as a wheel: the reference is built into the letters themselves, not bolted on next to them.',
      'Orange instead of the eco-green every cycling brand reaches for by default.',
      'A geometric sans, so it reads as an app, not a cycling club crest.',
    ],
    reflectionHeading: 'Mileage is the real test',
    reflection:
      'Orange over the eco-green every delivery brand defaults to was the decision I’d defend hardest here, closer to a hazard vest than a leaf, and the reason this mark doesn’t disappear into a field of green delivery logos.',
    visuals: [
      { kind: 'image', src: img('velo', '07-building-signage.png'), alt: 'Vélo wordmark on the side of a building', caption: 'Dark-store signage, read from the street.', width: 1500, height: 1125, size: 'lg' },
      { kind: 'image', src: img('velo', '08-billboard.png'), alt: 'Vélo wordmark on an outdoor street billboard', caption: 'Out-of-home billboard.', width: 1500, height: 1125, size: 'lg' },
      {
        kind: 'gallery',
        images: [
          { src: img('velo', '02-bag-studio.png'), alt: 'Two Vélo bags, black and white, on studio pedestals' },
          { src: img('velo', '09-bags-mono.png'), alt: 'Vélo courier bags in a monochrome studio lineup' },
          { src: img('velo', '03-hot-cup.png'), alt: 'Vélo-branded hot drink cup under an espresso machine' },
          { src: img('velo', '04-cold-cup.png'), alt: 'Vélo-branded iced drink cup' },
        ],
        caption: 'Monochrome bags, hot cup, cold cup: the wordmark holding its shape across four different surfaces.',
      },
      {
        kind: 'text',
        body: 'A wordmark that only works on a splash screen isn’t finished. It’s a logo waiting to fail somewhere. Every application here forced a real decision: the reversed mark on the black bag had to hold up at reading distance from across a street, the cup lockup had to survive being gripped and tilted, and the building sign had to work lit from below at night. None of that shows up when a mark only exists in a brand deck.',
      },
      {
        kind: 'gallery',
        images: [
          { src: img('velo', '05-pouch-flat.png'), alt: 'Vélo-branded snack packaging pouch' },
          { src: img('velo', '06-pouch-hand.png'), alt: 'Vélo-branded packaging pouch held in two hands' },
        ],
        caption: 'Packaging pouch, flat and held, the smallest surface the mark has to work on.',
      },
    ],
  },
];

export function getGraphicProject(slug: string) {
  return graphicProjects.find((p) => p.slug === slug);
}
