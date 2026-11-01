import { useSyncExternalStore } from 'react';
const subscribe = () => () => {};
// O React usa o retrato do estado do servidor no servidor e durante a hidratação; depois passa
// a usar o estado do navegador. Isso evita divergências entre o HTML e as preferências salvas de tema e movimento.
export default function useHydrating() {
  return useSyncExternalStore(subscribe, () => false, () => true);
}
