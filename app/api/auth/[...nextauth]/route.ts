import { handlers } from '@/lib/auth/config';

// ============================================
// Route handler para NextAuth v5
// Expõe GET e POST para /api/auth/*
// ============================================
export const { GET, POST } = handlers;
