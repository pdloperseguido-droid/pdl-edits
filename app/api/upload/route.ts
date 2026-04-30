import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/lib/auth/config';

// Configurações de segurança
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/quicktime', 'video/webm',
  'application/pdf', 'application/zip', 'application/x-zip-compressed'
];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validação de tamanho
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx 50MB)' }, { status: 400 });
    }

    // Validação de tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Gerar nome único para evitar colisões e ataques de sobrescrita
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    
    // Caminho relativo e absoluto
    const relativePath = `/uploads/${uniqueFileName}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const fullPath = join(uploadDir, uniqueFileName);

    // Garantir que o diretório existe
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignora se já existe
    }

    // Salvar arquivo
    await writeFile(fullPath, buffer);

    console.log(`[Upload] Arquivo salvo: ${fullPath}`);

    return NextResponse.json({
      url: relativePath,
      name: file.name,
      type: getSimpleFileType(file.type),
      size: file.size
    });

  } catch (error) {
    console.error('[Upload Error]:', error);
    return NextResponse.json({ error: 'Erro interno ao processar upload' }, { status: 500 });
  }
}

function getSimpleFileType(mimeType: string) {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.includes('pdf')) return 'PDF';
  return 'OTHER';
}
