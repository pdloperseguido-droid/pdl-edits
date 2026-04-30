'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, ExternalLink, Image as ImageIcon, Film, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/server/actions/portfolio';
import type { Portfolio } from '@/lib/db/schema';
import type { PortfolioInput } from '@/lib/validations/service';
import { toast } from 'sonner';

interface PortfolioManagerProps {
  initialItems: Portfolio[];
}

export function PortfolioManager({ initialItems }: PortfolioManagerProps) {
  const [items, setItems] = useState<Portfolio[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<PortfolioInput>({
    title: '',
    description: '',
    category: '',
    beforeUrl: '',
    afterUrl: '',
    type: 'IMAGE',
    isFeatured: false,
  });

  const handleOpenModal = (item?: Portfolio) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        description: item.description || '',
        category: item.category,
        beforeUrl: item.beforeUrl,
        afterUrl: item.afterUrl,
        type: item.type,
        isFeatured: item.isFeatured,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        beforeUrl: '',
        afterUrl: '',
        type: 'IMAGE',
        isFeatured: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        const res = await updatePortfolioItem(editingId, formData);
        if (res.error) throw new Error(res.error);
        setItems(items.map(i => i.id === editingId ? { ...i, ...formData } as Portfolio : i));
        toast.success('Item atualizado com sucesso!');
      } else {
        const res = await createPortfolioItem(formData);
        if (res.error) throw new Error(res.error);
        // Refresh items or optimistic update
        window.location.reload(); // Simplest way to get the ID and dates correctly
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const res = await deletePortfolioItem(id);
      if (res.error) throw new Error(res.error);
      setItems(items.filter(i => i.id !== id));
      toast.success('Item removido com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao remover item');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Portfólio</h1>
          <p className="text-zinc-400 mt-1">Gerencie a vitrine de trabalhos do site.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Novo Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="glass border border-white/5 rounded-2xl overflow-hidden group">
            <div className="aspect-video relative bg-zinc-900">
              {(() => {
                const isVideo = item.type?.toUpperCase() === 'VIDEO';
                const getThumbnail = () => {
                  if (!isVideo) return item.afterUrl;
                  if (item.beforeUrl && item.beforeUrl.startsWith('http')) return item.beforeUrl;
                  const ytMatch = item.afterUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
                  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
                  return item.beforeUrl;
                };
                return (
                  <img 
                    src={getThumbnail()} 
                    alt={item.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                );
              })()}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="secondary" className="bg-black/60 backdrop-blur-md">
                  {item.type === 'VIDEO' ? <Film className="w-3 h-3 mr-1" /> : <ImageIcon className="w-3 h-3 mr-1" />}
                  {item.category}
                </Badge>
                {item.isFeatured && (
                  <Badge variant="primary" className="glow-purple-sm">
                    <Star className="w-3 h-3 mr-1 fill-white" /> Destaque
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-white mb-1">{item.title}</h3>
              <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{item.description || 'Sem descrição'}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(item)}
                    className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg hover:bg-red-500/5 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <a 
                  href={item.afterUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
                >
                  Ver link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 glass border border-dashed border-white/10 rounded-3xl">
          <p className="text-zinc-500">Nenhum item cadastrado ainda.</p>
          <Button 
            variant="secondary" 
            className="mt-4" 
            onClick={() => handleOpenModal()}
          >
            Adicionar meu primeiro trabalho
          </Button>
        </div>
      )}

      {/* Modal de Formulário */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Item' : 'Novo Item do Portfólio'}
        description="Preencha os dados abaixo para exibir seu trabalho na vitrine."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input 
            label="Título"
            placeholder="Ex: Edição Cinematográfica Viagem Japão"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Categoria"
              placeholder="Ex: Viagem, Casamento..."
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">Tipo</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/60 transition-all"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'IMAGE' | 'VIDEO' })}
              >
                <option value="IMAGE" className="bg-[#111]">Imagem</option>
                <option value="VIDEO" className="bg-[#111]">Vídeo</option>
              </select>
            </div>
          </div>

          <Textarea 
            label="Descrição (Opcional)"
            placeholder="Breve resumo do que foi feito..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="URL Antes (Preview)"
              placeholder="https://..."
              value={formData.beforeUrl}
              onChange={(e) => setFormData({ ...formData, beforeUrl: e.target.value })}
              required
            />
            <Input 
              label="URL Depois (Resultado)"
              placeholder="https://..."
              value={formData.afterUrl}
              onChange={(e) => setFormData({ ...formData, afterUrl: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
            <input 
              id="isFeatured"
              type="checkbox"
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-violet-500 focus:ring-violet-500"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            />
            <label htmlFor="isFeatured" className="text-sm text-zinc-300 cursor-pointer">
              Destacar este item na página inicial
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              isLoading={isLoading}
            >
              {editingId ? 'Salvar Alterações' : 'Criar Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
