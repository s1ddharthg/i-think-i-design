import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-white/10 bg-black px-6 py-12 text-white/50 sm:flex-row sm:justify-between">
      <span className="text-sm">© {new Date().getFullYear()} Sid</span>
      <Link href="/contact" className="text-sm text-white hover:underline">
        Contact
      </Link>
    </footer>
  );
}
