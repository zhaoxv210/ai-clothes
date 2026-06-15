
interface MannequinProps {
  pose: 'front' | 'side'
  className?: string
}

export function Mannequin({ pose, className = '' }: MannequinProps) {
  if (pose === 'side') {
    return (
      <svg viewBox="0 0 200 500" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="120" cy="50" r="30" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
        {/* Neck */}
        <rect x="112" y="78" width="16" height="18" rx="3" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
        {/* Torso */}
        <path d="M105 96 L95 170 L100 240 L140 240 L145 170 L135 96Z" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
        {/* Arm back */}
        <path d="M105 110 L80 170 L75 220 L82 222 L88 170 L108 110Z" fill="#e0e0e0" stroke="#ccc" strokeWidth="1" />
        {/* Arm front */}
        <path d="M135 110 L150 160 L155 210 L162 208 L158 160 L142 110Z" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
        {/* Leg back */}
        <path d="M105 240 L100 330 L95 370 L90 410 L85 430 L93 432 L98 410 L103 370 L108 330 L112 240Z" fill="#e0e0e0" stroke="#ccc" strokeWidth="1" />
        {/* Leg front */}
        <path d="M130 240 L135 330 L138 370 L140 410 L142 430 L150 428 L147 410 L145 370 L142 330 L140 240Z" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 200 500" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="100" cy="45" r="30" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
      {/* Neck */}
      <rect x="92" y="73" width="16" height="18" rx="3" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
      {/* Shoulders */}
      <path d="M60 90 L140 90 L145 95 L140 100 L60 100 L55 95Z" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
      {/* Left arm */}
      <path d="M60 95 L45 140 L40 180 L48 182 L52 142 L64 100Z" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
      {/* Right arm */}
      <path d="M140 95 L155 140 L160 180 L152 182 L148 142 L136 100Z" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
      {/* Torso */}
      <path d="M75 105 L70 170 L75 245 L125 245 L130 170 L125 105Z" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
      {/* Waist */}
      <path d="M75 240 L125 240 L128 250 L72 250Z" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
      {/* Left leg */}
      <path d="M78 250 L72 340 L68 400 L65 430 L75 432 L78 400 L82 340 L88 250Z" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
      {/* Right leg */}
      <path d="M122 250 L128 340 L132 400 L135 430 L125 432 L122 400 L118 340 L112 250Z" fill="#e5e5e5" stroke="#ccc" strokeWidth="1" />
      {/* Feet */}
      <rect x="62" y="428" width="16" height="8" rx="2" fill="#e0e0e0" stroke="#ccc" strokeWidth="1" />
      <rect x="122" y="428" width="16" height="8" rx="2" fill="#e0e0e0" stroke="#ccc" strokeWidth="1" />
    </svg>
  )
}
