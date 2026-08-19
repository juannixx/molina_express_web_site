// Marca dados pendentes de duas formas:
//   TODO_algum_dado  -> valor placeholder que ainda nao existe
//   // MOCK: ...     -> valor fake de apresentacao que NAO pode ir a producao
// Ambos bloqueiam o build de producao (build:prod) ate serem substituidos.
export function scanText(text) {
  const results = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const m of lines[i].matchAll(/TODO_[A-Za-z0-9_]*/g)) {
      results.push({ line: i + 1, match: m[0] });
    }
    for (const m of lines[i].matchAll(/\/\/\s*MOCK\b/g)) {
      results.push({ line: i + 1, match: m[0].trim() });
    }
  }
  return results;
}
