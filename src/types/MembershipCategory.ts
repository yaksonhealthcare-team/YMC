type MembershipCategory = {
  brandCode: string
  name: string
  code: string
  pictureUrl?: string
}

export type { MembershipCategory }

export const mockMembershipCategories: MembershipCategory[] = [
  {
    brandCode: "003",
    code: "023",
    name: "페이셜뷰티",
  },
  {
    brandCode: "003",
    code: "024",
    name: "뷰티풀웨딩",
  },
  {
    brandCode: "003",
    code: "025",
    name: "스킨솔루션",
  },
  {
    brandCode: "003",
    code: "026",
    name: "스페셜",
  },
  {
    brandCode: "003",
    code: "027",
    name: "맨즈뷰티",
  },
  {
    brandCode: "003",
    code: "028",
    name: "맞춤바디",
  },
  {
    brandCode: "003",
    code: "029",
    name: "프리미엄",
  },
  {
    brandCode: "003",
    code: "030",
    name: "기타메뉴",
  },
]
