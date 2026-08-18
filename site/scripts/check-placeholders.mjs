import { readFileSync } from "node:fs";
import { scanText } from "./placeholders.mjs";

const file = "src/content/site.ts";
const findings = scanText(readFileSync(file, "utf-8"));

if (findings.length === 0) {
  console.log(`check:placeholders OK - no TODO_ markers in ${file}`);
  process.exit(0);
}

console.error(`check:placeholders FAILED - ${findings.length} placeholder(s) in ${file}:`);
for (const f of findings) console.error(`  ${file}:${f.line}  ${f.match}`);
console.error("Replace every TODO_ value with real data before a production build.");
process.exit(1);
