#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { crmFetch } from "./lib/api.mjs";

function lerArgFile() {
  const idx = process.argv.indexOf("--file");
  if (idx === -1) return null;
  return process.argv[idx + 1];
}

async function lerStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8");
}

const arquivo = lerArgFile();
const bruto = arquivo ? readFileSync(arquivo, "utf-8") : await lerStdin();

let payload;
try {
  payload = JSON.parse(bruto);
} catch (error) {
  console.error("JSON invalido:", error.message);
  process.exit(1);
}

if (!payload.resultado || payload.resultado.tipo !== "profunda") {
  console.error("payload.resultado.tipo deve ser 'profunda'. Veja SKILL.md para o formato esperado.");
  process.exit(1);
}
if (!payload.clienteId && !payload.nome) {
  console.error("Informe payload.clienteId (cliente existente) ou payload.nome (novo prospect).");
  process.exit(1);
}

const resposta = await crmFetch("/api/automacoes/analise-profunda", {
  method: "POST",
  body: JSON.stringify(payload),
});

if (!resposta?.clienteId || !resposta?.analiseId) {
  console.error(
    "O CRM respondeu sem clienteId/analiseId. A analise NAO pode ser considerada salva."
  );
  process.exit(1);
}

console.log(JSON.stringify(resposta, null, 2));
// stdout de proposito: o SKILL.md manda conferir esta linha no output do script, e quem captura
// so o stdout perderia justamente a trava de persistencia.
console.log(
  `CONFIRMADO_NO_CRM clienteId=${resposta.clienteId} analiseId=${resposta.analiseId}`
);
