export type Category = 'ui-ux' | 'graphic-design';

export type Project = {
  id: string;
  slug: string;
  category: Category;
  title: string;
  blurb: string;
  problem: string;
  approach: string;
  outcome: string;
  accent: string;
};

export const projects: Project[] = [
  { id: '1', slug: 'flowbank-mobile-banking', category: 'ui-ux', title: 'FlowBank Mobile Banking', blurb: 'Redesigning everyday banking for speed and trust.', problem: 'Users abandoned transfers mid-flow due to unclear confirmation states.', approach: 'Simplified the transfer flow to three steps with real-time validation and a single confirmation screen.', outcome: 'Reduced transfer abandonment and support tickets related to failed transfers.', accent: '#6C5CE7' },
  { id: '2', slug: 'orbit-analytics-dashboard', category: 'ui-ux', title: 'Orbit Analytics Dashboard', blurb: 'Turning dense data into a dashboard people actually read.', problem: 'Analysts ignored the dashboard because key metrics were buried below the fold.', approach: 'Rebuilt the information hierarchy around a single primary metric per view with drill-down navigation.', outcome: 'Daily active dashboard usage grew across the analyst team.', accent: '#00B894' },
  { id: '3', slug: 'nimbus-travel-app', category: 'ui-ux', title: 'Nimbus Travel App', blurb: 'A booking flow that feels like planning a trip, not filling a form.', problem: 'The multi-step booking flow had high drop-off at payment.', approach: 'Merged trip details and payment into a single scrollable summary with inline editing.', outcome: 'Booking completion rate improved measurably in usability testing.', accent: '#0984E3' },
  { id: '4', slug: 'pulse-health-tracker', category: 'ui-ux', title: 'Pulse Health Tracker', blurb: 'Making daily health data feel encouraging, not clinical.', problem: 'Users felt anxious rather than motivated by the existing data-heavy UI.', approach: 'Shifted the visual language toward soft charts and milestone-based encouragement copy.', outcome: 'Improved week-two retention in early cohort testing.', accent: '#E17055' },
  { id: '5', slug: 'lumen-design-system', category: 'ui-ux', title: 'Lumen Design System', blurb: 'One system, every product surface.', problem: 'Three product teams maintained three inconsistent component libraries.', approach: 'Consolidated into a token-based system with documented usage guidelines.', outcome: 'Cut new-feature UI build time and eliminated visual drift across products.', accent: '#FDCB6E' },
  { id: '6', slug: 'atlas-onboarding-flow', category: 'ui-ux', title: 'Atlas Onboarding Flow', blurb: 'First impressions, redesigned.', problem: 'New users dropped off before reaching the core product value.', approach: 'Replaced a 7-screen onboarding tour with a 2-screen flow plus contextual in-product tips.', outcome: 'More new users reached activation in the first session.', accent: '#00CEC9' },
  { id: '7', slug: 'midnight-type-specimen', category: 'graphic-design', title: 'Midnight Type Specimen', blurb: 'A type specimen series shot entirely at 1AM.', problem: 'Wanted to explore typography outside a client-brief context.', approach: 'Designed a self-initiated specimen series pairing display type with long-exposure photography.', outcome: 'Selected for a small design-community feature.', accent: '#2D3436' },
  { id: '8', slug: 'echo-record-label-identity', category: 'graphic-design', title: 'Echo Record Label Identity', blurb: 'Visual identity for an independent record label.', problem: 'The label had no consistent visual identity across releases.', approach: 'Built a modular identity system: one mark, a strict grid, and a rotating duotone palette per release.', outcome: 'Consistent brand recognition across a dozen releases.', accent: '#D63031' },
  { id: '9', slug: 'grove-coffee-packaging', category: 'graphic-design', title: 'Grove Coffee Packaging', blurb: 'Packaging system for a small-batch coffee roaster.', problem: 'Shelf presence was weak against larger competing brands.', approach: 'Designed a bold single-color-per-origin packaging system with hand-drawn botanical marks.', outcome: 'Noticeable increase in shelf pick-up during in-store testing.', accent: '#6C5CE7' },
  { id: '10', slug: 'signal-festival-poster-series', category: 'graphic-design', title: 'Signal Festival Poster Series', blurb: 'A poster series for an experimental music festival.', problem: 'Needed a visual system flexible enough for a multi-day, multi-genre lineup.', approach: 'Built a generative grid system where each poster is a variation of the same rule set.', outcome: 'Series used across print, social, and venue signage.', accent: '#0984E3' },
  { id: '11', slug: 'anchor-editorial-layout', category: 'graphic-design', title: 'Anchor Editorial Layout', blurb: 'Editorial layout system for a design magazine.', problem: 'Long-form articles felt visually flat and interchangeable.', approach: 'Introduced a strict baseline grid with variable column widths tied to article type.', outcome: 'Improved read-through rate reported by the editorial team.', accent: '#00B894' },
  { id: '12', slug: 'nocturne-motion-titles', category: 'graphic-design', title: 'Nocturne Motion Titles', blurb: 'Title sequence design for an independent short film.', problem: 'The film needed titles that set tone without a large motion budget.', approach: 'Designed a minimal kinetic-type sequence built entirely from the film’s own color palette.', outcome: 'Praised in festival reviews as a highlight of the film’s craft.', accent: '#FDCB6E' },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getByCategory(category: Category) {
  return projects.filter((p) => p.category === category);
}
