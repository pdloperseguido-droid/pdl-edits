import { Shield, Lock, Eye, FileText, Scale } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidade',
  description: 'Como protegemos seus dados na PDL Edits.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Política de <span className="text-gradient">Privacidade</span></h1>
          <p className="text-zinc-400 text-lg">Sua privacidade é nossa prioridade absoluta.</p>
        </div>

        <div className="glass-strong border border-white/10 rounded-3xl p-8 md:p-12 space-y-12 text-zinc-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Eye className="w-6 h-6 text-violet-400" />
              1. Coleta de Informações
            </h2>
            <p>
              Coletamos apenas os dados estritamente necessários para a prestação de nossos serviços de edição digital:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dados de Cadastro:</strong> Nome, e-mail e telefone/WhatsApp para contato e entrega dos arquivos.</li>
              <li><strong>Dados de Pagamento:</strong> Processados de forma segura via Stripe ou Pix. Não armazenamos números de cartão de crédito em nossos servidores.</li>
              <li><strong>Arquivos de Mídia:</strong> Vídeos e fotos enviados para edição são armazenados temporariamente apenas durante o processo de produção e revisão.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Lock className="w-6 h-6 text-violet-400" />
              2. Uso dos Dados
            </h2>
            <p> Seus dados são utilizados exclusivamente para: </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processar seus pedidos e realizar a entrega dos serviços contratados.</li>
              <li>Enviar atualizações sobre o status da sua edição.</li>
              <li>Suporte técnico e comunicação direta com o editor responsável.</li>
              <li>Com sua autorização, enviar novidades e ofertas exclusivas via newsletter.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Scale className="w-6 h-6 text-violet-400" />
              3. LGPD e Seus Direitos
            </h2>
            <p>
              Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, você possui o direito de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Confirmar a existência de tratamento de seus dados.</li>
              <li>Acessar, corrigir ou excluir seus dados de nossa base a qualquer momento.</li>
              <li>Revogar o consentimento para comunicações de marketing.</li>
              <li>Solicitar a portabilidade de seus dados.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileText className="w-6 h-6 text-violet-400" />
              4. Armazenamento e Exclusão
            </h2>
            <p>
              Arquivos de vídeo brutos e projetos editados são mantidos em nossos servidores por um período de <strong>30 dias</strong> após a entrega final, como garantia caso você perca seus arquivos. Após este prazo, os arquivos de mídia são permanentemente excluídos para sua segurança.
            </p>
          </section>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-zinc-500">
              Última atualização: Maio de 2024
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              Dúvidas? Entre em contato via <a href="mailto:contato@pdledits.com" className="text-violet-400 hover:underline">contato@pdledits.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
