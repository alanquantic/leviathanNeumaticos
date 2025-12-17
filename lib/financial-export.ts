import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface FinancialReportData {
  configuration: {
    scenario: string;
    marketSplit: string;
    tonsPerDay: number;
    operatingDaysPerYear: number;
    uptimePercentage: number;
  };
  production: {
    totalTons: number;
    chips3Tons: number;
    chips1Tons: number;
    crumbTons: number;
  };
  revenue: {
    totalRevenue: number;
    revenueChips3: number;
    revenueChips1: number;
    revenueCrumb: number;
  };
  costs: {
    annualOpex: number;
    trueCostPerTon: {
      chips_3: number;
      chips_1: number;
      crumb: number;
    };
  };
  profitability: {
    ebitda: number;
    ebitdaMargin: number;
    grossMargin: number;
  };
  investment: {
    totalCapexInvestment: number;
    npv: number;
    irr: number;
    paybackPeriodYears: number | null;
  };
  token: {
    totalSupply: number;
    tokenPrice: number;
    yieldPercentage: number;
    breakEvenMonths: number | null;
  };
  projections: Array<{
    year: number;
    revenue: number;
    opex: number;
    ebitda: number;
    cashFlow: number;
    cumulativeCashFlow: number;
  }>;
}

export function exportFinancialReportPDF(data: FinancialReportData) {
  const doc = new jsPDF();
  let currentY = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246); // blue-500
  doc.text('Reporte Financiero Industrial', 14, currentY);
  currentY += 7;

  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, currentY);
  currentY += 3;
  doc.text(`Escenario: ${data.configuration.scenario.toUpperCase()} | Mercado: ${data.configuration.marketSplit}`, 14, currentY);
  currentY += 10;

  // Line separator
  doc.setDrawColor(229, 231, 235);
  doc.line(14, currentY, 196, currentY);
  currentY += 10;

  // Section: Configuración
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Configuración Operativa', 14, currentY);
  currentY += 7;

  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text(`Capacidad: ${data.configuration.tonsPerDay} ton/día | Uptime: ${(data.configuration.uptimePercentage * 100).toFixed(0)}%`, 14, currentY);
  currentY += 5;
  doc.text(`Días Operativos: ${data.configuration.operatingDaysPerYear}/año | Producción Anual: ${data.production.totalTons.toFixed(0)} ton`, 14, currentY);
  currentY += 10;

  // Section: Métricas Clave
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Métricas Clave de Inversión', 14, currentY);
  currentY += 7;

  const metricsData = [
    ['Métrica', 'Valor'],
    ['NPV (15 años)', `$${(data.investment.npv / 1_000_000).toFixed(2)}M`],
    ['IRR', `${data.investment.irr.toFixed(1)}%`],
    ['Payback Period', data.investment.paybackPeriodYears ? `${data.investment.paybackPeriodYears.toFixed(1)} años` : 'N/A'],
    ['EBITDA Anual', `$${(data.profitability.ebitda / 1_000_000).toFixed(2)}M`],
    ['Margen EBITDA', `${data.profitability.ebitdaMargin.toFixed(1)}%`],
    ['CAPEX Total', `$${(data.investment.totalCapexInvestment / 1_000_000).toFixed(2)}M`],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [metricsData[0]],
    body: metricsData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Section: Revenue & Costs
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Ingresos y Costos Anuales', 14, currentY);
  currentY += 7;

  const revenueData = [
    ['Concepto', 'Monto'],
    ['Ingresos Totales', `$${(data.revenue.totalRevenue / 1_000_000).toFixed(2)}M`],
    ['  - 3" Chips', `$${(data.revenue.revenueChips3 / 1_000_000).toFixed(2)}M`],
    ['  - 1" Chips', `$${(data.revenue.revenueChips1 / 1_000_000).toFixed(2)}M`],
    ['  - Crumb Rubber', `$${(data.revenue.revenueCrumb / 1_000_000).toFixed(2)}M`],
    ['OPEX Total', `$${(data.costs.annualOpex / 1_000_000).toFixed(2)}M`],
    ['EBITDA', `$${(data.profitability.ebitda / 1_000_000).toFixed(2)}M`],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [revenueData[0]],
    body: revenueData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
    styles: { fontSize: 9 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Section: Tokenomics
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Tokenomics', 14, currentY);
  currentY += 7;

  const tokenData = [
    ['Parámetro', 'Valor'],
    ['Total Supply', `${data.token.totalSupply.toLocaleString()} tokens`],
    ['Precio por Token', `$${data.token.tokenPrice}`],
    ['Yield Anual', `${data.token.yieldPercentage.toFixed(2)}%`],
    ['Break-even', data.token.breakEvenMonths ? `${data.token.breakEvenMonths} meses` : 'N/A'],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [tokenData[0]],
    body: tokenData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [168, 85, 247] },
    styles: { fontSize: 9 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Section: Cash Flow Proyections (5 primeros años)
  if (currentY > 200) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Proyección de Cash Flow (Primeros 5 Años)', 14, currentY);
  currentY += 7;

  const cashFlowData = data.projections.slice(0, 5).map((p) => [
    `Año ${p.year}`,
    `$${(p.revenue / 1_000_000).toFixed(2)}M`,
    `$${(p.opex / 1_000_000).toFixed(2)}M`,
    `$${(p.ebitda / 1_000_000).toFixed(2)}M`,
    `$${(p.cashFlow / 1_000_000).toFixed(2)}M`,
    `$${(p.cumulativeCashFlow / 1_000_000).toFixed(2)}M`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Año', 'Revenue', 'OPEX', 'EBITDA', 'Cash Flow', 'Acumulado']],
    body: cashFlowData,
    theme: 'grid',
    headStyles: { fillColor: [249, 115, 22] },
    styles: { fontSize: 8 },
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text('Tire Recycling Industrial Financial Engine', 14, 285);
  doc.text('© 2024 Todos los derechos reservados', 14, 290);

  doc.save(`reporte-financiero-${data.configuration.scenario}-${Date.now()}.pdf`);
}

export function exportFinancialReportCSV(data: FinancialReportData) {
  const lines = [
    'Reporte Financiero Industrial',
    `Fecha: ${new Date().toLocaleDateString('es-MX')}`,
    `Escenario: ${data.configuration.scenario.toUpperCase()}`,
    '',
    'CONFIGURACIÓN OPERATIVA',
    `Capacidad,${data.configuration.tonsPerDay} ton/día`,
    `Uptime,${(data.configuration.uptimePercentage * 100).toFixed(0)}%`,
    `Días Operativos,${data.configuration.operatingDaysPerYear}`,
    `Producción Anual,${data.production.totalTons.toFixed(0)} ton`,
    '',
    'MÉTRICAS DE INVERSIÓN',
    `NPV (15 años),${data.investment.npv.toFixed(2)}`,
    `IRR,${data.investment.irr.toFixed(2)}%`,
    `Payback Period,${data.investment.paybackPeriodYears ? data.investment.paybackPeriodYears.toFixed(1) + ' años' : 'N/A'}`,
    `EBITDA Anual,${data.profitability.ebitda.toFixed(2)}`,
    `Margen EBITDA,${data.profitability.ebitdaMargin.toFixed(2)}%`,
    `CAPEX Total,${data.investment.totalCapexInvestment.toFixed(2)}`,
    '',
    'INGRESOS Y COSTOS',
    `Ingresos Totales,${data.revenue.totalRevenue.toFixed(2)}`,
    `OPEX Total,${data.costs.annualOpex.toFixed(2)}`,
    `EBITDA,${data.profitability.ebitda.toFixed(2)}`,
    '',
    'TOKENOMICS',
    `Total Supply,${data.token.totalSupply}`,
    `Precio por Token,${data.token.tokenPrice}`,
    `Yield Anual,${data.token.yieldPercentage.toFixed(2)}%`,
    `Break-even,${data.token.breakEvenMonths ? data.token.breakEvenMonths + ' meses' : 'N/A'}`,
    '',
    'PROYECCIÓN CASH FLOW',
    'Año,Revenue,OPEX,EBITDA,Cash Flow,Acumulado',
    ...data.projections.map((p) =>
      `${p.year},${p.revenue.toFixed(2)},${p.opex.toFixed(2)},${p.ebitda.toFixed(2)},${p.cashFlow.toFixed(2)},${p.cumulativeCashFlow.toFixed(2)}`
    ),
  ];

  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `reporte-financiero-${data.configuration.scenario}-${Date.now()}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
