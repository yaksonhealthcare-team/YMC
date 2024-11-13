import { BranchDTO } from "../BranchDTO.ts"
import { Branch } from "../../Branch.ts"

export class BranchMapper {
  private static toBrand(name: string): "therapist" | "dalia" | "diet" {
    const trimmed = name.trim()
    if (trimmed.startsWith("약손명가")) return "therapist"
    else if (trimmed.startsWith("달리아")) return "dalia"
    else if (trimmed.startsWith("여리한")) return "diet"
    return "therapist"
  }

  static toEntities(dto: BranchDTO): Branch[] {
    return dto.result.map((item) => ({
      id: item.b_idx,
      name: item.b_name,
      address: item.b_addr,
      latitude: Number(item.b_lat),
      longitude: Number(item.b_lon),
      canBookToday: item.reserve === "Y",
      distanceInMeters: item.distance,
      isFavorite: item.b_bookmark === "Y",
      brand: this.toBrand(item.b_name),
    }))
  }
}
