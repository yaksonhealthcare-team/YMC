export const addressKeys = {
  all: ["address"] as const,
  bookmarks: () => [...addressKeys.all, "bookmarks"] as const,
} as const
