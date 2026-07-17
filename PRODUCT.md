# Product

## Register

brand

## Users

Recruiters, hiring managers, and prospective freelance/agency clients evaluating Sid as a UI/UX and graphic designer. They arrive with low patience and high skepticism — they've seen a hundred portfolios — and are scanning for two things: is the work actually good, and is this person credible to work with. Session length is short unless the work earns more of it.

## Product Purpose

Land clients and attract recruiters by proving design skill through the portfolio itself, not just describing it. The site has to be the strongest possible piece of evidence: real case studies (Vélo, Festember, TuteDude, TradeView, Cyberscape, Apex) walked through with actual product-management reasoning (user pain, business pain, competitive landscape, approach, what success would look like), presented inside interactive device mockups rather than static screenshots. Success looks like a visitor leaving convinced this person can both design and think like a product owner.

## Brand Personality

Confident, restrained, technical. Near-black surfaces with one disciplined accent color carrying hierarchy. Motion is precise and scroll-driven (GSAP ScrollTrigger, Lenis-smoothed), never decorative bounce. Copy is honest and specific — case studies name real unfinished pieces ("the login still says Welcome back Sid") rather than polishing everything into marketing language. The brand's confidence comes from restraint and evidence, not volume.

## Anti-references

Generic AI-portfolio scaffolding: a tiny uppercase eyebrow above every section, 01/02/03 numbered markers on non-sequential content, gradient-clip headline text, identical same-size card grids repeated endlessly, side-stripe colored borders on callouts, glassmorphism as a default surface treatment. If a section could be mistaken for a template, it's failed. Also avoid corporate SaaS-dashboard aesthetics (hero-metric stat cards, navy/blue enterprise coloring) — this is a design portfolio, not a product dashboard.

## Design Principles

- **Show, don't tell.** Every claim about a project is backed by an interactive artifact (a real device mockup, a scroll-driven flow) rather than a paragraph asserting it.
- **Honesty over polish.** Case studies keep their rough edges visible (an unfinished dashboard, a placeholder phone number) instead of hiding them — credibility comes from what's admitted, not just what's shown.
- **One accent, disciplined use.** A single accent color (currently neon yellow) carries CTA, hierarchy, and interactive state — never a rotating palette per section.
- **Motion has a reason.** Every scroll-driven or hover animation exists to reveal structure (a device pinned while screens flow through it, a vortex that pulls the visitor toward the next section) — not applied uniformly as decoration.
- **Real reasoning, not just visuals.** Case studies carry the product-manager layer (user pain, business pain, competitor analysis, approach, success metrics) alongside the UI, because the target audience is evaluating thinking as much as pixels.

## Accessibility & Inclusion

WCAG AA baseline. Every animated component ships a `prefers-reduced-motion` alternative (crossfade or static state, never a blank/gated section) — already enforced consistently across the codebase (Hero, WorkVortex, SectionFlow, Footer, CustomCursor, etc.). Custom cursor and Lenis smooth scroll both disable themselves for reduced-motion users, falling back to native browser behavior.
