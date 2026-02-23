import { UserMembershipSchema } from '@/_domain/membership';
import { BottomFixedSection, Button, Divider } from '@/_shared';
import { useLayout } from '@/widgets/layout/model/LayoutContext';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ReservationFormValues } from '@/entities/reservation/model/reservation.types';
import { ReservationMenuSection, ReservationMenuSectionProps, ReservationRestSection } from '@/features/reservation/ui';

export interface ReservationTemplateProps {
  memberships: UserMembershipSchema[];
  consultCount: ReservationMenuSectionProps['consultCount'];
  onSubmit: (values: ReservationFormValues) => void;
  isPending?: boolean;
}
export const ReservationTemplate = ({
  memberships,
  consultCount,
  onSubmit,
  isPending = false
}: ReservationTemplateProps) => {
  const { handleSubmit } = useFormContext<ReservationFormValues>();

  return (
    <>
      <Header />
      <section className="py-2">
        <ReservationMenuSection consultCount={consultCount} memberships={memberships} />
        <Divider className="my-6" />
        <ReservationRestSection />
      </section>

      <BottomFixedSection>
        <Button onClick={handleSubmit(onSubmit)} isLoading={isPending}>
          예약하기
        </Button>
      </BottomFixedSection>
    </>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const { setHeader, setNavigation } = useLayout();

  useEffect(() => {
    setHeader({
      display: true,
      title: '예약하기',
      left: 'back',
      onClickBack: () => navigate(-1),
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: false });
  }, [navigate, setHeader, setNavigation]);

  return <></>;
};
