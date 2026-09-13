export const OPERATIONAL_STATUS_CATEGORIES = [
  {
    category: 'Facilities',
    total: 12,
    breakdown: [
      { count: 10, label: 'Active', color: 'var(--status-success)' },
      { count: 2, label: 'Maint', color: 'var(--status-warning)' }
    ]
  },
  {
    category: 'Transport',
    total: 24,
    breakdown: [
      { count: 20, label: 'On Route', color: 'var(--status-success)' },
      { count: 4, label: 'Delayed', color: 'var(--status-danger)' }
    ]
  },
  {
    category: 'Supply',
    total: 8,
    breakdown: [
      { count: 6, label: 'Stable', color: 'var(--status-success)' },
      { count: 2, label: 'Low', color: 'var(--status-warning)' }
    ]
  },
  {
    category: 'Orders',
    total: 35,
    breakdown: [
      { count: 32, label: 'Processed', color: 'var(--status-success)' },
      { count: 3, label: 'Pending', color: 'var(--status-warning)' }
    ]
  }
];
