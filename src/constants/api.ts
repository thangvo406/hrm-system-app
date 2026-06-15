export const EndPoints = {
  AUTH: {
    completeRegister: 'auth/register/complete',
    login: 'auth/login',
    register: 'auth/register',
    sendOTP: 'auth/register/phone/send-otp',
    verifyOTP: 'auth/register/phone/confirm-otp',
    getUniversities: 'universities',
    sendOtpForgotPass: 'auth/forgot-password/send-otp',
    verifyOtpForgotPass: 'auth/forgot-password/confirm-otp',
    submitForgotPass: 'auth/forgot-password/reset',
  },
  ACCOUNT: {
    getProfile: 'user/profile',
  },
};
