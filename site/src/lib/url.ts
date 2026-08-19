// Prefixa caminhos internos com o base path do deploy (ex.: GitHub Pages em
// /molina_express_web_site). Em produção própria o base é "/" e nada muda.
const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

export function withBase(path: string): string {
  return `${base}${path}`;
}
