-- ============================================================
-- Migração Manual: Adicionar Serviço Promocional
-- Combo: Highlight + Thumbnail
-- Cole este SQL no HeidiSQL e execute
-- ============================================================

INSERT INTO `services` (
  `id`,
  `slug`,
  `title`,
  `description`,
  `short_description`,
  `price`,
  `category`,
  `delivery_days`,
  `thumbnail_url`,
  `features`,
  `not_included`,
  `tags`,
  `is_active`,
  `is_featured`,
  `sort_order`
) VALUES (
  UUID(),
  'combo-highlight-thumbnail',
  'Combo: Highlight + Thumbnail',
  'O pacote perfeito para seu canal! Editamos seu highlight com cortes dinâmicos e colorização premium, e ainda criamos uma thumbnail de alta conversão para garantir o máximo de cliques. Economize com este combo exclusivo.',
  'Highlight profissional + Thumbnail de alta conversão em um só pacote.',
  59.90,
  'Promocional',
  2,
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=90',
  '["Edição de Highlight (até 10min)","Thumbnail Personalizada","Color Grading incluso","Trilha Sonora Licenciada","2 Revisões Gratuitas","Entrega em 48h"]',
  '["Gravação de conteúdo","Locução"]',
  'Combo,YouTube,Gaming,Promoção',
  1,
  1,
  0
);