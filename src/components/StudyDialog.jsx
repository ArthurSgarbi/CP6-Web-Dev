import { useEffect, useRef } from 'react';
import Icon from './Icon';
import { Link } from 'react-router-dom';
import ProjectImage from './ProjectImage.jsx';
import ProjectInfo from './ProjectInfo.jsx';

export default function StudyDialog({ study, onClose, onPrevious, onNext, totalCount, position }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const isOpen = Boolean(study);

  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      document.documentElement.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      } else {
        document.getElementById('work')?.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  const closeOnBackdrop = (event) => {
    if (event.target !== dialogRef.current) return;
    const bounds = dialogRef.current.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) onClose();
  };

  const changeWithKeyboard = (event) => {
    if (event.key === 'Tab') {
      const controls = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    if (event.key === 'ArrowLeft' && onPrevious) {
      event.preventDefault();
      onPrevious();
    }
    if (event.key === 'ArrowRight' && onNext) {
      event.preventDefault();
      onNext();
    }
  };

  return (
    <dialog
      className="study-dialog"
      ref={dialogRef}
      aria-labelledby="dialog-study-title"
      aria-describedby="dialog-study-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={closeOnBackdrop}
      onKeyDown={changeWithKeyboard}
    >
      {study && (
        <div className="study-dialog-inner">
          <div className="dialog-topline">
            <span className="dialog-kicker">Projeto de desenvolvimento / GitHub</span>
            <button className="dialog-close" type="button" ref={closeRef} onClick={onClose} aria-label="Fechar detalhes do projeto">
              <Icon name="close" />
            </button>
          </div>

          <div className="dialog-image-wrap">
            <ProjectImage project={study} className="dialog-image" width={1600} height={1100} />
          </div>

          <div className="dialog-copy">
            <div className="dialog-title-row">
              <h2 className="dialog-title" id="dialog-study-title" aria-live="polite">{study.title}</h2>
              <span className="dialog-counter">{String(position).padStart(2, '0')}{totalCount ? ` / ${String(totalCount).padStart(2, '0')}` : ''}</span>
            </div>
            <ProjectInfo project={study} descriptionId="dialog-study-description" />
            <Link className="text-link project-permalink" to={study.detailsUrl}>Abrir página individual <Icon /></Link>
            {totalCount > 1 && (onPrevious || onNext) && (
              <div className="dialog-navigation">
                {onPrevious && <button className="dialog-nav-button" type="button" onClick={onPrevious}><Icon name="arrow-left" /> Projeto anterior</button>}
                {onNext && <button className="dialog-nav-button" type="button" onClick={onNext}>Próximo projeto <Icon name="arrow-right" /></button>}
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
