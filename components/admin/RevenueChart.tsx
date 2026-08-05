'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { name: 'AUG 01', revenue: 45000, orders: 4 },
  { name: 'AUG 02', revenue: 78000, orders: 7 },
  { name: 'AUG 03', revenue: 62000, orders: 5 },
  { name: 'AUG 04', revenue: 110000, orders: 11 },
  { name: 'AUG 05', revenue: 145000, orders: 14 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff003c" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ff003c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
          <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#12131c',
              borderColor: 'rgba(255,255,255,0.14)',
              borderRadius: '4px',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px',
              color: '#ffffff',
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#ff003c"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
