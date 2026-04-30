import { Star, Heart, MessageCircle } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'dannz elo job',
    time: '16h',
    likes: 26,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dannz',
    text: 'mano esse pack de edição salvou kkkkk, minhas edições ficaram muito mais bonitas',
  },
  {
    id: 2,
    name: 'Fxz',
    time: '13h',
    likes: 23,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fxz',
    text: 'muito bom o pack de edição, comecei a editar pra ganhar dinheiro e o pack me ajudou muito',
  },
  {
    id: 3,
    name: 'I N S A N O !',
    time: '3h',
    likes: 6,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=insano',
    text: 'pack completo mano, ja tive retorno do investimento',
  },
  {
    id: 4,
    name: 'Lucky',
    time: '19h',
    likes: 37,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucky',
    text: 'tem tudo e mais um pouco slk kkkk, comecei a editar e precisava de um pack de edição',
  },
  {
    id: 5,
    name: 'roma',
    time: '2d',
    likes: 42,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=roma',
    text: 'melhor investimento que fiz esse ano, o suporte é nota 10!',
  },
  {
    id: 6,
    name: '9000',
    time: '5h',
    likes: 12,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9000',
    text: 'as transições desse pack são de outro mundo, vale cada centavo',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden" aria-labelledby="testimonials-title">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest font-display">
              Feedback da Comunidade
            </span>
          </div>
          <h2 id="testimonials-title" className="text-4xl md:text-5xl font-bold font-display">
            O que <span className="text-gradient">estão falando</span>
          </h2>
        </div>

        {/* Comments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((comment) => (
            <div
              key={comment.id}
              className="glass-strong border border-white/5 rounded-[2rem] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-violet-500/20 group"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-white/5 group-hover:ring-violet-500/30 transition-all">
                    <img
                      src={comment.avatar}
                      alt={comment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-bold text-zinc-100 truncate hover:text-violet-400 transition-colors cursor-pointer font-display">
                        {comment.name}
                      </span>
                      <span className="text-xs text-zinc-500 whitespace-nowrap">{comment.time}</span>
                    </div>
                    {/* Like Action */}
                    <div className="flex flex-col items-center gap-0.5 group/like cursor-pointer">
                      <Heart className="w-4 h-4 text-zinc-500 group-hover/like:text-rose-500 group-hover/like:fill-rose-500 transition-all" />
                      <span className="text-[10px] text-zinc-500 group-hover/like:text-rose-400">{comment.likes}</span>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-[15px] text-zinc-300 leading-snug mb-3">
                    {comment.text}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button className="text-[13px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors">
                      Responder
                    </button>
                    <div className="flex items-center gap-1 text-zinc-600">
                       <MessageCircle className="w-3 h-3" />
                       <span className="text-[11px]">Ver traduções</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-16 text-center">
           <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-bold hover:bg-white/10 hover:text-white transition-all font-display">
              Ver todos os 2,481 comentários
           </button>
        </div>
      </div>
    </section>
  );
}
