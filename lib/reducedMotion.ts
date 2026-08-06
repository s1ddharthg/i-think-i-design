'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

// The server has no media query to read, so it renders the full-motion tree —
// and so must the client's hydration pass, or React sees two different trees.
//
// This is why framer-motion's own useReducedMotion cannot be used for anything
// that reaches the DOM: it is `useState(prefersReducedMotion.current)`, which
// reads matchMedia during the first client render. A visitor with Reduced
// Motion enabled therefore hydrates markup the server never sent, and React
// throws a hydration mismatch. useSyncExternalStore renders the server
// snapshot first and re-renders with the real value immediately after, which
// is the supported way to read a client-only value during hydration.
//
// It also picks up changes to the setting, which framer's version explicitly
// does not.
const getServerSnapshot = () => false;

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
