'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CostBreakdownChartProps {
  utilities: number;
  production: number;
  maintenance: number;
}

const COLORS = ['#EAB308', '#22C55E', '#F97316'];

export default function CostBreakdownChart({ utilities, production, maintenance }: CostBreakdownChartProps) {
  const data = [
    { name: 'Utilities', value: utilities ?? 0, color: COLORS[0] },
    { name: 'Production Labor', value: production ?? 0, color: COLORS[1] },
    { name: 'Maintenance', value: maintenance ?? 0, color: COLORS[2] },
  ];

  const total = (utilities ?? 0) + (production ?? 0) + (maintenance ?? 0);

  const renderLabel = (entry: any) => {
    const percent = ((entry?.value ?? 0) / total) * 100;
    return `${percent?.toFixed?.(1) ?? '0.0'}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry?.color ?? COLORS[index % COLORS.length]} />
          )) ?? []}
        </Pie>
        <Tooltip
          formatter={(value: any) => `$${(value ?? 0)?.toFixed?.(2) ?? '0.00'}`}
          contentStyle={{ fontSize: 11 }}
        />
        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ fontSize: 11 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
