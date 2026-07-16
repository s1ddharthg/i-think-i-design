export const CONTACT_EMAIL = 'siddharthgundavarapu@gmail.com';
const ACCENT_TEXT = '#A79BFF';

/** Oversized email CTA: each letter rolls up to a duplicate accent-colored copy on hover.
 *  Pure CSS transitions (transform only), staggered per letter via transition-delay.
 *  Reduced motion: roll disabled, falls back to an opacity hover. */
export default function RollingEmail({ className = '' }: { className?: string }) {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      aria-label={CONTACT_EMAIL}
      className={`group block w-fit max-w-full whitespace-nowrap text-[clamp(1.1rem,4.4vw,3.25rem)] font-semibold leading-none tracking-tight text-white transition-opacity motion-reduce:hover:opacity-70 ${className}`}
    >
      <span aria-hidden className="flex">
        {CONTACT_EMAIL.split('').map((ch, i) => (
          <span key={i} className="relative inline-block h-[1.18em] overflow-hidden">
            <span
              className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              <span className="flex h-[1.18em] items-center">{ch}</span>
              <span className="flex h-[1.18em] items-center" style={{ color: ACCENT_TEXT }}>
                {ch}
              </span>
            </span>
          </span>
        ))}
      </span>
    </a>
  );
}
