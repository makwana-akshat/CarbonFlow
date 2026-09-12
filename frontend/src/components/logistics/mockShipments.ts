import type { Shipment, RouteOption, TransportModeId, ModeEligibility } from './types';

export const SAMPLE_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-8924-CRYO',
    emitterLocation: {
      name: 'Hazira Petrochemical Complex',
      facility: 'Chlor-Alkali High-Purity CO2 Plant',
      city: 'Surat',
      state: 'Gujarat',
      coordinates: [21.1702, 72.8311],
    },
    buyerLocation: {
      name: 'Tata Steel Cleantech Offtake',
      facility: 'Continuous Casting & DRI Unit',
      city: 'Ahmedabad',
      state: 'Gujarat',
      coordinates: [23.0225, 72.5714],
    },
    volume: 1250,
    purity: 99.4,
    physicalState: 'liquefied',
    status: 'in-transit',
    scheduledDispatch: 'Today, 06:00 IST',
    orderRef: 'ORD-8921',
  },
  {
    id: 'SHP-7741-PIPE',
    emitterLocation: {
      name: 'Dahej Industrial Corridor',
      facility: 'Post-Combustion Amine Carbon Capture',
      city: 'Bharuch',
      state: 'Gujarat',
      coordinates: [21.7051, 72.9959],
    },
    buyerLocation: {
      name: 'Gujarat Polychem Synthetics',
      facility: 'Methanol Synthesis Plant',
      city: 'Vadodara',
      state: 'Gujarat',
      coordinates: [22.3072, 73.1812],
    },
    volume: 4800,
    purity: 97.8,
    physicalState: 'gas',
    status: 'scheduled',
    scheduledDispatch: 'Tomorrow, 08:00 IST',
    orderRef: 'ORD-8919',
  },
  {
    id: 'SHP-6512-FALLBACK',
    emitterLocation: {
      name: 'Rourkela Steel Complex Offgas',
      facility: 'Blast Furnace Off-Gas PSA Unit',
      city: 'Rourkela',
      state: 'Odisha',
      coordinates: [22.2604, 84.8536],
    },
    buyerLocation: {
      name: 'Kalinga Mineral Sequestration',
      facility: 'Mineral Carbonation Pilot',
      city: 'Rourkela Adjacent Sector',
      state: 'Odisha',
      coordinates: [22.2850, 84.8950],
    },
    volume: 850,
    purity: 94.2,
    physicalState: 'gas',
    status: 'scheduled',
    scheduledDispatch: 'Scheduled for 14 Sep, 10:00 IST',
    orderRef: 'ORD-8914',
  },
];

export function getEligibleModes(shipment: Shipment): ModeEligibility[] {
  const { purity, physicalState } = shipment;

  // Pipeline requires ~97%+ purity
  const isPipelineEligible = purity >= 97.0;
  // Truck (liquefied) requires >99% purity and liquefied physical state
  const isTruckEligible = purity > 99.0 && physicalState === 'liquefied';
  // On-site direct is always eligible as fallback
  const isOnsiteEligible = true;

  // Recommendation logic:
  // If truck eligible and liquefied -> truck recommended
  // If pipeline eligible -> pipeline recommended
  // Otherwise -> onsite direct recommended
  let recommendedMode: TransportModeId = 'onsite';
  if (isTruckEligible && physicalState === 'liquefied') {
    recommendedMode = 'truck';
  } else if (isPipelineEligible) {
    recommendedMode = 'pipeline';
  }

  return [
    {
      modeId: 'pipeline',
      name: 'Pipeline Trunk',
      subtitle: 'Supercritical high-throughput corridor',
      iconType: 'pipeline',
      isEligible: isPipelineEligible,
      ineligibilityReason: !isPipelineEligible
        ? `Requires 97%+ purity (this shipment: ${purity}%)`
        : undefined,
      isRecommended: recommendedMode === 'pipeline',
      estimatedBaseCostPerTon: 850,
      standardMinPurity: 97.0,
      requiresState: 'gas',
    },
    {
      modeId: 'truck',
      name: 'Truck (Liquefied)',
      subtitle: 'Cryogenic ISO-tanker convoy (NH Corridor)',
      iconType: 'truck',
      isEligible: isTruckEligible,
      ineligibilityReason: !isTruckEligible
        ? purity <= 99.0
          ? `Requires >99% purity (this shipment: ${purity}%)`
          : `Requires liquefied state (this shipment: ${physicalState})`
        : undefined,
      isRecommended: recommendedMode === 'truck',
      estimatedBaseCostPerTon: 1450,
      standardMinPurity: 99.0,
      requiresState: 'liquefied',
    },
    {
      modeId: 'onsite',
      name: 'On-site Direct',
      subtitle: 'Direct industrial off-take / battery limit tie-in',
      iconType: 'onsite',
      isEligible: isOnsiteEligible,
      isRecommended: recommendedMode === 'onsite',
      estimatedBaseCostPerTon: 220,
      standardMinPurity: 90.0,
    },
  ];
}

