import { db } from './lib/db';
import { users, services, orders, portfolio } from './lib/db/schema';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

async function seed() {
  console.log('Cleaning database...');
  await db.delete(orders);
  await db.delete(users);
  await db.delete(services);
  await db.delete(portfolio);
  
  console.log('Seeding...');

  const hashedPassword = await bcrypt.hash('PdlEdits2026!', 10);

  // 1. Users
  const adminId = randomUUID();
  const clientId = randomUUID();

  await db.insert(users).values([
    {
      id: adminId,
      name: 'Admin PDL',
      email: 'admin@pdledits.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
    {
      id: clientId,
      name: 'João Cliente',
      email: 'cliente@teste.com',
      password: hashedPassword,
      role: 'CLIENT',
    },
  ]);

  // 2. Services
  const videoServiceId = randomUUID();
  const thumbnailServiceId = randomUUID();
  const motionServiceId = randomUUID();
  const comboServiceId = randomUUID();

  await db.insert(services).values([
    {
      id: thumbnailServiceId,
      slug: 'thumbnails',
      title: 'Thumbnails',
      category: 'Foto',
      price: '25.00',
      deliveryDays: 1,
      description: 'Criação de miniaturas (thumbnails) profissionais e altamente clicáveis para YouTube e outras plataformas. Focamos em psicologia das cores, composição visual e legibilidade para garantir o máximo de cliques em seu conteúdo.',
      shortDescription: 'Miniaturas personalizadas de alta conversão para seus vídeos.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=90',
      features: JSON.stringify(['Design exclusivo e personalizado', 'Otimização de CTR (Taxa de Cliques)', 'Tratamento de imagem do criador', 'Tipografia chamativa', 'Alta resolução (PNG/JPEG)', 'Entrega em até 24h', '1 revisão gratuita']),
      notIncluded: JSON.stringify(['Ilustrações complexas do zero', 'Criação de logotipo', 'Arquivos editáveis (PSD)']),
      tags: 'YouTube,Gaming,Vlogs,Tutorials,Social Media',
      isFeatured: false,
      sortOrder: 0,
    },
    {
      id: videoServiceId,
      slug: 'edicao-de-video',
      title: 'Edição de Vídeo',
      category: 'Vídeo',
      price: '50.00',
      deliveryDays: 3,
      description: 'Serviço completo de edição de vídeo com corte profissional, colorização cinematográfica, inserção de trilha sonora licenciada e efeitos visuais. Ideal para YouTubers, criadores de conteúdo, casamentos e eventos corporativos.',
      shortDescription: 'Edição completa com corte, colorização e trilha sonora.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=90',
      features: JSON.stringify(['Corte e montagem profissional', 'Color grading cinematográfico', 'Trilha sonora licenciada', '2 revisões gratuitas', 'Exportação em 4K/1080p', 'Entrega em formato MP4', 'Legendas (sob demanda)', 'Miniatura para YouTube']),
      notIncluded: JSON.stringify(['Gravação do vídeo', 'Locução/narração', 'Animações complexas (Motion Graphics)', 'Mais de 2h de material bruto']),
      tags: 'YouTube,Instagram,Vlogs,Eventos,Casamento,Corporativo',
      isFeatured: true,
      sortOrder: 1,
    },
    {
      id: motionServiceId,
      slug: 'motion-graphics',
      title: 'Motion Graphics',
      category: 'Motion',
      price: '200.00',
      deliveryDays: 5,
      description: 'Criação de animações e elementos gráficos em movimento usando Adobe After Effects. Inclui intros, logos animados, lower thirds, títulos animados e elementos de transição.',
      shortDescription: 'Animações e elementos gráficos para seus vídeos.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=90',
      features: JSON.stringify(['After Effects profissional', 'Animação de logo', 'Títulos e lower thirds', 'Transições customizadas', 'Arquivo-fonte .aep incluído', '3 revisões gratuitas', 'Exportação em ProRes/H.264']),
      notIncluded: JSON.stringify(['Design de logo (apenas animação)', 'Mais de 3min de animação', 'Modelagem 3D']),
      tags: 'After Effects,Intros,Títulos,Logos,YouTube,Comerciais',
      isFeatured: false,
      sortOrder: 3,
    },
    {
      id: comboServiceId,
      slug: 'combo-highlight-thumbnail',
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
    },
  ]);

  // 3. Order
  const orderId = randomUUID();
  await db.insert(orders).values({
    id: orderId,
    userId: clientId,
    serviceId: videoServiceId,
    status: 'IN_PROGRESS',
    totalPrice: '50.00',
    paymentStatus: 'PAID',
    notes: 'Quero um estilo cinematográfico.',
  });

  // 4. Portfolio
  await db.insert(portfolio).values([
    {
      id: randomUUID(),
      title: 'Wedding Highlight Reel',
      category: 'Casamento',
      beforeUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=90',
      afterUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=90',
      type: 'IMAGE',
      isFeatured: true,
      description: 'Color grade cinematográfico para vídeo de casamento com paleta quente e dreamy.',
      sortOrder: 0,
    },
    {
      id: randomUUID(),
      title: 'Product Showcase Edit',
      category: 'Comercial',
      beforeUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=90',
      afterUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=90&sat=-100&con=80',
      type: 'IMAGE',
      isFeatured: true,
      description: 'Retoque e composição para catálogo de produto premium.',
      sortOrder: 1,
    },
    {
      id: randomUUID(),
      title: 'Bali Travel Film',
      category: 'Viagem',
      beforeUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90',
      afterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=90&hue-rotate=30',
      type: 'IMAGE',
      isFeatured: true,
      description: 'Edição de vlog de viagem com cortes dinâmicos e trilha envolvente.',
      sortOrder: 2,
    },
    {
      id: randomUUID(),
      title: 'Portrait Retouch Pro',
      category: 'Retrato',
      beforeUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=90',
      afterUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=90&sat=20',
      type: 'IMAGE',
      isFeatured: true,
      description: 'Retoque avançado de retrato com frequency separation e dodge & burn.',
      sortOrder: 3,
    },
    {
      id: randomUUID(),
      title: 'Corporate Event Coverage',
      category: 'Corporativo',
      beforeUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=90',
      afterUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=90&brightness=1.1',
      type: 'IMAGE',
      isFeatured: false,
      description: 'Edição de evento corporativo com múltiplas câmeras e sincronização.',
      sortOrder: 4,
    },
    {
      id: randomUUID(),
      title: 'Instagram Reels Pack',
      category: 'Social Media',
      beforeUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=90',
      afterUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=90&sat=30',
      type: 'IMAGE',
      isFeatured: false,
      description: 'Pack de reels otimizados para Instagram com hooks virais e CTA.',
      sortOrder: 5,
    },
    {
      id: randomUUID(),
      title: 'Anime Music Video (AMV)',
      category: 'Motion',
      beforeUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=90',
      afterUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', // Big Buck Bunny or similar public video
      type: 'VIDEO',
      isFeatured: true,
      description: 'AMV com sincronização precisa de batidas e efeitos de transição.',
      sortOrder: 6,
    },
  ]);

  console.log('Seed complete!');
  console.log('Admin: admin@pdledits.com / PdlEdits2026!');
  console.log('Client: cliente@teste.com / PdlEdits2026!');
  console.log('Order ID:', orderId);
}

seed().catch(console.error);
