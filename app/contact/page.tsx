'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="flex min-h-screen flex-col justify-center bg-black px-6 pt-32 pb-24 text-white">
        <div className="mx-auto w-full max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">Contact</span>
          <a
            href="mailto:hello@sid.design"
            className="mt-6 block text-4xl font-semibold transition-opacity hover:opacity-70 sm:text-6xl"
          >
            hello@sid.design
          </a>

          <div className="mt-16 flex gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Dribbble</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>

          {sent ? (
            <p className="mt-16 text-white/70">Thanks — I&apos;ll get back to you soon.</p>
          ) : (
            <form
              className="mt-16 flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input
                required
                placeholder="Name"
                className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
              />
              <textarea
                required
                placeholder="Message"
                rows={4}
                className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="mt-4 w-fit rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
