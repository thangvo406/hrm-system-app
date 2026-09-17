export enum Paths {
  AppTabs = 'app_tabs',
  Authorization = 'authorization',
  Carts = 'carts',
  Home = 'home',
  PaymentOffline = 'payment_offline',
  Profile = 'profile',
  QRCodeViewer = 'qr_code_viewer',
  Startup = 'startup',
}

export enum AppStacks {
  Auth = 'Auth',
  App = 'App',
}

export const SCREEN_IGNORE_SWIPE_LEFT: Paths[] = [];

export const AUTH_PATHS = new Set<string>([Paths.AppTabs, Paths.Authorization]);
