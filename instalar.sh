#!/bin/sh
# Instala este repositório para o Codex (modo offline):
#  - liga cada skills/<nome> em $CODEX_HOME/skills/<nome>
#  - grava o catálogo de agentes num bloco marcado de $CODEX_HOME/AGENTS.md
# Pode ser rodado de novo após `git pull`: o bloco é substituído, não duplicado.
set -eu

REPO=$(cd "$(dirname "$0")" && pwd)
CODEX="${CODEX_HOME:-$HOME/.codex}"
INICIO='<!-- hub-agentes:inicio -->'
FIM='<!-- hub-agentes:fim -->'

mkdir -p "$CODEX/skills"
for dir in "$REPO"/skills/*/; do
  [ -f "$dir/SKILL.md" ] || continue
  nome=$(basename "$dir")
  ln -sfn "${dir%/}" "$CODEX/skills/$nome"
  echo "skill: $nome"
done

campo() { # campo <arquivo> <chave> — valor de uma linha do frontmatter
  awk -v k="$2" 'NR==1 && $0=="---" {f=1; next} f && $0=="---" {exit} f && index($0, k": ")==1 {sub(k": ", ""); gsub(/^"|"$/, ""); print; exit}' "$1"
}

bloco=$(mktemp)
{
  echo "$INICIO"
  echo "## Agentes da Barn Swallow"
  echo
  echo "Quando a tarefa combinar com um destes agentes, leia o arquivo indicado e siga as instruções dele."
  echo
  for f in "$REPO"/agents/*.md; do
    [ -f "$f" ] || continue
    echo "- $(campo "$f" name): $(campo "$f" description) — instruções em \`$f\`"
  done
  echo "$FIM"
} > "$bloco"

alvo="$CODEX/AGENTS.md"
touch "$alvo"
resto=$(mktemp)
# Tira o bloco antigo e as linhas em branco do fim, para rodar de novo não acumular espaços.
awk -v i="$INICIO" -v f="$FIM" '
  $0==i {pula=1; next} $0==f {pula=0; next} pula {next}
  /^$/ {brancas++; next}
  {while (brancas) {print ""; brancas--} print}
' "$alvo" > "$resto"
{ cat "$resto"; [ -s "$resto" ] && echo; cat "$bloco"; } > "$alvo"
rm -f "$bloco" "$resto"
echo "catálogo gravado em $alvo"
