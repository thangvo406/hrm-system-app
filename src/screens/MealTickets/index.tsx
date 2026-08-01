import { Vouchers } from '@components';
import { useMealTickets } from '@hooks';
Index.propTypes = {};
function Index() {
  const propsVoucher = useMealTickets();

  return (
    <Vouchers
      {...propsVoucher}
      expiredLabel="미사용"
      btnUseLabel="식권 QR 보기"
    />
  );
}
export default Index;
