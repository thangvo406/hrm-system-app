#!/usr/bin/env bash
# ============================================================
# Build JS bundle từ project React Native, nén zip và upload lên CodePush server.
#
# Cách dùng (chạy trong thư mục gốc của app React Native):
#   SERVER=https://your-server.com \
#   ADMIN_USER=your-username \
#   ADMIN_PASSWORD=your-password \
#   DEPLOYMENT_KEY=xxxx \
#   ./release.sh android "Fix crash màn hình home"
#
#   ./release.sh <platform: ios|android> [description] [rollout]
#
# Server không còn nhận token tĩnh — script tự login lấy token ngắn hạn.
# Trong CI, đặt ADMIN_USER/ADMIN_PASSWORD làm secret của pipeline.
#
# KHÔNG còn tham số version: đọc thẳng từ file của app để không ai gõ nhầm và
# để giá trị luôn khớp với binary đang phát hành.
#   appVersion         <- app.json "appVersion"  (SỐ THỨ TỰ BUNDLE, số nguyên
#                         tăng dần từ 1 — KHÔNG phải version native. Máy chỉ tải
#                         khi số của nó nhỏ hơn số này.)
#   minPlatformVersion <- app.json "minPlatformVersion" (version NATIVE tối
#                         thiểu chạy được bundle này, so với
#                         DeviceInfo.getVersion(); máy thấp hơn bị bỏ qua)
#
# MỖI LẦN release phải tăng "appVersion" trong app.json, nếu không máy sẽ thấy
# số bằng nhau và không tải gì cả.
# ============================================================
set -euo pipefail

PLATFORM="${1:?Thiếu platform (ios|android)}"
DESCRIPTION="${2:-}"
ROLLOUT="${3:-100}"

APP_VERSION="$(node -p "require('./app.json').appVersion || 0")"
MIN_PLATFORM_VERSION="${MIN_PLATFORM_VERSION:-$(node -p "require('./app.json').minPlatformVersion || ''")}"

if [ "$APP_VERSION" -lt 1 ] 2>/dev/null; then
  echo "app.json thiếu \"appVersion\" hoặc nhỏ hơn 1 — máy sẽ không bao giờ tải bundle này." >&2
  exit 1
fi

SERVER="${SERVER:?Cần biến môi trường SERVER}"
ADMIN_USER="${ADMIN_USER:?Cần biến môi trường ADMIN_USER}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:?Cần biến môi trường ADMIN_PASSWORD}"
DEPLOYMENT_KEY="${DEPLOYMENT_KEY:?Cần biến môi trường DEPLOYMENT_KEY}"

echo "==> Đăng nhập $SERVER..."
LOGIN_RESPONSE=$(curl -sS -X POST "$SERVER/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USER\",\"password\":\"$ADMIN_PASSWORD\"}")

ADMIN_TOKEN=$(printf '%s' "$LOGIN_RESPONSE" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin).get("token",""))' 2>/dev/null || true)

if [ -z "$ADMIN_TOKEN" ]; then
  echo "Login thất bại: $LOGIN_RESPONSE" >&2
  exit 1
fi

OUT_DIR="codepush_build/$PLATFORM"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

if [ "$PLATFORM" = "ios" ]; then
  ENTRY_EXT="jsbundle"
else
  ENTRY_EXT="bundle"
fi

echo "==> Bundle JS cho $PLATFORM..."
npx react-native bundle \
  --platform "$PLATFORM" \
  --dev false \
  --entry-file index.js \
  --bundle-output "$OUT_DIR/index.bundle" \
  --assets-dest "$OUT_DIR"

echo "==> Nén zip..."
ZIP_FILE="codepush_build/${PLATFORM}_release.zip"
rm -f "$ZIP_FILE"
(cd "$OUT_DIR" && zip -r "../${PLATFORM}_release.zip" . >/dev/null)

echo "==> Upload lên $SERVER (appVersion=$APP_VERSION, minPlatformVersion=${MIN_PLATFORM_VERSION:-<không giới hạn>})..."
curl -sS -X POST "$SERVER/admin/deployments/$DEPLOYMENT_KEY/releases" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "file=@$ZIP_FILE" \
  -F "appVersion=$APP_VERSION" \
  -F "minPlatformVersion=$MIN_PLATFORM_VERSION" \
  -F "description=$DESCRIPTION" \
  -F "rollout=$ROLLOUT" | python3 -m json.tool || true

echo "==> Xong."
