export type SortKey = "new" | "price_asc" | "price_desc";

type ProductWithMeta = {
  id: number;
  price: number;
  release_year?: string | null;
};

export function sortProducts<T extends ProductWithMeta>(
  items: T[],
  sort: SortKey
): T[] {
  const copy = [...items];
  if (sort === "price_asc") {
    copy.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    copy.sort((a, b) => b.price - a.price);
  } else {
    copy.sort((a, b) => {
      const ay = a.release_year ? parseInt(a.release_year as string, 10) : 0;
      const by = b.release_year ? parseInt(b.release_year as string, 10) : 0;
      if (ay !== by) return by - ay;
      return b.id - a.id;
    });
  }
  return copy;
}
