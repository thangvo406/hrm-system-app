#!/usr/bin/env bash
# ============================================================
# Build JS bundle từ project React Native, nén zip và upload lên CodePush server.
#
# Cách dùng (chạy trong thư mục gốc của app React Native):
#   SERVER=https://your-server.com \
#   ADMIN_TOKEN=your-admin-token \
#   DEPLOYMENT_KEY=xxxx \
#   ./release.sh android 1.0.0 "Fix crash màn hình home"
#
#   ./release.sh <platform: ios|android> <targetAppVersion> [description] [rollout]
# ============================================================
set -euo pipefail

PLATFORM="${1:?Thiếu platform (ios|android)}"
APP_VERSION="${2:?Thiếu targetAppVersion (vd 1.0.0 hoặc 1.x)}"
DESCRIPTION="${3:-}"
ROLLOUT="${4:-100}"

SERVER="${SERVER:?Cần biến môi trường SERVER}"
ADMIN_TOKEN="${ADMIN_TOKEN:?Cần biến môi trường ADMIN_TOKEN}"
DEPLOYMENT_KEY="${DEPLOYMENT_KEY:?Cần biến môi trường DEPLOYMENT_KEY}"

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

echo "==> Upload lên $SERVER..."
curl -sS -X POST "$SERVER/admin/deployments/$DEPLOYMENT_KEY/releases" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "file=@$ZIP_FILE" \
  -F "appVersion=$APP_VERSION" \
  -F "description=$DESCRIPTION" \
  -F "rollout=$ROLLOUT" | python3 -m json.tool || true

echo "==> Xong."
