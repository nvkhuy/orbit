import { useState, useRef, useEffect } from 'preact/hooks';
import { SketchCalendarIcon } from './SketchIcons';

interface SketchDatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  placeholder?: string;
  style?: any;
  className?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function SketchDatePicker({
  value = '',
  onChange,
  placeholder = 'dd/mm/yyyy',
  style = {},
  className = '',
}: SketchDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Parse initial view date
  const parsedDate = value && !isNaN(Date.parse(value)) ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsedDate.getMonth()); // 0-indexed

  // Synchronize view year & month when value changes
  useEffect(() => {
    if (value && !isNaN(Date.parse(value))) {
      const d = new Date(value + 'T00:00:00');
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = (e: MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e: MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const monthStr = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formatted = `${viewYear}-${monthStr}-${dayStr}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  const handleSelectToday = (e: MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    const year = today.getFullYear();
    const monthStr = String(today.getMonth() + 1).padStart(2, '0');
    const dayStr = String(today.getDate()).padStart(2, '0');
    const formatted = `${year}-${monthStr}-${dayStr}`;
    setViewYear(year);
    setViewMonth(today.getMonth());
    onChange(formatted);
    setIsOpen(false);
  };

  // Calendar math
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday

  // Format display text (e.g. "2026-08-15" or user's preference)
  const displayValue = value ? value : '';

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', width: '100%', ...style }} class={className}>
      {/* Trigger Button */}
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
          justifyContent: 'space-between',
          cursor: 'pointer',
          padding: '0.35rem 0.6rem',
          fontSize: '0.95rem',
          backgroundColor: '#ffffff',
          userSelect: 'none',
          gap: '0.5rem',
          textAlign: 'left',
          width: '100%',
        }}
      >
        <span style={{ color: displayValue ? 'var(--fg)' : 'rgba(45, 45, 45, 0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayValue || placeholder}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {value && (
            <span
              onClick={handleClear}
              title="Clear date"
              style={{
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'var(--accent)',
                fontWeight: 'bold',
                padding: '0 0.2rem',
              }}
            >
              ✕
            </span>
          )}
          <SketchCalendarIcon size={20} color="#ff4d4d" />
        </div>
      </button>

      {/* Sketch Calendar Popover */}
      {isOpen && (
        <div
          class="wobbly-border-sm"
          style={{
            position: 'absolute',
            top: '105%',
            left: 0,
            width: '270px',
            backgroundColor: '#fdfbf7',
            backgroundImage: 'var(--paper-dots)',
            backgroundSize: '24px 24px',
            boxShadow: 'var(--shadow)',
            zIndex: 10000,
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {/* Calendar Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              class="sketch-button secondary"
              onClick={handlePrevMonth}
              style={{ padding: '0.1rem 0.5rem', fontSize: '1rem', lineHeight: '1' }}
            >
              ‹
            </button>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              class="sketch-button secondary"
              onClick={handleNextMonth}
              style={{ padding: '0.1rem 0.5rem', fontSize: '1rem', lineHeight: '1' }}
            >
              ›
            </button>
          </div>

          {/* Days of Week Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '2px' }}>
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--blue)', fontWeight: 'bold' }}>
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
            {/* Empty slots for days before 1st of month */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const monthStr = String(viewMonth + 1).padStart(2, '0');
              const dayStr = String(dayNum).padStart(2, '0');
              const dateStr = `${viewYear}-${monthStr}-${dayStr}`;
              const isSelected = value === dateStr;

              const today = new Date();
              const isToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === dayNum;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  style={{
                    padding: '0.3rem 0',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid var(--border)' : isToday ? '1px dashed var(--accent)' : '1px solid transparent',
                    backgroundColor: isSelected ? '#fff9c4' : 'transparent',
                    fontWeight: isSelected || isToday ? 'bold' : 'normal',
                    color: isSelected ? 'var(--fg)' : 'var(--fg)',
                    transition: 'all 0.1s ease',
                    boxShadow: isSelected ? '2px 2px 0px var(--border)' : 'none',
                    transform: isSelected ? 'rotate(-1deg)' : 'none',
                  }}
                  onMouseEnter={(e: any) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--muted)';
                  }}
                  onMouseLeave={(e: any) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px dashed var(--border)' }}>
            <button
              type="button"
              onClick={handleSelectToday}
              style={{ background: 'none', border: 'none', color: 'var(--blue)', fontFamily: 'var(--font-heading)', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
