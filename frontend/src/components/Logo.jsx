import { useId } from 'react';

// Logo TeamiFy : étoile + équipe (5 personnes), dégradé rouge assorti à l'interface.
// Utilisation : <Logo />  |  <Logo size={48} />  |  <Logo showText={false} />
const Logo = ({ size = 36, showText = true, className = '' }) => {
  const gid = useId().replace(/:/g, '');
  return (
    <span className={`tm-logo ${className}`}>
      <svg width={size} height={size} viewBox="0 0 70 70" fill="none" role="img" aria-label="TeamiFy">
        <defs>
          <linearGradient id={`tm-${gid}`} x1="8" y1="6" x2="62" y2="66" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff6b76" />
            <stop offset="0.55" stopColor="#e63946" />
            <stop offset="1" stopColor="#a4111c" />
          </linearGradient>
        </defs>
        {/* étoile pleine */}
        <path
          d="M35.00 13.50 L41.23 25.92 L54.97 28.01 L45.08 37.78 L47.34 51.49 L35.00 45.10 L22.66 51.49 L24.92 37.78 L15.03 28.01 L28.77 25.92 Z"
          fill={`url(#tm-${gid})`}
          stroke={`url(#tm-${gid})`}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* flèche de progression */}
        <path d="M35 43.5 V31 M28.8 36.8 L35 30.6 L41.2 36.8" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* les membres de l'équipe */}
        <g fill={`url(#tm-${gid})`}>
          <circle cx="52.93" cy="9.82" r="4.6" />
          <circle cx="64.01" cy="43.93" r="4.6" />
          <circle cx="35.00" cy="65.00" r="4.6" />
          <circle cx="5.99" cy="43.93" r="4.6" />
          <circle cx="17.07" cy="9.82" r="4.6" />
        </g>
      </svg>
      {showText && (
        <span className="tm-logo-text">
          <b>T</b>eami<b>F</b>y
        </span>
      )}
    </span>
  );
};

export default Logo;
