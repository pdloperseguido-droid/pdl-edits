'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Como envio meus vídeos para edição?',
    a: 'Após confirmar o pedido, você acessa o chat exclusivo do projeto dentro da sua conta. Lá você pode enviar os arquivos diretamente ou compartilhar um link do Google Drive, WeTransfer ou qualquer serviço de armazenamento. Suportamos arquivos de até 2GB por upload direto.',
  },
  {
    q: 'Vocês editam vídeos para Reels, Shorts e TikTok?',
    a: 'Sim! Trabalhamos com todos os formatos verticais (9:16) para Reels, Shorts e TikTok, horizontais (16:9) para YouTube e feed, além de quadrados (1:1) para feed do Instagram. Você escolhe o formato ao contratar o serviço.',
  },
  {
    q: 'Posso pedir ajustes depois da entrega?',
    a: 'Sim. Todos os nossos serviços incluem revisões dentro do prazo. Se algo não ficou como você esperava — seja no corte, trilha, legenda ou color grading — é só pedir pelo chat do pedido que ajustamos sem custo adicional.',
  },
  {
    q: 'Qual o prazo médio de entrega?',
    a: 'O prazo padrão é de até 72 horas (3 dias úteis). Projetos mais simples como thumbnails e highlights costumam sair antes. Para projetos grandes ou com múltiplos vídeos, combinamos um prazo específico no chat.',
  },
  {
    q: 'Vocês colocam legenda, trilha e efeitos?',
    a: 'Depende do serviço contratado. Edição completa inclui legenda sincronizada, trilha sonora licenciada, efeitos de transição e correção de cor. Você pode ver o que está incluído na descrição de cada serviço antes de contratar.',
  },
  {
    q: 'Consigo contratar edição recorrente?',
    a: 'Sim. Se você precisa de edição frequente — seja semanal ou mensal — entre em contato pelo chat ou Discord antes de fazer o pedido. Oferecemos condições especiais para quem tem volume fixo de vídeos.',
  },
  {
    q: 'Em que programas vocês editam?',
    a: 'Usamos principalmente Vegas Pro, After Effects e Photoshop. Se você precisar dos arquivos-fonte do projeto, é só solicitar ao finalizar o pedido.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section aria-labelledby="faq-title">
      <div className="mb-10">
        <p className="badge-accent inline-flex mb-4">Dúvidas frequentes</p>
        <h2 id="faq-title" className="font-heading uppercase text-3xl md:text-4xl font-bold tracking-[-0.035em] leading-tight">
          Perguntas que nossos{' '}
          <span className="text-gradient">clientes fazem</span>
        </h2>
      </div>

      <div className="space-y-2">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-violet-500/25 bg-[#110d1a]'
                  : 'border-white/[0.06] bg-[#0d0d0d] hover:border-white/[0.10]'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left group"
                aria-expanded={isOpen}
              >
                <span className={`font-heading text-[15px] font-semibold tracking-[-0.02em] leading-snug transition-colors ${isOpen ? 'text-violet-300' : 'text-white group-hover:text-zinc-200'}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                    isOpen ? 'rotate-180 text-violet-400' : 'text-zinc-600 group-hover:text-zinc-400'
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5">
                  <p className="font-sans text-[13px] font-normal leading-relaxed text-zinc-400">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
