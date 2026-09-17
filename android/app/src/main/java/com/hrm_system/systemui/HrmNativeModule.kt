package com.coop_use.systemui

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
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
   * Mở một Android intent-URI dạng `intent://...#Intent;...;package=...;end` để
   * chuyển sang app khác (vd xác thực SKT tauth, app ngân hàng trong luồng KCP).
   *
   * WebView không tự mở được scheme `intent://`, và `Linking.openURL` của RN chỉ
   * parse như một URI thường nên bỏ mất đoạn `#Intent;...` -> không launch được
   * app đích. Ở đây dùng [Intent.parseUri] với [Intent.URI_INTENT_SCHEME] để lấy
   * đúng data + package + action, rồi startActivity.
   *
   * Nếu app đích chưa cài: ưu tiên `browser_fallback_url` (nếu URL có kèm), sau
   * đó tới CH Play theo `package` của intent.
   */
  @ReactMethod
  fun openIntentUrl(url: String?, promise: Promise) {
    if (url.isNullOrBlank()) {
      promise.reject(ERR_INVALID_URL, "URL is null or blank")
      return
    }

    try {
      val intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME)

      // Chống "intent scheme URL attack": không cho trang web ép mở component nội
      // bộ của app. Data + package đã đủ để hệ thống resolve app đích.
      intent.addCategory(Intent.CATEGORY_BROWSABLE)
      intent.component = null
      intent.selector = null

      if (launch(intent)) {
        promise.resolve(true)
        return
      }

      // App đích chưa cài -> fallback.
      val fallbackUrl = intent.getStringExtra("browser_fallback_url")
      val packageName = intent.getPackage()
      val opened = when {
        !fallbackUrl.isNullOrBlank() ->
          launch(Intent(Intent.ACTION_VIEW, Uri.parse(fallbackUrl)))
        !packageName.isNullOrBlank() ->
          launch(Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$packageName")))
        else -> false
      }

      if (opened) {
        promise.resolve(true)
      } else {
        promise.reject(ERR_NO_HANDLER, "No app can handle url: $url")
      }
    } catch (error: Throwable) {
      promise.reject(ERR_FAILED, error.message, error)
    }
  }

  /**
   * Thử start [intent] bằng activity hiện tại (nếu có), fallback về application
   * context với cờ NEW_TASK. Trả về `false` khi không có app nào xử lý được
   * (ActivityNotFoundException) để caller chạy nhánh fallback.
   */
  private fun launch(intent: Intent): Boolean {
    return try {
      val activity = reactContext.currentActivity
      if (activity == null) {
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactContext.startActivity(intent)
      } else {
        activity.startActivity(intent)
      }
      true
    } catch (_: ActivityNotFoundException) {
      false
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
    private const val ERR_INVALID_URL = "E_INVALID_URL"
    private const val ERR_NO_HANDLER = "E_NO_HANDLER"
  }
}
