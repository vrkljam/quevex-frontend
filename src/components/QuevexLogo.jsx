export function QuevexLogo({ size = 64, className = "", showText = true }) {
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const wordmarkStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const textStyle = {
    fontWeight: "bold",
    fontSize: `${size * 0.35}px`,
    letterSpacing: "-0.02em",
    lineHeight: 1,
    // Apply the gradient color scheme to the word "Quevex"
    background: "linear-gradient(90deg, #0D9488 0%, #14B8A6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textFillColor: "transparent",
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Logo Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Queue elements (stacked nodes) transforming into arrow */}

        {/* First node - deep sea teal with 0.6 opacity */}
        <circle cx="20" cy="30" r="5" fill="#0D9488" opacity="0.6" />
        <rect
          x="28"
          y="27"
          width="15"
          height="6"
          rx="3"
          fill="#0D9488"
          opacity="0.6"
        />

        {/* Second node - turquoise teal with 0.8 opacity */}
        <circle cx="20" cy="50" r="5" fill="#14B8A6" opacity="0.8" />
        <rect
          x="28"
          y="47"
          width="25"
          height="6"
          rx="3"
          fill="#14B8A6"
          opacity="0.8"
        />

        {/* Third node - electric cyan bottom accent */}
        <circle cx="20" cy="70" r="5" fill="#06B6D4" />
        <rect x="28" y="67" width="35" height="6" rx="3" fill="#06B6D4" />

        {/* Arrow formation - representing execution and forward motion */}
        <path
          d="M 55 50 L 85 50 L 85 40 L 95 55 L 85 70 L 85 60 L 55 60 Z"
          fill="url(#teal-gradient)"
        />

        {/* Connecting lines showing transformation */}
        <line
          x1="25"
          y1="30"
          x2="55"
          y2="45"
          stroke="#0D9488"
          strokeWidth="1.5"
          opacity="0.3"
        />
        <line
          x1="25"
          y1="70"
          x2="55"
          y2="55"
          stroke="#06B6D4"
          strokeWidth="1.5"
          opacity="0.3"
        />

        <defs>
          <linearGradient id="teal-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D9488" /> {/* Deep Sea Teal */}
            <stop offset="100%" stopColor="#14B8A6" /> {/* Bright Turquoise */}
          </linearGradient>
        </defs>
      </svg>

      {/* Wordmark */}
      {showText && (
        <div style={wordmarkStyle}>
          <span style={textStyle}>Quevex</span>
        </div>
      )}
    </div>
  );
}
