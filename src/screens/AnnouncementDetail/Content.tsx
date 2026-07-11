import type { MixedStyleDeclaration } from 'react-native-render-html';

import { ScaleSize } from '@kits/core';
import RenderHtml from 'react-native-render-html';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import React, { useRef, useState } from 'react';
import WebView from 'react-native-webview';
import dayjs from 'dayjs';
import Loading from '@dialogs/Loading'

import TitleRow from './TitleRow';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9E9E9E';
const BODY_COLOR = '#333333';

const HORIZONTAL_PADDING = ScaleSize(20);
const PARAGRAPH_MARGIN_VERTICAL = ScaleSize(10);
const DATE_MARGIN_TOP = ScaleSize(24);
const WEBVIEW_MIN_HEIGHT = 100;

type Properties = {
  readonly contentHtml: string;
  readonly createdDate: string;
  readonly title: string;
};

const tagsStyles: Record<string, MixedStyleDeclaration> = {
  b: { color: TEXT_DARK, fontWeight: '700' },
  body: { color: BODY_COLOR, fontSize: ScaleSize(14), lineHeight: ScaleSize(22) },
  div: { color: BODY_COLOR, fontSize: ScaleSize(14), lineHeight: ScaleSize(22) },
  p: {
    color: BODY_COLOR,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(22),
    marginVertical: PARAGRAPH_MARGIN_VERTICAL,
  },
  span: { color: BODY_COLOR, fontSize: ScaleSize(14), lineHeight: ScaleSize(22) },
  strong: { color: TEXT_DARK, fontWeight: '700' },
};

const INJECTED_JS = `
  (function() {
    function sendHeight() {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'height', value: document.documentElement.scrollHeight })
      );
    }
    window.addEventListener('load', sendHeight);
    new MutationObserver(sendHeight).observe(document.body, { childList: true, subtree: true });
    sendHeight();
  })();
  true;
`;

function Content({ contentHtml, createdDate, title }: Properties) {
  const { width } = useWindowDimensions();
  const [webViewHeight, setWebViewHeight] = useState(WEBVIEW_MIN_HEIGHT);
  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const contentWidth = width - HORIZONTAL_PADDING * 2;
  const isFullDocument = contentHtml.trimStart().toLowerCase().startsWith('<!doctype');

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <TitleRow title={title} />
      {isFullDocument ? (
       <>
          {!isLoading ? undefined : (
            <Loading
               style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  bottom: '35%',
                  zIndex: 999,
               }}
            />
         )}
         <WebView
          ref={webViewRef}
          injectedJavaScript={INJECTED_JS}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data) as {
                type: string;
                value: number;
              };
              if (data.type === 'height' && data.value > WEBVIEW_MIN_HEIGHT) {
                setWebViewHeight(data.value);
              }
            } catch {
              // ignore
            }
          }}
          onLoadStart={() => {
            setIsLoading(true);
          }}
          onLoadEnd={() => {
            setIsLoading(false);
          }}
          onError={() => {
            setIsLoading(false);
          }}
          scrollEnabled={false}
          source={{ html: contentHtml }}
          style={[styles.webView, { height: webViewHeight, width: contentWidth }]}
        />
       </>
      ) : (
        <RenderHtml
          baseStyle={tagsStyles.body ?? {}}
          contentWidth={contentWidth}
          source={{ html: contentHtml }}
          tagsStyles={tagsStyles}
        />
      )}
      <View style={styles.dateRow}>
        <Text style={styles.dateText}>
          {dayjs(createdDate).format('YY-MM-DD')}
        </Text>
      </View>
    </ScrollView>
  );
}

export default React.memo(Content);

const styles = StyleSheet.create({
  dateRow: {
    alignItems: 'flex-end',
    marginTop: DATE_MARGIN_TOP,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  dateText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: ScaleSize(12),
  },
  webView: {
    backgroundColor: 'transparent',
  },
});
