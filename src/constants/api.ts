export const EndPoints = {
  BASE: {
    uploadFile: 'file/upload',
  },
  AUTH: {
    login: 'auth/login',
    loginSocial: (provider: string) => `auth/social/${provider}/login`,
    register: 'auth/register',
    sendOTP: 'auth/register/phone/send-otp',
    verifyOTP: 'auth/register/phone/confirm-otp',
    getUniversities: (request: string) => `university?${request}`,
    createLinkVerifyForgotPass: 'auth/forgot-password/identity/init',
    submitForgotPass: 'auth/forgot-password/reset',
    refreshToken: 'auth/refresh',
    logout: 'auth/logout',
    sendOtpVerifyMembership: 'auth/register/membership-verification',
    confirmMemberShipVerify:
      'auth/register/membership-verification/confirm-otp',
    selectSchool: 'user/session/university',
    createLinkVerifyInfoUser: 'auth/register/identity/init',
  },
  CONTRIBUTION: {
    increase: 'contribution/increase-request',
    summary: 'contribution/summary',
    historiesDividend: (request: string) => `contribution/dividend?${request}`,
    dividendDetail: (dividendId: number) =>
      `contribution/dividend/${dividendId}`,
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
    deleteAccount: 'user/delete',
    activeAccount: 'activeAccount',
    changePass: 'user/change-password',
    updateProfile: 'user/profile',
    confirmOTPRequestMembership: 'user/membership/confirm-otp',
    createQRCodeMember: 'api/v1/membership/qr/generate',
    withdrawalBalance: 'balance/withdrawal',
    getMealTickets: (request: string) => `order/ticket${request}`,
    getTransactionsMovement: (request: string) => `balance/movement${request}`,
    payPointHistories: (request: string) => `balance/ledger${request}`,
  },
  ACCOUNT_MANAGEMENT: {
    addAccount: 'balance/kcp/register/init',
    lockCardAccount: 'balance/payment-method/block',
    unLockCardAccount: 'balance/payment-method/unblock',
    makeDefaultCard: 'balance/payment-method/default',
    list: 'balance/payment-method',
    removeCardAccount: 'balance/kcp/manage/init',
  },
  NOTIFICATIONS: {
    list: (request: string) => `notification?${request}`,
    markRead: (notifyId: number) => `notification/${notifyId}/read`,
    markReadAll: 'notification/read-all',
    detail: (notifyId: number | string) => `notification/${notifyId}`,
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
  VOUCHERS: {
    list: (request: string) => `coupon/my-certificates${request}`,
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
    generateQRCodePay: 'api/v1/pay/qr/generate',
    // balanceCharge: 'balance/kcp/charge/init',
    balanceCharge: 'balance/charge',
    cartDetail: (cartId: number) => `app/cart/${cartId}`,
  },

  WALLET: {
    currentWallet: 'balance',
    getTransactionHistories: (request: string) => `balance/ledger?${request}`,
    topUpWallet: 'wallet/charge',
  },
};
