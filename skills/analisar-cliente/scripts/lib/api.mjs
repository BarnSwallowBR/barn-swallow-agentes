import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Esta skill NAO mora dentro de CRM/ (fica em Barn_swallow/.claude/skills/), entao nao da para
// achar a raiz do app contando niveis a partir daqui. Procuramos o diretorio que contem
// prisma/schema.prisma: CRM_DIR explicito > cwd e seus pais (a skill manda rodar de CRM/) >
// diretorio do proprio script e seus pais.
function acharCrmDir() {
  const candidatos = [];
  if (process.env.CRM_DIR) candidatos.push(path.resolve(process.env.CRM_DIR));
  for (const inicio of [process.cwd(), __dirname]) {
    let atual = inicio;
    for (let i = 0; i < 6; i++) {
      candidatos.push(atual);
      const pai = path.dirname(atual);
      if (pai === atual) break;
      atual = pai;
    }
  }
  return candidatos.find((dir) => existsSync(path.join(dir, "prisma", "schema.prisma")));
}

// O AUTOMACOES_API_SECRET normalmente vive na tabela Configuracao do Postgres, nao em arquivo:
// esta leitura de .env e so um atalho para teste local contra `npm run dev`.
function lerChaveEnv(chave) {
  const crmDir = acharCrmDir();
  if (!crmDir) return undefined;
  for (const arquivo of [".env.local", ".env"]) {
    const caminho = path.join(crmDir, arquivo);
    if (!existsSync(caminho)) continue;
    const conteudo = readFileSync(caminho, "utf-8");
    for (const linha of conteudo.split("\n")) {
      const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && m[1] === chave) {
        return m[2].trim().replace(/^["']|["']$/g, "");
      }
    }
  }
  return undefined;
}

export function baseUrl() {
  return process.env.CRM_BASE_URL || "https://crm.barnswallow.com.br";
}

export async function crmFetch(caminho, opts = {}) {
  const secret = process.env.AUTOMACOES_API_SECRET || lerChaveEnv("AUTOMACOES_API_SECRET");
  if (!secret) {
    throw new Error(
      "AUTOMACOES_API_SECRET nao encontrado. O valor fica na tabela Configuracao do Postgres " +
        "(tela Configuracoes -> Automacoes), nao em arquivo .env. Exporte a variavel no shell " +
        "antes de rodar - veja a secao 'Como rodar os scripts desta skill' no SKILL.md."
    );
  }

  const url = `${baseUrl()}${caminho}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
      ...(opts.headers || {}),
    },
  });

  const texto = await res.text();
  let corpo;
  try {
    corpo = texto ? JSON.parse(texto) : {};
  } catch {
    corpo = { raw: texto };
  }

  if (res.status === 401) {
    throw new Error(
      "Nao autorizado (401) ao chamar " +
        caminho +
        ". Verifique se AUTOMACOES_API_SECRET esta configurado no CRM (Configuracoes -> Automacoes, " +
        "ou CRM/.env.local em dev) e se o valor usado aqui e exatamente o mesmo."
    );
  }
  if (!res.ok) {
    throw new Error(`Erro ${res.status} em ${caminho}: ${corpo.error || texto}`);
  }

  return corpo;
}
