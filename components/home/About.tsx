const experience = [
  { year: '2024 — Now', role: 'Product Designer', place: 'Freelance / Independent' },
  { year: '2022 — 2024', role: 'UI/UX Designer', place: 'Product Studio' },
  { year: '2020 — 2022', role: 'Graphic Designer', place: 'Design Agency' },
];

export default function About() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-16 bg-black px-6 py-32 text-white sm:flex-row sm:gap-24">
      <div className="sm:w-1/2">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">About</span>
        <p className="mt-6 text-xl leading-relaxed text-white/80">
          Designer working across UI/UX and graphic design — obsessed with the
          small details that make an interface feel considered, not just built.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">Experience</span>
        {experience.map((item) => (
          <div key={item.role} className="flex items-baseline justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-lg text-white">{item.role}</p>
              <p className="text-sm text-white/50">{item.place}</p>
            </div>
            <span className="text-sm text-white/40">{item.year}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
