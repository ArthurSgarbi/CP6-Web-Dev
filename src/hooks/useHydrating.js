import { useSyncExternalStore } from 'react';
const subscribe = () => () => {};
// React uses the server snapshot on the server and during hydration, then switches
// to browser state. This keeps saved themes/motion preferences from mismatching HTML.
export default function useHydrating() {
  return useSyncExternalStore(subscribe, () => false, () => true);
}
