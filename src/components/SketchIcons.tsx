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
