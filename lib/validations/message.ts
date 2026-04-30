import { z } from 'zod';

// ============================================
// Schema de Mensagem do Chat
// ============================================
export const messageSchema = z.object({
  orderId: z
    .string()
    .min(1, 'ID do pedido é obrigatório'),
  content: z
    .string()
    .min(1, 'Mensagem não pode estar vazia')
    .max(5000, 'Mensagem muito longa'),
  fileUrl: z
    .string()
    .optional()
    .nullable(),
  fileType: z
    .enum(['IMAGE', 'VIDEO', 'PDF', 'OTHER'])
    .optional()
    .nullable(),
  fileName: z
    .string()
    .max(255, 'Nome do arquivo muito longo')
    .optional()
    .nullable(),
});

export type MessageInput = z.infer<typeof messageSchema>;
