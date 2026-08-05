import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const kpis = [
    { label: 'NET REVENUE (MONTH)', value: '₹4,40,000', change: '+24.5%', icon: <DollarSign className="w-5 h-5 text-accent-crimson" /> },
    { label: 'TOTAL ORDERS', value: '41 UNITS', change: '+12.0%', icon: <ShoppingBag className="w-5 h-5 text-accent-cyan" /> },
    { label: 'AVERAGE ORDER VALUE', value: '₹10,731', change: '+5.4%', icon: <TrendingUp className="w-5 h-5 text-accent-lime" /> },
    { label: 'LOW STOCK ALERTS', value: '2 SKUs', change: 'ACTION REQ', icon: <AlertTriangle className="w-5 h-5 text-status-warning" /> },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Title Header */}
        <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
          <div>
            <Heading size="3xl" font="display">
              EXECUTIVE COMMAND CENTER
            </Heading>
            <Text size="xs" variant="muted" className="font-mono">
              REAL-TIME SALES TELEMETRY & QIKINK POD INTEGRATION STATUS
            </Text>
          </div>
          <Badge variant="cyan" shape="chamfer" dot>
            SYSTEM VERIFIED
          </Badge>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="p-5 rounded-md bg-charcoal-matte/70 backdrop-blur-xl border border-glass-border-subtle hover:border-glass-border-medium transition-all shadow-glass-md space-y-3 font-mono"
            >
              <div className="flex items-center justify-between text-riiqxText-muted">
                <span className="text-[10px] uppercase tracking-wider">{kpi.label}</span>
                {kpi.icon}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-white">{kpi.value}</span>
                <span className="text-xs text-status-success font-bold">{kpi.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Chart Section */}
        <div className="p-6 rounded-md bg-charcoal-matte/80 border border-glass-border-medium shadow-glass-lg space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-glass-border-subtle pb-3">
            <span className="text-accent-crimson font-bold text-sm uppercase">
              // REVENUE PERFORMANCE (AUGUST 2026)
            </span>
            <Badge variant="crimson" shape="chamfer">
              INR ₹ REVENUE SCALE
            </Badge>
          </div>
          <RevenueChart />
        </div>
      </div>
    </AdminLayout>
  );
}
