import { useState, useRef, useEffect } from 'preact/hooks';

export interface Option {
  value: string;
  label: string;
}

interface SketchSelectProps {
  value: string;
  options: Option[];
  onChange: (val: string) => void;
  placeholder?: string;
  style?: any;
  className?: string;
  bgColor?: string;
}

export default function SketchSelect({ 
  value, 
  options, 
  onChange, 
  placeholder = 'Select...', 
  style = {}, 
  className = '',
  bgColor
}: SketchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value) || { value: '', label: placeholder };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', minWidth: '110px', ...style }} class={className}>
      <button
        type="button"
        class="sketch-input"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          cursor: 'pointer',
          padding: '0.25rem 0.6rem',
          fontSize: '0.9rem',
          backgroundColor: bgColor || '#ffffff',
          userSelect: 'none',
          gap: '0.5rem',
          textAlign: 'left',
          width: '100%',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption.label}
        </span>
        <span style={{ fontSize: '0.7rem', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}>▼</span>
      </button>

      {isOpen && (
        <div
          class="wobbly-border-sm"
          style={{
            position: 'absolute',
            top: '105%',
            left: 0,
            width: 'max-content',
            minWidth: '100%',
            maxHeight: '220px',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow)',
            zIndex: 10000,
            padding: '0.2rem 0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {options.map(opt => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '0.35rem 0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.95rem',
                  backgroundColor: isSelected ? '#fff9c4' : 'transparent',
                  color: 'var(--fg)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  gap: '0.75rem',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e: any) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--muted)';
                }}
                onMouseLeave={(e: any) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
