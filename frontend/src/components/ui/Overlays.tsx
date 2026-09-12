import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key & trap focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Dialog Panel */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
            className={`relative w-full ${maxWidthClasses} rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] overflow-hidden z-10`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)]">
              <h2 id="modal-title" className="text-[17px] font-semibold text-[var(--text-primary)]">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-left">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="p-4 sm:px-6 bg-[var(--surface-muted)]/50 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      const selectedItem = items[focusedIndex];
      if (!selectedItem.disabled) {
        onSelect(selectedItem);
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left" onKeyDown={handleKeyDown}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-2 w-56 rounded-[var(--radius-card)] bg-[var(--surface-card)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] p-1.5 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <div role="menu" className="space-y-0.5">
              {items.map((item, idx) => {
                const isFocused = idx === focusedIndex;
                return (
                  <button
                    key={item.id}
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      onSelect(item);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-[var(--radius-chip)] text-[13px] transition-colors disabled:opacity-40 disabled:pointer-events-none ${
                      item.danger
                        ? 'text-[var(--status-danger)] hover:bg-[#E5484D]/10'
                        : isFocused
                        ? 'bg-[var(--surface-muted)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary-accessible)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
