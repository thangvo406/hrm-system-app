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

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "coop_use"

  override fun onCreate(savedInstanceState: Bundle?) {
    // Ngăn react-native-screens restore fragments
    super.onCreate(null)

    // Splash sau super.onCreate cho lifecycle ổn định
    // SplashScreen.show(this)

    // Chuẩn bị edge-to-edge
    try {
      WindowCompat.setDecorFitsSystemWindows(window, false)
    } catch (_: Throwable) { /* no-op */ }

    // Chờ decorView sẵn sàng rồi mới đụng immersive
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
      // Show status bar (top bar)
      controller.show(WindowInsetsCompat.Type.statusBars())
      // Hide navigation bar (bottom bar)
      controller.hide(WindowInsetsCompat.Type.navigationBars())
      controller.systemBarsBehavior =
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

      @Suppress("DEPRECATION")
      window.decorView.systemUiVisibility = (
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
          or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
      )
    } catch (_: IllegalArgumentException) {
      // Vài OEM vẫn có thể quăng lỗi nếu window vừa mất focus — bỏ qua an toàn.
    } catch (_: Throwable) {
      // Nuốt quirk khác của OEM.
    }
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
