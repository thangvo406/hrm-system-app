import type { TApprovalStep } from '@type/requests';

import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const AVATAR_SIZE = ScaleSize(44);
const ARROW_SIZE = ScaleSize(18);
/** Cấp duyệt lẻ tô xanh, cấp chẵn tô tím — chỉ để phân biệt hai người. */
const EVEN_STEP = 2;

type Properties = {
  readonly steps: readonly TApprovalStep[];
};

/**
 * Chuỗi người sẽ duyệt đơn, theo đúng thứ tự. Mũi tên giữa hai ô là thông tin
 * thật: đơn chỉ tới cấp sau khi cấp trước đã duyệt.
 */
function ApprovalFlow({ steps }: Properties) {
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.label}>{t('create_request.approval_label')}</Text>

      <View style={styles.card}>
        {steps.map((step, index) => {
          const isEven = index % EVEN_STEP === 1;

          return (
            <React.Fragment key={step.id}>
              {index > 0 ? (
                <Image
                  color={Colors.gray24}
                  height={ARROW_SIZE}
                  name="ic_chevron_right"
                  type="svg"
                  width={ARROW_SIZE}
                />
              ) : undefined}

              <View style={styles.step}>
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: isEven ? Colors.purple04 : Colors.blue06,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.initials,
                      { color: isEven ? Colors.purple03 : Colors.blue02 },
                    ]}
                  >
                    {step.initials}
                  </Text>
                </View>

                <View style={styles.stepText}>
                  <Text numberOfLines={1} style={styles.name}>
                    {step.name}
                  </Text>
                  <Text numberOfLines={1} style={styles.role}>
                    {t(step.roleKey)}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

export default React.memo(ApprovalFlow);

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: AVATAR_SIZE / 2,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    width: AVATAR_SIZE,
  },
  card: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.gray19,
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    padding: ScaleSize(12),
  },
  initials: {
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
  label: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginBottom: ScaleSize(8),
  },
  name: {
    color: Colors.navy04,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  role: {
    color: Colors.gray17,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  step: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  stepText: {
    flex: 1,
  },
});
