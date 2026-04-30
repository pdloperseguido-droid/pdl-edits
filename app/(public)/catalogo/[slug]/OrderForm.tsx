'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';

interface OrderFormProps {
  serviceId: string;
  serviceTitle: string;
}

/** Formulário de pedido na página do serviço */
export function OrderForm({ serviceId, serviceTitle }: OrderFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redireciona para checkout com os dados do serviço
    const params = new URLSearchParams({
      serviceId,
      serviceTitle,
      notes,
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        id="order-notes"
        label="Descreva seu projeto (opcional)"
        placeholder="Ex: Preciso editar um vlog de 10 minutos com estilo cinematográfico, cores frias e música eletrônica suave..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
      />

      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={isLoading}
        leftIcon={<ShoppingCart className="w-5 h-5" />}
      >
        Fazer pedido agora
      </Button>
    </form>
  );
}
