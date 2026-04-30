'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Tag, Clock, DollarSign, List, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { createService, updateService, deleteService, toggleServiceActive } from '@/server/actions/services';
import type { Service } from '@/lib/db/schema';
import type { ServiceInput } from '@/lib/validations/service';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

interface ServiceManagerProps {
  initialItems: any[]; // Usando any[] para lidar com o parse do servidor
}

export function ServiceManager({ initialItems }: ServiceManagerProps) {
  const [items, setItems] = useState<any[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<ServiceInput>({
    slug: '',
    title: '',
    description: '',
    shortDescription: '',
    price: 0,
    category: '',
    deliveryDays: 3,
    thumbnailUrl: '',
    features: [],
    notIncluded: [],
    tags: [],
    isActive: true,
    isFeatured: false,
  });

  // State para arrays do formulário
  const [featureInput, setFeatureInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        slug: item.slug,
        title: item.title,
        description: item.description,
        shortDescription: item.shortDescription || '',
        price: Number(item.price),
        category: item.category,
        deliveryDays: item.deliveryDays,
        thumbnailUrl: item.thumbnailUrl || '',
        features: item.features || [],
        notIncluded: item.notIncluded || [],
        tags: item.tags || [],
        isActive: item.isActive,
        isFeatured: item.isFeatured,
      });
    } else {
      setEditingId(null);
      setFormData({
        slug: '',
        title: '',
        description: '',
        shortDescription: '',
        price: 0,
        category: '',
        deliveryDays: 3,
        thumbnailUrl: '',
        features: [],
        notIncluded: [],
        tags: [],
        isActive: true,
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
        const res = await updateService(editingId, formData);
        if (res.error) throw new Error(res.error);
        toast.success('Serviço atualizado!');
      } else {
        const res = await createService(formData);
        if (res.error) throw new Error(res.error);
        toast.success('Serviço criado!');
      }
      window.location.reload();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este serviço permanentemente?')) return;
    try {
      const res = await deleteService(id);
      if (res.error) throw new Error(res.error);
      setItems(items.filter(i => i.id !== id));
      toast.success('Serviço removido');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await toggleServiceActive(id, !current);
      if (res.error) throw new Error(res.error);
      setItems(items.map(i => i.id === id ? { ...i, isActive: !current } : i));
      toast.success(current ? 'Serviço desativado' : 'Serviço ativado');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFormData({ ...formData, features: [...(formData.features || []), featureInput.trim()] });
    setFeatureInput('');
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Catálogo de Serviços</h1>
          <p className="text-zinc-400 mt-1">Configure os pacotes e preços oferecidos no site.</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Novo Serviço
        </Button>
      </div>

      <div className="glass border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/2 text-left">
              <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Serviço</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Prazo</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/2 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/5 overflow-hidden flex-shrink-0">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Tag className="w-4 h-4 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-xs text-zinc-500 font-mono">/{item.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400">{item.category}</td>
                <td className="px-6 py-4 font-bold text-white">{formatPrice(item.price)}</td>
                <td className="px-6 py-4 text-zinc-400">{item.deliveryDays} dias</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleToggleActive(item.id, item.isActive)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                      item.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {item.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {item.isActive ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg hover:bg-red-500/5 text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 bg-white/2 border border-dashed border-white/10 rounded-2xl mt-6">
          <p className="text-zinc-500">Nenhum serviço no catálogo.</p>
        </div>
      )}

      {/* Modal Formulário */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Serviço' : 'Novo Serviço'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Nome do Serviço"
              placeholder="Ex: Edição de Reels Premium"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input 
              label="Slug (URL)"
              placeholder="ex-edicao-reels"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="Preço (R$)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
            <Input 
              label="Categoria"
              placeholder="Vídeo, Foto, etc"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <Input 
              label="Prazo (Dias)"
              type="number"
              value={formData.deliveryDays}
              onChange={(e) => setFormData({ ...formData, deliveryDays: Number(e.target.value) })}
              required
            />
          </div>

          <Textarea 
            label="Descrição Curta"
            placeholder="Resumo para o card do catálogo..."
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            rows={2}
          />

          <Textarea 
            label="Descrição Completa"
            placeholder="Detalhes completos do que o serviço oferece..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />

          <Input 
            label="URL da Thumbnail"
            placeholder="https://..."
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
          />

          {/* Gerenciamento de Features */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <List className="w-4 h-4" /> Recursos Incluídos
            </label>
            <div className="flex gap-2">
              <Input 
                placeholder="Ex: Resolução 4K"
                className="flex-1"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" variant="secondary" onClick={addFeature}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(formData.features) && formData.features.map((f, i) => (
                <Badge key={i} variant="secondary" className="pr-1 py-1">
                  {f}
                  <button type="button" onClick={() => removeFeature(i)} className="ml-2 hover:text-red-400 p-0.5">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-white/5">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              {editingId ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
