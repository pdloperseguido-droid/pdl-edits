import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, accounts, sessions } from '@/lib/db/schema';
import { loginSchema } from '@/lib/validations/auth';

// ============================================
// Configuração NextAuth v5
// ============================================
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adapter Drizzle para persistir sessões no MySQL
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),

  providers: [
    // -------------------------------------
    // Provider: Google OAuth
    // -------------------------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'CLIENT' as const,
        };
      },
    }),

    // -------------------------------------
    // Provider: Credentials (email/senha)
    // -------------------------------------
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        // Valida com Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Busca o usuário no banco
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user) {
          console.log('Login failed: User not found', email);
          return null;
        }
        
        if (!user.password) {
          console.log('Login failed: User has no password (OAuth account?)', email);
          return null;
        }

        // Verifica senha
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          console.log('Login failed: Password mismatch', email);
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  callbacks: {
    // Adiciona role ao token JWT
    async jwt({ token, user, account }) {
      if (user) {
        (token as any).id = user.id;
        (token as any).role = (user as { role?: string }).role ?? 'CLIENT';
      }

      // Para OAuth, busca role do banco
      if (account && account.provider !== 'credentials') {
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email as string))
          .limit(1);
        if (dbUser) {
          (token as any).id = dbUser.id;
          (token as any).role = dbUser.role;
        }
      }

      return token;
    },

    // Expõe role na sessão
    async session({ session, token }) {
      if (token) {
        session.user.id = (token as any).id as string;
        session.user.role = (token as any).role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },

  secret: process.env.AUTH_SECRET,
});

// Tipos estendidos para a sessão
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
    };
  }

  interface User {
    role?: string;
  }
}

