'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Film, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('E-mail ou senha incorretos. Verifique e tente novamente.');
      setIsLoading(false);
      return;
    }

    // Redireciona baseado na role (o middleware cuida disso, mas forçamos aqui)
    router.push('/minha-conta');
    router.refresh();
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
          <h1 className="text-3xl font-black text-white">Bem-vindo de volta</h1>
          <p className="text-zinc-400 mt-2">Entre na sua conta para continuar</p>
        </div>

        {/* Card de login */}
        <div className="glass-strong border border-white/10 rounded-2xl p-8 space-y-6">
          {/* Erro global */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400" role="alert">
              {error}
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

          {/* Divisor */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Form */}
          <form onSubmit={handleCredentials} className="space-y-5">
            <Input
              id="login-email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />
            <div>
              <Input
                id="login-password"
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                autoComplete="current-password"
                required
              />
              <div className="flex justify-end mt-1.5">
                <Link href="/auth/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Esqueci minha senha
                </Link>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Registro */}
          <p className="text-center text-sm text-zinc-500">
            Não tem conta?{' '}
            <Link href="/auth/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
