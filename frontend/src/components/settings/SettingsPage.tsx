import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Building2,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Sparkles,
  Sliders,
  Loader2
} from 'lucide-react';
import { Input, Select, Toggle } from '../ui/FormControls';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../store/useAppStore';
import type { UserRole } from '../../types/dashboard';
import { fetchWithAuth } from '../../services/api';

export const SettingsPage: React.FC = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { userRole, setUserRole, showToast } = useAppStore();

  const queryClient = useQueryClient();

  const { data: dbUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;
      return fetchWithAuth('/users/me', token);
    },
    enabled: !!user,
  });

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
  });

  // Organization Form State
  const [orgData, setOrgData] = useState({
    companyName: '',
    industry: 'chemicals',
    facilityLocation: '',
    co2Capacity: '',
    verificationStatus: 'unverified',
  });

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    supplyAlerts: true,
    orderUpdates: true,
    contractNotifications: false,
  });

  // Role State (synced with app store)
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);

  useEffect(() => {
    setSelectedRole(userRole);
  }, [userRole]);

  // Keep synced if Clerk user or DB user loads
  useEffect(() => {
    if (dbUser || user) {
      setProfileData({
        name: dbUser?.first_name ? `${dbUser.first_name} ${dbUser.last_name || ''}`.trim() : user?.fullName || '',
        email: dbUser?.email || user?.primaryEmailAddress?.emailAddress || '',
        phone: dbUser?.phone || '',
        jobTitle: dbUser?.job_title || '',
      });

      if (dbUser) {
        setOrgData({
          companyName: dbUser.company_name || '',
          industry: dbUser.industry || 'chemicals',
          facilityLocation: dbUser.facility_location || '',
          co2Capacity: dbUser.co2_capacity || '',
          verificationStatus: dbUser.is_verified ? 'verified' : 'unverified',
        });

        setNotifications({
          priceAlerts: dbUser.notif_price_alerts ?? true,
          supplyAlerts: dbUser.notif_supply_alerts ?? true,
          orderUpdates: dbUser.notif_order_updates ?? true,
          contractNotifications: dbUser.notif_contract_notifs ?? false,
        });

        if (dbUser.role) {
          setSelectedRole(dbUser.role as UserRole);
          if (dbUser.role !== userRole) {
            setUserRole(dbUser.role as UserRole);
          }
        }
      }
    }
  }, [user, dbUser]);

  const updateMutation = useMutation({
    mutationFn: async (updatePayload: any) => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return fetchWithAuth('/users/me', token, {
        method: 'PATCH',
        body: JSON.stringify(updatePayload)
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      showToast('Settings saved successfully');
      setHasSaved(true);
      setTimeout(() => setHasSaved(false), 4000);
    },
    onError: (error) => {
      showToast('Failed to save settings');
      console.error(error);
    }
  });

  const [hasSaved, setHasSaved] = useState(false);

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const nameParts = profileData.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');

    const payload = {
      first_name: firstName,
      last_name: lastName,
      phone: profileData.phone,
      job_title: profileData.jobTitle,
      company_name: orgData.companyName,
      industry: orgData.industry,
      co2_capacity: orgData.co2Capacity,
      facility_location: orgData.facilityLocation,
      notif_price_alerts: notifications.priceAlerts,
      notif_supply_alerts: notifications.supplyAlerts,
      notif_order_updates: notifications.orderUpdates,
      notif_contract_notifs: notifications.contractNotifications,
      role: selectedRole,
    };

    updateMutation.mutate(payload);

    // Apply role change to global store immediately for UI sync
    if (selectedRole !== userRole) {
      setUserRole(selectedRole);
    }
  };

  const industryOptions = [
    { label: 'Specialty Chemicals & Refining', value: 'chemicals' },
    { label: 'Direct Air Capture (DAC) Operator', value: 'dac_operator' },
    { label: 'Biogenic Fermentation & Biofuels', value: 'biogenic' },
    { label: 'Synthetic Aviation Fuels (e-SAF)', value: 'esaf' },
    { label: 'Cement & Building Materials', value: 'cement' },
    { label: 'Food & Beverage Bottling (E290)', value: 'food_beverage' },
  ];

  const roleOptions = [
    { label: 'Buyer — Industrial Feedstock Offtaker', value: 'buyer' },
    { label: 'Supplier — CO₂ Capture / Emitter Facility', value: 'supplier' },
    { label: 'Platform Administrator — Grid & Corridor Clearing', value: 'admin' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[var(--ink)]">
            Platform Settings
          </h1>
          <p className="text-[13px] text-[var(--text-secondary-accessible)] mt-1">
            Manage your authenticated profile, industrial facility parameters, dispatch notifications, and workspace role.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasSaved && (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--status-success)] bg-[#34C77B]/10 px-3 py-1 rounded-[var(--radius-pill)] border border-[var(--status-success)]/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={handleSaveAll}
            disabled={updateMutation.isPending || isLoadingUser}
            className="shadow-xs"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {updateMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {isLoadingUser ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
          <p className="text-[14px] text-[var(--text-secondary-accessible)]">Loading your workspace profile...</p>
        </div>
      ) : (
        <form onSubmit={handleSaveAll} className="space-y-6">
        {/* 1. Profile Card */}
        <section className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 sm:p-7 border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-muted)] text-[var(--accent-primary)] flex items-center justify-center border border-[var(--border-subtle)]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--ink)]">User Profile</h2>
                <p className="text-[12px] text-[var(--text-secondary-accessible)]">
                  Clerk authenticated identity and operator contact details.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase px-2 py-0.5 rounded bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
              Clerk Managed
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-2">
            {/* Avatar */}
            <div className="relative">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={profileData.name}
                  className="w-18 h-18 rounded-full object-cover border-2 border-[var(--accent-primary)]/40 shadow-xs"
                />
              ) : (
                <div className="w-18 h-18 rounded-full bg-[var(--accent-primary)] text-white font-bold text-xl flex items-center justify-center shadow-xs">
                  {profileData.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 p-1 bg-[var(--surface-card)] rounded-full border border-[var(--border-subtle)] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[var(--ink)]">{profileData.name}</h3>
                <Badge variant="filled-accent">Operator</Badge>
              </div>
              <p className="text-[13px] text-[var(--text-secondary-accessible)]">
                {profileData.email}
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] font-mono">
                ID: {user?.id || 'usr_cf_89201948'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <Input
                label="Full Name (Clerk)"
                value={profileData.name}
                disabled
                trailingIcon={<Lock className="w-3.5 h-3.5" />}
                helperText="Synced directly with Clerk SSO authentication"
              />
            </div>
            <div>
              <Input
                label="Verified Email Address (Clerk)"
                type="email"
                value={profileData.email}
                disabled
                trailingIcon={<Lock className="w-3.5 h-3.5" />}
                helperText="Primary email used for billing & cryptographic notices"
              />
            </div>
            <div>
              <Input
                label="Direct Operations Phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+31 20 000 0000"
                helperText="Dispatch coordination & emergency SCADA alerts"
              />
            </div>
            <div>
              <Input
                label="Corporate Job Title"
                value={profileData.jobTitle}
                onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                placeholder="Head of Procurement"
                helperText="Displayed on digital bill-of-lading contracts"
              />
            </div>
          </div>
        </section>

        {/* 2. Organization Card */}
        <section className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 sm:p-7 border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-muted)] text-[var(--accent-primary)] flex items-center justify-center border border-[var(--border-subtle)]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--ink)]">Organization & Facility</h2>
                <p className="text-[12px] text-[var(--text-secondary-accessible)]">
                  Enterprise entity, industrial capacity, and third-party verification status.
                </p>
              </div>
            </div>
            {orgData.verificationStatus === 'verified' ? (
              <Badge variant="outline-success">
                <CheckCircle2 className="w-3 h-3" />
                Verified Facility
              </Badge>
            ) : (
              <Badge variant="outline-warning">
                <Shield className="w-3 h-3" />
                Unverified Facility
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Registered Entity Name"
                value={orgData.companyName}
                onChange={(e) => setOrgData({ ...orgData, companyName: e.target.value })}
                placeholder="Apex Chemicals BV"
              />
            </div>

            <div>
              <Select
                label="Primary Industry Sector"
                value={orgData.industry}
                onChange={(e) => setOrgData({ ...orgData, industry: e.target.value })}
                options={industryOptions}
              />
            </div>

            <div>
              <Input
                label="CO₂ Annual Capture / Utilization Capacity"
                value={orgData.co2Capacity}
                onChange={(e) => setOrgData({ ...orgData, co2Capacity: e.target.value })}
                placeholder="45,000 t/year"
                helperText="Used for capacity matching & corridor reservation"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Primary Physical Facility / Delivery Terminal"
                value={orgData.facilityLocation}
                onChange={(e) => setOrgData({ ...orgData, facilityLocation: e.target.value })}
                placeholder="Hub Location"
                helperText="Used to calculate real-time intermodal transport latency & GPS dispatch"
              />
            </div>
          </div>
        </section>

        {/* 3. Notification Preferences Card */}
        <section className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 sm:p-7 border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border-subtle)]">
            <div className="w-8 h-8 rounded-lg bg-[var(--surface-muted)] text-[var(--accent-primary)] flex items-center justify-center border border-[var(--border-subtle)]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[var(--ink)]">Notification Preferences</h2>
              <p className="text-[12px] text-[var(--text-secondary-accessible)]">
                Manage automated market signals, corridor triggers, and dispatch updates.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            <div className="py-3.5 first:pt-0 last:pb-0">
              <Toggle
                checked={notifications.priceAlerts}
                onChange={(checked) => setNotifications({ ...notifications, priceAlerts: checked })}
                label="Price Alerts"
                description="Trigger alerts when regional CO₂ spot benchmarks or index pricing fluctuates by >5%."
              />
            </div>

            <div className="py-3.5">
              <Toggle
                checked={notifications.supplyAlerts}
                onChange={(checked) => setNotifications({ ...notifications, supplyAlerts: checked })}
                label="Supply Alerts"
                description="Instant algorithmic notifications when newly vetted high-purity capture corridors come online."
              />
            </div>

            <div className="py-3.5">
              <Toggle
                checked={notifications.orderUpdates}
                onChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })}
                label="Order Updates"
                description="Live status telemetry for ISO rail, barge, and pipeline custody transfers and shipments."
              />
            </div>

            <div className="py-3.5">
              <Toggle
                checked={notifications.contractNotifications}
                onChange={(checked) =>
                  setNotifications({ ...notifications, contractNotifications: checked })
                }
                label="Contract Notifications"
                description="Escrow release events, mutual cryptographic signatures, and expiration renewal prompts."
              />
            </div>
          </div>
        </section>

        {/* 4. Role & Access Card */}
        <section className="bg-[var(--surface-card)] rounded-[var(--radius-card)] p-6 sm:p-7 border border-[var(--border-subtle)] shadow-[var(--shadow-card)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-muted)] text-[var(--accent-primary)] flex items-center justify-center border border-[var(--border-subtle)]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--ink)]">Role & Access Control</h2>
                <p className="text-[12px] text-[var(--text-secondary-accessible)]">
                  Active operating console perspective and permission scopes.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[var(--accent-primary)] uppercase px-2 py-0.5 rounded bg-[var(--accent-primary)]/10 font-semibold">
              Current: {userRole.toUpperCase()}
            </span>
          </div>

          <div className="space-y-4">
            <Select
              label="Switch Active Workspace Role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              options={roleOptions}
              helperText="Switching roles adjusts your dashboard metrics, supplier/offtaker recommendations, and custody tools."
            />

            <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-start gap-3 text-[12px] text-[var(--text-secondary-accessible)]">
              <Sliders className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text-primary)]">Multi-Role Workspace Mode:</strong> In CarbonFlow, operators with dual roles (e.g. producers that also purchase tech-grade buffer gas) can switch contexts dynamically. Changes take effect across your navigation sidebar and recommendation engine immediately upon saving.
              </div>
            </div>
          </div>
        </section>

        {/* Form Footer Save Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <p className="text-[12px] text-[var(--text-secondary)]">
            Changes are saved to your local enterprise workspace profile.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={updateMutation.isPending}
              className="w-full sm:w-auto shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
      )}
    </div>
  );
};
