import { FileText, Gavel, RefreshCw, Copyright, AlertTriangle, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Termos de Uso',
  description: 'Regras e diretrizes para uso dos serviços PDL Edits.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
            <Gavel className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Termos de <span className="text-gradient">Uso</span></h1>
          <p className="text-zinc-400 text-lg">Regras claras para uma parceria de sucesso.</p>
        </div>

        <div className="glass-strong border border-white/10 rounded-3xl p-8 md:p-12 space-y-12 text-zinc-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileText className="w-6 h-6 text-violet-400" />
              1. Objeto do Serviço
            </h2>
            <p>
              A <strong>PDL Edits</strong> presta serviços de edição digital de vídeo e imagem por encomenda. Ao contratar nossos serviços, você está adquirindo o tempo e a expertise técnica de nossos editores para transformar seus arquivos brutos em um produto final editado.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-violet-400" />
              2. Política de Revisões
            </h2>
            <p>
              Prezamos pela sua satisfação. Por padrão, cada pedido inclui:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Até 2 rodadas de revisões</strong> sem custo adicional, desde que as solicitações não alterem o escopo original do pedido.</li>
              <li>Revisões extras ou mudanças drásticas de roteiro após o início da edição podem estar sujeitas a taxas adicionais.</li>
              <li>O prazo para solicitar revisões é de <strong>7 dias corridos</strong> após a entrega da primeira versão.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Copyright className="w-6 h-6 text-violet-400" />
              3. Propriedade Intelectual
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Arquivos Brutos:</strong> Você declara possuir todos os direitos legais sobre as imagens e áudios enviados para edição.</li>
              <li><strong>Produto Final:</strong> Após o pagamento integral, a propriedade intelectual do vídeo editado é transferida integralmente para você.</li>
              <li><strong>Portfólio:</strong> A PDL Edits reserva-se o direito de utilizar trechos dos vídeos editados em seu portfólio próprio, a menos que o cliente solicite formalmente a confidencialidade do projeto.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-violet-400" />
              4. Cancelamento e Reembolso
            </h2>
            <p>
              Seguindo o <strong>Código de Defesa do Consumidor (CDC)</strong> e a natureza de produtos digitais personalizados:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cancelamentos solicitados antes do início da edição dão direito ao reembolso integral.</li>
              <li>Caso o trabalho já tenha sido iniciado, o reembolso será proporcional ao tempo de trabalho dedicado.</li>
              <li>Após a entrega do arquivo final e aceite das revisões, não haverá reembolso por tratar-se de serviço customizado já consumido.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-violet-400" />
              5. Prazos de Entrega
            </h2>
            <p>
              Os prazos começam a contar a partir do recebimento de <strong>todos os arquivos e instruções</strong> necessários. Atrasos no envio de materiais pelo cliente resultarão em extensões automáticas no prazo de entrega.
            </p>
          </section>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-zinc-500">
              Estes termos regem a relação comercial entre o cliente e a PDL Edits sob as leis da República Federativa do Brasil.
            </p>
            <p className="text-sm text-zinc-500 mt-4">
              Última atualização: Maio de 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
