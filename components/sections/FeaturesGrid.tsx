import { Check } from 'lucide-react';

const FEATURES = [
  {
    title: 'Vegas Pro & AE',
    desc: 'Compatível com Vegas Pro e After Effects.',
  },
  {
    title: 'Transições limpas',
    desc: 'Sem exagero. Ritmo que retém.',
  },
  {
    title: 'Qualidade Exclusiva',
    desc: 'Edição de alto nível com o selo de excelência da PDL Edits.',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="glass border border-white/5 rounded-2xl p-8 transition-all duration-300 hover:border-violet-500/20 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon Circle */}
              <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center mb-6 border border-white/5">
                <Check className="w-5 h-5 text-zinc-400" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
