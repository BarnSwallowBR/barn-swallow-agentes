# Barn Swallow — Agentes

**Os agentes de IA que operam a Barn Swallow — abertos.**

A Barn Swallow é um parceiro de tecnologia de Campinas–SP, operado por duas pessoas. Não temos um time grande. Temos processo — e este repositório é esse processo escrito: os agentes, as skills e os documentos de contexto que usamos todos os dias com Claude Code, Codex e qualquer cliente MCP.

Não é framework nem produto. É a configuração real de uma operação enxuta, publicada para quem quer ver como funciona por dentro.

---

## O que tem aqui

| Pasta | O que é |
|---|---|
| [`agents/`](agents) | Um arquivo por agente: papel, regras, fluxo de trabalho e quais skills e documentos ele carrega |
| [`skills/`](skills) | Habilidades reutilizáveis (`SKILL.md` + scripts e arquivos de apoio) |
| [`documentos/`](documentos) | Contexto da empresa: cultura e marca |
| [`memorias/`](memorias) | O que cada agente aprendeu com aprovações e recusas anteriores |
| [`avatars/`](avatars) | Imagem de cada agente no painel |
| [`.claude-plugin/`](.claude-plugin) | Manifesto para instalar como plugin do Claude Code |
| [`instalar.sh`](instalar.sh) | Instalador para o Codex |

---

## Os agentes

Cada agente tem o nome de alguém que definiu a própria área. O nome é lembrete de padrão, não fantasia.

| Agente | Inspiração | Papel | Faz | Não faz |
|---|---|---|---|---|
| [`desenvolvimento`](agents/desenvolvimento.md) | Ada Lovelace | Engenharia de software | Implementa funcionalidade, corrige bug, escreve migration e teste — com plano, TDD e verificação antes de declarar pronto | Ignorar o `CLAUDE.md`/`AGENTS.md` do projeto |
| [`design`](agents/design.md) | Dieter Rams | Design de produto | Telas, componentes, tokens, texto de interface, responsividade, acessibilidade WCAG AA | Mexer em regra de negócio, banco ou autenticação |
| [`seguranca`](agents/seguranca.md) | Alan Turing | Auditoria de segurança | Procura falha de autorização, vazamento entre tenants, injeção, corrida, sessão e segredo exposto | Editar código — só reporta |
| [`ogilvy`](agents/ogilvy.md) | David Ogilvy | Estratégia de conteúdo da empresa | Pilares, calendário e roteiros com teste de capacidade de 90 dias | Planejar para o perfil pessoal |
| [`davinci`](agents/davinci.md) | Leonardo da Vinci | Produção de conteúdo da empresa | Posts e carrosséis no guia de marca; agenda no Metricool após aprovação | Publicar sem aprovação explícita |
| [`jobs`](agents/jobs.md) | Steve Jobs | Estratégia de marca pessoal | Plano de Founder-Led Growth, pautas de tecnologia com fonte e data | Planejar para a empresa |
| [`gutenberg`](agents/gutenberg.md) | Johannes Gutenberg | Produção de conteúdo pessoal | Posts e legendas em primeira pessoa; salva no Drive e publica após aprovação | Usar a identidade visual da empresa |

### Como eles se conectam

```
Empresa (@barn_swallowbr)          Perfil pessoal (@rochajunior.dev)
   ogilvy  ──roteiro──▶  davinci       jobs  ──pauta──▶  gutenberg
   estratégia            produção      estratégia         produção

Código
   design ──▶ desenvolvimento ──▶ seguranca
   interface   implementação        auditoria
```

As duas trilhas de conteúdo não se misturam — nem estilo, nem métrica, nem destino de publicação. Essa separação está escrita nas memórias de cada agente, não depende de alguém lembrar.

---

## Princípios que todo agente segue

Os agentes herdam a cultura da empresa ([`documentos/cultura.md`](documentos/cultura.md)). Na prática:

