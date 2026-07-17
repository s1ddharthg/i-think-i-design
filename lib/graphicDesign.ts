// Content + asset map for the 8 real graphic-design case studies.
// Images live in /public/images/graphic-design/<slug>/. No image is ever
// used twice inside its own case study — the cover is the cover, nothing
// else reuses it as a "visual."

// Every image carries its real pixel width/height so it can render at its
// true aspect ratio where that matters. `size: 'lg'` marks a visual as a
// full-width feature break — the wide, "out in the world" shots (billboards,
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
      // Two to four photos, shown together — a duo side by side, or a bento
      // mosaic once there are enough shots to earn one.
      kind: 'gallery';
      images: { src: string; alt: string }[];
      caption: string;
    }
  | {
      // A standalone beat of copy between image groups — the process detail
      // that doesn't fit in a one-line caption.
      kind: 'text';
      body: string;
    };

export type GraphicProject = {
  slug: string;
  index: string;
  title: string;
  tagline: string;
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
  honestNote?: string;
  visuals: Visual[];
};

const img = (slug: string, file: string) => `/images/graphic-design/${slug}/${file}`;

export const graphicProjects: GraphicProject[] = [
  {
    slug: 'less-is-more',
    index: '01',
    title: 'Less Is More',
    tagline: 'Three questions, three brands — one shape, one color, one line each.',
    cover: img('less-is-more', '01-cover.png'),
    coverAlt: 'Airbnb, Amazon, and YouTube posters, each reduced to one silhouette and one color',
    coverWidth: 1500,
    coverHeight: 1125,
    brief:
      'The brief I gave myself: pick a question big enough that a company’s own board would argue about it, then answer it with as little as possible — one color, one black silhouette, one line of type. No props to hide behind.',
    role: 'Solo — concept, illustration, and type, across all three.',
    roles: ['Concept', 'Illustration', 'Type'],
    keyDecisions: [
      'Airbnb got coral because the question was about workspaces people actually live in, and coral feels domestic in a way a tech blue never would.',
      'Amazon got amber, the color of every delivery box that’s ever shown up at your door — the poster is delivery boxes, so the color had to be too.',
      'YouTube got a flat sports-jersey green, because "collaborative learning" needed to feel like a study group, not a keynote.',
      'Every poster gets exactly one silhouette. If an idea couldn’t survive being reduced to a single human shape, it wasn’t finished yet.',
      'The three posters share a family of background linework — close enough that they read as siblings, different enough that none of them is a copy-paste of the last.',
    ],
    reflectionHeading: 'What I’d tell you if you asked',
    reflection:
      'This is the project I’d defend without notes in an interview. It also taught me that "less" is a harder constraint than "more" — cutting the fourth color is a lot harder than adding it.',
    visuals: [
      { kind: 'ig-post', src: img('less-is-more', '05-airbnb-poster.png'), alt: 'Airbnb poster: a coral building silhouette', postCaption: 'Can Airbnb redefine booking workspaces? One question, one shape, one color. 🧡', caption: 'Poster one — the workspace question.' },
      { kind: 'ig-post', src: img('less-is-more', '06-amazon-poster.png'), alt: 'Amazon poster: stacked delivery boxes in amber', postCaption: 'Can Amazon crack repair & refurbish? A stack of boxes says more than a paragraph.', caption: 'Poster two — the delivery question.' },
      { kind: 'ig-post', src: img('less-is-more', '07-youtube-poster.png'), alt: 'YouTube poster: a green silhouette at a desk', postCaption: 'Can YouTube make learning collaborative? A desk, a green field, no question mark needed.', caption: 'Poster three — the learning question.' },
      {
        kind: 'text',
        body: 'Each of these started as a paragraph — a real debate a product team could plausibly be having. The rule I set was brutal on purpose: strip the paragraph down to a single question, then answer that question with one silhouette and one color, nothing else allowed to carry meaning. Most drafts died at the second color. The ones that survived are the ones where the shape alone told a stranger what the poster was about before they read a word.',
      },
      { kind: 'image', src: img('less-is-more', '02-outdoor-billboard.png'), alt: 'The Amazon poster painted across the side of a building', caption: 'One poster, taken outdoor — wrapped across the corner of a building.', width: 1500, height: 1125, size: 'lg' },
      {
        kind: 'gallery',
        images: [
          { src: img('less-is-more', '03-magazine.png'), alt: 'The three posters stacked like a magazine run' },
          { src: img('less-is-more', '04-notebooks-flatlay.png'), alt: 'The three posters as a spread of notebooks' },
        ],
        caption: 'Stacked like a print run, and swiped through like a carousel — the same three posters, two different physical lives.',
      },
    ],
  },
  {
    slug: 'moxie',
    index: '02',
    title: 'Moxie',
    tagline: 'A real Indian haircare brand — six pieces I made for them, uninvited.',
    cover: img('moxie', '00-cover.svg'),
    coverAlt: 'Moxie brand cover artwork — the wordmark and packaging system on a yellow field',
    coverWidth: 1440,
    coverHeight: 1080,
    brief:
      'Moxie is a real haircare brand in the Indian market. I’m not their designer — this is a case study and a learning exercise, six posters I made for them without being asked, to see if I could hold one studio’s worth of decisions across a whole set instead of one. The brief I gave myself: build from a shelf’s-eye view — packaging, a hero shot, a review post, an ingredient callout, an ad, and a printed extension — and make all six look like they came out of the same studio, not six separate weekends.',
    role: 'Solo, brand to backend — naming direction, packaging design, campaign art direction, and the copy on every piece.',
    roles: ['Naming Direction', 'Packaging Design', 'Campaign Art Direction', 'Copywriting'],
    keyDecisions: [
      'Yellow instead of the lilac-and-sage every haircare brand defaults to, because I wanted Moxie to win the "which bottle do I see first" test on a shelf full of soft pastels.',
      'A wordmark with a hard period — MOXIE. — because "beauty with attitude" in a soft script typeface would’ve been lying.',
      'Three secondary colors, one per hair concern, so the full range reads as organized rather than matched by accident.',
      'Photoreal renders for anything selling the product, illustrated characters for anything selling the feeling. The ecommerce shot has to look real. The zine card doesn’t need to.',
      'One recurring sticker shape, reused on the ad, the ingredient graphic, and the review post, so someone scrolling fast still clocks all six as one brand.',
    ],
    reflectionHeading: 'What I’d tell you if you asked',
    reflection:
      'Six connected pieces taught me something one poster never could — a brand isn’t a logo, it’s a set of decisions you keep making the same way on purpose.',
    honestNote:
      'This is unsolicited work — Moxie hasn’t seen or approved any of it. It’s presented here as a case study and a learning exercise in holding one brand system across six pieces, not as client work.',
    visuals: [
      { kind: 'ig-post', src: img('moxie', '01-cover-cart.png'), alt: 'Moxie product lineup in a shopping cart', postCaption: 'Beauty with attitude, built to earn a spot in the cart. 🛒', caption: 'The full lineup, staged the way it’d actually get discovered — mid-scroll, mid-cart.' },
      { kind: 'ig-post', src: img('moxie', '04-hero-bubbles.png'), alt: 'Moxie conditioner bottle with water droplets and a soap bubble', postCaption: 'Beyond beauty, built to last. 🧴', caption: 'The product-in-hand hero shot — the one piece that has to look real, not designed.' },
      {
        kind: 'text',
        body: 'By the third piece I stopped designing individual assets and started designing a studio: one lighting setup, one sticker shape, one way of cropping a bottle, reused on purpose instead of reinvented per post. That’s the actual skill this project was testing — not whether I could make one good shot, but whether I could make six that all look like the same person made them on the same afternoon, for a brand I don’t work for and was never asked to design for.',
      },
      { kind: 'ig-post', src: img('moxie', '03-review-post.png'), alt: 'Moxie Instagram post with five-star review callouts', postCaption: 'Voices that matter. Real reviews, no filter. 🧡', caption: 'The review post that makes the shelf story feel lived-in, not launched.' },
      { kind: 'ig-post', src: img('moxie', '05-ingredient-callout.png'), alt: 'Moxie shampoo bottle with ingredient callouts for yacón root, tomato, and almond', postCaption: 'Science meets beauty — every ingredient gets credited, not just claimed.', caption: 'The ingredient callout — the one post that has to work as hard as a label.' },
      { kind: 'ig-post', src: img('moxie', '06-ad-campaign.png'), alt: 'Moxie campaign ad, "Beauty That Talks Back"', postCaption: 'Beauty that talks back. 💬', caption: 'The campaign ad — attitude first, product second.' },
      { kind: 'ig-post', src: img('moxie', '02-zine-postcard.png'), alt: 'A hand holding a fan of Moxie postcards, "Visual Storytelling Vol. 1"', postCaption: 'Visual Storytelling, Vol. 1 — the brand, printed and held. 📌', caption: 'The printed extension — proof the system survives leaving the screen.' },
    ],
  },
  {
    slug: 'fifteen-days-of-ui',
    index: '03',
    title: '15 Days of UI',
    tagline: 'A cover for a challenge that isn’t finished yet.',
    cover: img('fifteen-days-of-ui', '01-cover-flat.png'),
    coverAlt: '"15 Days of UI" poster covered in stickers on a black concrete texture',
    coverWidth: 6220,
    coverHeight: 2700,
    brief:
      'This is a cover for a challenge, and right now that’s all it is, which is exactly the problem. The brief I gave myself: announce a 15-day, one-screen-a-day UI challenge with a cover loud enough to stop a scroll on day one.',
    role: 'Solo.',
    roles: ['Art Direction', 'Cover Design', 'Typography'],
    keyDecisions: [
      'Went maximalist on purpose. Stickers, arrows, a distressed concrete texture, because a quiet minimal cover for a "challenge" post would’ve read as an apology, not an invitation.',
      'Kept the tool credit and my handle visible, since a challenge post is basically a tiny brand launch and I wanted it to look like one.',
    ],
    reflectionHeading: 'Honest note',
    reflection:
      'A cover with no visible days behind it is a promise, not a portfolio piece. Before this goes live, the daily screens go right under this cover, or the whole thing gets relabeled as "day one of an ongoing series" instead of a finished body of work. I’d rather say that here than have someone else notice first.',
    honestNote:
      'A cover with no visible days behind it is a promise, not a portfolio piece. Before this goes live, the daily screens go right under this cover, or the whole thing gets relabeled as "day one of an ongoing series" instead of a finished body of work.',
    visuals: [
      { kind: 'image', src: img('fifteen-days-of-ui', '02-wall-mockup.png'), alt: '"15 Days of UI" poster pinned to a concrete wall', caption: 'The announcement, pinned to a wall instead of buried in a feed.', width: 1500, height: 1125, size: 'lg' },
      {
        kind: 'text',
        body: 'I built the cover before I built the challenge, which is backwards, and I know it. The honest reason: I wanted to see if the launch could earn attention on its own merits before I committed fifteen days to it. It did the job it was built for — loud, sticker-heavy, impossible to scroll past. What it can’t do yet is stand in for the fifteen screens it’s promising. That part’s still coming.',
      },
      {
        kind: 'gallery',
        images: [
          { src: img('fifteen-days-of-ui', '03-billboard-mockup.png'), alt: '"15 Days of UI" poster on a lit street billboard' },
          { src: img('fifteen-days-of-ui', '04-ooh-street.png'), alt: '"15 Days of UI" poster on a street billboard among trees' },
        ],
        caption: 'Out in the world, two ways — the same cover has to survive both a night shot and a daylight one.',
      },
    ],
  },
  {
    slug: 'pragyan-hackathon',
    index: '04',
    title: 'Pragyan Hackathon × Kanini',
    tagline: 'A poster with a real client, a real deadline, and zero patience for instincts that didn’t fit the brief.',
    cover: img('pragyan-hackathon', '01-cover.png'),
    coverAlt: 'Pragyan Hackathon poster, framed, leaning against a wall',
    coverWidth: 1500,
    coverHeight: 1125,
    brief:
      'Kanini Software Solutions sponsored a 2-day AI hackathon for Pragyan, and I got a non-negotiable list: dates, prize, domain, sponsor logos, and a registration deadline, all of it legible on a phone screen. The job was making it look like a real company would want its name on it.',
    role: 'Solo poster designer, briefed directly by Pragyan’s sponsor liaison team.',
    roles: ['Poster Design', 'Client Briefing', 'Typography'],
    keyDecisions: [
      'Near-black with a scanline texture, because I wanted this to feel like it belonged in a data center, not a college corridor.',
      'A slab typeface heavy enough to hold its ground on top of a busy dark background.',
      'Two photo "chips" styled like scan windows, a crowd shot and an AI visual, so the poster felt evidence-based without new event photography.',
      'One yellow, reserved for exactly four things: date, city, prize, deadline.',
    ],
    reflectionHeading: 'Honest note',
    reflection:
      'There’s a stray cursor icon sitting on the headline in every export of this file — leftover from screen-recording the design, not part of the design. It’s visible in the mockups below because that’s the real file. Fixed before this poster prints again.',
    honestNote:
      'There’s a stray cursor icon sitting on the headline in the current file, left over from an old export I hadn’t caught until I lined this up next to everything else. Fixed before it goes near a portfolio.',
    visuals: [
      { kind: 'image', src: img('pragyan-hackathon', '02-standee-street.png'), alt: 'Pragyan Hackathon poster on an A-frame street standee', caption: 'A 2-day AI hackathon needed to look like it belonged in a Chennai tech park, not a college hallway.', width: 1500, height: 1125, size: 'lg' },
      { kind: 'ig-post', src: img('pragyan-hackathon', '03-instagram-post.png'), alt: 'Pragyan Hackathon Instagram announcement post', postCaption: 'Pragyan × Kanini — 2 days, one prize, zero excuses to sit this one out. 💻', caption: 'The Instagram announcement — the version most people actually saw.' },
      {
        kind: 'text',
        body: 'A sponsor brief is a different kind of constraint than a self-set one — every fact on this poster was non-negotiable before I opened the file. The design job wasn’t inventing a concept, it was making a checklist of dates and logos feel like a decision instead of a form. The scanline texture and the "scan window" photo chips did that work: they gave the poster a reason to look the way it does, instead of just a place to put the required text.',
      },
      {
        kind: 'gallery',
        images: [
          { src: img('pragyan-hackathon', '05-flat-poster.png'), alt: 'Pragyan Hackathon poster, flat, with designer credits' },
          { src: img('pragyan-hackathon', '06-standee-studio.png'), alt: 'Pragyan Hackathon poster on an A-frame standee in a studio setting' },
        ],
        caption: 'Flat file and standee cut, side by side — credits included on both.',
      },
      { kind: 'image', src: img('pragyan-hackathon', '04-whatsapp-forward.png'), alt: 'Pragyan Hackathon poster forwarded in a WhatsApp chat', caption: 'Phone screen, WhatsApp forward — how these actually spread.', width: 2140, height: 1600 },
    ],
  },
  {
    slug: 'pragyan-podcast',
    index: '05',
    title: 'The Pragyan Podcast',
    tagline: 'A cover for a season that sounds different on purpose.',
    cover: img('pragyan-podcast', '01-cover-spotify.png'),
    coverAlt: 'The Pragyan Podcast Season 6 cover, shown in a Spotify now-playing screen',
    coverWidth: 2460,
    coverHeight: 1536,
    brief:
      'New season, new mood, though I’ll admit I didn’t plan for it to look this different from the last one. The brief: Season 6 needed cover art that said "new energy" without losing "still the same show."',
    role: 'Solo cover designer, also this episode’s guest.',
    roles: ['Cover Design', 'Podcast Guest'],
    keyDecisions: [
      'Spray-paint blue and citron, because the show’s whole appeal is that it doesn’t sound rehearsed, and the art needed to match that.',
      'Split the wordmark across white and yellow so it still reads at the size it’ll actually be seen at, a podcast app thumbnail, not a poster.',
      'The "out now!" speech bubble is hand-drawn on purpose. A podcast is a voice medium. The art should sound a little like one too.',
    ],
    reflectionHeading: 'Honest note',
    reflection:
      'Put next to last season’s sticker-collage cover, this one shares almost no visual DNA with it. That’s either a strength, each season gets its own mood, or a gap, nothing ties the show together across seasons, depending on how you look at it. If I kept building this system, I’d add one small element, a corner mark or a mini logo, that survives every season so a returning listener recognizes the show at a glance.',
    visuals: [
      { kind: 'image', src: img('pragyan-podcast', '03-standee-outdoor.png'), alt: 'Pragyan Podcast poster on an outdoor standee', caption: 'Out in the world — an outdoor standee cut.', width: 4000, height: 3000, size: 'lg' },
      {
        kind: 'gallery',
        images: [
          { src: img('pragyan-podcast', '04-flyer-ground.png'), alt: 'Pragyan Podcast flyer folded on a table' },
          { src: img('pragyan-podcast', '08-wall-taped.png'), alt: 'Pragyan Podcast poster taped to an outdoor wall' },
        ],
        caption: 'A flyer on a table, a poster on a wall — the same cover, two ways people actually run into it.',
      },
      {
        kind: 'text',
        body: 'Last season’s cover was a sticker collage — busy, dense, collected. This one is three spray-paint marks and a hand-drawn speech bubble, and I let it be that different on purpose. The reasoning: a podcast that prides itself on not sounding rehearsed shouldn’t have art that looks focus-grouped into consistency. The tradeoff is real, though — a listener scrolling past both seasons back to back has no visual thread to grab onto, and that’s the next problem worth solving, not this one.',
      },
      { kind: 'ig-post', src: img('pragyan-podcast', '05-flat-cover.png'), alt: 'Pragyan Podcast Season 6 cover art', postCaption: 'New season, new noise. Season 6 Ep. 1 — out now 🎙️', caption: 'The announcement post — cover art doing double duty as the launch asset.' },
      {
        kind: 'gallery',
        images: [
          { src: img('pragyan-podcast', '06-table-phone.png'), alt: 'Pragyan Podcast on a phone lying on a wooden table' },
          { src: img('pragyan-podcast', '07-pouch-hanging.png'), alt: 'Pragyan Podcast cover art in a hanging plastic pouch mockup' },
        ],
        caption: 'On a phone, browsing the directory — and printed, packed, and hung as a physical takeaway.',
      },
    ],
  },
  {
    slug: 'pixalette',
    index: '06',
    title: 'Pixalette',
    tagline: 'The typography is the poster. Everything else holds it up.',
    cover: img('pixalette', '01-cover-macro.png'),
    coverAlt: 'Macro crop of the Pixalette 3D neon-tube lettering',
    coverWidth: 2818,
    coverHeight: 1344,
    brief:
      'Design key art for Pixalette, a retro arcade night, where the headline treatment had to do the job a logo usually does.',
    role: 'Solo — the 3D render, the layout, the info cards.',
    roles: ['3D Render', 'Layout', 'Info Cards'],
    keyDecisions: [
      'Built the letters as physical 3D neon tubes, lit like an arcade cabinet, because a flat neon text effect would’ve looked like a font choice, not a place.',
      'Amber instead of the blue-and-pink every gaming poster reaches for by default.',
      'Torn-paper info cards for the event list and contacts, so they read like flyers pinned to a board, not a slide pulled from a deck.',
    ],
    reflectionHeading: 'Honest note',
    reflection:
      'There’s an "R — RESTRICTED" sticker on one of the cards that means literally nothing in context. It looked cool sitting in the file. It does nothing once it’s next to real information — still visible in the export below, pending a re-render without it.',
    honestNote:
      'There’s an "R — RESTRICTED" sticker on one of the cards that means literally nothing in context. It looked cool sitting in the file. It does nothing once it’s next to real information. Cutting it.',
    visuals: [
      { kind: 'image', src: img('pixalette', '02-banner-grid.png'), alt: 'Pixalette key art: 3D neon lettering with event info cards', caption: 'Large-format OOH/banner — the full layout, info cards included.', width: 3110, height: 1350, size: 'lg' },
      {
        kind: 'text',
        body: 'The brief was basically "make the name feel like a place you could walk into," so the type had to stop behaving like type. Modeling the letters as lit neon tubes instead of applying a neon effect to flat text meant every letterform had to survive being seen from an angle, with real shadow falloff — a much harder constraint than picking a glow filter, and the reason this reads as key art instead of a poster with a cool font.',
      },
      { kind: 'image', src: img('pixalette', '03-ooh-fence.png'), alt: 'Pixalette banner mounted on an outdoor construction fence', caption: 'Out in the world — the banner in context.', width: 1500, height: 1125 },
    ],
  },
  {
    slug: 'festy-highlights',
    index: '07',
    title: 'Festember Highlights',
    tagline: 'One poster, a dozen different phones.',
    cover: img('festy-highlights', '01-cover-flat.png'),
    coverAlt: 'Festember Highlights poster: a halftone duotone photo composite in a film-strip frame',
    coverWidth: 3110,
    coverHeight: 4050,
    brief:
      'Recap a season of Festember in one shareable image, built from real event photos that had nothing in common except the event.',
    role: 'Solo — sourced and selected the photos, built the composite.',
    roles: ['Photo Curation', 'Composite Design'],
    keyDecisions: [
      'Film-strip framing and sprocket holes, so casual phone photos read as memories, not screenshots.',
      'One halftone duotone treatment across every photo, which did the actual heavy lifting of making a dozen mismatched shots look like they belonged in the same poster.',
      'A large central "F" mark, the one place for the eye to land in an otherwise busy grid.',
    ],
    reflectionHeading: 'What I’d tell you if you asked',
    reflection:
      'Most of this section is illustration built from scratch. This one’s different. The skill on display is curation, taking messy reality and color-matching it into one system, and that’s a muscle worth showing separately.',
    visuals: [
      { kind: 'image', src: img('festy-highlights', '02-framed-print.png'), alt: 'Festember Highlights poster in a floating acrylic frame', caption: 'Framed print / physical poster.', width: 1500, height: 1125, size: 'lg' },
      {
        kind: 'text',
        body: 'None of the source photos were shot for this. They were phone snaps from a dozen different people, in a dozen different lighting conditions, and the actual design problem was making them agree with each other — one halftone duotone treatment, one film-strip frame, one grid. The skill here isn’t generating imagery, it’s editorial: knowing which twelve photos out of two hundred tell one story, and what treatment makes them look like they always belonged together.',
      },
      { kind: 'image', src: img('festy-highlights', '03-poster-wall.png'), alt: 'Festember Highlights poster taped to an outdoor wall', caption: 'Instagram story / out in the world.', width: 1500, height: 1125 },
    ],
  },
  {
    slug: 'velo',
    index: '08',
    title: 'Vélo',
    tagline: 'A wordmark for cycle couriers — built to survive a bag, a cup, and a building sign.',
    cover: img('velo', '01-cover-bag-hand.png'),
    coverAlt: 'A hand holding a Vélo courier delivery bag',
    coverWidth: 4000,
    coverHeight: 3000,
    brief:
      'Design a mark for a food-delivery platform built around cycle couriers — one that doesn’t lean on a literal bike icon to prove it’s about cycling, and that survives a courier bag, a coffee cup, and a dark-store sign as easily as a splash screen.',
    role: 'Solo.',
    roles: ['Brand Identity', 'Wordmark Design', 'Applications'],
    keyDecisions: [
      'The "l" doubles as a handlebar and seat post, the "o" closes as a wheel — the reference is built into the letters themselves, not bolted on next to them.',
      'Orange instead of the eco-green every delivery brand reaches for by default — closer to a hazard vest than a leaf.',
      'A geometric sans so it reads at a glance on a moving bag, not just a stationary app icon.',
    ],
    reflectionHeading: 'Honest note',
    reflection:
      'The wordmark now has real mileage — a courier bag, a hot cup, a cold cup, a snack pouch, and a building sign, not just a splash screen. What’s still missing is the boring documentation: a clear-space and minimum-size spec, and a type-pairing sheet, the parts that keep a rider’s badge and a menu insert consistent when I’m not the one placing them.',
    honestNote:
      'What’s still missing is the boring documentation: a clear-space and minimum-size spec, and a type-pairing sheet, the parts that keep every future application consistent when I’m not the one placing them.',
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
        caption: 'Monochrome bags, hot cup, cold cup — the wordmark holding its shape across four different surfaces.',
      },
      {
        kind: 'text',
        body: 'A wordmark that only works on a splash screen isn’t finished — it’s a logo waiting to fail somewhere. Every application here forced a real decision: the reversed mark on the black bag had to hold up at reading distance from across a street, the cup lockup had to survive being gripped and tilted, and the building sign had to work lit from below at night. None of that shows up when a mark only exists in a brand deck.',
      },
      {
        kind: 'gallery',
        images: [
          { src: img('velo', '05-pouch-flat.png'), alt: 'Vélo-branded snack packaging pouch' },
          { src: img('velo', '06-pouch-hand.png'), alt: 'Vélo-branded packaging pouch held in two hands' },
        ],
        caption: 'Packaging pouch, flat and held — the smallest surface the mark has to work on.',
      },
    ],
  },
];

export function getGraphicProject(slug: string) {
  return graphicProjects.find((p) => p.slug === slug);
}
