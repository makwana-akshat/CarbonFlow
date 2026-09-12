import React, { forwardRef, useId } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leadingIcon, trailingIcon, className = '', id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="type-label block text-[var(--text-secondary-accessible)] font-medium">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="absolute left-3 text-[var(--text-secondary)] pointer-events-none shrink-0">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full h-10 px-3.5 ${leadingIcon ? 'pl-9' : ''} ${
              trailingIcon ? 'pr-9' : ''
            } rounded-[var(--radius-chip)] bg-[var(--surface-card)] border ${
              error ? 'border-[var(--status-danger)]' : 'border-[var(--border-subtle)]'
            } text-[14px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-colors shadow-2xs disabled:opacity-40 disabled:bg-[var(--surface-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 ${className}`}
            {...props}
          />
          {trailingIcon && (
            <span className="absolute right-3 text-[var(--text-secondary)] pointer-events-none shrink-0">
              {trailingIcon}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-[12px] font-medium text-[var(--status-danger)]">{error}</p>
        ) : helperText ? (
          <p className="text-[12px] text-[var(--text-secondary)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="type-label block text-[var(--text-secondary-accessible)] font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full min-h-[90px] p-3 rounded-[var(--radius-chip)] bg-[var(--surface-card)] border ${
            error ? 'border-[var(--status-danger)]' : 'border-[var(--border-subtle)]'
          } text-[14px] text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-colors shadow-2xs disabled:opacity-40 disabled:bg-[var(--surface-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-[12px] font-medium text-[var(--status-danger)]">{error}</p>
        ) : helperText ? (
          <p className="text-[12px] text-[var(--text-secondary)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, error, className = '', id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="type-label block text-[var(--text-secondary-accessible)] font-medium">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full h-10 pl-3.5 pr-9 rounded-[var(--radius-chip)] bg-[var(--surface-card)] border ${
              error ? 'border-[var(--status-danger)]' : 'border-[var(--border-subtle)]'
            } text-[14px] text-[var(--text-primary)] appearance-none transition-colors shadow-2xs disabled:opacity-40 disabled:bg-[var(--surface-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)] absolute right-3 pointer-events-none" />
        </div>
        {error ? (
          <p className="text-[12px] font-medium text-[var(--status-danger)]">{error}</p>
        ) : helperText ? (
          <p className="text-[12px] text-[var(--text-secondary)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-start gap-2.5 text-left select-none">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          disabled={disabled}
          className={`w-4 h-4 mt-0.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--accent-primary)] accent-[var(--accent-primary)] transition-all disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-1 focus:ring-offset-[var(--bg)] ${className}`}
          {...props}
        />
        {(label || description) && (
          <label htmlFor={inputId} className="cursor-pointer">
            {label && <span className="text-[14px] font-medium text-[var(--text-primary)] block">{label}</span>}
            {description && <span className="text-[12px] text-[var(--text-secondary)] block mt-0.5">{description}</span>}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, description, className = '', id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-start gap-2.5 text-left select-none">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          disabled={disabled}
          className={`w-4 h-4 mt-0.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--accent-primary)] accent-[var(--accent-primary)] transition-all disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-1 focus:ring-offset-[var(--bg)] ${className}`}
          {...props}
        />
        {(label || description) && (
          <label htmlFor={inputId} className="cursor-pointer">
            {label && <span className="text-[14px] font-medium text-[var(--text-primary)] block">{label}</span>}
            {description && <span className="text-[12px] text-[var(--text-secondary)] block mt-0.5">{description}</span>}
          </label>
        )}
      </div>
    );
  }
);
RadioButton.displayName = 'RadioButton';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-3 text-left select-none ${className}`}>
      {(label || description) && (
        <div>
          {label && <span className="text-[14px] font-medium text-[var(--text-primary)] block">{label}</span>}
          {description && <span className="text-[12px] text-[var(--text-secondary)] block mt-0.5">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-40 ${
          checked ? 'bg-[var(--accent-primary)]' : 'bg-[var(--surface-muted)] border border-[var(--border-subtle)]'
        }`}
      >
        <span
          className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        label={label}
        error={error}
        trailingIcon={<Calendar className="w-4 h-4 pointer-events-none" />}
        className={`cursor-pointer ${className}`}
        {...props}
      />
    );
  }
);
DatePicker.displayName = 'DatePicker';
