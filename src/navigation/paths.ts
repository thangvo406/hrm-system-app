export enum Paths {
  AppTabs = 'app_tabs',
  Attendance = 'attendance',
  AttendanceHistories = 'attendance_histories',
  Authorization = 'authorization',
  Carts = 'carts',
  CreateRequest = 'create_request',
  Home = 'home',
  Notifications = 'notifications',
  PaymentOffline = 'payment_offline',
  Profile = 'profile',
  QRCodeViewer = 'qr_code_viewer',
  Requests = 'requests',
  Startup = 'startup',
}

export enum AppStacks {
  Auth = 'Auth',
  App = 'App',
}

export const SCREEN_IGNORE_SWIPE_LEFT: Paths[] = [];

export const AUTH_PATHS = new Set<string>([Paths.AppTabs, Paths.Authorization]);
