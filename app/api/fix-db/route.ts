import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  
  // Segurança básica opcional: pode passar ?key=pdledits para rodar, ou executa direto
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (!isDevelopment && key !== 'pdlfix') {
    return NextResponse.json(
      { error: 'Não autorizado. Para executar em produção, acesse com ?key=pdlfix' },
      { status: 401 }
    );
  }

  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ error: 'DATABASE_URL não configurada no ambiente.' }, { status: 500 });
  }

  console.log('Iniciando correção automática de Collation no banco de dados...');
  
  try {
    const connection = await mysql.createConnection(url);
    const dbName = url.split('/').pop()?.split('?')[0] || 'pdledits';

    const queries = [
      `ALTER DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      `ALTER TABLE \`users\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      `ALTER TABLE \`accounts\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      `ALTER TABLE \`sessions\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      `ALTER TABLE \`services\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      `ALTER TABLE \`portfolio\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      `ALTER TABLE \`orders\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      `ALTER TABLE \`messages\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    ];

    const results = [];
    for (const query of queries) {
      try {
        await connection.query(query);
        results.push({ query, status: 'SUCESSO' });
      } catch (err: any) {
        results.push({ query, status: 'FALHOU', error: err.message });
      }
    }

    await connection.end();
    return NextResponse.json({
      success: true,
      message: 'Unificação de Collation concluída!',
      dbName,
      results
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      tip: 'Verifique se o banco de dados está online e se a string de conexão está correta.'
    }, { status: 500 });
  }
}
