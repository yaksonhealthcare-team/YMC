import React, { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material"
import {
  usePopupStore,
  usePopupActions,
  PopupState,
} from "../../stores/popupStore"
// Import AppPopupData from the correct API file
import { AppPopupData } from "../../apis/contents.api"

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper core and types
import SwiperCore from "swiper"

// Import Swiper styles
import "swiper/css"

// Placeholder image URL
const TEMP_IMAGE_URL =
  "https://via.placeholder.com/400x400.png?text=Square+Popup"

export function StartupPopup() {
  const isOpen = usePopupStore((state: PopupState) => state.isOpen)
  const popupDataArray = usePopupStore((state: PopupState) => state.popupData)
  const { closePopup, setDontShowAgain } = usePopupActions()
  const swiperRef = useRef<SwiperCore | null>(null)
  const navigate = useNavigate()

  const handleClose = () => {
    closePopup()
  }

  const handleDontShowAgain = () => {
    setDontShowAgain(7)
  }

  const handleImageClick = (code: string) => {
    if (code) {
      navigate(`/popup/${code}`)
      closePopup()
    }
  }

  useEffect(() => {
    if (isOpen && swiperRef.current) {
      const timer = setTimeout(() => {
        swiperRef.current?.update()
        console.log("Swiper updated after dialog open.")
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const isSwiperActive = !!(popupDataArray && popupDataArray.length > 1)

  if (!isOpen || !popupDataArray || popupDataArray.length === 0) {
    return null
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          margin: 0,
          padding: 0,
          overflow: "visible",
          maxWidth: "95%",
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
      sx={{
        "& .MuiDialog-container": {
          alignItems: "center",
          justifyContent: "center",
        },
        "& .swiper": { backgroundColor: "transparent" },
      }}
    >
      <DialogContent
        sx={{
          padding: 0,
          "&:first-of-type": { paddingTop: 0 },
          width: "100%",
          overflow: "visible",
        }}
      >
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          spaceBetween={16}
          slidesPerView={1.2}
          centeredSlides={true}
          loop={isSwiperActive}
          allowSlideNext={isSwiperActive}
          allowSlidePrev={isSwiperActive}
          className="w-full"
          style={{ overflow: "visible" }}
        >
          {popupDataArray.map((popup: AppPopupData, index) => (
            <SwiperSlide
              key={index}
              className="aspect-square bg-[#eee] rounded-xl overflow-hidden flex items-center justify-center"
            >
              <img
                src={popup.imageUrl || TEMP_IMAGE_URL}
                alt={`Startup Promotion ${index + 1}`}
                onClick={() => handleImageClick(popup.code)}
                className={`block w-full h-full object-cover ${popup.code ? "cursor-pointer" : ""}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between",
          padding: "0",
          width: "100%",
          mt: "13.5px",
          pr: "16px",
          pl: "32px",
        }}
      >
        <Button
          onClick={handleDontShowAgain}
          color="inherit"
          sx={{ color: "#fff", fontSize: "0.875rem", padding: 0 }}
        >
          7일간 보지 않기
        </Button>
        <Button
          onClick={handleClose}
          color="inherit"
          sx={{ color: "#fff", fontSize: "0.875rem", padding: 0 }}
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  )
}
