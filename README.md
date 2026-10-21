# Agentes da Barn Swallow

Conteúdo do Hub de Agentes (`agentes.barnswallow.com.br`). Editado pelo painel,
que faz commit aqui; também pode ser editado direto pelo Git.

- `agents/<nome>.md` — agentes (frontmatter `name`, `description`, opcionais `quando_usar`, `skills`, `documentos`, `tools`)
- `skills/<nome>/SKILL.md` — skills, com arquivos auxiliares na mesma pasta
- `documentos/<nome>.md` — documentos de contexto (frontmatter `titulo`, `descricao`)

## Usar

**Online (recomendado):** no painel, em *Conectar*, gere um token e cole o comando na IA.

**Offline — Claude Code:**

```
/plugin marketplace add TechFRJ/barn-swallow-agentes
/plugin install barn-swallow-agentes@barn-swallow
```

**Offline — Codex:** `git clone` este repositório e rode `./instalar.sh`.

No modo offline os agentes e skills ficam locais; os documentos ficam em
`documentos/` dentro do clone, mas não são carregados automaticamente.

Use o plugin offline **ou** o MCP numa mesma máquina, não os dois — os agentes
apareceriam duplicados.
