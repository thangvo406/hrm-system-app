export const EndPoints = {
  AUTH: {
    login: 'auth/login',
    loginSocial: (provider: string) => `auth/social/${provider}/login`,
    register: 'auth/register',
    sendOTP: 'auth/register/phone/send-otp',
    verifyOTP: 'auth/register/phone/confirm-otp',
    getUniversities: (request: string) => `university?${request}`,
    sendOtpForgotPass: 'auth/forgot-password/send-otp',
    verifyOtpForgotPass: 'auth/forgot-password/confirm-otp',
    submitForgotPass: 'auth/forgot-password/reset',
    refreshToken: 'auth/refresh',
    logout: 'auth/logout',
    memberShipVerify: 'auth/register/membership-verification',
    selectSchool: 'user/session/university',
  },
  CONTRIBUTION: {
    increase: 'contribution/increase-request',
    summary: 'contribution/summary',
    histories: (request: string) => `contribution/history?${request}`,
    historyDetail: (historyId: number | string) =>
      `contribution/history/${historyId}`,
  },
  ACCOUNT: {
    autoCompleteAddress: (request: string) => `?${request}`,
    deletePushId: (pushId: string) =>
      `notification/push-subscription/${pushId}`,
    getProfile: 'user/profile',
    updateMembership: 'user/membership/request',
    updatePushId: 'notification/push-subscription',
  },
  NOTIFICATIONS: {
    list: (request: string) => `notification?${request}`,
    markRead: (notifyId: number) => `notification/${notifyId}/read`,
    markReadAll: 'notification/read-all',
  },
  ANNOUNCEMENTS: {
    detail: (announcementId: number | string) =>
      `announcement/${announcementId}`,
    list: (request: string) => `announcement?${request}`,
    listImage: 'banner?pageOption=ANNOUNCEMENT',
  },
  PRODUCTS: {
    detail: (productId: number | string) => `product/${productId}`,
    list: (request: string) => `product?${request}`,
  },
  SURVEY: {
    list: (request: string) => `survey?${request}`,
    detail: (surveyId: number | string) => `survey/${surveyId}`,
    submitSurvey: (surveyId: number | string) => `survey/done/${surveyId}`,
  },
  STORE: {
    list: (request: string) => `store?${request}`,
    detail: (storeId: number | string) => `store/${storeId}`,
    storeOrderRecent: 'store/store-recent',
  },
  PAYMENT: {
    checkout: 'app/cart/items',
    updateProductCart: (cartId: number) => `app/cart/items/${cartId}`,
    getInfoProductCheckout: (request: string) => `app/cart/check?${request}`,
    removeCartItem: (productId: number) => `app/cart/${productId}`,
    getListCart: (request: string) => `app/cart?${request}`,
    countTotalItemCart: 'app/cart/sum',
    createOrder: 'order/create',
    createLinkPaymentOrder: (orderId: number) =>
      `order/${orderId}/checkout/init`,
    orderHistories: (request: string) => `order?${request}`,
    orderHistoryDetail: (orderId: string) => `order/${orderId}`,
    addressOrderRecent: 'order/recent-address',
    generateQRCode: 'api/v1/pay/qr/generate',
    initCharge: 'balance/kcp/charge/init',
  },
  WALLET: {
    currentWallet: 'balance',
    getTransactionHistories: (request: string) => `balance/ledger?${request}`,
    topUpWallet: 'wallet/charge',
  },
};
