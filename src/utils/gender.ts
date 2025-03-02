export type Gender = "M" | "F"

export function getGenderDisplay(gender: Gender): string {
  return gender === "M" ? "남자" : "여자"
}
