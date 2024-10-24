type Branch = {
  id: string,
  name: string,
  address: string,
  latitude: number,
  longitude: number,
  canBookToday: boolean,
  distanceInMeters: number | null,
  isFavorite: boolean,
}

export const MockBranches: Branch[] = Array.from({ length: 12 }, (_, i) => ({
  id: `${i}`,
  name: `약손명가 ${i}호점`,
  address: "서울시 강남구 강남대로 24길 38 sk허브빌딩 A동 206호",
  latitude: 34,
  longitude: 34,
  canBookToday: Math.random() > 0.5,
  distanceInMeters: 500,
  isFavorite: Math.random() > 0.5,
}))

export type { Branch }
