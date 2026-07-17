package com.coop_use.systemui

import android.view.View
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Native module điều khiển thanh navigation bar hệ thống (back/home/recent)
 * ở runtime từ JS.
 *
 * MainActivity đã ẩn navigation bar lúc khởi động qua applyImmersiveSafely();
 * module này cho phép JS bật/tắt lại theo từng màn hình mà không cần rebuild.
 */
class CoopNativeModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  /**
   * Ẩn thanh navigation bar hệ thống. Dùng immersive-sticky để người dùng vẫn
   * có thể vuốt để hiện tạm thời.
   */
  @ReactMethod
  fun hideBottomNavigationBar(promise: Promise) {
    runOnUi(promise) { decorView, controller ->
      controller.hide(WindowInsetsCompat.Type.navigationBars())
      controller.systemBarsBehavior =
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

      // API 28 (Android 9) và thấp hơn: WindowInsetsControllerCompat không đủ,
      // phải set trực tiếp các cờ systemUiVisibility. Giữ LIGHT_STATUS_BAR để
      // status bar luôn là dark-content (khớp MainActivity.applyImmersiveSafely).
      @Suppress("DEPRECATION")
      decorView.systemUiVisibility = (
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
          or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
          or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
          or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
      )

      // API 30+: đường systemUiVisibility đã deprecated, dùng controller.
      controller.isAppearanceLightStatusBars = true
    }
  }

  /**
   * Hiện lại thanh navigation bar hệ thống.
   */
  @ReactMethod
  fun showBottomNavigationBar(promise: Promise) {
    runOnUi(promise) { decorView, controller ->
      controller.show(WindowInsetsCompat.Type.navigationBars())

      // Giữ LIGHT_STATUS_BAR để status bar luôn là dark-content.
      @Suppress("DEPRECATION")
      decorView.systemUiVisibility = (
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
          or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
      )

      controller.isAppearanceLightStatusBars = true
    }
  }

  /**
   * Chạy [block] trên UI thread với decorView + insets controller của activity
   * hiện tại. Reject promise nếu không có activity (vd: app ở background).
   */
  private fun runOnUi(
    promise: Promise,
    block: (decorView: View, controller: WindowInsetsControllerCompat) -> Unit,
  ) {
    val activity = reactContext.currentActivity
    if (activity == null) {
      promise.reject(ERR_NO_ACTIVITY, "Current activity is null")
      return
    }

    activity.runOnUiThread {
      try {
        val decorView = activity.window.decorView
        val controller = WindowInsetsControllerCompat(activity.window, decorView)
        block(decorView, controller)
        promise.resolve(true)
      } catch (error: Throwable) {
        promise.reject(ERR_FAILED, error.message, error)
      }
    }
  }

  companion object {
    const val NAME = "CoopNativeModule"
    private const val ERR_NO_ACTIVITY = "E_NO_ACTIVITY"
    private const val ERR_FAILED = "E_FAILED"
  }
}
