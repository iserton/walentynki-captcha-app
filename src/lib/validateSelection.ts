export function validateSelection(selectedIds: string[], correctIds: string[]) {
  const a = new Set(selectedIds);
  const b = new Set(correctIds);
  if (a.size !== b.size) return false;
  for (const id of a) if (!b.has(id)) return false;
  return true;
}
