import Header from "@components/Header"
import { Branch } from "../../../types/Branch"
import MembershipBranchSelectPage from "../MembershipBranchSelectPage"
import { useState, useEffect } from "react"
import { useLayout } from "../../../contexts/LayoutContext"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import CaretLeftIcon from "@assets/icons/CaretLeftIcon.svg?react"
import CartIcon from "@components/icons/CartIcon.tsx"

interface Props {
  onBranchSelect: (branch: Branch) => void
  onClose: () => void
  brandCode: string
}

export const MembershipBranchSelectModal = ({
  onBranchSelect,
  onClose,
  brandCode,
}: Props) => {
  const { setHeader } = useLayout()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentBrandCode = brandCode || searchParams.get("brand_code") || "001"

  // 모달이 닫힐 때 헤더를 복원
  useEffect(() => {
    return () => {
      // 모달이 닫힐 때 원래 회원권 상세 페이지의 헤더를 복원
      setTimeout(() => {
        setHeader({
          display: true,
          component: (
            <div className={"flex items-center justify-between px-5 py-3 h-[48px]"}>
              <div
                onClick={() => {
                  navigate(`/membership?brand_code=${currentBrandCode}`)
                }}
              >
                <CaretLeftIcon className={"w-5 h-5"} />
              </div>
              <CartIcon />
            </div>
          ),
          backgroundColor: "bg-white",
        });
      }, 100);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9001]"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="fixed inset-0 bg-white h-full w-full"
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Header title="지점 선택" type="back_title" onClickBack={onClose} />
        <MembershipBranchSelectPage
          onSelect={(branch) => {
            onBranchSelect(branch);
            onClose();
          }}
          brandCode={brandCode}
        />
      </div>
    </div>
  )
}
