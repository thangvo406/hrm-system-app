import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import GoogleSignIn
import KakaoSDKCommon
import KakaoSDKAuth
import NaverThirdPartyLogin

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    if let kakaoAppKey = Bundle.main.object(forInfoDictionaryKey: "KAKAO_APP_KEY") as? String {
      KakaoSDK.initSDK(appKey: kakaoAppKey)
    }

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "coop_use",
      in: window,
      launchOptions: launchOptions
    )
    
    RNSplashScreen.show()

   return true
  }

  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    
    // 1. Kiểm tra KakaoTalk
    if AuthApi.isKakaoTalkLoginUrl(url) {
      return AuthController.handleOpenUrl(url: url)
    }
    
    // 2. Kiểm tra Naver
    let naverScheme = Bundle.main.object(forInfoDictionaryKey: "NAVER_URL_SCHEME") as? String
    if let scheme = naverScheme, !scheme.isEmpty, url.scheme == scheme {
      return NaverThirdPartyLoginConnection.getSharedInstance().application(app, open: url, options: options)
    }
    
    // 3. Kiểm tra Google Sign-In
    // Sử dụng câu lệnh if để nếu Google không xử lý URL này, ứng dụng vẫn tiếp tục chạy xuống dưới
    if GIDSignIn.sharedInstance.handle(url) {
      return true
    }
    
    // 4. Fallback về React Native Deep Linking (RCTLinkingManager)
    return RCTLinkingManager.application(app, open: url, options: options)
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
