type BranchDTO = {
  current_addr: string
  result: {
    b_idx: string
    b_name: string
    b_addr: string
    b_lat: string
    b_lon: string
    reserve: string
    distance: string
    b_bookmark: string
  }[]
}

export type { BranchDTO }
