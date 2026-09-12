import React from 'react';
import { ZoomIn, ZoomOut, Locate, Maximize2 } from 'lucide-react';

interface MapToolbarProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRecenter?: () => void;
}

const ToolBtn: React.FC<{
  onClick?: () => void;
  'aria-label': string;
  children: React.ReactNode;
}> = ({ onClick, 'aria-label': label, children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--text-secondary-accessible)] hover:text-[var(--ink)] hover:bg-[var(--surface-muted)] transition-colors shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
  >
    {children}
  </button>
);

export const MapToolbar: React.FC<MapToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
}) => {
  return (
    <div
      className="flex flex-col gap-1.5"
      role="group"
      aria-label="Map navigation controls"
    >
      <ToolBtn aria-label="Zoom in" onClick={onZoomIn}>
        <ZoomIn className="w-4 h-4" />
      </ToolBtn>
      <ToolBtn aria-label="Zoom out" onClick={onZoomOut}>
        <ZoomOut className="w-4 h-4" />
      </ToolBtn>

      {/* Divider */}
      <div className="h-px bg-[var(--border-subtle)] mx-1" />

      <ToolBtn aria-label="Re-center map on India" onClick={onRecenter}>
        <Locate className="w-4 h-4" />
      </ToolBtn>
      <ToolBtn aria-label="Toggle fullscreen">
        <Maximize2 className="w-4 h-4" />
      </ToolBtn>
    </div>
  );
};
