import AppNavigator from '@navigation/AppNavigator';
import { useEffect, useRef } from 'react';

type Params = Record<string, unknown>;

/**
 * Consume params handed back to this (previous) screen via
 * `AppNavigator.goBack(params)`. Whenever the route's params change and any of
 * the given `keys` is present, the values are passed to `onReceive` exactly
 * once and then cleared — only those keys are cleared, all other route params
 * are preserved.
 *
 * The effect is keyed on the params object *reference* (not on the value), so
 * returning the same object/value again is still detected: every fresh
 * `goBack(params)` produces a new params reference and re-triggers consumption.
 */
export function useReturnParams<T extends Params>(
  props: any,
  keys: readonly (keyof T & string)[],
  onReceive: (values: Partial<T>) => void,
) {
  const onReceiveRef = useRef(onReceive);
  onReceiveRef.current = onReceive;

  const routeParams = props?.route?.params as Params | undefined;

  useEffect(() => {
    if (!routeParams) return;

    const received: Partial<T> = {};
    const cleared: Params = {};
    let hasValue = false;
    for (const key of keys) {
      if (routeParams[key] !== undefined) {
        received[key] = routeParams[key] as T[typeof key];
        cleared[key] = undefined;
        hasValue = true;
      }
    }
    if (!hasValue) return;

    onReceiveRef.current(received);

    // Clear ONLY the specified keys. setParams merges, so other params stay.
    AppNavigator.setParams(props, cleared);
  }, [routeParams]);
}
