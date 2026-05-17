'use client';

import { useState } from 'react';
import { ExternalLink, Check, Loader2, ArrowRight } from 'lucide-react';
import { deliverOrder } from '@/server/actions/orders';
import { toast } from 'sonner';

interface DeliverFormProps {
  orderId: string;
  initialDeliverableUrl?: string | null;
}

export function DeliverForm({ orderId, initialDeliverableUrl }: DeliverFormProps) {
  const [url, setUrl] = useState(initialDeliverableUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!initialDeliverableUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      const res = await deliverOrder({ orderId, deliverableUrl: url.trim() });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Projeto entregue com sucesso! O cliente foi notificado.');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Erro ao entregar o projeto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass border border-white/5 rounded-2xl p-4 space-y-4">
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Entregável do Projeto</p>
        <p className="text-[10px] text-zinc-600 mt-0.5">Link final do vídeo editado (Google Drive, Mega, etc.)</p>
      </div>

      {!isEditing && url ? (
        <div className="space-y-3">
          <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl flex items-center justify-between">
            <span className="text-xs text-zinc-400 truncate max-w-[140px]">{url}</span>
            <a 
              href={url} 
              target="_blank" 
              rel="noreferrer" 
              className="p-1 rounded-lg hover:bg-white/5 text-violet-400 hover:text-violet-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-2 rounded-xl border border-white/10 hover:border-white/20 text-[10px] font-black uppercase tracking-wider transition-all text-zinc-400 hover:text-white"
          >
            Atualizar Entrega
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="url"
            required
            placeholder="https://drive.google.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40 transition-all"
          />
          <div className="flex gap-2">
            {initialDeliverableUrl && (
              <button
                type="button"
                onClick={() => {
                  setUrl(initialDeliverableUrl);
                  setIsEditing(false);
                }}
                className="flex-1 py-2 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-wider transition-all text-zinc-500 hover:text-zinc-300"
              >
                Voltar
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="flex-1 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  Entregar <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
