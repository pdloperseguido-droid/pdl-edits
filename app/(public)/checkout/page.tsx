'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, CreditCard, Lock, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { createCheckoutSession } from '@/server/actions/payments';

type Step = 'details' | 'payment' | 'confirmation';

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  paymentMethod: 'STRIPE' | 'PIX' | 'BOLETO';
}

/** Página de checkout com 3 etapas */
function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceId = searchParams.get('serviceId') || '';
  const serviceTitle = searchParams.get('serviceTitle') || 'Serviço';
  const notes = searchParams.get('notes') || '';

  // Preço mock — será buscado do server quando integrado ao DB
  const price = 150;

  const [step, setStep] = useState<Step>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [form, setForm] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'STRIPE',
  });

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateDetails = () => {
    const newErrors: Partial<CheckoutFormData> = {};
    if (!form.name.trim() || form.name.length < 2) newErrors.name = 'Nome inválido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'E-mail inválido';
    if (!form.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) setStep('payment');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await createCheckoutSession(serviceId, notes);
      
      if (res.error) {
        throw new Error(res.error);
      }

      if (res.url) {
        window.location.href = res.url;
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao processar pagamento');
      setIsLoading(false);
    }
  };

  const STEPS = [
    { id: 'details', label: 'Seus dados' },
    { id: 'payment', label: 'Pagamento' },
    { id: 'confirmation', label: 'Confirmação' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => router.back()}
            className="mb-6"
          >
            Voltar
          </Button>
          <h1 className="text-4xl font-black mb-2">Finalizar Pedido</h1>
          <p className="text-zinc-400">Complete os dados abaixo para confirmar seu pedido.</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute inset-x-0 top-4 h-px bg-white/10" aria-hidden="true" />
          {STEPS.map((s, i) => {
            const isActive = s.id === step;
            const isDone = STEPS.indexOf({ id: step, label: '' } as typeof STEPS[0]) > i ||
              (step === 'payment' && i === 0) || (step === 'confirmation' && i <= 1);
            return (
              <div key={s.id} className="relative flex flex-col items-center gap-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isActive ? 'btn-gradient text-white' :
                  isDone ? 'bg-emerald-500 text-white' :
                  'bg-zinc-800 text-zinc-500 border border-white/10'
                }`}>
                  {isDone && !isActive ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-violet-400' : 'text-zinc-500'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-3">
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="glass border border-white/8 rounded-2xl p-8 space-y-6">
                <h2 className="text-xl font-bold">Seus dados</h2>
                <Input
                  id="checkout-name"
                  label="Nome completo"
                  placeholder="João Silva"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  error={errors.name}
                  required
                />
                <Input
                  id="checkout-email"
                  label="E-mail"
                  type="email"
                  placeholder="joao@email.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  error={errors.email}
                  required
                />
                <Input
                  id="checkout-phone"
                  label="WhatsApp / Telefone"
                  placeholder="(11) 99999-9999"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  error={errors.phone}
                  required
                />
                <Button type="submit" size="lg" className="w-full">
                  Continuar para pagamento
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handlePayment} className="glass border border-white/8 rounded-2xl p-8 space-y-6">
                <h2 className="text-xl font-bold">Método de pagamento</h2>

                {/* Opções de pagamento */}
                <div className="space-y-3">
                  {[
                    { value: 'STRIPE', label: 'Cartão de crédito/débito', icon: '💳', desc: 'Visa, Mastercard, Elo — via Stripe' },
                    { value: 'PIX', label: 'Pix', icon: '⚡', desc: 'Pagamento instantâneo' },
                    { value: 'BOLETO', label: 'Boleto bancário', icon: '📄', desc: 'Compensação em até 3 dias úteis' },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        form.paymentMethod === method.value
                          ? 'border-violet-500/50 bg-violet-500/10'
                          : 'border-white/8 hover:border-white/15 bg-white/3'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={form.paymentMethod === method.value as 'STRIPE' | 'PIX' | 'BOLETO'}
                        onChange={(e) => updateField('paymentMethod', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        form.paymentMethod === method.value ? 'border-violet-500' : 'border-white/20'
                      }`}>
                        {form.paymentMethod === method.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                        )}
                      </div>
                      <span className="text-2xl flex-shrink-0" aria-hidden="true">{method.icon}</span>
                      <div>
                        <p className="font-medium text-white">{method.label}</p>
                        <p className="text-xs text-zinc-500">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {form.paymentMethod === 'STRIPE' && (
                  <div className="space-y-4 pt-2 border-t border-white/5">
                    <Input id="card-number" label="Número do cartão" placeholder="0000 0000 0000 0000" leftIcon={<CreditCard className="w-4 h-4" />} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input id="card-expiry" label="Validade" placeholder="MM/AA" />
                      <Input id="card-cvv" label="CVV" placeholder="123" type="password" />
                    </div>
                    <Input id="card-name" label="Nome no cartão" placeholder="JOAO SILVA" />
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" size="lg" onClick={() => setStep('details')} className="flex-1">
                    Voltar
                  </Button>
                  <Button type="submit" size="lg" className="flex-2 flex-1" isLoading={isLoading} leftIcon={<Lock className="w-4 h-4" />}>
                    {isLoading ? 'Processando...' : 'Confirmar pagamento'}
                  </Button>
                </div>
              </form>
            )}

            {step === 'confirmation' && (
              <div className="glass border border-emerald-500/20 rounded-2xl p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">Pedido confirmado! 🎉</h2>
                  <p className="text-zinc-400">Seu pedido foi recebido e já está sendo processado.</p>
                </div>
                <div className="glass border border-white/8 rounded-xl p-4 text-left">
                  <p className="text-xs text-zinc-500 mb-1">Número do pedido</p>
                  <p className="text-xl font-bold text-violet-400">{orderId}</p>
                </div>
                <p className="text-sm text-zinc-400">
                  Você receberá uma confirmação em <strong className="text-white">{form.email}</strong>. 
                  Acesse a área do cliente para acompanhar e enviar seus arquivos pelo chat.
                </p>
                <div className="flex flex-col gap-3">
                  <Button size="lg" onClick={() => router.push('/minha-conta')}>
                    Ir para Minha Conta
                  </Button>
                  <Button variant="ghost" size="md" onClick={() => router.push('/')}>
                    Voltar ao início
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Resumo do pedido */}
          <div className="lg:col-span-2">
            <div className="glass border border-white/8 rounded-2xl p-6 sticky top-28 space-y-5">
              <h3 className="font-bold text-white">Resumo do pedido</h3>

              <div className="pb-5 border-b border-white/8">
                <p className="text-sm text-zinc-400 mb-1">Serviço</p>
                <p className="font-semibold text-white">{serviceTitle}</p>
              </div>

              {notes && (
                <div className="pb-5 border-b border-white/8">
                  <p className="text-sm text-zinc-400 mb-1">Observações</p>
                  <p className="text-sm text-zinc-300 line-clamp-3">{notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-zinc-400">Subtotal</p>
                <p className="text-white font-semibold">{formatPrice(price)}</p>
              </div>
              <div className="flex items-center justify-between pb-5 border-b border-white/8">
                <p className="text-zinc-400">Taxa de serviço</p>
                <p className="text-white">Grátis</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-white">Total</p>
                <p className="text-2xl font-black text-gradient">{formatPrice(price)}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/8">
                <Shield className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <p className="text-xs text-zinc-500">Pagamento seguro via Stripe. Seus dados estão protegidos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
