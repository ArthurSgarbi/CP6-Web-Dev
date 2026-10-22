export default function ProjectSkeleton({ index = 0 }) {
  return (
    <div className={`study study-0${index % 4 + 1} project-skeleton`} aria-hidden="true">
      <div className="study-image-wrap skeleton-image" />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-short" />
    </div>
  );
}
