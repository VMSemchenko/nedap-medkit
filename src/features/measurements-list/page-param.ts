const FIRST_PAGE = 1;

export function parsePageParam(raw: string | null): number {
  if (raw === null || !/^\d+$/.test(raw)) return FIRST_PAGE;
  return Math.max(FIRST_PAGE, Number(raw));
}

export function clampPage(page: number, totalPages: number): number {
  return Math.min(page, Math.max(FIRST_PAGE, totalPages));
}
