import type { RootState } from '@services/common/store';

const getValue = (state: RootState): number => state.counter.value;

export const CounterSelector = {
  getValue,
};
