import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

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

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "hrm_system",
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
    codePushBundleURL() ?? Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  // Bundle OTA do react-native-codepush-sdk cài vào Documents/CustomCodePush/current.bundle.
  // Chỉ dùng khi file tồn tại và không rỗng; ngược lại fallback về main.jsbundle trong app.
  private func codePushBundleURL() -> URL? {
    guard
      let documents = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first
    else {
      return nil
    }
    let bundleURL = documents.appendingPathComponent("CustomCodePush/current.bundle")
    guard
      let attributes = try? FileManager.default.attributesOfItem(atPath: bundleURL.path),
      let size = attributes[.size] as? NSNumber,
      size.intValue > 0
    else {
      return nil
    }
    return bundleURL
  }
}
