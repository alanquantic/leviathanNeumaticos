'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StageCostChartProps {
  stages: any[];
}

export default function StageCostChart({ stages }: StageCostChartProps) {
  const data = stages?.map((stage) => ({
    name: `Stage ${stage?.stageNumber ?? ''}`,
    Utilities: (stage?.calculatedTotalUtilities ?? 0)?.toFixed?.(2) ?? '0.00',
    Production: (stage?.calculatedTotalProduction ?? 0)?.toFixed?.(2) ?? '0.00',
    Maintenance: (stage?.calculatedTotalMaintenance ?? 0)?.toFixed?.(2) ?? '0.00',
  })) ?? [];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
        <XAxis
          dataKey="name"
          tickLine={false}
          tick={{ fontSize: 10 }}
          label={{
            value: 'Processing Stage',
            position: 'insideBottom',
            offset: -15,
            style: { textAnchor: 'middle', fontSize: 11 },
          }}
        />
        <YAxis
          tickLine={false}
          tick={{ fontSize: 10 }}
          label={{
            value: 'Cost ($)',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: 11 },
          }}
        />
        <Tooltip
          contentStyle={{ fontSize: 11 }}
          formatter={(value: any) => `$${value}`}
        />
        <Legend
          verticalAlign="top"
          wrapperStyle={{ fontSize: 11 }}
        />
        <Bar dataKey="Utilities" fill="#EAB308" />
        <Bar dataKey="Production" fill="#22C55E" />
        <Bar dataKey="Maintenance" fill="#F97316" />
      </BarChart>
    </ResponsiveContainer>
  );
}
