export const EndPoints = {
  AUTH: {
    completeRegister: 'auth/register/complete',
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
  },
  ACCOUNT: {
    getProfile: 'user/profile',
    updatePushId: 'notification/push-subscription',
    deletePushId: (pushId: string) =>
      `notification/push-subscription/${pushId}`,
    updateMembership: 'user/membership/request',
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
    removeCartItem: (productId: number) => `app/cart/items/${productId}`,
    getListCart: (request: string) => `app/cart?${request}`,
    countTotalItemCart: 'app/cart/sum',
  },
  WALLET: {
    currentWallet: 'wallet',
    getTransactionHistories: (request: string) =>
      `wallet/transaction?${request}`,
    topUpWallet: 'wallet/charge',
  },
};
