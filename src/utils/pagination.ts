export function buildPages(
  currentPage: number,
  totalPages: number
): (number | "...")[] {
  if (!Number.isFinite(totalPages) || totalPages <= 0) return [];
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  const items: (number | "...")[] = [1];
  if (windowStart > 2) items.push("...");
  for (let p = windowStart; p <= windowEnd; p++) items.push(p);
  if (windowEnd < totalPages - 1) items.push("...");
  items.push(totalPages);

  return items;
}
