import React, { useState, useMemo } from 'react';
import { AlertsHeader } from './AlertsHeader';
import { OperationalSummaryBar } from './OperationalSummaryBar';
import { ActiveAlertsList } from './ActiveAlertsList';
import { AlertDetailDrawer } from './AlertDetailDrawer';
import { OperationalNetworkStatus } from './OperationalNetworkStatus';
import { FacilityMonitoringTable } from './FacilityMonitoringTable';
import { ShipmentMonitoringTable } from './ShipmentMonitoringTable';
import { AlertHistoryFeed } from './AlertHistoryFeed';
import { 
  ACTIVE_ALERTS_DATA, 
  ALERT_OPERATIONAL_SUMMARY, 
  type ActiveAlertItem, 
  type AlertSeverity,
  type FacilityMonitoringItem,
  type ShipmentMonitoringItem
} from '../../data/alertsMock';
import { Toast } from '../ui/Feedback';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<ActiveAlertItem[]>(ACTIVE_ALERTS_DATA);
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');
  const [timeWindow, setTimeWindow] = useState<string>('24h');
  const [selectedAlert, setSelectedAlert] = useState<ActiveAlertItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    if (selectedSeverity === 'all') return alerts;
    return alerts.filter((a) => a.severity === selectedSeverity);
  }, [alerts, selectedSeverity]);

  const handleSelectAlert = (alert: ActiveAlertItem) => {
    setSelectedAlert(alert);
    setIsDrawerOpen(true);
  };

  const handleActionClick = (alert: ActiveAlertItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAlert(alert);
    setIsDrawerOpen(true);
    showToast(`Inspecting ${alert.severity.toUpperCase()} condition: ${alert.title}`);
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
    if (selectedAlert?.id === alertId) {
      setSelectedAlert((prev) => (prev ? { ...prev, acknowledged: true } : null));
    }
    showToast(`Condition ${alertId} acknowledged and logged in SCADA audit trail.`);
  };

  const handleInvestigate = (alert: ActiveAlertItem) => {
    showToast(`Opening telemetry diagnostic log for ${alert.source} (${alert.id}).`);
  };

  const handleOpenFacility = (sourceName: string) => {
    showToast(`Connected to real-time SCADA node for ${sourceName}.`);
  };

  const handleSelectFacility = (fac: FacilityMonitoringItem) => {
    showToast(`Focusing telemetry view on ${fac.facility} (${fac.region}). Output: ${fac.captureOutput}%.`);
  };

  const handleSelectShipment = (shp: ShipmentMonitoringItem) => {
    showToast(`Tracking convoy ${shp.shipmentId} on ${shp.route}. Status: ${shp.status}.`);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 pb-16 animate-fade-in text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-2">
          <Toast variant="info" message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      )}

      {/* 1. Header with severity controls & time window */}
      <AlertsHeader
        selectedSeverity={selectedSeverity}
        onSelectSeverity={setSelectedSeverity}
        timeWindow={timeWindow}
        onSelectTimeWindow={setTimeWindow}
        totalAlertsCount={alerts.length}
      />

      {/* 2. Operational Summary Bar (Restrained status metrics) */}
      <OperationalSummaryBar
        summary={ALERT_OPERATIONAL_SUMMARY}
        onFilterCritical={() => setSelectedSeverity('critical')}
        onFilterWarnings={() => setSelectedSeverity('warning')}
      />

      {/* 3. Main Active Alerts Feed */}
      <ActiveAlertsList
        alerts={filteredAlerts}
        onSelectAlert={handleSelectAlert}
        onActionClick={handleActionClick}
      />

      {/* 4. Operational Network Status Index */}
      <OperationalNetworkStatus />

      {/* 5. Facility & Logistics Dual Monitoring Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <FacilityMonitoringTable onSelectFacility={handleSelectFacility} />
        <ShipmentMonitoringTable onSelectShipment={handleSelectShipment} />
      </div>

      {/* 6. Alert History */}
      <AlertHistoryFeed />

      {/* Slide-Over Alert Detail Drawer */}
      <AlertDetailDrawer
        alert={selectedAlert}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAcknowledge={handleAcknowledge}
        onInvestigate={handleInvestigate}
        onOpenFacility={handleOpenFacility}
      />
    </div>
  );
};
