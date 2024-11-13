import { BranchDTO } from "../BranchDTO.ts"
import { Branch } from "../../Branch.ts"

export class BranchMapper {
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
    }))
  }
}
