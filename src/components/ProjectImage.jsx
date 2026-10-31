import { useState } from 'react';
import { PROJECT_IMAGE_FALLBACK } from '../utils/formatRepository.js';

export default function ProjectImage({ project, width = 1200, height = 1500, className, loading = 'lazy' }) {
  const [failedSource, setFailedSource] = useState(null);
  const usingFallback = failedSource === project.image;

  return (
    <img
      className={className}
      src={usingFallback ? PROJECT_IMAGE_FALLBACK : project.image}
      srcSet={usingFallback ? undefined : project.imageSrcSet}
      sizes={project.imageSrcSet && !usingFallback ? '(max-width: 700px) calc(100vw - 44px), (max-width: 1100px) 46vw, 700px' : undefined}
      decoding="async"
      alt={usingFallback
        ? `Composição abstrata usada como capa de ${project.title}`
        : project.imageAlt ?? `Imagem de apresentação de ${project.title}`}
      width={width}
      height={height}
      loading={loading}
      onError={() => {
        if (!usingFallback) setFailedSource(project.image);
      }}
    />
  );
}
