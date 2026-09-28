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
    attendanceInfo: 'v1/attendance/today',
    histories: (request: string) => `v1/attendance/history${request}`,
  },
  HOME: {
    homeInfo: 'v1/home',
  },
  REQUESTS: {
    list: (request: string) => `v1/request${request}`,
  },
  NOTIFICATIONS: {
    list: (request: string) => `v1/notification${request}`,
  },
};
