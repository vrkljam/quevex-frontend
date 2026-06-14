import { useEffect, useState } from "react";

const QuevexLoader = () => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setRotation((prev) => prev + 6);
    }, 16);

    const pulseInterval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.08 : 1));
    }, 600);

    return () => {
      clearInterval(rotateInterval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "96px",
        height: "96px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 96 96"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        <circle
          cx="48"
          cy="48"
          r="44"
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="200 76"
        />
      </svg>

      <span
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#0EA5E9",
          fontFamily: "system-ui, sans-serif",
          transform: `scale(${scale})`,
          transition: "transform 0.3s ease",
          userSelect: "none",
        }}
      >
        Q
      </span>
    </div>
  );
};

export default QuevexLoader;
