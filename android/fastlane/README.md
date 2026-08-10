fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android beta

```sh
[bundle exec] fastlane android beta
```

Tự động lấy build mới nhất trên Firebase, bump versionCode, build APK và đẩy lên Firebase App Distribution

### android release_aab

```sh
[bundle exec] fastlane android release_aab
```

Build AAB Release (bundleRelease) cho Play Store — CI upload artifact qua GitHub Actions

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
