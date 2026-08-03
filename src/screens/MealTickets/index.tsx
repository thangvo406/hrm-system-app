import { Vouchers } from '@components';
import { useMealTickets } from '@hooks';
import { useTranslation } from 'react-i18next';
Index.propTypes = {};
function Index() {
  const propsVoucher = useMealTickets();
  const { t } = useTranslation();

  return (
    <Vouchers
      {...propsVoucher}
      expiredLabel="미사용"
      btnUseLabel="식권 QR 보기"
      backgroundExpired="#3B82F6"
      isHideLabelExpired
      title={t('meal_ticket.title')}
    />
  );
}
export default Index;
