import Vouchers from '@components/Vouchers';
import { useVouchers } from '@hooks';
function Index() {
  const propsVoucher = useVouchers();

  return <Vouchers {...propsVoucher} />;
}
export default Index;
