import { db } from './lib/db';
import { services } from './lib/db/schema';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config({ path: '.env.local' });

async function addPromo() {
  try {
    const slug = 'combo-highlight-thumbnail';
    const existing = await db.select().from(services).where(eq(services.slug, slug));
    
    if (existing.length > 0) {
      console.log('Combo already exists.');
      return;
    }

    await db.insert(services).values({
      id: randomUUID(),
      slug: slug,
      title: 'Combo: Highlight + Thumbnail',
      category: 'Promocional',
      price: '59.90',
      deliveryDays: 2,
      description: 'O pacote perfeito para seu canal! Editamos seu highlight com cortes dinâmicos e colorização premium, e ainda criamos uma thumbnail de alta conversão para garantir o máximo de cliques. Economize com este combo exclusivo.',
      shortDescription: 'Highlight profissional + Thumbnail de alta conversão em um só pacote.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=90',
      features: JSON.stringify(['Edição de Highlight (até 10min)', 'Thumbnail Personalizada', 'Color Grading incluso', 'Trilha Sonora Licenciada', '2 Revisões Gratuitas', 'Entrega em 48h']),
      notIncluded: JSON.stringify(['Gravação de conteúdo', 'Locução']),
      tags: 'Combo,YouTube,Gaming,Promoção',
      isFeatured: true,
      sortOrder: 0,
    });

    console.log('Combo added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to add combo:', error);
    process.exit(1);
  }
}

addPromo();
