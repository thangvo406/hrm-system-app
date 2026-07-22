// import { Colors } from '@assets/colors';
// import { Fonts } from '@assets/fonts';
// import { Images } from '@assets/images';
// import AppButton from '@components/AppButton';
import HeaderDetail from '@components/HeaderDetail';
// import Header from '@components/Header';
// import ImageAsset from '@components/ImageAsset';
// import LoadingIcon from '@components/LoadingIcon';
// import { AppConstants } from '@constants';
// import { useWebview } from '@hooks/useWebview';
import { ScaleSize } from '@kits/core';
// import AppNavigator from '@navigations/AppNavigator';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  //   Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

function WebViewScreen(props: any) {
  //   const {
  //     url,
  //     title,
  //     webViewRef,
  //     isError,
  //     isLoading,
  //     injectedJavascript,
  //     onError,
  //     onLoadEnd,
  //     onLoadStart,
  //     scrollEnabled,
  //     onReload,
  //     onHandleMessage,
  //     isShowHeader,
  //   } = useWebview(props);

  const {
    url,
    title,
    cookies,
    isError = false,
    onRequestClose,
    onNavigationStateChange,
  } = props || {};
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  // const insset = useSafeAreaInsets();
  const webViewRef = useRef(null);
  const cookieScript = cookies
    ? `
      ${Object.keys(cookies)
        .map(key => `document.cookie = '${key}=${cookies[key] ?? ''}; path=/';`)
        .join('\n      ')}

      true;
    `
    : undefined;
  const onLoadStart = () => {
    setIsLoading(true);
  };
  const onLoadEnd = () => {
    setIsLoading(false);
  };
  const onError = () => {
    setIsLoading(false);
  };
  const onReload = event => {};
  const onHandleMessage = event => {
    // console.log('onHandleMessage', event);
  };

  const renderErrorScreen = () => {
    return (
      <View style={styles.wrapperError}>
        <Text style={styles.errorText}>{t('common.error_unknown')}</Text>
        <TouchableOpacity onPress={onReload} style={styles.errorReload}>
          <Text style={styles.reloadText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <HeaderDetail
        title={title}
        usePaddingTop={false}
        onPressBack={onRequestClose}
        hideNotify
      />
      {!isLoading ? null : (
        <ActivityIndicator
          style={{
            position: 'absolute',
            alignSelf: 'center',
            bottom: '35%',
            zIndex: 999,
          }}
        />
      )}
      {isError ? (
        renderErrorScreen()
      ) : (
        <WebView
          ref={webViewRef}
          style={styles.webView}
          //   scrollEnabled={scrollEnabled}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          javaScriptEnabled
          //   injectedJavaScript={injectedJavascript}
          //  injectedJavaScriptBeforeContentLoaded={injectedJavascript}
          injectedJavaScriptBeforeContentLoaded={cookieScript}
          source={{
            uri: url,
          }}
          originWhitelist={['*']}
          webviewDebuggingEnabled
          domStorageEnabled
          javaScriptCanOpenWindowsAutomatically
          automaticallyAdjustContentInsets={false}
          mediaPlaybackRequiresUserAction={false}
          useWebKit
          incognito
          allowsInlineMediaPlayback
          onMessage={onHandleMessage}
          mixedContentMode="always"
          cacheEnabled={false}
          onError={onError}
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          onNavigationStateChange={(navState: WebViewNavigation): void => {
            onNavigationStateChange?.(navState, onRequestClose);
          }}
          userAgent={
            Platform.OS === 'android'
              ? 'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
              : 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
          }
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  errorReload: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#BCC2C6',
    backgroundColor: '#F6f7f7',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  wrapperError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#edeeee',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#8F8E94',
  },
  reloadText: {
    fontSize: 14,
    color: '#8F8E94',
  },
  webView: {
    flex: 1,
    borderRadius: ScaleSize(20),
  },
  backgroundContainer: {
    paddingRight: ScaleSize(6),
  },
  backgroundTitle: {
    width: ScaleSize(513),
    height: ScaleSize(43),
    paddingLeft: ScaleSize(16),
    paddingRight: ScaleSize(16),
    paddingBottom: ScaleSize(16),
    top: ScaleSize(-2),
    position: 'absolute',
    zIndex: 1,
  },
  contentInBackgroundTitle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(10),
  },
  textTitle: {
    fontSize: ScaleSize(16, 14),
    lineHeight: ScaleSize(40),
    color: 'red',
  },
  backgroundWebView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ScaleSize(6),
  },
  appButton: {
    left: ScaleSize(25),
    position: 'absolute',
    zIndex: 999,
    top: ScaleSize(6),
  },
  iconBack: {
    width: ScaleSize(40),
    height: ScaleSize(40),
  },
  contentInBackgroundWebView: {
    width: '90%',
    height: '84%',
    marginTop: ScaleSize(24),
    borderRadius: ScaleSize(20),
  },
});
export default WebViewScreen;
