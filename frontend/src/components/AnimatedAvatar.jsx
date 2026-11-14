import './AnimatedAvatar.css';

/*
  Avatars animés en SVG + CSS (aucune dépendance, aucune image).
  Utilisation :  <AnimatedAvatar id="a3" size={96} />
  - `id` correspond à l'id de l'avatar renvoyé par le backend (a1…a6) ou à une clé (rocket, fox…).
  - `still` désactive l'animation (ex. pour les listes très longues).
  Pour ajouter un avatar : ajouter une entrée dans ART + un alias dans ALIASES.
*/

const ART = {
  rocket: (
    <g className="av-float">
      <g className="av-flame"><path d="M42 74 Q50 98 58 74 Z" fill="#ffb703" /><path d="M45 74 Q50 90 55 74 Z" fill="#ff6b35" /></g>
      <path d="M50 8 C68 20 70 50 64 76 H36 C30 50 32 20 50 8Z" fill="#f1f3f9" />
      <path d="M50 8 C58 14 63 22 65 32 H35 C37 22 42 14 50 8Z" fill="#e63946" />
      <circle cx="50" cy="46" r="9" fill="#1b1f3b" /><circle cx="50" cy="46" r="6" fill="#7dd3fc" />
      <path d="M36 62 L22 80 L38 74Z M64 62 L78 80 L62 74Z" fill="#e63946" />
    </g>
  ),
  astronaut: (
    <g className="av-float">
      <g className="av-wave"><rect x="66" y="52" width="9" height="22" rx="4.5" fill="#e8ebf5" /></g>
      <rect x="25" y="52" width="9" height="22" rx="4.5" fill="#e8ebf5" />
      <rect x="32" y="50" width="36" height="32" rx="12" fill="#f1f3f9" />
      <rect x="44" y="60" width="12" height="9" rx="2" fill="#e63946" />
      <circle cx="50" cy="32" r="22" fill="#f1f3f9" />
      <rect x="35" y="22" width="30" height="22" rx="11" fill="#1b1f3b" />
      <path d="M40 28 Q44 25 48 27" stroke="#7dd3fc" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <g className="av-eye"><circle cx="45" cy="34" r="2" fill="#fff" /><circle cx="55" cy="34" r="2" fill="#fff" /></g>
    </g>
  ),
  fox: (
    <g className="av-float">
      <path className="av-tail" d="M72 70 Q96 64 90 40 Q82 56 68 60Z" fill="#ff8a3d" />
      <path d="M16 14 L38 30 L22 44Z M84 14 L62 30 L78 44Z" fill="#ff8a3d" />
      <path d="M20 20 L33 30 L24 38Z M80 20 L67 30 L76 38Z" fill="#3b2a24" />
      <path d="M14 50 Q50 20 86 50 Q80 86 50 90 Q20 86 14 50Z" fill="#ff8a3d" />
      <path d="M22 58 Q50 54 78 58 Q70 84 50 88 Q30 84 22 58Z" fill="#fff" />
      <g className="av-eye"><circle cx="37" cy="52" r="4.5" fill="#1b1f3b" /><circle cx="63" cy="52" r="4.5" fill="#1b1f3b" /></g>
      <path d="M45 66 H55 L50 72Z" fill="#1b1f3b" />
    </g>
  ),
  owl: (
    <g className="av-float">
      <g className="av-flap-l"><path d="M20 50 Q8 66 22 82 Q30 70 30 56Z" fill="#8b5e3c" /></g>
      <g className="av-flap-r"><path d="M80 50 Q92 66 78 82 Q70 70 70 56Z" fill="#8b5e3c" /></g>
      <path d="M24 22 L36 30 H64 L76 22 V50 Q76 88 50 90 Q24 88 24 50Z" fill="#a9744a" />
      <ellipse cx="50" cy="72" rx="16" ry="14" fill="#f3d9b5" />
      <circle cx="38" cy="44" r="12" fill="#fff" /><circle cx="62" cy="44" r="12" fill="#fff" />
      <g className="av-eye"><circle cx="38" cy="44" r="5.5" fill="#1b1f3b" /><circle cx="62" cy="44" r="5.5" fill="#1b1f3b" /></g>
      <path d="M45 54 H55 L50 62Z" fill="#f5b82e" />
    </g>
  ),
  robot: (
    <g className="av-float">
      <line x1="50" y1="8" x2="50" y2="22" stroke="#6b7185" strokeWidth="3" />
      <circle className="av-pulse" cx="50" cy="8" r="5" fill="#e63946" />
      <rect x="22" y="22" width="56" height="44" rx="14" fill="#cfd5e6" />
      <rect x="29" y="30" width="42" height="26" rx="9" fill="#1b1f3b" />
      <g className="av-eye"><circle cx="41" cy="42" r="5" fill="#5eead4" /><circle cx="59" cy="42" r="5" fill="#5eead4" /></g>
      <path d="M42 51 Q50 56 58 51" stroke="#5eead4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="32" y="70" width="36" height="22" rx="8" fill="#e63946" />
      <g className="av-wave"><rect x="72" y="70" width="8" height="18" rx="4" fill="#cfd5e6" /></g>
      <rect x="20" y="70" width="8" height="18" rx="4" fill="#cfd5e6" />
    </g>
  ),
  brain: (
    <g className="av-float">
      <path className="av-pulse" d="M50 18 C36 8 16 18 20 36 C8 42 12 62 26 64 C28 80 46 86 50 78 C54 86 72 80 74 64 C88 62 92 42 80 36 C84 18 64 8 50 18Z" fill="#ff8fab" />
      <path d="M50 20 V78 M30 38 Q40 42 50 38 M70 38 Q60 42 50 38 M32 56 Q42 60 50 56 M68 56 Q58 60 50 56" stroke="#e0568f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <g className="av-eye"><circle cx="38" cy="48" r="3.5" fill="#1b1f3b" /><circle cx="62" cy="48" r="3.5" fill="#1b1f3b" /></g>
      <g className="av-spark"><path d="M86 12 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#f5b82e" /></g>
    </g>
  ),
};

const ALIASES = { a1: 'rocket', a2: 'astronaut', a3: 'fox', a4: 'owl', a5: 'robot', a6: 'brain' };
export const hasAnimatedAvatar = (id) => !!ART[ALIASES[id] || id];
export const AVATAR_KEYS = Object.keys(ART);

export default function AnimatedAvatar({ id, size = 80, still = false, label, className = '' }) {
  const art = ART[ALIASES[id] || id] || ART.robot;
  return (
    <svg
      className={`av ${still ? 'av-still' : ''} ${className}`}
      width={size} height={size} viewBox="0 0 100 100"
      role="img" aria-label={label || 'Avatar'}
    >
      {art}
    </svg>
  );
}
