import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';

const TITLE = 'About';
const DESCRIPTION =
  "I'm Sid — a designer working across UI/UX, product and graphic design. Nosy about why people do what they do, and how that shapes what I build.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/about', type: 'profile' },
};

export default function AboutPage() {
  return <AboutContent />;
}
