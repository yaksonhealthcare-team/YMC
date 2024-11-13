type BranchDetail = {
  id: string
  name: string
  brand: string
  images: string[]
  location: {
    address: string
    latitude: number
    longitude: number
    distance?: string
  }
  phoneNumber: string
  operatingHours: {
    weekday: {
      start: string;
      end: string;
    },
    saturday: {
      start: string;
      end: string;
    },
    holiday: {
      start: string,
      end: string;
    }
  }
  director: Profile
  staffs: Profile[]
  directions: {
    bus: {
      description: string
      routes: string[]
    }
    subway: {
      description: string
    }
    car: {
      description: string
    }
  }
  notices?: string[]
  favoriteCount: number
  availableMembershipCount: number
  isBookmarked?: boolean
  programs?: {
    name: string
    duration: string
    price: number
    discount?: number
    scope: "all" | "branch_only"
  }[]
}

type Profile = {
  name: string
  profileImageUrl?: string
  description?: string
}

export const MockBranch = (id: string): BranchDetail => ({
  id: id,
  name: `약손명가 ${id}점`,
  brand: "약손명가",
  images: [
    "https://picsum.photos/id/100/300/200",
    "https://picsum.photos/id/101/300/200",
    "https://picsum.photos/id/102/300/200",
    "https://picsum.photos/id/103/300/200",
  ],
  location: {
    address: "서울시 강남구 논현로 22길 1 sk허브빌딩 206호",
    latitude: 30,
    longitude: 30,
    distance: "500m",
  },
  phoneNumber: "02-123-4556",
  operatingHours: {
    weekday: {
      start: "10:00",
      end: "21:00",
    },
    saturday: {
      start: "09:00",
      end: "17:30",
    },
    holiday: {
      start: "",
      end: "",
    },
  },
  director: {
    name: "정연희 원장",
    profileImageUrl: undefined,
    description: "프로필 내용 노출",
  },
  staffs: [
    {
      name: "정인희 부원장",
      profileImageUrl: undefined,
      description: "프로필 내용 노출",
    },
    {
      name: "김민지 매니저",
      profileImageUrl: undefined,
      description: "프로필 내용 노출",
    },
    {
      name: "박수영 테라피스트",
      profileImageUrl: undefined,
      description: "프로필 내용 노출",
    },
    {
      name: "이주화 테라피스트",
      profileImageUrl: undefined,
      description: "프로필 내용 노출",
    },
  ],
  directions: {
    bus: {
      description: "강남구청역 하차 후 바로 보이는 SK허브빌딩 2층 (미스터피자옆)",
      routes: ["401", "640", "3414", "41", "3011", "4431"],
    },
    subway: {
      description:
        "7호선 2번출구 바로 앞 SK허브빌딩 2층 또는 지하철역에 연결된 SK허브빌딩 지하1층 이용",
    },
    car: {
      description:
        "강남구청역 사거리에서 선을ㅇ역 방향 첫 번째 골목에 SK허브빌딩 주차장 입구",
    },
  },
  notices: [],
  favoriteCount: 24,
  availableMembershipCount: 1,
  isBookmarked: false,
  programs: [
    {
      name: "작은 얼굴 관리 (80분)",
      duration: "120분 소요",
      price: 200000,
      scope: "all",
    },
    {
      name: "작은 얼굴 관리 (80분)",
      duration: "120분 소요",
      price: 200000,
      scope: "branch_only",
    },
    {
      name: "경락 관리 (80분)",
      duration: "120분 소요",
      price: 240000,
      discount: 0.2,
      scope: "all",
    },
    {
      name: "경락 관리 (80분)",
      duration: "120분 소요",
      price: 200000,
      discount: 0.3,
      scope: "all",
    },
    {
      name: "작은 얼굴 관리 (80분)",
      duration: "120분 소요",
      price: 200000,
      scope: "all",
    },
  ],
})

type Branch = {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  canBookToday: boolean
  distanceInMeters: string | null
  isFavorite: boolean
}

export const MockBranches: Branch[] = Array.from({ length: 12 }, (_, i) => ({
  id: `${i}`,
  name: `약손명가 ${i}호점`,
  address: "서울시 강남구 강남대로 24길 38 sk허브빌딩 A동 206호",
  latitude: 37.523040 + (0.001 * i),
  longitude: 127.028841 + (0.001 * i),
  canBookToday: Math.random() > 0.5,
  distanceInMeters: "0.5m",
  isFavorite: Math.random() > 0.5,
}))

export type { Branch, BranchDetail }

