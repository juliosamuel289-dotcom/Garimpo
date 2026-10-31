-- Importa os 10 produtos visíveis em:
-- https://www.mercadolivre.com.br/social/juliosamuel000
-- Os links são os endereços publicados no perfil, com seus parâmetros preservados.
insert into public.produtos (
  id,
  titulo,
  link,
  imagem,
  preco,
  preco_valor,
  categoria
)
values
  (
    'MLB-3879781723',
    'Cascata Estrela 3m 115 Leds Natal Prova D''água Bivolt 8 Fun',
    'https://produto.mercadolivre.com.br/MLB-3879781723-cascata-estrela-3m-115-leds-natal-prova-dagua-bivolt-8-fun-_JM??searchVariation=207734544169&matt_tool=51963698#polycard_client=social-profile-middleend&source=lists&type=item&tracking_id=bf1a5d52-a5d1-4151-b682-fe2d0f68a9b7',
    'https://http2.mlstatic.com/D_Q_NP_2X_902544-MLB118871219221_102026-AB.webp',
    'R$ 59,90',
    59.90,
    'Recomendados'
  ),
  (
    'MLB-5405524376',
    'Jaqueta Puffer De Frio Blusa Impermeável Inverno Intenso',
    'https://produto.mercadolivre.com.br/MLB-5405524376-jaqueta-puffer-de-frio-blusa-impermeavel-inverno-intenso-_JM?searchVariation=183734307522&matt_tool=51963698&matt_tracing_id=01423638-9d29-4e64-9410-2ee354a7c429&matt_event_ts=1793478097923&matt_d2id=6c24a9b5-f54f-4383-a86d-2f6f1ee422fd#polycard_client=social-profile-middleend&source=lists&type=item&tracking_id=bf1a5d52-a5d1-4151-b682-fe2d0f68a9b7',
    'https://http2.mlstatic.com/D_Q_NP_2X_829600-MLB112200803145_052026-AB.webp',
    'R$ 66,40',
    66.40,
    'Recomendados'
  ),
  (
    'MLB4288456287',
    'Bolsa De Viagem T60 Impermeável De Poliéster, Com Bolso Para Sapatos E 5 Divisões Cinza Liso',
    'https://www.mercadolivre.com.br/bolsa-de-viagem-t60-impermeavel-de-poliester-com-bolso-para-sapatos-e-5-divisoes/p/MLB58339984?matt_tool=51963698&matt_event_ts=1793478097923&matt_d2id=6c24a9b5-f54f-4383-a86d-2f6f1ee422fd&matt_tracing_id=01423638-9d29-4e64-9410-2ee354a7c429#polycard_client=social-profile-middleend&source=lists&type=product&tracking_id=bf1a5d52-a5d1-4151-b682-fe2d0f68a9b7&wid=MLB4288456287&sid=storefronts',
    'https://http2.mlstatic.com/D_Q_NP_2X_791614-MLA93307277976_092025-AB.webp',
    'R$ 74,90',
    74.90,
    'Recomendados'
  ),
  (
    'MLB4615784065',
    'Gorro Touca 100% Lã Natural Dual Color Canelada Para Neve Verde Musgo E Preto Un Liso',
    'https://www.mercadolivre.com.br/gorro-touca-100-la-natural-dual-color-canelada-para-neve-verde-musgo-e-preto-un/p/MLB68263653?matt_tool=51963698&matt_event_ts=1793478097923&matt_d2id=6c24a9b5-f54f-4383-a86d-2f6f1ee422fd&matt_tracing_id=01423638-9d29-4e64-9410-2ee354a7c429#polycard_client=social-profile-middleend&source=lists&type=product&tracking_id=bf1a5d52-a5d1-4151-b682-fe2d0f68a9b7&wid=MLB4615784065&sid=storefronts',
    'https://http2.mlstatic.com/D_Q_NP_2X_747801-MLA110566362087_042026-AB.webp',
    'R$ 35,00',
    35.00,
    'Recomendados'
  ),
  (
    'MLB6471445810',
    'Sandália Crocs Crocband Clog Quartz Quartz 37',
    'https://www.mercadolivre.com.br/sandalia-crocs-crocband-clog-quartz/up/MLBU3852794674?pdp_filters=item_id%3AMLB6471445810&matt_tool=51963698&matt_tracing_id=01423638-9d29-4e64-9410-2ee354a7c429&matt_event_ts=1793478097923&matt_d2id=6c24a9b5-f54f-4383-a86d-2f6f1ee422fd#polycard_client=social-profile-middleend&wid=MLB6471445810&source=lists&type=item&tracking_id=bf1a5d52-a5d1-4151-b682-fe2d0f68a9b7&sid=storefronts',
    'https://http2.mlstatic.com/D_Q_NP_2X_653855-MLB108878701955_032026-AB.webp',
    'R$ 369,00',
    369.00,
    'Recomendados'
  ),
  (
    'MLB2757682964',
    'Tenis Olympikus Dynamic Masculino Preto/vermelho Texturizado 43 Br',
    'https://www.mercadolivre.com.br/tenis-olympikus-dynamic-masculino/p/MLB18655622?matt_tool=51963698&matt_event_ts=1793478097923&matt_d2id=6c24a9b5-f54f-4383-a86d-2f6f1ee422fd&matt_tracing_id=01423638-9d29-4e64-9410-2ee354a7c429#polycard_client=social-profile-middleend&source=lists&type=product&tracking_id=bf1a5d52-a5d1-4151-b682-fe2d0f68a9b7&wid=MLB2757682964&sid=storefronts',
    'https://http2.mlstatic.com/D_Q_NP_2X_861113-MLA99885427321_112025-AB.webp',
    'R$ 329,99',
    329.99,
    'Recomendados'
  ),
  (
    'MLB4667709197',
    'Jaqueta Masculina Puffer Corta Vento Bobojaco Blusa De Frio Preto G',
    'https://www.mercadolivre.com.br/jaqueta-masculina-puffer-corta-vento-bobojaco-blusa-de-frio/up/MLBU3949921795?pdp_filters=item_id%3AMLB4667709197&matt_tool=51963698&matt_tracing_id=01423638-9d29-4e64-9410-2ee354a7c429&matt_event_ts=1793478097923&matt_d2id=6c24a9b5-f54f-4383-a86d-2f6f1ee422fd#polycard_client=social-profile-middleend&wid=MLB4667709197&source=lists&type=item&tracking_id=bf1a5d52-a5d1-4151-b682-fe2d0f68a9b7&sid=storefronts',
    'https://http2.mlstatic.com/D_Q_NP_2X_641434-MLB110943962716_052026-AB.webp',
    'R$ 59,59',
    59.59,
    'Recomendados'
  ),
  (
    'MLB5487391317',
    'Kit 10 Potes Vidro Hermetico Vai Ao Forno Microondas 640ml Marmita Hermético Freezer Fitness Rishon Azul-escuro',
    'https://www.mercadolivre.com.br/kit-10-potes-vidro-hermetico-vai-ao-forno-microondas-640ml-marmita-hermetico-freezer-fitness-rishon/p/MLB63904966?matt_tool=51963698&matt_event_ts=1793478097923&matt_d2id=6c24a9b5-f54f-4383-a86d-2f6f1ee422fd&matt_tracing_id=01423638-9d29-4e64-9410-2ee354a7c429#polycard_client=social-profile-middleend&source=lists&type=product&tracking_id=bf1a5d52-a5d1-4151-b682-fe2d0f68a9b7&wid=MLB5487391317&sid=storefronts',
    'https://http2.mlstatic.com/D_Q_NP_2X_804826-MLA118499072842_102026-AB.webp',
    'R$ 35,93',
    35.93,
    'Recomendados'
  ),
  (
    'MLB4971286277',
    'Lava Roupas Líquido Omo Lavanderia Profissional Lavagem 7l',
    'https://www.mercadolivre.com.br/lava-roupas-liquido-omo-lavanderia-profissional-lavagem-7l/p/MLB47068572?matt_tool=51963698&matt_event_ts=1793478097923&matt_d2id=6c24a9b5-f54f-4383-a86d-2f6f1ee422fd&matt_tracing_id=01423638-9d29-4e64-9410-2ee354a7c429#polycard_client=social-profile-middleend&source=lists&type=product&tracking_id=bf1a5d52-a5d1-4151-b682-fe2d0f68a9b7&wid=MLB4971286277&sid=storefronts',
    'https://http2.mlstatic.com/D_Q_NP_2X_741613-MLA99336286980_112025-AB.webp',
    'R$ 127,90',
    127.90,
    'Recomendados'
  ),
  (
    'MLB3502468545',
    'Filamento Voolt 3d Pla Verde Efeito Fosco Velvet Premium 1kg Verde Velvet',
    'https://www.mercadolivre.com.br/filamento-voolt-3d-pla-verde-efeito-fosco-velvet-premium-1kg-verde-velvet/p/MLB23487120?matt_tool=51963698&matt_event_ts=1793478097923&matt_d2id=6c24a9b5-f54f-4383-a86d-2f6f1ee422fd&matt_tracing_id=01423638-9d29-4e64-9410-2ee354a7c429#polycard_client=social-profile-middleend&source=lists&type=product&tracking_id=bf1a5d52-a5d1-4151-b682-fe2d0f68a9b7&wid=MLB3502468545&sid=storefronts',
    'https://http2.mlstatic.com/D_Q_NP_2X_647571-MLA116549201715_082026-AB.webp',
    'R$ 113,55',
    113.55,
    'Recomendados'
  )
on conflict (id) do update set
  titulo = excluded.titulo,
  link = excluded.link,
  imagem = excluded.imagem,
  preco = excluded.preco,
  preco_valor = excluded.preco_valor,
  categoria = excluded.categoria;
