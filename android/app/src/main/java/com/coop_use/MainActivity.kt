package com.coop_use

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.core.view.WindowInsetsCompat
import android.view.View
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "coop_use"

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)
    // Ngăn react-native-screens restore fragments
    super.onCreate(null)

    // Chuẩn bị edge-to-edge
    try {
      WindowCompat.setDecorFitsSystemWindows(window, false)
    } catch (_: Throwable) { /* no-op */ }

    // Ẩn navigation bar ngay lập tức để không flash khi splash hiện
    applyImmersiveSafely()
    // Áp dụng lại sau khi decorView layout xong (một số OEM cần)
    window.decorView.post { applyImmersiveSafely() }
  }


  override fun onWindowFocusChanged(hasFocus: Boolean) {
    super.onWindowFocusChanged(hasFocus)
    if (hasFocus) applyImmersiveSafely()
  }

  override fun onConfigurationChanged(newConfig: android.content.res.Configuration) {
    super.onConfigurationChanged(newConfig)
    applyImmersiveSafely()
  }

  private fun applyImmersiveSafely() {
    try {
      val controller = WindowInsetsControllerCompat(window, window.decorView)
      controller.show(WindowInsetsCompat.Type.statusBars())
      controller.hide(WindowInsetsCompat.Type.navigationBars())
      controller.systemBarsBehavior =
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

      // API 28 (Android 9) và thấp hơn: WindowInsetsControllerCompat không đủ,
      // phải set trực tiếp HIDE_NAVIGATION + IMMERSIVE_STICKY.
      @Suppress("DEPRECATION")
      window.decorView.systemUiVisibility = (
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
          or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
          or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
          or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
          or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
      )
    } catch (_: IllegalArgumentException) {
    } catch (_: Throwable) {
    }
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
