// Stand-in for the American College of Lifestyle Medicine's real logo.
// ACLM's own usage policy requires explicit written permission before
// displaying their logo anywhere (lifestylemedicine.zendesk.com/hc/en-us/
// articles/32762262901147-Can-I-use-the-ACLM-logo) — this project doesn't
// have that, so a real ACLM mark isn't included here. This renders a
// simple leaf/droplet glyph instead, in whatever color the caller sets via
// CSS `color` (fill defaults to currentColor). Swap the <path> below for
// ACLM's actual mark once permission is granted — every caller (see
// QuestionScreen.jsx's progress bar) only ever sets a color on the
// wrapping element, never touches this shape directly, so nothing else
// needs to change.
function AclmMarkPlaceholder({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path
        d="M12 2C8 6 4 10 4 15a8 8 0 0 0 16 0c0-5-4-9-8-13Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default AclmMarkPlaceholder
