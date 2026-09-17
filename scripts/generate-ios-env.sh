#!/bin/sh
#
# Regenerates the two files every iOS build consumes:
#
#   ios/.env         source of truth for react-native-config's Config codegen
#                    phase, which turns it into GeneratedDotEnv.m (the values
#                    reachable from JS as Config.*)
#   ios/tmp.xcconfig included by the Pods-HRMSystem xcconfig, so $(APP_NAME),
#                    $(GOOGLE_IOS_CLIENT_ID), $(KAKAO_APP_KEY),
#                    $(NAVER_URL_SCHEME), $(APP_IOS_ID)... resolve in
#                    Info.plist and build settings
#
# Both are generated, gitignored, and must never be edited by hand.
#
# Called from three places, all of which must agree:
#   - the HRMSystem scheme's build pre-action (Xcode builds) — runs before Xcode
#     resolves build settings, which is what lets Info.plist pick up changes
#     within the same build
#   - the "Config codegen" build phase of the react-native-config pod, wired up
#     in ios/Podfile post_install
#   - ios/fastlane/Fastfile, since xcodebuild does not run scheme pre-actions
#
# Source selection, in order:
#   1. /tmp/envfile, when it names a real source (written by the pre-action or
#      by fastlane) — this is react-native-config's own selection channel
#   2. $ENVFILE, same rule
#   3. /tmp/envfile already pointing at ios/.env means an earlier call in this
#      same build resolved it, so reuse what is there
#   4. env/.dev
#
set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GENERATED_ENV="ios/.env"
GENERATED_XCCONFIG="ios/tmp.xcconfig"
DEFAULT_SOURCE_ENV="env/.dev"

BUILD_XCCONFIG="$REPO_ROOT/node_modules/react-native-config/ios/ReactNativeConfig/BuildXCConfig.rb"

tmp_envfile=""
if [ -f /tmp/envfile ]; then
  tmp_envfile="$(tr -d '[:space:]' < /tmp/envfile)"
fi

source_env=""
if [ -n "$tmp_envfile" ] && [ "$tmp_envfile" != "$GENERATED_ENV" ]; then
  source_env="$tmp_envfile"
elif [ -n "$ENVFILE" ] && [ "$ENVFILE" != "$GENERATED_ENV" ]; then
  source_env="$ENVFILE"
elif [ "$tmp_envfile" = "$GENERATED_ENV" ] && [ -f "$REPO_ROOT/$GENERATED_ENV" ]; then
  # Already resolved earlier in this build — keep the file as it is.
  echo "Reusing $GENERATED_ENV (already generated for this build)"
  source_env=""
else
  source_env="$DEFAULT_SOURCE_ENV"
fi

if [ -n "$source_env" ]; then
  if [ ! -f "$REPO_ROOT/$source_env" ]; then
    echo "error: env file not found: $REPO_ROOT/$source_env" >&2
    exit 1
  fi
  echo "Generating $GENERATED_ENV from $source_env"
  cp "$REPO_ROOT/$source_env" "$REPO_ROOT/$GENERATED_ENV"
fi

# Hand react-native-config's own scripts the generated file rather than the
# original source, so every consumer reads the exact same bytes. /tmp/envfile
# outranks $ENVFILE inside ReadDotEnv.rb, so it is the only reliable channel.
echo "$GENERATED_ENV" > /tmp/envfile

if [ ! -f "$BUILD_XCCONFIG" ]; then
  echo "error: $BUILD_XCCONFIG not found — run yarn install" >&2
  exit 1
fi

echo "Generating $GENERATED_XCCONFIG"
"$BUILD_XCCONFIG" "$REPO_ROOT" "$REPO_ROOT/$GENERATED_XCCONFIG" > /dev/null
