---
name: analisar-cliente
description: Analisa a presenca digital (site, Instagram, Facebook, TikTok) e o cadastro na Receita Federal (CNPJ) de um cliente/lead ja cadastrado no CRM ou de um prospect novo. Pesquisa na web, avalia os canais, cruza dados para gerar insights concretos em portugues e obrigatoriamente salva o resultado no banco do CRM (fonte unica de verdade, visivel na tela do cliente). Use quando o usuario pedir para analisar cliente, analisar prospect, avaliar presenca digital, revisar redes sociais, auditar site ou analisar CNPJ/cadastro.
---

Paths abaixo sao relativos a `CRM/` (raiz do app Next.js), nao a este diretorio de skill.

## Como rodar os scripts desta skill (leia antes do passo 1)

Esta skill mora em `/root/Barn_swallow/.claude/skills/analisar-cliente/`, **fora** de `CRM/` — de
`CRM/` os scripts ficam em `../.claude/skills/analisar-cliente/scripts/`.

O Node do host e o **v12**, que nao entende a sintaxe dos scripts (`SyntaxError: Unexpected reserved
word` no top-level await). Use sempre o Node 20 em `/opt/node20/bin/node`. Nao adianta rodar
`docker exec crm-farjgital node ...`: o container nao monta o diretorio `.claude`.

O `AUTOMACOES_API_SECRET` **nao esta em nenhum `.env`** — ele vive na tabela `Configuracao` do
Postgres do CRM. Exporte-o uma vez por sessao antes de rodar qualquer script:

```bash
cd /root/Barn_swallow/CRM
export AUTOMACOES_API_SECRET=$(docker exec crm-farjgital-db psql -U crm -d crm_farjgital -tAc \
  "SELECT valor FROM \"Configuracao\" WHERE chave='AUTOMACOES_API_SECRET'")
```

Sem isso o script aborta com "AUTOMACOES_API_SECRET nao encontrado" antes de falar com o CRM.

## O que essa skill faz

O CRM tambem tem uma versao automatica dessa analise embutida no botao "Analisar cliente" (`src/lib/analiseProfundaIA.ts` + `src/lib/cnpj.ts`) — ela roda sozinha via OpenRouter (busca web da IA + fetch simples de cada canal + consulta de CNPJ via BrasilAPI), sem precisar do Claude Code. Esta skill faz o mesmo tipo de analise, mas **com voce mesmo** (com suas ferramentas de busca/fetch na web) abrindo o site e os perfis sociais de verdade — util quando a versao automatica nao acha nada (ex: modelo de IA sem suporte a busca web configurado), ou quando o usuario quer uma investigacao mais a fundo do que um unico prompt automatico consegue.

Os dois caminhos salvam no mesmo lugar e no mesmo formato (`AnaliseProfundaResultado`), entao o resultado desta skill aparece no CRM exatamente como o do botao.

Fluxo: buscar cliente no CRM (ou tratar como prospect novo) -> descobrir/confirmar canais -> consultar CNPJ (se houver) -> analisar cada canal -> cruzar cadastro com o que foi observado -> montar relatorio em PT-BR -> salvar pela API no banco do CRM via `scripts/salvar-analise.mjs` -> confirmar o `CONFIRMADO_NO_CRM`.

> **Fonte unica: o banco.** Desde 2026-07-12 a analise e salva SO no Postgres do CRM (aparece na tela do cliente). O espelho antigo em arquivo (`CLIENTES/<slug>/AUDITORIA.md`) esta DESLIGADO por padrao — nao gere nem procure esse arquivo. (Ele so volta a ser escrito se alguem setar `AUDITORIA_MD_ATIVA=true` em Configuracao no CRM; no fluxo normal, ignore-o.)

## Passo 1 — identifique o cliente (sempre primeiro)

Rode, a partir de `CRM/`:

```bash
/opt/node20/bin/node ../.claude/skills/analisar-cliente/scripts/buscar-cliente.mjs "<nome ou empresa>"
```

 Isso chama `GET /api/automacoes/clientes/buscar` e retorna clientes/leads existentes que combinam com o termo (nome ou empresa, case-insensitive).

