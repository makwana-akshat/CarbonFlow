export type PurityTier =
  | 'liquefaction-ready'
  | 'pipeline-ready'
  | 'eor-ready'
  | 'needs-upgrade'
  | 'Liquefaction-ready'
  | 'Pipeline-ready'
  | 'EOR-ready'
  | 'Needs upgrade';

export { CO2ListingCard, CO2ListingCard as ListingCard } from './CO2ListingCard';
export type { CO2ListingCardProps, CO2ListingCardProps as ListingCardProps } from './CO2ListingCard';
