'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

const links = [
  { href: '/ui-ux', label: 'UI/UX' },
  { href: '/graphic-design', label: 'Graphic Design' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={reduceMotion ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        // home has the full-screen loader (1.8s count + 0.8s exit) — arrive just as it lifts
        transition={{ delay: pathname === '/' ? 2.4 : 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-2 backdrop-blur-xl"
      >
        <Link
          href="/"
          className="px-4 py-2 text-sm font-semibold tracking-tight text-white rounded-full hover:bg-white/10 transition-colors"
        >
          SG
        </Link>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <motion.div key={link.href} whileHover={{ y: -2 }} className="relative">
              <Link
                href={link.href}
                className="px-4 py-2 text-sm text-white/70 hover:text-white rounded-full transition-colors block"
              >
                {link.label}
              </Link>
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </nav>
  );
}
