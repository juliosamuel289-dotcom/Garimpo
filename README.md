# Garimpo
Site para produtos comissionados.

Vitrine de ofertas com Next.js App Router, React, Tailwind CSS e Supabase. O catálogo é consultado no servidor, com busca textual em português e paginação de 24 produtos.

## Configuração

1. Configure o projeto Supabase e execute [`supabase/schema.sql`](./supabase/schema.sql) no SQL Editor caso ainda não tenha feito isso.
2. Na Vercel, configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` nas variáveis de ambiente do projeto. Para desenvolvimento local, copie `.env.example` para `.env.local` e preencha as mesmas variáveis.
3. O catálogo já foi migrado para a tabela `public.produtos`. Não há importador JSON neste projeto.
4. A rotina do GitHub Actions em [`.github/workflows/sync-profile.yml`](./.github/workflows/sync-profile.yml) lê a lista pública “Minhas recomendações” a cada hora e atualiza o Supabase. Ela inclui o código de afiliado `matt_tool=51963698` nos links.
5. Conecte o repositório GitHub à Vercel para publicar o site e habilite o GitHub Actions. Cadastre `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` em **Settings → Secrets and variables → Actions → New repository secret** no GitHub. O primeiro sincronismo pode ser iniciado na aba **Actions → Sync Mercado Livre profile → Run workflow**; os seguintes são agendados de hora em hora.
6. A chave `service_role` é usada apenas pelo GitHub Actions para gravar no banco. Não a configure na Vercel, no `.env.local`, no `.env.example`, no navegador ou em variáveis `NEXT_PUBLIC_*`.

## Cupons

A página [`/cupons`](./src/app/cupons/page.tsx) consulta no servidor as páginas de cupons da Méliuz para Mercado Livre, Shopee e AliExpress. As respostas são armazenadas em cache por até uma hora; não é necessário criar uma tabela no Supabase nem configurar outro workflow. Os códigos são removidos quando deixam de aparecer na fonte após a atualização do cache. A Méliuz não informa datas confiáveis de vencimento para todos os cupons, e a fonte pode levar algum tempo para removê-los.

O sincronizador importa os produtos exibidos publicamente no perfil; não consegue ler produtos privados ou outros itens da conta. Como o Mercado Livre não fornece um feed oficial para essa lista, a rotina interpreta a página pública e pode precisar de ajustes se o formato mudar ou o acesso automatizado for bloqueado. Em caso de erro, ela não apaga produtos já cadastrados. Verifique no painel de afiliados se o parâmetro `matt_tool` está atribuindo as comissões esperadas.

## Desenvolvimento

```powershell
npm run dev
```

Abra <http://localhost:3000>. Para validar alterações:

```powershell
npm run lint
npm run build
```

A página busca no Supabase no servidor. A pesquisa consulta título e categoria; a paginação carrega 24 produtos por página.

Para testar a leitura da lista sem gravar no banco, execute no PowerShell:

```powershell
$env:MELI_AFFILIATE_TOOL = "51963698"
npm run sync:profile -- --dry-run
```
