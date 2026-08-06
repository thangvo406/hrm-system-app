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
      expiredLabel={t('meal_ticket.unused')}
      btnUseLabel={t('meal_ticket.view_qr')}
      backgroundExpired="#3B82F6"
      isHideLabelExpired
      isMealTicket
      title={t('meal_ticket.title')}
    />
  );
}
export default Index;
