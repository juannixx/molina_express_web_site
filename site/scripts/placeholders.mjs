export function scanText(text) {
  const results = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const m of lines[i].matchAll(/TODO_[A-Za-z0-9_]*/g)) {
      results.push({ line: i + 1, match: m[0] });
    }
  }
  return results;
}
