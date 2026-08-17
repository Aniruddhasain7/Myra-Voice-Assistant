import React from "react";

const MyraAvatar = ({ state = "idle" }) => {
  const barsCount = 36;
  const bars = Array.from({ length: barsCount });

  return (
    <div className={`myra-avatar-wrapper ${state}`}>
      <div className="myra-glow"></div>

      <svg
        className="myra-svg"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#00ffff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0088ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#001133" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#00ffff" stopOpacity="0" />
            <stop offset="85%" stopColor="#00ffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="cyanBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#0077ff" />
          </linearGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="250"
          cy="250"
          r="230"
          className="hud-outer-boundary"
          stroke="rgba(0, 255, 255, 0.15)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 8"
        />

        <circle
          cx="250"
          cy="250"
          r="215"
          className="hud-ring ring-outer-cw"
          stroke="url(#cyanBlue)"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="40 20 10 20 80 30"
          filter="url(#glow)"
        />

        <circle
          cx="250"
          cy="250"
          r="195"
          className="hud-ring ring-outer-ccw"
          stroke="#00ffff"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          fill="none"
          strokeDasharray="120 40 20 40"
        />

        <g className="hud-ring ring-mid-cw">
          <circle
            cx="250"
            cy="250"
            r="175"
            stroke="rgba(0, 255, 255, 0.4)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="15 65"
            filter="url(#glow)"
          />
          <circle
            cx="250"
            cy="250"
            r="175"
            stroke="#0088ff"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="5 25 10 25"
          />
        </g>

        <g className="sound-spectrum" transform="translate(250, 250)">
          {bars.map((_, i) => {
            const angle = (i * 360) / barsCount;
            return (
              <line
                key={i}
                x1="0"
                y1="-135"
                x2="0"
                y2="-155"
                className={`spectrum-bar bar-${i % 6}`}
                stroke="#00ffff"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${angle})`}
                filter="url(#glow)"
              />
            );
          })}
        </g>

        <circle
          cx="250"
          cy="250"
          r="125"
          className="hud-ring ring-inner-ccw"
          stroke="url(#cyanBlue)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="90 30 30 30"
          filter="url(#glow)"
        />

        <circle
          cx="250"
          cy="250"
          r="100"
          className="hud-ring ring-inner-cw"
          stroke="rgba(0, 255, 255, 0.7)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="8 8 32 8"
        />

        <g className="reactor-core-group" transform="translate(250, 250)">
          <circle
            r="75"
            fill="url(#ringGlow)"
            stroke="#00ffff"
            strokeWidth="2"
            className="core-outer-ring"
            filter="url(#glow)"
          />

          <polygon
            points="0,-60 52,30 -52,30"
            fill="none"
            stroke="#00ffff"
            strokeWidth="2"
            className="core-triangle tri-1"
            filter="url(#glow)"
          />
          <polygon
            points="0,60 52,-30 -52,-30"
            fill="none"
            stroke="#0088ff"
            strokeWidth="1.5"
            className="core-triangle tri-2"
          />

          <circle
            r="42"
            fill="url(#coreGradient)"
            className="core-pulse-sphere"
            filter="url(#intenseGlow)"
          />

          <circle
            r="16"
            fill="#ffffff"
            className="core-center-light"
            filter="url(#intenseGlow)"
          />
        </g>

        <g
          className="hud-overlay-details"
          stroke="rgba(0, 255, 255, 0.3)"
          strokeWidth="1"
        >
          <line x1="250" y1="10" x2="250" y2="40" />
          <line x1="250" y1="460" x2="250" y2="490" />
          <line x1="10" y1="250" x2="40" y2="250" />
          <line x1="460" y1="250" x2="490" y2="250" />
        </g>

        <text
          x="250"
          y="420"
          textAnchor="middle"
          className="hud-status-text"
          fill="#00ffff"
          filter="url(#glow)"
        >
          {state === "idle" && "MYRA // IDLE"}
          {state === "listening" && "MYRA // LISTENING..."}
          {state === "speaking" && "MYRA // SPEAKING"}
        </text>
      </svg>
    </div>
  );
};

export default MyraAvatar;
