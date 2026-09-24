export const EndPoints = {
  AUTH: {
    login: 'v1/auth/login',
    refreshToken: 'v1/auth/refresh',
    logout: 'v1/auth/logout',
  },
  ACCOUNT: {
    getProfile: 'v1/user/profile',
    listOffice: 'v1/office',
  },
  ATTENDANCE: {
    checkIn: 'v1/attendance/checkin',
    checkOut: 'v1/attendance/checkout',
  },
};
