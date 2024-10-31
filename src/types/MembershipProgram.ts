type MembershipProgram = {
  id: string,
  name: string,
  brand: string,
  duration?: string,
  branchScope: string,
  options: {
    id: string,
    visitCount: string,
    price: string,
    originalPrice?: string,
  }[]
}

export type { MembershipProgram }