- **Se houver um match claro e o usuario confirmar que e o mesmo cliente/empresa**: use o `id` retornado como `clienteId` no passo 4. Reaproveite os campos sociais ja cadastrados (`website`, `instagram`, etc.) como ponto de partida.
- **Se nao houver match, ou o usuario disser que e um prospect novo**: **nao tente casar por nome sozinho** — o CRM ja teve um incidente real de perda de dados ao mesclar clientes so pelo nome (ver `CRM/CLAUDE.md`, secao "Filesystem integration"). Prossiga como prospect novo: no passo 4 voce vai enviar `nome`/`empresa`/`cidade` em vez de `clienteId`, e o CRM cria um novo Cliente (`status: LEAD`) automaticamente. So marque como "existente" quando o usuario confirmar explicitamente.

## Passo 1.5 — consulte o CNPJ (se houver)

Se o cliente tiver `documento` (CNPJ, 14 digitos) cadastrado no CRM, ou voce descobrir o CNPJ durante a pesquisa (costuma aparecer no rodape do site ou numa busca "<empresa> CNPJ"), consulte os dados cadastrais publicos via BrasilAPI (gratuito, sem chave):

```bash
curl -s "https://brasilapi.com.br/api/cnpj/v1/<14 digitos, so numeros>"
```

Isso retorna razao social, nome fantasia, situacao cadastral, data de abertura, natureza juridica, capital social, porte, CNAE principal/secundarios, situacao no Simples Nacional, socios (QSA, com data de entrada), endereco e telefones. Guarde isso pro passo 4 (`resultado.cadastro`) e pro passo de insights abaixo. Se o cliente so tiver CPF (pessoa fisica) ou nao tiver documento, pule este passo — nao ha cadastro publico equivalente para CPF.

## Passo 2 — descubra os canais (se ainda nao souber as URLs)

Se o cliente do CRM ja tem `website`/`instagram`/`facebook`/`tiktok` preenchidos, comece por eles. Caso contrario, faca uma busca na web pelo nome da empresa (+ cidade, se souber) para achar:
- Site oficial
- Instagram
- Facebook
- TikTok

Se depois de pesquisar um canal genuinamente nao existir (a empresa nao tem TikTok, por exemplo), registre isso explicitamente — nao invente uma URL nem deixe em branco sem explicacao.

## Passo 3 — analise cada canal

**Isso e o cerne da skill. Seja honesto sobre o que da para observar de verdade.**

### Site
Acesse a pagina inicial (e 1-2 paginas internas relevantes, se der: contato, sobre, produtos/servicos). Avalie:
- HTTPS ativo?
- Titulo e meta description fazem sentido / sao descritivos?
- Tem informacao de contato visivel (telefone, e-mail, WhatsApp, endereco)?
- Tem CTA claro (comprar, agendar, pedir orcamento, etc.)?
- Paginas essenciais existem (sobre, contato, produtos/servicos)? Alguma esta quebrada (404)?
- Da pra perceber se e responsivo/mobile-friendly (meta viewport, layout que nao parece so desktop)?

### Instagram / Facebook / TikTok
Tente abrir o perfil publico. **Essas plataformas frequentemente bloqueiam acesso automatizado** (login wall, captcha, shell vazio renderizado so via JS). Quando isso acontecer:
- Marque o canal como inacessivel para analise de conteudo — nao invente numero de seguidores, frequencia de posts, ou qualidade de conteudo que voce nao conseguiu realmente ver.
- Registre a limitacao explicitamente (ex: "Perfil publico existe, mas o conteudo não pôde ser carregado automaticamente — recomenda-se revisão manual").
- Se algum dado vazar via snippet de busca (bio, contagem de seguidores aparecendo no resultado do Google, etc.), pode usar isso, mas cite que veio de um snippet, nao de visita direta.

Quando o fetch realmente funcionar e voce conseguir ver conteudo de verdade (bio, posts, links), avalie: bio completa com contato/link, consistencia visual, atividade recente aparente, uso de call-to-action.

### Canal que nao existe
Diga isso claramente e recomende criar o canal — isso e um ponto de melhoria valido por si so.

### Cruzando cadastro com o que foi observado (insights)
Se voce consultou o CNPJ no passo 1.5, compare esses dados com o que observou no site/redes/CRM (nome, e-mail, telefone) e liste achados de negocio reais — nao generico. Exemplos do que procurar (baseado em analises reais ja feitas):
- O e-mail cadastrado no CRM e de um contador/terceiro (dominio de escritorio de contabilidade) em vez da propria empresa.
- Capital social muito baixo pra o porte real que o site/redes sugerem (loja fisica, equipe, catalogo grande, B2B).
- Um socio com data de entrada recente pode indicar sucessao ou reestruturacao societaria — vale mencionar, nao afirmar como fato.
- CNAE cadastrado nao bate com a atividade real observada online (ex: CNAE de varejo mas o site mostra operacao de atacado/B2B).
- Historia contada no site ("3 geracoes", "30 anos de mercado") vs. data de abertura do CNPJ atual — pode ser normal (empresa sucessora de uma anterior), mas vale registrar a diferenca.
- Situacao no Simples Nacional e se isso faz sentido pro porte/faturamento aparente.

