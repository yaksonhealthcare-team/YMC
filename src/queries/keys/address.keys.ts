export const addressKeys = {
  all: ["address"] as const,
  bookmarks: () => [...addressKeys.all, "bookmarks"] as const,
  search: (keyword: string) => [...addressKeys.all, "search", keyword] as const,
} as const
