import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

import { Colors } from '@constants';

type Properties = {
  readonly testID?: string;
};

// Khung rỗng dùng chung cho các màn đã gỡ hết nghiệp vụ cũ: route vẫn tồn tại
// để điều hướng không gãy, UI để trống chờ dựng lại theo nghiệp vụ HRM.
function PlaceholderScreen({ testID }: Properties) {
  return (
    <SafeAreaView style={styles.container} testID={testID}>
      <View style={styles.content} />
    </SafeAreaView>
  );
}

export default React.memo(PlaceholderScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
