import { useState } from 'react';
import { PROJECT_IMAGE_FALLBACK } from '../utils/formatRepository.js';

export default function ProjectImage({ project, width = 1200, height = 1500, className, loading = 'lazy' }) {
  const [failedSource, setFailedSource] = useState(null);
  const usingFallback = failedSource === project.image;

  return (
    <img
      className={className}
      src={usingFallback ? PROJECT_IMAGE_FALLBACK : project.image}
      alt={usingFallback
        ? `Composição abstrata usada como capa de ${project.title}`
        : `Imagem de apresentação do repositório ${project.title}`}
      width={width}
      height={height}
      loading={loading}
      onError={() => {
        if (!usingFallback) setFailedSource(project.image);
      }}
    />
  );
}
