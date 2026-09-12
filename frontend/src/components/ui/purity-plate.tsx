import { cn } from '../../lib/utils';
import type { PurityTier } from './listing-card';

const tierStyles: Record<string, { bg: string; text: string; label: string }> = {
  'liquefaction-ready': {
    bg: 'linear-gradient(135deg, #dff4ff 0%, #7ec8f0 45%, #2e6fa8 100%)',
    text: '#0c2a3d',
    label: 'Liquefaction-ready',
  },
  'pipeline-ready': {
    bg: 'linear-gradient(135deg, #ffe4d1 0%, #ff9a52 45%, #dc5000 100%)',
    text: '#4a1f00',
    label: 'Pipeline-ready',
  },
  'eor-ready': {
    bg: 'linear-gradient(135deg, #e3f3d8 0%, #8fc96a 45%, #4b7a2e 100%)',
    text: '#1c3010',
    label: 'EOR-ready',
  },
  'needs-upgrade': {
    bg: 'repeating-linear-gradient(135deg, #fff1de 0px, #fff1de 14px, #f0b25f 14px, #f0b25f 28px)',
    text: '#4a2e00',
    label: 'Needs upgrade',
  },
  'Liquefaction-ready': {
    bg: 'linear-gradient(135deg, #dff4ff 0%, #7ec8f0 45%, #2e6fa8 100%)',
    text: '#0c2a3d',
    label: 'Liquefaction-ready',
  },
  'Pipeline-ready': {
    bg: 'linear-gradient(135deg, #ffe4d1 0%, #ff9a52 45%, #dc5000 100%)',
    text: '#4a1f00',
    label: 'Pipeline-ready',
  },
  'EOR-ready': {
    bg: 'linear-gradient(135deg, #e3f3d8 0%, #8fc96a 45%, #4b7a2e 100%)',
    text: '#1c3010',
    label: 'EOR-ready',
  },
  'Needs upgrade': {
    bg: 'repeating-linear-gradient(135deg, #fff1de 0px, #fff1de 14px, #f0b25f 14px, #f0b25f 28px)',
    text: '#4a2e00',
    label: 'Needs upgrade',
  },
};

export function PurityPlate({ purity, tier, className }: { purity: number; tier: PurityTier; className?: string }) {
  const normalizedKey = (tier in tierStyles)
    ? tier
    : (tier.toLowerCase().replace(' ', '-') in tierStyles)
      ? tier.toLowerCase().replace(' ', '-')
      : 'needs-upgrade';
  const style = tierStyles[normalizedKey] || tierStyles['needs-upgrade'];

  return (
    <div
      className={cn('relative overflow-hidden rounded-xl px-4 py-3 flex items-center justify-between', className)}
      style={{ background: style.bg, color: style.text }}
    >
      <span className="text-sm font-medium">{purity}% purity</span>
      <span className="text-xs font-semibold uppercase tracking-wide opacity-90">{style.label}</span>
    </div>
  );
}

export default PurityPlate;
