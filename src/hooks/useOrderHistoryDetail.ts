import { useState } from 'react';

export type OrderDetailProduct = {
  readonly id: string;
  readonly name: string;
  readonly attributes: string;
  readonly quantity: number;
  readonly price: number;
  readonly imageUrl: string;
};

export type OrderDetail = {
  readonly orderCode: string;
  readonly orderTime: string;
  readonly status: string;
  readonly totalAmount: number;
  readonly paymentMethod: string;
  readonly recipientName: string;
  readonly recipientPhone: string;
  readonly deliveryAddress: string;
  readonly shippingMethod: string;
  readonly subtotal: number;
  readonly shippingFee: number;
  readonly products: OrderDetailProduct[];
};

const MOCK_ORDER_DETAIL: OrderDetail = {
  orderCode: 'DH2505180001',
  orderTime: '18/05/2025 09:41',
  status: 'Hoàn tất',
  totalAmount: 250_000,
  paymentMethod: 'Thanh toán khi nhận hàng (COD)',
  recipientName: 'Nguyễn Văn An',
  recipientPhone: '0901 234 567',
  deliveryAddress: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  shippingMethod: 'Giao hàng tiêu chuẩn',
  subtotal: 230_000,
  shippingFee: 20_000,
  products: [
    {
      id: '1',
      name: 'Áo thun nam cotton basic',
      attributes: 'Màu xanh lá / Size M',
      quantity: 1,
      price: 120_000,
      imageUrl: '',
    },
    {
      id: '2',
      name: 'Tai nghe Bluetooth SoundPro',
      attributes: 'Màu đen',
      quantity: 1,
      price: 350_000,
      imageUrl: '',
    },
    {
      id: '3',
      name: 'Pin sạc dự phòng 10000mAh',
      attributes: 'Màu trắng',
      quantity: 1,
      price: 160_000,
      imageUrl: '',
    },
  ],
};

export function useOrderHistoryDetail() {
  const [showAllProducts, setShowAllProducts] = useState(false);

  const toggleShowAllProducts = () => setShowAllProducts(prev => !prev);

  const visibleProducts = showAllProducts
    ? MOCK_ORDER_DETAIL.products
    : MOCK_ORDER_DETAIL.products.slice(0, 3);

  return {
    data: MOCK_ORDER_DETAIL,
    showAllProducts,
    toggleShowAllProducts,
    visibleProducts,
  };
}
