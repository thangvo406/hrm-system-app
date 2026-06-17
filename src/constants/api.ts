export const EndPoints = {
  AUTH: {
    completeRegister: 'auth/register/complete',
    login: 'auth/login',
    loginSocial: (provider: string) => `auth/social/${provider}/login`,
    register: 'auth/register',
    sendOTP: 'auth/register/phone/send-otp',
    verifyOTP: 'auth/register/phone/confirm-otp',
    getUniversities: 'university',
    sendOtpForgotPass: 'auth/forgot-password/send-otp',
    verifyOtpForgotPass: 'auth/forgot-password/confirm-otp',
    submitForgotPass: 'auth/forgot-password/reset',
  },
  ACCOUNT: {
    getProfile: 'user/profile',
    updatePushId: 'notification/push-subscription',
    deletePushId: (pushId: string) =>
      `notification/push-subscription/${pushId}`,
  },
  NOTIFICATIONS: {
    list: 'notifications',
  },
};
