import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
export default function UnsavedChanges({ dirty }) {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm('Há alterações não salvas. Deseja sair e descartá-las?')) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);
  return null;
}