So inclua um insight se voce realmente tem os dois lados (cadastro E observacao online) pra sustentar — nao especule com base em so um dos dois.

## Passo 4 — monte o resultado e salve no CRM

> **REGRA OBRIGATORIA:** nunca escreva nenhum arquivo de auditoria a mao e nunca considere a
> tarefa concluida sem a confirmacao do banco. A tela web le o Postgres. A unica forma valida de
> concluir e executar `scripts/salvar-analise.mjs` e receber `CONFIRMADO_NO_CRM` com `clienteId` e
> `analiseId`. Sem essa confirmacao, informe erro ao usuario e nao diga que a analise apareceu no CRM.

### Destino obrigatorio

Uma execucao so esta completa quando o resultado estiver no banco:

- Postgres do CRM, como um novo registro `ClienteAnalise` com `resultado.tipo = "profunda"`.

Nao escreva o Markdown manualmente em lugar nenhum. A API e a fonte unica do salvamento. (Se o
CRM estiver com `AUDITORIA_MD_ATIVA=true`, a propria API tambem grava um espelho em
`CLIENTES/<slug>/AUDITORIA.md` — mas isso e opcional e voce nunca gera esse arquivo por conta propria.)

Monte um objeto `AnaliseProfundaResultado` (formato definido em `CRM/src/lib/analiseProfunda.ts`):

```json
{
  "tipo": "profunda",
  "termoBusca": "Empresa X Sao Paulo",
  "geradoEm": "2026-07-10T18:00:00.000Z",
  "cadastro": {
    "cnpj": "01507704000118",
    "razaoSocial": "EMPRESA X LTDA",
    "nomeFantasia": "Empresa X",
    "situacaoCadastral": "ATIVA",
    "dataInicioAtividade": "1996-10-22",
    "naturezaJuridica": "Sociedade Empresaria Limitada",
    "capitalSocial": 10000,
    "porte": "MICRO EMPRESA",
    "cnaePrincipal": "Comercio varejista (4722902)",
    "cnaesSecundarios": [],
    "simplesNacional": { "optante": false, "dataOpcao": "2010-01-01", "dataExclusao": "2012-12-31" },
    "socios": [{ "nome": "FULANA DE TAL", "qualificacao": "Socio-Administrador", "dataEntrada": "2025-05-06" }],
    "endereco": "Av. Exemplo 123, Sao Paulo - SP, 01000-000",
    "telefones": ["1133334444"]
  },
  "canais": [
    {
      "canal": "website",
      "status": "encontrado",
      "url": "https://exemplo.com.br",
      "resumo": "Site simples, sem HTTPS, sem informacao de contato visivel na home.",
      "pontosFortes": ["Design limpo"],
      "pontosDeMelhoria": ["Ativar HTTPS", "Adicionar telefone/WhatsApp visivel no topo"]
    },
    {
      "canal": "instagram",
      "status": "inacessivel",
      "url": "https://instagram.com/exemplo",
      "resumo": "Perfil publico existe mas o conteudo nao pode ser carregado automaticamente.",
      "pontosDeMelhoria": ["Revisar manualmente frequencia de posts e bio"],
      "limitacaoAnalise": "Instagram bloqueou o fetch automatizado (login wall)."
    },
    {
      "canal": "tiktok",
      "status": "nao_encontrado",
      "resumo": "Nenhum perfil de TikTok encontrado.",
      "pontosDeMelhoria": ["Criar perfil no TikTok, publico jovem da regiao e ativo la"]
    }
  ],
  "pontosDeMelhoria": [
    "Ativar HTTPS no site",
    "Adicionar contato visivel no site",
    "Criar perfil no TikTok"
  ],
  "insights": [
    "Socia entrou na sociedade em 06/05/2025 - pode indicar sucessao/reestruturacao recente.",
    "Capital social (R$ 10.000) destoa da operacao aparente (loja fisica + presenca B2B)."
  ],
  "resumoGeral": "Empresa tradicional, ativa, com presenca digital basica mas com falhas tecnicas simples de corrigir; sinais de transicao de gestao recente valem acompanhamento."
}
```

