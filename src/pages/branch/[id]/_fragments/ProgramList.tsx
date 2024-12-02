import { CareProgramTab } from "./CareProgramTab.tsx"
import { MembershipProgram } from "../../../../types/MembershipProgram.ts"
import CareProgramCard from "./CareProgramCard.tsx"
import { useServiceCategories } from "queries/useMembershipQueries.tsx"

interface ProgramListProps {
  brandCode: string
}

const ProgramList = ({ brandCode }: ProgramListProps) => {
  const { data: serviceCategories } = useServiceCategories(brandCode)

  return (
    <div className={"w-full"}>
      <CareProgramTab programs={serviceCategories} />
      <ul className={"flex flex-col px-5 py-6 gap-5"}>
        {mockPrograms.map((program) => (
          <li key={program.id}>
            <CareProgramCard program={program} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProgramList

// This data is based on `/api/memberships/detail?s_idx=48138` (some value modified)
const mockPrograms: MembershipProgram[] = [
  {
    id: "48147",
    name: "(얼굴)작은모공관리추가",
    brand: "약손명가",
    branchScope: "지점 회원권",
    options: [],
  },
  {
    id: "48146",
    name: "(얼굴) 이중턱관리+아로마",
    brand: "약손명가",
    duration: "120분 소요",
    branchScope: "전지점",
    options: [
      {
        id: "88582",
        visitCount: "1회권",
        price: "90,000",
      },
      {
        id: "88583",
        visitCount: "10회권",
        price: "800,000",
      },
      {
        id: "88584",
        visitCount: "20회권",
        price: "1,400,000",
      },
    ],
  },
  {
    id: "48145",
    name: "(얼굴) 이목구비(조각)",
    brand: "약손명가",
    branchScope: "지점 회원권",
    options: [
      {
        id: "88576",
        visitCount: "1회권",
        price: "50,000",
      },
      {
        id: "88577",
        visitCount: "10회권",
        price: "400,000",
      },
      {
        id: "88578",
        visitCount: "20회권",
        price: "700,000",
      },
      {
        id: "88579",
        visitCount: "30회권",
        price: "1,050,000",
      },
      {
        id: "88580",
        visitCount: "40회권",
        price: "1,400,000",
      },
      {
        id: "88581",
        visitCount: "50회권",
        price: "1,750,000",
      },
    ],
  },
  {
    id: "48144",
    name: "(얼굴) 에그셀런트 관리",
    brand: "약손명가",
    branchScope: "지점 회원권",
    options: [
      {
        id: "88573",
        visitCount: "1회권",
        price: "90,000",
      },
      {
        id: "88574",
        visitCount: "10회권",
        price: "800,000",
      },
      {
        id: "88575",
        visitCount: "20회권",
        price: "1,400,000",
      },
    ],
  },
  {
    id: "48143",
    name: "(얼굴) 비대칭 테라피",
    brand: "약손명가",
    branchScope: "지점 회원권",
    options: [
      {
        id: "88567",
        visitCount: "1회권",
        price: "90,000",
      },
      {
        id: "88568",
        visitCount: "10회권",
        price: "800,000",
      },
      {
        id: "88569",
        visitCount: "20회권",
        price: "1,400,000",
      },
      {
        id: "88570",
        visitCount: "30회권",
        price: "2,100,000",
      },
      {
        id: "88571",
        visitCount: "40회권",
        price: "2,800,000",
      },
      {
        id: "88572",
        visitCount: "50회권",
        price: "3,500,000",
      },
    ],
  },
  {
    id: "48142",
    name: "(얼굴) 동안테라피",
    brand: "약손명가",
    duration: "120분 소요",
    branchScope: "전지점",
    options: [
      {
        id: "88561",
        visitCount: "1회권",
        price: "50,000",
      },
      {
        id: "88562",
        visitCount: "10회권",
        price: "400,000",
      },
      {
        id: "88563",
        visitCount: "20회권",
        price: "700,000",
      },
      {
        id: "88564",
        visitCount: "30회권",
        price: "1,050,000",
      },
      {
        id: "88565",
        visitCount: "40회권",
        price: "1,400,000",
      },
      {
        id: "88566",
        visitCount: "50회권",
        price: "1,750,000",
      },
    ],
  },
  {
    id: "48141",
    name: "(바디) 피부 관리",
    brand: "약손명가",
    branchScope: "지점 회원권",
    options: [
      {
        id: "88555",
        visitCount: "1회권",
        price: "40,000",
      },
      {
        id: "88556",
        visitCount: "10회권",
        price: "300,000",
      },
      {
        id: "88557",
        visitCount: "20회권",
        price: "550,000",
      },
      {
        id: "88558",
        visitCount: "30회권",
        price: "825,000",
      },
      {
        id: "88559",
        visitCount: "40회권",
        price: "1,100,000",
      },
      {
        id: "88560",
        visitCount: "50회권",
        price: "1,375,000",
      },
    ],
  },
  {
    id: "48140",
    name: "(바디) 이중턱관리+아로마",
    brand: "약손명가",
    branchScope: "지점 회원권",
    options: [
      {
        id: "88552",
        visitCount: "1회권",
        price: "100,000",
      },
      {
        id: "88553",
        visitCount: "10회권",
        price: "900,000",
      },
      {
        id: "88554",
        visitCount: "20회권",
        price: "1,600,000",
      },
    ],
  },
  {
    id: "48139",
    name: "(바디) 이목구비(조각)",
    brand: "약손명가",
    branchScope: "지점 회원권",
    options: [
      {
        id: "88549",
        visitCount: "1회권",
        price: "60,000",
      },
      {
        id: "88550",
        visitCount: "10회권",
        price: "500,000",
      },
      {
        id: "88551",
        visitCount: "20회권",
        price: "800,000",
      },
    ],
  },
  {
    id: "48138",
    name: "(바디) 에그셀런트 관리",
    brand: "약손명가",
    branchScope: "지점 회원권",
    options: [
      {
        id: "88546",
        visitCount: "1회권",
        price: "110,000",
      },
      {
        id: "88547",
        visitCount: "10회권",
        price: "1,000,000",
      },
      {
        id: "88548",
        visitCount: "20회권",
        price: "1,800,000",
      },
    ],
  },
]
