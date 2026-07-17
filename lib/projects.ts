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

// UI/UX case studies now live in lib/uiux.ts with their own renderer. This
// list is graphic-design only; the ui-ux gallery reads from uiuxProjects.
export const projects: Project[] = [
  { id: '7', slug: 'less-is-more', category: 'graphic-design', title: 'Less Is More', blurb: 'Three questions, three brands — one shape, one color, one line each.', problem: 'n/a — see full case study.', approach: 'n/a — see full case study.', outcome: 'n/a — see full case study.', accent: '#FF6F61' },
  { id: '8', slug: 'moxie', category: 'graphic-design', title: 'Moxie', blurb: 'A real Indian haircare brand — six pieces I made for them, uninvited.', problem: 'n/a — see full case study.', approach: 'n/a — see full case study.', outcome: 'n/a — see full case study.', accent: '#E6FF3C' },
  { id: '9', slug: 'pragyan-hackathon', category: 'graphic-design', title: 'Pragyan Hackathon × Kanini', blurb: 'A poster with a real client, a real deadline, and a fixed list of facts.', problem: 'n/a — see full case study.', approach: 'n/a — see full case study.', outcome: 'n/a — see full case study.', accent: '#FFD400' },
  { id: '10', slug: 'fifteen-days-of-ui', category: 'graphic-design', title: '15 Days of UI', blurb: 'A cover for a challenge that isn’t finished yet.', problem: 'n/a — see full case study.', approach: 'n/a — see full case study.', outcome: 'n/a — see full case study.', accent: '#FF3B76' },
  { id: '11', slug: 'pragyan-podcast', category: 'graphic-design', title: 'The Pragyan Podcast', blurb: 'A cover for a season that sounds different on purpose.', problem: 'n/a — see full case study.', approach: 'n/a — see full case study.', outcome: 'n/a — see full case study.', accent: '#2F5BFF' },
  { id: '12', slug: 'pixalette', category: 'graphic-design', title: 'Pixalette', blurb: 'The typography is the poster. Everything else holds it up.', problem: 'n/a — see full case study.', approach: 'n/a — see full case study.', outcome: 'n/a — see full case study.', accent: '#F5A623' },
  { id: '13', slug: 'festy-highlights', category: 'graphic-design', title: 'Festy Highlights', blurb: 'One poster, a dozen different phones.', problem: 'n/a — see full case study.', approach: 'n/a — see full case study.', outcome: 'n/a — see full case study.', accent: '#FF6F91' },
  { id: '14', slug: 'velo', category: 'graphic-design', title: 'Vélo', blurb: 'A wordmark for cycle couriers, built to survive a bag, a cup, and a building sign.', problem: 'n/a — see full case study.', approach: 'n/a — see full case study.', outcome: 'n/a — see full case study.', accent: '#E8892B' },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getByCategory(category: Category) {
  return projects.filter((p) => p.category === category);
}
