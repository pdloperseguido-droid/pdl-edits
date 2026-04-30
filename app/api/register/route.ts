import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { registerSchema } from '@/lib/validations/auth';

/** API para registro de usuário */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Verifica se e-mail já existe
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.' },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cria usuário
    const userId = randomUUID();
    await db.insert(users).values({
      id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'CLIENT',
    });

    return NextResponse.json({ success: true, userId }, { status: 201 });
  } catch (error) {
    console.error('[REGISTER]', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