- **Nada de número inventado.** Faltou dado, o agente marca e diz o que precisa ser levantado.
- **Fato separado de opinião.** Novidade de tecnologia só entra com fonte primária e data.
- **Aprovação antes de publicar.** Nenhum agente de conteúdo posta sem um "aprovado" explícito.
- **Regras do projeto vêm primeiro.** Os agentes de código leem o `CLAUDE.md`/`AGENTS.md` antes de qualquer coisa — e não negociam.
- **Capacidade real.** Todo plano passa pelo teste: duas pessoas sustentam isso por 90 dias?
- **Verificação antes de "pronto".** Teste rodado, saída lida, resultado real relatado.

---

## Como usar

Escolha **um** modo por máquina. Plugin offline e MCP juntos duplicam os agentes.

### Claude Code — plugin

```
/plugin marketplace add BarnSwallowBR/barn-swallow-agentes
/plugin install barn-swallow-agentes@barn-swallow
```

### Codex

```sh
git clone https://github.com/BarnSwallowBR/barn-swallow-agentes
cd barn-swallow-agentes
./instalar.sh
```

O script liga cada skill em `$CODEX_HOME/skills/` e grava o catálogo de agentes num bloco marcado do `$CODEX_HOME/AGENTS.md`. Depois de um `git pull`, rode de novo — o bloco é substituído, não duplicado.

### Qualquer cliente MCP — online

Os agentes também rodam pelo Hub de Agentes da Barn Swallow, que expõe tudo via MCP (`usar_agente`, `ler_skill`, `ler_documento`, `ver_referencias`, `anotar_memoria`). O acesso é por token, gerado no painel.

> No modo offline, agentes e skills ficam locais. Os documentos ficam em `documentos/`, mas não são carregados automaticamente — o agente lê quando precisa.

---

## Adaptar para a sua empresa

A estrutura funciona para qualquer operação. Para usar como base:

1. Faça um fork.
2. Troque `documentos/cultura.md` e `documentos/marca.md` pelos seus.
3. Apague os agentes de conteúdo — eles são específicos da nossa marca.
4. Mantenha `desenvolvimento`, `design` e `seguranca`: são genéricos e leem as regras do projeto onde rodam.
5. Limpe `memorias/` — elas são nossas.

### Formato de um agente

```markdown
---
name: seguranca                       # identificador único
description: O que faz e quando usar  # usado para escolher o agente
apelido: Alan Turing                  # opcional — nome no painel
cargo: Auditor de segurança           # opcional
categoria: Segurança                  # opcional — agrupa no painel
quando_usar: Frase de gatilho         # opcional
tools: Read, Grep, Glob, Bash         # opcional — ferramentas liberadas
skills: [systematic-debugging]        # opcional — skills que carrega
documentos: [cultura, marca]          # opcional — contexto que carrega
---

Instruções do agente em Markdown.
```

Documentos usam frontmatter `titulo` e `descricao`. Skills seguem o formato padrão `skills/<nome>/SKILL.md`.

---

## Créditos

Parte das skills vem de projetos abertos, mantidas com a licença original na pasta de cada uma:

- **[Superpowers](https://github.com/obra/superpowers)** — Jesse Vincent, licença MIT. Base do fluxo de desenvolvimento: `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`, `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `using-git-worktrees`, `finishing-a-development-branch`, `dispatching-parallel-agents`, `writing-skills`, `using-superpowers`, `diagnosing-superpowers`.
- **`ui-ux-pro-max`** — [ORIGEM E LICENÇA A CONFIRMAR]

As demais skills e todos os agentes e documentos são da Barn Swallow.

---

## Licença

[DEFINIR] — este repositório ainda não tem arquivo `LICENSE`. Até ele existir, todos os direitos sobre o conteúdo próprio da Barn Swallow (agentes, documentos, marca, memórias) ficam reservados. As skills de terceiros seguem a licença de cada pasta.

---

## Sobre a Barn Swallow

Não somos uma agência de marketing. Somos um parceiro de tecnologia — automação de vendas, automação financeira, agentes de IA e software sob medida para empresas que vendem por relacionamento.

**[barnswallow.com.br](https://barnswallow.com.br)** · WhatsApp [+55 19 98439-9054](https://wa.me/5519984399054) · Campinas–SP
