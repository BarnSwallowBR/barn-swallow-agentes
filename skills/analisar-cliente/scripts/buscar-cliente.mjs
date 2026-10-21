#!/usr/bin/env node
import { crmFetch } from "./lib/api.mjs";

const termo = process.argv[2];
if (!termo) {
  console.error('Uso: node buscar-cliente.mjs "nome ou empresa"');
  process.exit(1);
}

const resultado = await crmFetch(`/api/automacoes/clientes/buscar?termo=${encodeURIComponent(termo)}`);
console.log(JSON.stringify(resultado, null, 2));
