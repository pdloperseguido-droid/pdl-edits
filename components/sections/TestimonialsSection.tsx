import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'dannz elo job',
    time: '16h',
    likes: 26,
    avatar: '/images/feedbacks/user7.jpg',
    text: 'mano esse pack de edição salvou kkkkk, minhas edições ficaram muito mais bonitas',
  },
  {
    id: 2,
    name: 'Fxz',
    time: '13h',
    likes: 23,
    avatar: '/images/feedbacks/user4.png',
    text: 'muito bom o pack de edição, comecei a editar pra ganhar dinheiro e o pack me ajudou muito',
  },
  {
    id: 3,
    name: 'I N S A N O !',
    time: '3h',
    likes: 6,
    avatar: '/images/feedbacks/user5.png',
    text: 'pack completo mano, ja tive retorno do investimento',
  },
  {
    id: 4,
    name: 'Lucky',
    time: '19h',
    likes: 37,
    avatar: '/images/feedbacks/user2.jpg',
    text: 'tem tudo e mais um pouco slk kkkk, comecei a editar e precisava de um pack de edição',
  },
  {
    id: 5,
    name: 'roma',
    time: '2d',
    likes: 42,
    avatar: '/images/feedbacks/user1.jpg',
    text: 'melhor investimento que fiz esse ano, o suporte é nota 10!',
  },
  {
    id: 6,
    name: '9000',
    time: '5h',
    likes: 12,
    avatar: '/images/feedbacks/user3.jpg',
    text: 'as transições desse pack são de outro mundo, vale cada centavo',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 px-4 sm:px-6" aria-labelledby="testimonials-title">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="badge-accent inline-flex mb-4">Depoimentos</p>
          <h2 id="testimonials-title" className="font-heading uppercase text-3xl md:text-4xl font-bold tracking-[-0.035em] leading-tight">
            O que estão falando
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((comment) => (
            <div
              key={comment.id}
              className="card p-5 flex flex-col gap-4 group hover:border-violet-500/15 transition-all duration-200"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-violet-500 fill-violet-500" />
                ))}
              </div>

              {/* Texto */}
              <p className="font-sans text-[13px] font-normal leading-relaxed text-zinc-300 flex-1">
                &ldquo;{comment.text}&rdquo;
              </p>

              {/* Footer do card */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.05]">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                  <img
                    src={comment.avatar}
                    alt={comment.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-sans uppercase text-[12px] font-semibold tracking-[0.02em] text-zinc-100 truncate">{comment.name}</p>
                  <p className="font-sans text-[11px] font-medium text-zinc-500">{comment.time} atrás</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
