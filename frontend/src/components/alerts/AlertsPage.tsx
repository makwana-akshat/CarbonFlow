import React, { useState, useMemo, useEffect } from 'react';
import { AlertsHeader } from './AlertsHeader';
import { OperationalSummaryBar } from './OperationalSummaryBar';
import { ActiveAlertsList } from './ActiveAlertsList';
import { AlertDetailDrawer } from './AlertDetailDrawer';
import { OperationalNetworkStatus } from './OperationalNetworkStatus';
import { FacilityMonitoringTable } from './FacilityMonitoringTable';
import { ShipmentMonitoringTable } from './ShipmentMonitoringTable';
import { AlertHistoryFeed } from './AlertHistoryFeed';
import { 
  type ActiveAlertItem, 
  type AlertSeverity,
  type FacilityMonitoringItem,
  type ShipmentMonitoringItem,
  type AlertHistoryItem,
  type OperationalSummary
} from '../../data/alertsMock';
import { Toast } from '../ui/Feedback';
import { useAuth } from '@clerk/clerk-react';
import { 
  getActiveAlerts, 
  getAlertHistory, 
  getAlertSummary, 
  acknowledgeAlert, 
  resolveAlert, 
  getFacilitiesMonitoring, 
  getShipmentsMonitoring 
} from '../../services/telemetryApi';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<ActiveAlertItem[]>([]);
  const [history, setHistory] = useState<AlertHistoryItem[]>([]);
  const [summary, setSummary] = useState<OperationalSummary | null>(null);
  const [facilities, setFacilities] = useState<FacilityMonitoringItem[]>([]);
  const [shipments, setShipments] = useState<ShipmentMonitoringItem[]>([]);
  
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');
  const [timeWindow, setTimeWindow] = useState<string>('24h');
  const [selectedAlert, setSelectedAlert] = useState<ActiveAlertItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const { getToken } = useAuth();
  
  const fetchData = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      
      const [alertsData, historyData, summaryData, facilitiesData, shipmentsData] = await Promise.all([
        getActiveAlerts(token),
        getAlertHistory(token),
        getAlertSummary(token),
        getFacilitiesMonitoring(token),
        getShipmentsMonitoring(token)
      ]);
      
      if (alertsData) {
        const mapped: ActiveAlertItem[] = alertsData.map((alert: any) => ({
          id: alert.id,
          severity: alert.severity,
          title: alert.title,
          source: alert.facilities?.name || 'Unknown Facility',
          region: alert.facilities?.region || 'Unknown Region',
          currentMetric: alert.extra_fields?.currentMetric || 'N/A',
          expectedMetric: alert.extra_fields?.expectedMetric || 'N/A',
          variance: alert.extra_fields?.variance || 'N/A',
          detectedTime: alert.extra_fields?.detectedTime || 'Just now',
          duration: alert.extra_fields?.duration || '0 min',
          description: alert.extra_fields?.description || alert.title,
          operationalImpact: alert.extra_fields?.operationalImpact || 'Unknown',
          recommendedAction: alert.extra_fields?.recommendedAction || 'Investigate',
          actionType: alert.extra_fields?.actionType || 'investigate',
          actionLabel: alert.extra_fields?.actionLabel || 'View',
          acknowledged: alert.extra_fields?.acknowledged || false
        }));
        setAlerts(mapped);
      }
      
      if (historyData) setHistory(historyData);
      if (summaryData) setSummary(summaryData);
      if (facilitiesData) setFacilities(facilitiesData);
      if (shipmentsData) setShipments(shipmentsData);
      
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getToken]);

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

  const handleAcknowledge = async (alertId: string) => {
    try {
      const token = await getToken();
      await acknowledgeAlert(token, alertId);
      
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
      );
      if (selectedAlert?.id === alertId) {
        setSelectedAlert((prev) => (prev ? { ...prev, acknowledged: true } : null));
      }
      showToast(`Condition ${alertId} acknowledged and logged in SCADA audit trail.`);
    } catch (e) {
      showToast(`Failed to acknowledge alert`);
    }
  };

  const handleResolve = async (alertId: string, note: string) => {
    try {
      const token = await getToken();
      await resolveAlert(token, alertId, note);
      
      // Remove from active alerts list
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      setIsDrawerOpen(false);
      showToast(`Alert ${alertId} resolved successfully.`);
      fetchData(); // Refresh summary and history
    } catch (e) {
      showToast(`Failed to resolve alert`);
    }
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
      {summary && (
        <OperationalSummaryBar
          summary={summary}
          onFilterCritical={() => setSelectedSeverity('critical')}
          onFilterWarnings={() => setSelectedSeverity('warning')}
        />
      )}

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
        <FacilityMonitoringTable facilities={facilities} onSelectFacility={handleSelectFacility} />
        <ShipmentMonitoringTable shipments={shipments} onSelectShipment={handleSelectShipment} />
      </div>

      {/* 6. Alert History */}
      <AlertHistoryFeed history={history} />

      {/* Slide-Over Alert Detail Drawer */}
      <AlertDetailDrawer
        alert={selectedAlert}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAcknowledge={handleAcknowledge}
        onResolve={handleResolve}
        onInvestigate={handleInvestigate}
        onOpenFacility={handleOpenFacility}
      />
    </div>
  );
};
