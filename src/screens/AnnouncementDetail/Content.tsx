import type { MixedStyleDeclaration } from 'react-native-render-html';

import { ScaleSize } from '@kits/core';
import RenderHtml from 'react-native-render-html';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import React from 'react';
import dayjs from 'dayjs';

import TitleRow from './TitleRow';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9E9E9E';
const BODY_COLOR = '#333333';

const HORIZONTAL_PADDING = ScaleSize(20);
const PARAGRAPH_MARGIN_VERTICAL = ScaleSize(10);
const DATE_MARGIN_TOP = ScaleSize(24);

type Properties = {
  readonly contentHtml: string;
  readonly createdDate: string;
  readonly title: string;
};

const tagsStyles: Record<string, MixedStyleDeclaration> = {
  body: {
    color: BODY_COLOR,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(22),
  },
  div: {
    color: BODY_COLOR,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(22),
  },
  p: {
    color: BODY_COLOR,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(22),
    marginVertical: PARAGRAPH_MARGIN_VERTICAL,
  },
  li: {
    color: BODY_COLOR,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(22),
    marginVertical: ScaleSize(4),
  },
  span: {
    color: BODY_COLOR,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(22),
  },
  b: {
    color: TEXT_DARK,
    fontWeight: '700',
  },
  strong: {
    color: TEXT_DARK,
    fontWeight: '700',
  },
};

function Content({ contentHtml, createdDate, title }: Properties) {
  const { width } = useWindowDimensions();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <TitleRow title={title} />
      <RenderHtml
        baseStyle={tagsStyles.body || {}}
        contentWidth={width - HORIZONTAL_PADDING * 2}
        source={{ html: contentHtml }}
        tagsStyles={tagsStyles}
      />
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
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: ScaleSize(12),
    paddingBottom: ScaleSize(32),
  },
});
