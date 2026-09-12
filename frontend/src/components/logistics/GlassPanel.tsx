import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface GlassPanelProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  collapsedIcon: React.ReactNode;
  collapsedPosition: 'left' | 'right' | 'top-right';
  defaultCollapsed?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  hasWarningBadge?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  title,
  subtitle,
  badge,
  collapsedIcon,
  collapsedPosition,
  defaultCollapsed = false,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  hasWarningBadge = false,
  className = '',
  children,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Sync with defaultCollapsed if it changes (e.g. when shipment resets)
  useEffect(() => {
    setInternalCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapse = (collapsed: boolean) => {
    if (onToggleCollapse) {
      onToggleCollapse(collapsed);
    } else {
      setInternalCollapsed(collapsed);
    }
  };

  const getPositionAlignment = () => {
    switch (collapsedPosition) {
      case 'left':
        return 'self-start items-start';
      case 'right':
      case 'top-right':
        return 'self-end items-end';
      default:
        return 'self-start items-start';
    }
  };

  const transitionConfig = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: 'easeInOut' as const };

  return (
    <div className={`flex flex-col ${getPositionAlignment()} pointer-events-auto`}>
      <AnimatePresence mode="wait" initial={false}>
        {isCollapsed ? (
          /* COLLAPSED CIRCULAR ICON BUTTON (~44px) */
          <motion.button
            key="collapsed-icon"
            onClick={() => handleCollapse(false)}
            className="relative w-11 h-11 rounded-full border border-black/[0.08] bg-white/92 backdrop-blur-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer group shrink-0"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            }}
            title={`Expand ${title}`}
            aria-label={`Expand ${title} panel`}
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={transitionConfig}
          >
            <div className="text-[#F4611E] group-hover:scale-110 transition-transform">
              {collapsedIcon}
            </div>

            {/* Pulsing Warning Badge if active advisory */}
            {hasWarningBadge && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5A623] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F5A623] ring-2 ring-white" />
              </span>
            )}
          </motion.button>
        ) : (
          /* FULL EXPANDED FLOATING LIGHT PANEL */
          <motion.div
            key="expanded-panel"
            className={`rounded-2xl border border-black/[0.08] p-3.5 sm:p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${className}`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderColor: 'rgba(0, 0, 0, 0.08)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            }}
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={transitionConfig}
          >
            {/* Header with Title, Subtitle, Badges, and Close Button */}
            <div className="flex items-start justify-between gap-2.5 mb-2.5 pb-2 border-b border-gray-100">
              <div className="min-w-0 flex-1">
                {subtitle && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-0.5">
                    {subtitle}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] sm:text-[14px] font-bold text-gray-900 tracking-tight truncate">
                    {title}
                  </h3>
                  {badge && <div>{badge}</div>}
                </div>
              </div>

              {/* Close Button (×) */}
              <button
                onClick={() => handleCollapse(true)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors shrink-0 -mr-1 -mt-0.5"
                title={`Collapse ${title}`}
                aria-label={`Collapse ${title} panel`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Children Content */}
            <div className="w-full">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlassPanel;