export function getRouteOptionsForMode(shipment: Shipment, modeId: TransportModeId): RouteOption[] {
  // Generate realistic route options based on mode and coordinates
  const [eLat, eLng] = shipment.emitterLocation.coordinates;
  const [bLat, bLng] = shipment.buyerLocation.coordinates;

  if (modeId === 'truck') {
    return [
      {
        id: 'ROUTE-A',
        name: 'Route A — NH-48 Express Corridor',
        routeCode: 'NH48-EXP',
        viaDescription: 'Via Bharuch Bypass & Vadodara Ring Expressway',
        distanceKm: 268,
        estimatedTime: '4h 25m',
        transportCostINR: Math.round(shipment.volume * 1420),
        transportEmissionsTons: Number((shipment.volume * 0.000032 * 268).toFixed(3)), // Distinct transport footprint
        isRecommended: true,
        transitProgressPercent: shipment.status === 'in-transit' ? 62 : 0,
        modeId: 'truck',
        safetyLevel: 'Hazmat Certified',
        waypoints: [
          [eLat, eLng],
          [eLat + 0.35, eLng + 0.12],
          [eLat + 0.75, eLng + 0.22],
          [eLat + 1.25, eLng + 0.08],
          [bLat, bLng],
        ],
      },
      {
        id: 'ROUTE-B',
        name: 'Route B — Dedicated Freight Ring',
        routeCode: 'DFR-COASTAL',
        viaDescription: 'Via Dahej Port connector & Anand Industrial arterial',
        distanceKm: 294,
        estimatedTime: '5h 10m',
        transportCostINR: Math.round(shipment.volume * 1580),
        transportEmissionsTons: Number((shipment.volume * 0.000035 * 294).toFixed(3)),
        isRecommended: false,
        transitProgressPercent: shipment.status === 'in-transit' ? 45 : 0,
        modeId: 'truck',
        safetyLevel: 'Hazmat Certified',
        waypoints: [
          [eLat, eLng],
          [eLat + 0.28, eLng - 0.15],
          [eLat + 0.85, eLng - 0.08],
          [eLat + 1.40, eLng + 0.02],
          [bLat, bLng],
        ],
      },
      {
        id: 'ROUTE-C',
        name: 'Route C — Multimodal Rail-Truck Feeder',
        routeCode: 'MM-RAIL',
        viaDescription: 'Intermodal terminal transfer at Ankleshwar GIDC Hub',
        distanceKm: 315,
        estimatedTime: '6h 40m',
        transportCostINR: Math.round(shipment.volume * 1290),
        transportEmissionsTons: Number((shipment.volume * 0.000021 * 315).toFixed(3)),
        isRecommended: false,
        transitProgressPercent: shipment.status === 'in-transit' ? 30 : 0,
        modeId: 'truck',
        safetyLevel: 'ISO 27913 Compliant',
        waypoints: [
          [eLat, eLng],
          [eLat + 0.50, eLng + 0.28],
          [eLat + 1.05, eLng + 0.35],
          [eLat + 1.55, eLng + 0.15],
          [bLat, bLng],
        ],
      },
    ];
  }

  if (modeId === 'pipeline') {
    return [
      {
        id: 'PIPE-MAIN',
        name: 'Route A — Western Coastal CO₂ Trunk',
        routeCode: 'WC-TRUNK-01',
        viaDescription: 'Subsea & onshore high-pressure supercritical 120-bar spine',
        distanceKm: 182,
        estimatedTime: 'Continuous Stream',
        transportCostINR: Math.round(shipment.volume * 840),
        transportEmissionsTons: Number((shipment.volume * 0.000004 * 182).toFixed(3)),
        isRecommended: true,
        transitProgressPercent: shipment.status === 'in-transit' ? 88 : 0,
        modeId: 'pipeline',
        safetyLevel: 'ISO 27913 Compliant',
        waypoints: [
          [eLat, eLng],
          [eLat + 0.40, eLng + 0.05],
          [eLat + 0.90, eLng + 0.10],
          [bLat, bLng],
        ],
      },
      {
        id: 'PIPE-SPUR',
        name: 'Route B — Regional Interconnect Spur',
        routeCode: 'RIC-SPUR-4B',
        viaDescription: 'Secondary manifold via Bharuch Chemical Common Feeder',
        distanceKm: 210,
        estimatedTime: 'Continuous Stream',
        transportCostINR: Math.round(shipment.volume * 960),
        transportEmissionsTons: Number((shipment.volume * 0.000006 * 210).toFixed(3)),
        isRecommended: false,
        transitProgressPercent: shipment.status === 'in-transit' ? 60 : 0,
        modeId: 'pipeline',
        safetyLevel: 'ISO 27913 Compliant',
        waypoints: [
          [eLat, eLng],
          [eLat + 0.30, eLng + 0.18],
          [eLat + 0.78, eLng + 0.24],
          [bLat, bLng],
        ],
      },
    ];
  }

  // On-site Direct
  return [
    {
      id: 'ONSITE-DIRECT',
      name: 'Direct Battery-Limit Tie-in',
      routeCode: 'BATTERY-LIM-01',
      viaDescription: 'Direct adjacent pipeline/manifold tie-in across fence line',
      distanceKm: 4.8,
      estimatedTime: 'Immediate Transfer',
      transportCostINR: Math.round(shipment.volume * 190),
      transportEmissionsTons: 0.002,
      isRecommended: true,
      transitProgressPercent: 100,
      modeId: 'onsite',
      safetyLevel: 'Direct Offtake',
      waypoints: [
        [eLat, eLng],
        [eLat + 0.015, eLng + 0.012],
        [bLat, bLng],
      ],
    },
  ];
}
