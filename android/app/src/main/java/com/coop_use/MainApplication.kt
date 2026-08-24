package com.coop_use

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.coop_use.systemui.CoopNativePackage

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              add(CoopNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        // Bundle OTA do react-native-codepush-sdk cài vào
        // filesDir/CustomCodePush/current.bundle (RNFS.DocumentDirectoryPath trên
        // Android là getFilesDir()). Chỉ dùng ở release và khi file tồn tại,
        // không rỗng; ngược lại trả null để RN fallback về bundle đóng trong APK.
        // Song song với codePushBundleURL() trong ios/AppDelegade.swift.
        override fun getJSBundleFile(): String? {
          if (BuildConfig.DEBUG) {
            return null
          }
          val bundle = java.io.File(filesDir, "CustomCodePush/current.bundle")
          return if (bundle.exists() && bundle.length() > 0) bundle.absolutePath else null
        }

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
