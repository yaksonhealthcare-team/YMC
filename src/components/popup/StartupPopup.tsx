import type { ApiPopupItem } from '@/entities/content/api/contents.api';
import { PopupState, usePopupActions, usePopupStore } from '@/stores/popupStore';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

export function StartupPopup() {
  const isOpen = usePopupStore((state: PopupState) => state.isOpen);
  const popupDataArray = usePopupStore((state: PopupState) => state.popupData);

  const { closePopup, setDontShowAgain } = usePopupActions();
  const swiperRef = useRef<SwiperCore | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    closePopup();
  };

  const handleDontShowAgain = () => {
    setDontShowAgain(7);
  };

  const handleImageClick = (popup: ApiPopupItem) => {
    // 1) 외부 링크 (http/https) -> 새 창(또는 웹뷰에서 열기)
    if (/^https?:\/\//i.test(popup.link)) {
      window.open(popup.link, '_blank');
    } else if (popup.link.includes('/popup')) {
      // 2) 팝업 링크 (ex: /popup) -> 팝업 상세 페이지로 이동
      const base = popup.link.replace(/\/$/, '');
      navigate(`${base}/${popup.code}`);
    } else {
      // 3) 내부 링크 (ex: /event) -> 내부 페이지로 이동
      navigate(popup.link);
    }

    closePopup();
  };

  useEffect(() => {
    if (isOpen && swiperRef.current) {
      const timer = setTimeout(() => {
        swiperRef.current?.update();
        console.log('Swiper updated after dialog open.');
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const isSwiperActive = !!(popupDataArray && popupDataArray.length > 1);

  const displayPopupData = useMemo(() => {
    if (popupDataArray && popupDataArray.length === 2) {
      return [...popupDataArray, ...popupDataArray];
    }
    return popupDataArray;
  }, [popupDataArray]);

  const shouldRenderPopup = isOpen && location.pathname === '/' && displayPopupData && displayPopupData.length > 0;

  if (!shouldRenderPopup) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          margin: 0,
          padding: 0,
          overflow: 'visible',
          maxWidth: '360px',
          width: '80%',
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }
      }}
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'center',
          justifyContent: 'center'
        },
        '& .swiper': { backgroundColor: 'transparent' }
      }}
    >
      <DialogContent
        sx={{
          padding: 0,
          '&:first-of-type': { paddingTop: 0 },
          width: '100%',
          overflow: 'visible'
        }}
      >
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={16}
          slidesPerView={1}
          centeredSlides={true}
          loop={isSwiperActive}
          allowSlideNext={isSwiperActive}
          allowSlidePrev={isSwiperActive}
          className="w-full"
          style={{ overflow: 'visible' }}
        >
          {displayPopupData.map((popup: ApiPopupItem, index) => {
            return (
              <SwiperSlide
                key={`${popup.code}-${index}`}
                className="aspect-square bg-[#eee] rounded-xl overflow-hidden flex items-center justify-center"
                style={{ maxHeight: '360px' }}
              >
                <img
                  src={popup.files?.[0]?.fileurl || ''}
                  alt={`Startup Promotion ${popup.code}`}
                  onClick={() => handleImageClick(popup)}
                  className={`block w-full h-full object-cover ${popup.code ? 'cursor-pointer' : ''}`}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'space-between',
          padding: '0',
          width: '100%',
          mt: '13.5px',
          pr: '16px',
          pl: '32px'
        }}
      >
        <Button onClick={handleDontShowAgain} color="inherit" sx={{ color: '#fff', fontSize: '0.875rem', padding: 0 }}>
          7일간 보지 않기
        </Button>
        <Button onClick={handleClose} color="inherit" sx={{ color: '#fff', fontSize: '0.875rem', padding: 0 }}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
