interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  style?: any;
}

export const SketchFolderIcon = ({ size = 26, color = '#ffd54f', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(-2deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    <path
      d="M 3.5 7 C 3.5 5.5, 4.5 4.5, 6 4.5 L 9.5 4.5 C 10.8 4.5, 11.5 5.2, 12.2 6.2 L 13.2 7.5 L 18 7.5 C 19.5 7.5, 20.5 8.5, 20.5 10 L 20.5 17.5 C 20.5 19, 19.5 20, 18 20 L 6 20 C 4.5 20, 3.5 19, 3.5 17.5 Z"
      fill={color}
    />
  </svg>
);

export const SketchPinIcon = ({ size = 26, color = 'var(--accent)', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(6deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    <path
      d="M 9 4 L 15 4 C 15.5 4, 16 4.8, 15.4 5.8 L 14.2 9 L 16.8 12 C 17.3 12.6, 16.8 13.5, 15.8 13.5 L 8.2 13.5 C 7.2 13.5, 6.7 12.6, 7.2 12 L 9.8 9 L 8.6 5.8 C 8 4.8, 8.5 4, 9 4 Z"
      fill={color}
    />
    <line x1="12" y1="13.5" x2="12" y2="21" strokeWidth="3" />
  </svg>
);

export const SketchBoardIcon = ({ size = 26, color = '#bbdefb', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(1deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    <rect x="3" y="3" width="18" height="18" rx="3" fill={color} />
    <line x1="9" y1="3" x2="9" y2="21" strokeWidth="2" />
    <line x1="15" y1="3" x2="15" y2="21" strokeWidth="2" />
    <rect x="5.5" y="6" width="1.8" height="5" fill="var(--fg)" />
    <rect x="11.5" y="6" width="1.8" height="8" fill="var(--fg)" />
    <rect x="17.5" y="6" width="1.8" height="4" fill="var(--fg)" />
  </svg>
);

export const SketchClipboardIcon = ({ size = 26, color = '#d7ccc8', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(-2deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* Clipboard Base */}
    <rect x="4" y="4" width="16" height="18" rx="2" fill={color} />
    {/* Paper Sheet */}
    <rect x="6.5" y="7" width="11" height="13" rx="1" fill="#ffffff" strokeWidth="1.8" />
    {/* Lines on Paper */}
    <line x1="8.5" y1="10.5" x2="15.5" y2="10.5" strokeWidth="2" />
    <line x1="8.5" y1="13.5" x2="14" y2="13.5" strokeWidth="2" />
    <line x1="8.5" y1="16.5" x2="15.5" y2="16.5" strokeWidth="2" />
    {/* Top Metallic Clip */}
    <path d="M 8 4.5 C 8 3, 9.5 2, 12 2 C 14.5 2, 16 3, 16 4.5 Z" fill="#78909c" />
    <circle cx="12" cy="4" r="1" fill="#2d2d2d" />
  </svg>
);

export const SketchSparklesIcon = ({ size = 26, color = '#ffd54f', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(4deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* Big Sparkle */}
    <path
      d="M 12 2 Q 12 8 18 8 Q 12 8 12 14 Q 12 8 6 8 Q 12 8 12 2 Z"
      fill={color}
    />
    {/* Small Sparkle Top Left */}
    <path
      d="M 5 15 Q 5 18 8 18 Q 5 18 5 21 Q 5 18 2 18 Q 5 18 5 15 Z"
      fill="#ffb74d"
      strokeWidth="1.8"
    />
    {/* Small Sparkle Bottom Right */}
    <path
      d="M 19 14 Q 19 16.5 21.5 16.5 Q 19 16.5 19 19 Q 19 16.5 16.5 16.5 Q 19 16.5 19 14 Z"
      fill="#ff8a80"
      strokeWidth="1.8"
    />
  </svg>
);

export const SketchPencilIcon = ({ size = 26, color = '#ffb74d', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(-8deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* Eraser */}
    <path d="M 16.5 3.5 L 20.5 7.5 L 18.5 9.5 L 14.5 5.5 Z" fill="#ff8a80" />
    {/* Ferrule */}
    <path d="M 14.5 5.5 L 18.5 9.5 L 16.5 11.5 L 12.5 7.5 Z" fill="#cfd8dc" />
    {/* Body */}
    <path d="M 12.5 7.5 L 16.5 11.5 L 8.5 19.5 L 4.5 15.5 Z" fill={color} />
    <line x1="10.5" y1="9.5" x2="6.5" y2="17.5" strokeWidth="1.5" opacity="0.6" />
    {/* Wood Tip */}
    <path d="M 4.5 15.5 L 8.5 19.5 L 3 21 Z" fill="#ffe0b2" />
    {/* Lead Point */}
    <path d="M 4.2 19.8 L 3 21 L 4.2 18.6 Z" fill="#2d2d2d" />
  </svg>
);

export const SketchCalendarIcon = ({ size = 26, color = '#ff4d4d', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(-1deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* Calendar Body */}
    <rect x="3.5" y="5" width="17" height="16.5" rx="2.5" fill="#ffffff" />
    {/* Top Header Bar */}
    <path d="M 3.5 7.5 C 3.5 6, 4.5 5, 6 5 L 18 5 C 19.5 5, 20.5 6, 20.5 7.5 L 20.5 9.5 L 3.5 9.5 Z" fill={color} />
    {/* Binder Rings */}
    <line x1="7.5" y1="3" x2="7.5" y2="6.5" strokeWidth="2.8" />
    <line x1="16.5" y1="3" x2="16.5" y2="6.5" strokeWidth="2.8" />
    {/* Grid Dots / Small Squares */}
    <rect x="7" y="12.5" width="2" height="2" rx="0.5" fill="var(--fg)" />
    <rect x="11" y="12.5" width="2" height="2" rx="0.5" fill="var(--fg)" />
    <rect x="15" y="12.5" width="2" height="2" rx="0.5" fill="var(--fg)" />
    <rect x="7" y="16.5" width="2" height="2" rx="0.5" fill="var(--fg)" />
    <rect x="11" y="16.5" width="2" height="2" rx="0.5" fill="#ffd54f" strokeWidth="2" />
    <rect x="15" y="16.5" width="2" height="2" rx="0.5" fill="var(--fg)" />
  </svg>
);

export const SketchListIcon = ({ size = 26, color = '#ffffff', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(2deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* Paper Sheet */}
    <path d="M 4 3.5 L 15 3.5 L 20 8.5 L 20 20.5 C 20 21.5, 19 22.5, 18 22.5 L 6 22.5 C 5 22.5, 4 21.5, 4 20.5 Z" fill={color} />
    {/* Folded Corner */}
    <path d="M 15 3.5 L 15 8.5 L 20 8.5" fill="#e0e0e0" strokeWidth="2" />
    {/* Checkbox 1 & Line */}
    <rect x="7" y="8" width="3" height="3" rx="0.5" fill="#fff9c4" strokeWidth="1.8" />
    <line x1="12" y1="9.5" x2="17" y2="9.5" strokeWidth="2" />
    {/* Checkbox 2 & Line */}
    <rect x="7" y="13" width="3" height="3" rx="0.5" strokeWidth="1.8" />
    <path d="M 7.5 14.5 L 8.5 15.5 L 10 13.5" stroke="var(--accent)" strokeWidth="2" />
    <line x1="12" y1="14.5" x2="17.5" y2="14.5" strokeWidth="2" />
    {/* Checkbox 3 & Line */}
    <rect x="7" y="18" width="3" height="3" rx="0.5" strokeWidth="1.8" />
    <line x1="12" y1="19.5" x2="16" y2="19.5" strokeWidth="2" />
  </svg>
);

export const SketchRobotIcon = ({ size = 26, color = '#80deea', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(-2deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* Antenna Stem */}
    <line x1="12" y1="2" x2="12" y2="6" strokeWidth="2.5" />
    {/* Antenna Bulb */}
    <circle cx="12" cy="2" r="1.8" fill="#ff4d4d" strokeWidth="1.8" />
    {/* Side Ears / Bolts */}
    <rect x="2" y="10.5" width="2.5" height="4" rx="1" fill="#ffb74d" />
    <rect x="19.5" y="10.5" width="2.5" height="4" rx="1" fill="#ffb74d" />
    {/* Head Box */}
    <rect x="4" y="6" width="16" height="14" rx="3" fill={color} />
    {/* Eyes */}
    <circle cx="8.5" cy="11" r="2.2" fill="#ffffff" strokeWidth="1.8" />
    <circle cx="8.5" cy="11" r="0.9" fill="#2d2d2d" />
    <circle cx="15.5" cy="11" r="2.2" fill="#ffffff" strokeWidth="1.8" />
    <circle cx="15.5" cy="11" r="0.9" fill="#2d2d2d" />
    {/* Mouth Box */}
    <rect x="8" y="15.5" width="8" height="2.8" rx="1" fill="#ffffff" strokeWidth="1.6" />
    <line x1="10.7" y1="15.5" x2="10.7" y2="18.3" strokeWidth="1.4" />
    <line x1="13.3" y1="15.5" x2="13.3" y2="18.3" strokeWidth="1.4" />
  </svg>
);

export const SketchHumanIcon = ({ size = 26, color = '#c8e6c9', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(2deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* Head */}
    <circle cx="12" cy="7.5" r="4" fill={color} />
    {/* Torso */}
    <path d="M 4.5 20 C 4.5 15.5, 8 13.5, 12 13.5 C 16 13.5, 19.5 15.5, 19.5 20 Z" fill={color} />
  </svg>
);

export const SketchWorkspaceIcon = ({ size = 32, color = '#fff9c4', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(-2deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* Workspace Window Base */}
    <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" fill="#ffffff" />
    {/* Top Header Bar */}
    <line x1="3.5" y1="8" x2="20.5" y2="8" strokeWidth="2" />
    {/* Window Dots */}
    <circle cx="6" cy="5.8" r="0.7" fill="#ff4d4d" stroke="none" />
    <circle cx="8" cy="5.8" r="0.7" fill="#ffd54f" stroke="none" />
    <circle cx="10" cy="5.8" r="0.7" fill="#a5d6a7" stroke="none" />
    {/* Left Postit Note Card */}
    <rect x="5.5" y="10.5" width="5.5" height="4.5" rx="1" fill={color} strokeWidth="1.6" />
    {/* Right Top Line Graph / Spark */}
    <path d="M 13.5 14.5 L 15.5 11.5 L 17.5 13 L 18.5 10.5" stroke="var(--blue)" strokeWidth="2" />
    {/* Bottom Task Bar */}
    <rect x="5.5" y="17" width="13" height="1.8" rx="0.6" fill="#e0e0e0" strokeWidth="1.2" />
  </svg>
);

export const SketchGearIcon = ({ size = 22, color = '#cfd8dc', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(6deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* 8-Tooth Gear Path */}
    <path
      d="M 10.5 2.5 L 13.5 2.5 L 14.1 4.8 C 15 5.1, 15.8 5.6, 16.5 6.2 L 18.7 5.3 L 20.7 7.3 L 19.8 9.5 C 20.4 10.2, 20.9 11, 21.2 11.9 L 23.5 12.5 L 23.5 15.5 L 21.2 16.1 C 20.9 17, 20.4 17.8, 19.8 18.5 L 20.7 20.7 L 18.7 22.7 L 16.5 21.8 C 15.8 22.4, 15 22.9, 14.1 23.2 L 13.5 25.5 L 10.5 25.5 L 9.9 23.2 C 9 22.9, 8.2 22.4, 7.5 21.8 L 5.3 22.7 L 3.3 20.7 L 4.2 18.5 C 3.6 17.8, 3.1 17, 2.8 16.1 L 0.5 15.5 L 0.5 12.5 L 2.8 11.9 C 3.1 11, 3.6 10.2, 4.2 9.5 L 3.3 7.3 L 5.3 5.3 L 7.5 6.2 C 8.2 5.6, 9 5.1, 9.9 4.8 Z"
      fill={color}
      transform="scale(0.85) translate(2, 2)"
    />
    <circle cx="12" cy="12" r="3" fill="#ffffff" strokeWidth="2" />
  </svg>
);

export const SketchTrashIcon = ({ size = 22, color = '#ff8a80', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(-3deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* Lid Handle */}
    <path d="M 9.5 3.5 L 14.5 3.5" strokeWidth="2.5" />
    {/* Lid Rim */}
    <line x1="4" y1="6.5" x2="20" y2="6.5" strokeWidth="2.8" />
    {/* Can Body */}
    <path d="M 5.5 6.5 L 6.8 20.5 C 6.9 21.3, 7.6 22, 8.5 22 L 15.5 22 C 16.4 22, 17.1 21.3, 17.2 20.5 L 18.5 6.5 Z" fill={color} />
    {/* Vertical Rib Lines */}
    <line x1="9.5" y1="10" x2="9.5" y2="18.5" strokeWidth="1.8" />
    <line x1="12" y1="10" x2="12" y2="18.5" strokeWidth="1.8" />
    <line x1="14.5" y1="10" x2="14.5" y2="18.5" strokeWidth="1.8" />
  </svg>
);

export const SketchRocketIcon = ({ size = 26, color = '#ff8a80', className = '', style = {} }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      transform: 'rotate(-4deg)',
      filter: 'drop-shadow(1.5px 1.5px 0px var(--border))',
      ...style,
    }}
  >
    {/* Soft Warm Flame Tail */}
    <path
      d="M 8 16 C 5.5 18, 3 19.5, 1 22.5 C 4.5 21, 7 19, 10 17.5 Z"
      fill="#ffd54f"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M 8 16.5 C 6 18, 4 19.5, 2.5 21.5 C 5 20, 7 18.5, 9.5 17 Z"
      fill="#ffab91"
      stroke="none"
    />

    {/* Cute Side Fins */}
    <path d="M 8.5 13 L 5 15.5 C 4.5 14, 5.5 12, 7 11 Z" fill={color} stroke="currentColor" strokeWidth="2" />
    <path d="M 13 8.5 L 15.5 5 C 14 4.5, 12 5.5, 11 7 Z" fill={color} stroke="currentColor" strokeWidth="2" />

    {/* Cute Smooth White Rocket Body */}
    <path
      d="M 6.5 17.5 C 5.5 12, 10 6.5, 21.5 2.5 C 17.5 14, 12 18.5, 6.5 17.5 Z"
      fill="#ffffff"
      stroke="currentColor"
      strokeWidth="2.2"
    />

    {/* Pastel Red Nose Tip */}
    <path
      d="M 16.5 5 C 18.5 3.8, 20.2 2.8, 21.5 2.5 C 21.2 3.8, 20.2 5.5, 19 7.5 Z"
      fill={color}
      stroke="currentColor"
      strokeWidth="1.8"
    />

    {/* Friendly Soft Blue Porthole */}
    <circle cx="14" cy="9.5" r="2.4" fill="#bbdefb" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="14.7" cy="8.8" r="0.7" fill="#ffffff" stroke="none" />
  </svg>
);
