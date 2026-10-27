import { useEffect, useId, useRef, useState } from 'react';
import Icon from '../Icon.jsx';

export default function ProjectGallery({ images = [], projectTitle }) {
  const [failedSources, setFailedSources] = useState(() => new Set());
  const [activeSource, setActiveSource] = useState(null);
  const sectionRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const returnFocusRef = useRef(null);
  const id = useId();
  const availableImages = images.filter((image) => image.src && !image.pending && !failedSources.has(image.src));
  const position = availableImages.findIndex((image) => image.src === activeSource);
  const activeImage = availableImages[position];
  const isOpen = Boolean(activeImage);

  useEffect(() => {
    if (!isOpen) return undefined;

    const dialog = dialogRef.current;
    const previousFocus = returnFocusRef.current || document.activeElement;
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
        sectionRef.current?.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  const close = () => setActiveSource(null);

  const markImageFailed = (source) => {
    setFailedSources((current) => new Set(current).add(source));
    if (source === activeSource) {
      const nextImage = availableImages.find((image) => image.src !== source);
      setActiveSource(nextImage?.src ?? null);
    }
  };

  const navigate = (direction) => {
    if (availableImages.length < 2) return;
    const nextPosition = (position + direction + availableImages.length) % availableImages.length;
    setActiveSource(availableImages[nextPosition].src);
  };

  const handleKeyboard = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Tab') {
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
  };

  const closeOnBackdrop = (event) => {
    if (event.target !== dialogRef.current) return;
    const bounds = dialogRef.current.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  };

  return (
    <section className="case-gallery" aria-labelledby={`${id}-title`} ref={sectionRef} tabIndex={-1}>
      <div className="case-section-heading">
        <span className="case-index" aria-hidden="true">06 /</span>
        <h2 id={`${id}-title`}>Galeria de imagens</h2>
      </div>
      <div className="case-gallery-grid">
        {images.map((image, index) => (
          <figure className="case-gallery-item" key={`${image.src}-${index}`}>
            {!image.src || image.pending || failedSources.has(image.src) ? (
              <div className="case-image-missing" role="status">
                <p>Imagem do processo ainda não adicionada</p>
                {image.src && <code>{image.src}</code>}
              </div>
            ) : (
              <button
                className="case-gallery-trigger"
                type="button"
                aria-label={`Ampliar imagem: ${image.alt || projectTitle}`}
                aria-haspopup="dialog"
                onClick={(event) => {
                  returnFocusRef.current = event.currentTarget;
                  setActiveSource(image.src);
                }}
              >
                <img
                  className="case-gallery-image"
                  src={image.src}
                  alt={image.alt || `Imagem do projeto ${projectTitle}`}
                  width={image.width || 1600}
                  height={image.height || 1000}
                  loading="lazy"
                  onError={() => markImageFailed(image.src)}
                />
              </button>
            )}
            {image.caption && <figcaption className="case-gallery-caption">{image.caption}</figcaption>}
          </figure>
        ))}
      </div>

      <dialog
        className="case-lightbox"
        ref={dialogRef}
        aria-labelledby={`${id}-lightbox-title`}
        aria-describedby={`${id}-caption ${id}-position`}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={closeOnBackdrop}
        onKeyDown={handleKeyboard}
      >
        {activeImage && (
          <div className="case-lightbox-inner">
            <div className="case-lightbox-topline">
              <h2 id={`${id}-lightbox-title`}>{projectTitle}</h2>
              <button className="dialog-close" type="button" ref={closeRef} onClick={close} aria-label="Fechar imagem ampliada">
                <Icon name="close" />
              </button>
            </div>
            <figure>
              <img
                className="case-lightbox-image"
                src={activeImage.src}
                alt={activeImage.alt || `Imagem do projeto ${projectTitle}`}
                width={activeImage.width || 1600}
                height={activeImage.height || 1000}
                loading="lazy"
                onError={() => markImageFailed(activeImage.src)}
              />
              <figcaption className="case-gallery-caption" id={`${id}-caption`}>
                {activeImage.caption || activeImage.alt}
              </figcaption>
            </figure>
            <div className="case-lightbox-navigation">
              {availableImages.length > 1 && (
                <button className="dialog-nav-button" type="button" onClick={() => navigate(-1)}>
                  <Icon name="arrow-left" /> Imagem anterior
                </button>
              )}
              <p id={`${id}-position`} role="status" aria-live="polite" aria-atomic="true">
                Imagem {position + 1} de {availableImages.length}
              </p>
              {availableImages.length > 1 && (
                <button className="dialog-nav-button" type="button" onClick={() => navigate(1)}>
                  Próxima imagem <Icon name="arrow-right" />
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
