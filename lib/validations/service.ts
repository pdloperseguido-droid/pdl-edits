import { z } from 'zod';

// ============================================
// Schema de Criação/Edição de Serviço (Admin)
// ============================================
export const serviceSchema = z.object({
  slug: z
    .string()
    .min(2, 'Slug muito curto')
    .max(100, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(255, 'Título muito longo'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  shortDescription: z
    .string()
    .max(500, 'Descrição curta muito longa')
    .optional(),
  price: z
    .number()
    .positive('Preço deve ser positivo')
    .max(99999, 'Preço muito alto'),
  category: z
    .string()
    .min(1, 'Categoria é obrigatória'),
  deliveryDays: z
    .number()
    .int('Prazo deve ser número inteiro')
    .positive('Prazo deve ser positivo')
    .max(365, 'Prazo muito longo'),
  thumbnailUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  features: z.array(z.string()).optional(),
  notIncluded: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

// ============================================
// Schema de Criação de Pedido
// ============================================
export const orderSchema = z.object({
  serviceId: z
    .string()
    .min(1, 'Serviço é obrigatório'),
  notes: z
    .string()
    .max(2000, 'Observações muito longas')
    .optional(),
  paymentMethod: z
    .enum(['STRIPE', 'PIX', 'BOLETO'], {
      message: 'Método de pagamento inválido',
    }),
});

// ============================================
// Schema de Item do Portfólio (Admin)
// ============================================
export const portfolioSchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(255, 'Título muito longo'),
  description: z
    .string()
    .optional(),
  category: z
    .string()
    .min(1, 'Categoria é obrigatória'),
  beforeUrl: z
    .string()
    .url('URL do "antes" inválida'),
  afterUrl: z
    .string()
    .url('URL do "depois" inválida'),
  type: z.enum(['IMAGE', 'VIDEO']).default('IMAGE'),
  isFeatured: z.boolean().optional().default(false),
});

// ============================================
// Schema de Atualização de Status do Pedido
// ============================================
export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'IN_PROGRESS',
    'REVIEW',
    'DELIVERED',
    'CANCELLED',
  ]),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
