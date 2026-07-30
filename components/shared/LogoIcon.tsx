export const LogoIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={className}
    fill="none"
  >
    <defs>
      <linearGradient id="gear-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B00" />
        <stop offset="100%" stopColor="#FF8F3D" />
      </linearGradient>
      <linearGradient id="car-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
    
    {/* Half Gear Arc (Top) */}
    <path
      d="M15 50 A 35 35 0 0 1 85 50"
      stroke="url(#gear-grad)"
      strokeWidth="6"
      strokeLinecap="round"
      strokeDasharray="4 8"
    />
    <path
      d="M10 50 A 40 40 0 0 1 90 50"
      stroke="url(#gear-grad)"
      strokeWidth="8"
      strokeLinecap="round"
    />
    
    {/* Gear Teeth (Abstract) */}
    <path
      d="M20 20 L25 25 M50 5 L50 12 M80 20 L75 25 M15 35 L7 32 M85 35 L93 32"
      stroke="url(#gear-grad)"
      strokeWidth="5"
      strokeLinecap="round"
    />

    {/* Sports Car Silhouette */}
    <path
      d="M20 65 C 20 65, 25 50, 45 48 C 55 47, 65 52, 70 58 L 85 62 L 85 68 L 15 68 Z"
      fill="url(#car-grad)"
    />
    
    {/* Car Window / Highlights */}
    <path
      d="M45 49 C 52 48, 60 52, 65 57 L 50 57 Z"
      fill="#CBD5E1"
    />
    
    {/* Car Wheels */}
    <circle cx="30" cy="68" r="6" fill="#0F172A" stroke="#FF6B00" strokeWidth="2" />
    <circle cx="70" cy="68" r="6" fill="#0F172A" stroke="#FF6B00" strokeWidth="2" />
    
    {/* Speed Line */}
    <path
      d="M10 60 L 30 60 M5 65 L 15 65"
      stroke="#FF6B00"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);