`status` de cada canal e sempre um de: `"encontrado"` | `"nao_encontrado"` | `"inacessivel"`. `cadastro` e opcional (omita o campo inteiro se nao consultou/nao achou CNPJ). `insights` e opcional/pode ser lista vazia (`[]`) se nao houver cadastro ou nada relevante a apontar. `pontosDeMelhoria` no nivel raiz e a lista priorizada (top 5-8) que aparece em destaque na tela do CRM — derive das listas por canal, nao duplique tudo.

Salve rodando (a partir de `CRM/`):

```bash
echo '<json acima>' | /opt/node20/bin/node ../.claude/skills/analisar-cliente/scripts/salvar-analise.mjs
```

ou com um arquivo: `/opt/node20/bin/node ../.claude/skills/analisar-cliente/scripts/salvar-analise.mjs --file /tmp/analise.json`.

Payload completo esperado pelo script (`resultado` e o JSON acima; o resto sao irmaos dele no mesmo objeto):
- **Cliente existente**: `{ "clienteId": "<id do passo 1>", "resultado": {...}, "resumo": "<1-2 frases>" }`
- **Prospect novo**: `{ "nome": "Empresa X", "empresa": "Empresa X Ltda", "cidade": "Sao Paulo", "resultado": {...}, "resumo": "<1-2 frases>" }` — isso cria um novo Cliente com `status: LEAD` no CRM.

O script chama `POST /api/automacoes/analise-profunda`, que: cria o `ClienteAnalise` (ou cria o Cliente antes, se for prospect novo), preenche os campos sociais vazios do Cliente com o que foi encontrado e emite o evento `cliente.analise_profunda` para o n8n (se configurado). Resposta: `{ clienteId, analiseId, resumo }`. (Se `AUDITORIA_MD_ATIVA=true` no CRM, a API tambem grava o espelho em `CLIENTES/<slug>/AUDITORIA.md`; por padrao esse passo fica desligado.)

O resultado fica visivel na tela do CRM (`/dashboard/clientes/<id>` ou `/dashboard/leads/<id>`), num card "Analise profunda de presenca digital" separado do historico de analises rasas.

Antes de responder ao usuario, confira obrigatoriamente no output do script:

```text
CONFIRMADO_NO_CRM clienteId=... analiseId=...
```

Essa linha e a trava de persistencia: ela so e emitida depois que a API devolve os IDs do
registro criado. A ausencia dela significa que o fluxo falhou ou foi interrompido.

### Verificacao final obrigatoria

Depois de receber `CONFIRMADO_NO_CRM clienteId=... analiseId=...`, a persistencia esta confirmada:
o registro existe no Postgres e ja aparece na tela do cliente no CRM. Nao ha arquivo para conferir
no fluxo padrao. Se o script NAO emitir essa linha, trate como falha e informe o usuario — nao diga
que a analise apareceu no CRM.

## Apresente o relatorio ao usuario

Depois de salvar e confirmar, resuma para o usuario em PT-BR: o que foi encontrado por canal, os principais pontos de melhoria e qualquer limitacao. Informe explicitamente o `clienteId`, o `analiseId` e o link da pagina do cliente no CRM (`/dashboard/clientes/<id>` ou `/dashboard/leads/<id>`).

## Troubleshooting

- **Erro "AUTOMACOES_API_SECRET nao encontrado"**: o segredo fica na tabela `Configuracao` do Postgres (tela Configuracoes -> Automacoes), nao em arquivo. Exporte-o no shell com o comando da secao "Como rodar os scripts desta skill". Se preferir um arquivo para teste local, o script tambem aceita `AUTOMACOES_API_SECRET=<valor>` em `CRM/.env.local` ou `CRM/.env`.
- **401 "Nao autorizado"**: o token usado nao bate com o configurado no CRM. Confira se e a mesma chave (producao vs. `.env.local` sao independentes).
- **`SyntaxError: Unexpected reserved word` ou `MODULE_NOT_FOUND`**: voce rodou com o `node` do host (v12) ou com o path antigo `.claude/skills/...` a partir de `CRM/`. Use `/opt/node20/bin/node ../.claude/skills/analisar-cliente/scripts/...`.
- **Testando localmente**: `CRM_BASE_URL=http://localhost:3000` como variavel de ambiente antes de rodar os scripts, com `npm run dev` ativo e `LEGADO_CLIENTES_DIR=/root/Barn_swallow/CLIENTES` setado em `CRM/.env.local` (senao a gravacao do `AUDITORIA.md` falha silenciosamente, so loga o erro).
