import React from 'react';

const SyringeVisualizer = ({ units, maxUnits = 100 }) => {
  // Clamp units between 0 and maxUnits
  const clampedUnits = Math.min(Math.max(units, 0), maxUnits);

  // Calculate plunger position
  const scaleLength = 200;
  const pixelsPerUnit = scaleLength / maxUnits;
  const liquidWidth = clampedUnits * pixelsPerUnit;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px' }}>
      <svg width="350" height="140" viewBox="0 0 350 140" style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))' }}>
        <defs>
          {/* Gradients for realistic appearance */}
          <linearGradient id="barrelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.12)" />
          </linearGradient>

          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.7)" />
          </linearGradient>

          <linearGradient id="plungerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="50%" stopColor="#374151" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>

          <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="50%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>

          {/* Reflection effect */}
          <linearGradient id="reflection" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        {/* Needle with realistic metal look */}
        <g>
          {/* Needle base (hub) */}
          <rect x="35" y="58" width="20" height="24" rx="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />

          {/* Needle shaft */}
          <polygon
            points="10,68 10,72 35,70"
            fill="url(#needleGradient)"
            stroke="#6b7280"
            strokeWidth="0.5"
          />

          {/* Needle tip */}
          <polygon
            points="8,70 10,68 10,72"
            fill="#4b5563"
          />

          {/* Needle highlight */}
          <line x1="12" y1="69" x2="33" y2="69.5" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.5" />
        </g>

        {/* Syringe barrel outer shell */}
        <rect
          x="55"
          y="45"
          width="220"
          height="50"
          rx="6"
          fill="url(#barrelGradient)"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
        />

        {/* Inner barrel (where liquid goes) */}
        <rect
          x="60"
          y="52"
          width="210"
          height="36"
          rx="3"
          fill="rgba(0, 0, 0, 0.2)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />

        {/* Measurement markings */}
        {Array.from({ length: 11 }).map((_, i) => {
          const x = 60 + (i * (scaleLength / 10));
          const isMajor = i % 2 === 0;
          return (
            <g key={i}>
              {/* Tick marks */}
              <line
                x1={x}
                y1={isMajor ? 45 : 48}
                x2={x}
                y2="52"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth={isMajor ? "1.5" : "1"}
              />
              {/* Numbers only on major marks */}
              {isMajor && (
                <text
                  x={x}
                  y="40"
                  fontSize="11"
                  fontWeight="600"
                  fill="var(--text-secondary)"
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                >
                  {i * 10}
                </text>
              )}
            </g>
          );
        })}

        {/* Liquid inside syringe */}
        {liquidWidth > 0 && (
          <g>
            <rect
              x="60"
              y="53"
              width={liquidWidth}
              height="34"
              rx="2"
              fill="url(#liquidGradient)"
            />
            {/* Liquid highlight/reflection */}
            <rect
              x="60"
              y="53"
              width={liquidWidth}
              height="12"
              rx="2"
              fill="url(#reflection)"
              opacity="0.6"
            />
            {/* Meniscus effect at the top */}
            <ellipse
              cx={60 + liquidWidth}
              cy="70"
              rx="3"
              ry="15"
              fill="rgba(59, 130, 246, 0.3)"
            />
          </g>
        )}

        {/* Glass reflection on barrel */}
        <rect
          x="58"
          y="48"
          width="214"
          height="18"
          rx="4"
          fill="url(#reflection)"
          opacity="0.3"
        />

        {/* Plunger assembly */}
        <g transform={`translate(${liquidWidth}, 0)`}>
          {/* Plunger seal (rubber stopper) */}
          <rect
            x="60"
            y="54"
            width="6"
            height="32"
            rx="1"
            fill="url(#plungerGradient)"
          />

          {/* Plunger rod */}
          <rect
            x="66"
            y="67"
            width="50"
            height="6"
            rx="3"
            fill="#6b7280"
            stroke="#4b5563"
            strokeWidth="1"
          />

          {/* Plunger thumb rest */}
          <g>
            <circle
              cx="116"
              cy="70"
              r="16"
              fill="#374151"
              stroke="#4b5563"
              strokeWidth="2"
            />
            <circle
              cx="116"
              cy="70"
              r="12"
              fill="#1f2937"
            />
            {/* Thumb grip texture */}
            <circle cx="116" cy="70" r="8" fill="none" stroke="#4b5563" strokeWidth="1" />
            <circle cx="116" cy="70" r="5" fill="none" stroke="#4b5563" strokeWidth="0.5" />
          </g>
        </g>

        {/* Finger grips on barrel */}
        <g>
          <rect x="268" y="40" width="4" height="60" rx="2" fill="rgba(255, 255, 255, 0.2)" />
          <rect x="273" y="40" width="4" height="60" rx="2" fill="rgba(255, 255, 255, 0.2)" />
        </g>
      </svg>

      {/* Display current units */}
      <div style={{
        marginTop: '20px',
        fontSize: '1.25rem',
        fontWeight: '700',
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '0.02em'
      }}>
        {clampedUnits.toFixed(1)} Units
      </div>
      <div style={{
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        marginTop: '4px'
      }}>
        Draw to this mark on your syringe
      </div>
    </div>
  );
};

export default SyringeVisualizer;
