type Props = {
  className?: string;
  tone?: "light" | "dark";
};

/**
 * Custom architectural wordmark based strictly on the letters M · H · I.
 * Pure typographic geometry with a subtle turquoise molecular bridge in the H.
 */
export function LogoMark({ className = "h-5 w-auto", tone = "light" }: Props) {
  const ink = tone === "light" ? "#FFFFFF" : "#0B1220";
  const accent = tone === "light" ? "#19E6D4" : "#0E8F86";
  return (
    <svg
      viewBox="0 0 74 28"
      fill="none"
      className={className}
      role="img"
      aria-label="MHI"
    >
      {/* M — precision architectural strokes */}
      <path
        d="M2 24V4H5.8L15 17.8L24.2 4H28V24H24.2V10.5L16.2 22.2H13.8L5.8 10.5V24H2Z"
        fill={ink}
        className="transition-colors duration-300"
      />
      {/* H — vertical stems + molecular crossbar */}
      <path
        d="M35.5 4H39.4V24H35.5V4ZM52.6 4H56.5V24H52.6V4Z"
        fill={ink}
        className="transition-colors duration-300"
      />
      <rect
        x="39.4"
        y="12.4"
        width="13.2"
        height="3.1"
        rx="1"
        fill={accent}
        className="transition-colors duration-300"
      />
      {/* I — clean monolith stem with apex */}
      <rect
        x="64"
        y="9"
        width="4"
        height="15"
        fill={ink}
        className="transition-colors duration-300"
      />
      <rect
        x="64"
        y="4"
        width="4"
        height="3.2"
        rx="0.8"
        fill={accent}
        className="transition-colors duration-300"
      />
    </svg>
  );
}
