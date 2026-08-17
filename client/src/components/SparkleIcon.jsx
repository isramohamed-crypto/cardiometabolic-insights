// Four-point sparkle — a big one with a small companion, the standard
// "something insightful / generated for you" mark. Used on the Today
// page's "Habits I own" heading and its insights card. Stroke-free and
// filled with currentColor so it takes the color of whatever it sits in.
function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path
        d="M13.2 2.6c.2-.6 1-.6 1.2 0l1.2 3.4c.06.18.2.32.38.38l3.4 1.2c.6.2.6 1 0 1.2l-3.4 1.2a.66.66 0 0 0-.38.38l-1.2 3.4c-.2.6-1 .6-1.2 0l-1.2-3.4a.66.66 0 0 0-.38-.38l-3.4-1.2c-.6-.2-.6-1 0-1.2l3.4-1.2a.66.66 0 0 0 .38-.38l1.2-3.4Z"
        fill="currentColor"
      />
      <path
        d="M6.1 14.1c.14-.42.72-.42.86 0l.62 1.79c.05.13.15.23.28.28l1.79.62c.42.14.42.72 0 .86l-1.79.62a.47.47 0 0 0-.28.28l-.62 1.79c-.14.42-.72.42-.86 0l-.62-1.79a.47.47 0 0 0-.28-.28l-1.79-.62c-.42-.14-.42-.72 0-.86l1.79-.62a.47.47 0 0 0 .28-.28l.62-1.79Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  )
}

export default SparkleIcon
