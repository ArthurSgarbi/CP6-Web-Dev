export default function Icon({ name = 'arrow-up-right', className = '', ...props }) {
  const paths = {
    'arrow-up-right': <path d="M5 19 19 5M5 5h14v14" />,
    'arrow-down': <path d="M12 3v18m-7-7 7 7 7-7" />,
    'arrow-right': <path d="M3 12h18m-7-7 7 7-7 7" />,
    'arrow-left': <path d="M21 12H3m7-7-7 7 7 7" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    plus: <path d="M12 4v16M4 12h16" />,
    spark: <path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" />,
  };

  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name] ?? paths['arrow-up-right']}
    </svg>
  );
}
