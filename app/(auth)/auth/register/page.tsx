'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Film, User, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerSchema } from '@/lib/validations/auth';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Erro ao criar conta. Tente novamente.');
        setIsLoading(false);
        return;
      }

      // Auto-login após registro
      await signIn('credentials', {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      router.push('/minha-conta');
      router.refresh();
    } catch {
      setServerError('Erro interno. Tente novamente.');
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/minha-conta' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black">
              PDL <span className="text-gradient">Edits</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white">Criar sua conta</h1>
          <p className="text-zinc-400 mt-2">Comece a usar os serviços de edição hoje</p>
        </div>

        <div className="glass-strong border border-white/10 rounded-2xl p-8 space-y-6">
          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400" role="alert">
              {serverError}
            </div>
          )}

          {/* Google */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            isLoading={isGoogleLoading}
            onClick={handleGoogle}
            leftIcon={<LogIn className="w-5 h-5" />}
          >
            Continuar com Google
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              id="reg-name"
              label="Nome completo"
              placeholder="João Silva"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name}
              autoComplete="name"
              required
            />
            <Input
              id="reg-email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              autoComplete="email"
              required
            />
            <Input
              id="reg-password"
              label="Senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password}
              hint="Mínimo 8 caracteres, uma maiúscula e um número"
              autoComplete="new-password"
              required
            />
            <Input
              id="reg-confirm"
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              value={form.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword}
              autoComplete="new-password"
              required
            />

            <p className="text-xs text-zinc-500">
              Ao criar sua conta, você concorda com nossos{' '}
              <Link href="/termos" className="text-violet-400 hover:text-violet-300">Termos de Uso</Link>{' '}
              e{' '}
              <Link href="/privacidade" className="text-violet-400 hover:text-violet-300">Política de Privacidade</Link>.
            </p>

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar conta grátis'}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
