import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

export interface CategoryTag {
  id: string;
  label: string;
}

export interface SearchBarProps {
  /** Input value */
  value: string;
  /** Value change callback */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Optional embedded category chips inside the pill input */
  tags?: CategoryTag[];
  /** Currently selected tag id */
  selectedTagId?: string | null;
  /** Tag selection callback */
  onSelectTag?: (tagId: string | null) => void;
  /** Clear search callback */
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  tags = [],
  selectedTagId = null,
  onSelectTag,
  onClear,
  className = '',
}) => {
  return (
    <div
      className={`w-full rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] px-3 sm:px-4 py-1.5 flex flex-wrap items-center gap-2 shadow-xs transition-shadow focus-within:shadow-[var(--shadow-card)] focus-within:border-[var(--accent-primary)] ${className}`}
    >
      <Search className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />

      {/* Embedded category chips inside pill input (Shipment / Cargo / Route style) */}
      {tags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 max-w-full py-0.5">
          {tags.map((tag) => {
            const isSelected = selectedTagId === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onSelectTag?.(isSelected ? null : tag.id)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-[var(--radius-pill)] border transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-primary)] ${
                  isSelected
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] font-semibold shadow-xs'
                    : 'bg-[var(--surface-muted)] text-[var(--text-secondary-accessible)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-neutral-300'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] bg-transparent border-none text-[14px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
      />

      {(value || selectedTagId) && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-full hover:bg-[var(--surface-muted)] transition-colors shrink-0"
          aria-label="Clear search and filters"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  isActive?: boolean;
  count?: number;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  label = 'Filter',
  isActive = false,
  count,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      className={`h-9 px-3.5 rounded-[var(--radius-pill)] border text-[13px] font-medium transition-all flex items-center gap-1.5 shadow-2xs select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${
        isActive
          ? 'bg-[var(--surface-card)] border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
          : 'bg-[var(--surface-card)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)]'
      } ${className}`}
      {...props}
    >
      <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="w-4 h-4 rounded-full bg-[var(--accent-primary)] text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
          {count}
        </span>
      )}
      <ChevronDown className="w-3 h-3 text-[var(--text-secondary)] shrink-0 opacity-70" />
    </button>
  );
};

export interface SortPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const SortPill: React.FC<SortPillProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      className={`h-9 px-3.5 rounded-[var(--radius-pill)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors flex items-center gap-1.5 shadow-2xs select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${className}`}
      {...props}
    >
      <span>{label}</span>
      <ChevronDown className="w-3 h-3 text-[var(--text-secondary)] shrink-0 opacity-70" />
    </button>
  );
};
