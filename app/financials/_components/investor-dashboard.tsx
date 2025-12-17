'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, TrendingUp, TrendingDown, DollarSign, Coins, Target, Clock, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { exportFinancialReportPDF, exportFinancialReportCSV, type FinancialReportData } from '@/lib/financial-export';
import { useLanguage } from '@/lib/i18n/context';

interface SimulationResult {
  configuration: any;
  production: any;
  costs: any;
  pricing: any;
  revenue: any;
  profitability: any;
  investment: any;
  token: any;
  projections: any[];
  equipment: any[];
}

export function InvestorDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimulation();
  }, []);

  const fetchSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/financials/simulate');
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        toast.error(result.error || t.investorDashboard.loadError);
      }
    } catch (error) {
      toast.error(t.investorDashboard.loadError);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">{t.investorDashboard.loading}</p>
      </div>
    );
  }

  const { profitability, investment, token, projections, production, revenue, costs } = data;

  // Format currency - handle null/undefined values
  const fmt = (val: number | null | undefined, decimals: number = 0): string => 
    val != null ? `$${val.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}` : 'N/A';
  const pct = (val: number | null | undefined, decimals: number = 1): string => 
    val != null ? `${val.toFixed(decimals)}%` : 'N/A';

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Prepare data for charts
  const revenueByProduct = [
    { name: '3" Chips', value: revenue.revenueChips3, color: COLORS[0] },
    { name: '1" Chips', value: revenue.revenueChips1, color: COLORS[1] },
    { name: 'Crumb', value: revenue.revenueCrumb, color: COLORS[2] },
  ];

  // Add tipping fee if enabled
  if (revenue.tippingFeeData?.enabled && revenue.tippingFeeData.revenueTF > 0) {
    revenueByProduct.push({
      name: 'Tipping Fee',
      value: revenue.tippingFeeData.revenueTF,
      color: '#22c55e', // green-500
    });
  }

  const costBreakdown = [
    { name: 'OPEX', value: costs.annualOpex, color: COLORS[3] },
    { name: 'CAPEX (Annual)', value: projections[0]?.depreciation || 0, color: COLORS[4] },
  ];

  const handleExportPDF = () => {
    try {
      const reportData: FinancialReportData = {
        configuration: {
          scenario: data.configuration.scenario,
          marketSplit: data.configuration.marketSplit,
          tonsPerDay: data.configuration.plantConfig.tonsPerDay,
          operatingDaysPerYear: data.configuration.plantConfig.operatingDaysPerYear,
          uptimePercentage: data.configuration.plantConfig.uptimePercentage,
        },
        production,
        revenue,
        costs,
        profitability,
        investment,
        token,
        projections,
      };
      exportFinancialReportPDF(reportData);
      toast.success(t.investorDashboard.pdfSuccess);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error(t.investorDashboard.pdfError);
    }
  };

  const handleExportCSV = () => {
    try {
      const reportData: FinancialReportData = {
        configuration: {
          scenario: data.configuration.scenario,
          marketSplit: data.configuration.marketSplit,
          tonsPerDay: data.configuration.plantConfig.tonsPerDay,
          operatingDaysPerYear: data.configuration.plantConfig.operatingDaysPerYear,
          uptimePercentage: data.configuration.plantConfig.uptimePercentage,
        },
        production,
        revenue,
        costs,
        profitability,
        investment,
        token,
        projections,
      };
      exportFinancialReportCSV(reportData);
      toast.success(t.investorDashboard.csvSuccess);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error(t.investorDashboard.csvError);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tipping Fee Notice */}
      {revenue.tippingFeeData?.enabled && revenue.tippingFeeData.revenueTF > 0 && (
        <Card className="border-2 border-green-300 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                  {t.investorDashboard.tippingFeeEnabled}
                </h3>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  {t.investorDashboard.tippingFeeDesc.replace('{amount}', fmt(revenue.tippingFeeData.revenueTF)).replace('{share}', revenue.tippingFeeData.tfShare.toFixed(1))}
                  {!revenue.tippingFeeData.includeInBaseCase && (
                    <span className="ml-2 text-amber-700 dark:text-amber-400 font-medium">
                      {t.investorDashboard.excludedFromBaseCase}
                    </span>
                  )}
                </p>
              </div>
              <Badge className="bg-green-600 text-white">
                +{fmt(revenue.tippingFeeData.revenueTF)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export and Actions */}
      <Card className="no-print bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t.investorDashboard.exportTitle}
          </CardTitle>
          <CardDescription>
            {t.investorDashboard.exportDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExportPDF} variant="default" className="bg-red-600 hover:bg-red-700">
              <FileText className="mr-2 h-4 w-4" />
              {t.investorDashboard.exportPDF}
            </Button>
            <Button onClick={handleExportCSV} variant="default" className="bg-green-600 hover:bg-green-700">
              <FileText className="mr-2 h-4 w-4" />
              {t.investorDashboard.exportCSV}
            </Button>
            <Button onClick={fetchSimulation} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t.investorDashboard.refreshData}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-green-200 dark:border-green-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              {t.investorDashboard.annualRevenue}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{fmt(revenue.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {production.totalTons.toLocaleString(undefined, { maximumFractionDigits: 0 })} {t.investorDashboard.tonsYear}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              {t.investorDashboard.ebitda}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{fmt(profitability.ebitda)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t.investorDashboard.margin}: {pct(profitability.ebitdaMargin)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              {t.investorDashboard.npv}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{fmt(investment.npv)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              @ {pct(investment.discountRate)} {t.investorDashboard.discountRate}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 dark:border-amber-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              {t.investorDashboard.irr}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pct(investment.irr, 1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t.investorDashboard.irrFull}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t.investorDashboard.totalCapex}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(investment.totalCapexInvestment)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t.investorDashboard.paybackPeriod}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {investment.paybackPeriodYears ? `${investment.paybackPeriodYears.toFixed(1)} ${t.common.years}` : t.common.notAvailable}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t.investorDashboard.grossMargin}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{pct(profitability.grossMargin)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{t.investorDashboard.annualOpex}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(costs.annualOpex)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Token Metrics */}
      <Card className="border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-indigo-500" />
            {t.investorDashboard.tokenMetrics} - {token.tokenSymbol}
          </CardTitle>
          <CardDescription>
            {t.investorDashboard.tokenMetricsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">{t.investorDashboard.totalSupply}</div>
              <div className="text-xl font-bold">{token.totalSupply.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t.investorDashboard.tokenPrice}</div>
              <div className="text-xl font-bold">{fmt(token.tokenPrice, 2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t.investorDashboard.totalRaise}</div>
              <div className="text-xl font-bold">{fmt(token.totalRaise)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t.investorDashboard.annualYield}</div>
              <div className="text-xl font-bold text-green-600">{pct(token.yieldPercentage)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t.investorDashboard.distributionPerToken}</div>
              <div className="text-xl font-bold">{fmt(token.distributionPerToken, 2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t.investorDashboard.breakEven}</div>
              <div className="text-xl font-bold">{token.breakEvenMonths ? `${token.breakEvenMonths} ${t.common.months}` : t.common.notAvailable}</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
            <div className="text-sm">
              <strong>{t.investorDashboard.distributionModel}:</strong> {(token.revenueSharePercentage * 100).toFixed(0)}% {t.investorDashboard.ofEbitda} {token.distributionFrequency} {t.investorDashboard.in} {token.payoutCurrency}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Product */}
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">{t.investorDashboard.revenueByProduct}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">{t.investorDashboard.revenueDistribution}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByProduct}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => fmt(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">{t.investorDashboard.costStructure}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">{t.investorDashboard.opexVsCapex}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => fmt(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Projection */}
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{t.investorDashboard.cashFlowProjection}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">{t.investorDashboard.yearForecast.replace('{years}', projections.length.toString())}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'USD', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => fmt(value)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name={t.investorDashboard.revenue} />
              <Line type="monotone" dataKey="ebitda" stroke="#3b82f6" strokeWidth={2} name={t.investorDashboard.ebitda} />
              <Line type="monotone" dataKey="cashFlow" stroke="#8b5cf6" strokeWidth={2} name={t.investorDashboard.cashFlow} />
              <Line type="monotone" dataKey="cumulativeCashFlow" stroke="#f59e0b" strokeWidth={2} name={t.investorDashboard.cumulativeCF} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* EBITDA Progression */}
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{t.investorDashboard.ebitdaProgression}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">{t.investorDashboard.profitabilityMetrics}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value: number) => fmt(value)} />
              <Legend />
              <Bar dataKey="ebitda" fill="#3b82f6" name={t.investorDashboard.ebitda} />
              <Bar dataKey="netIncome" fill="#10b981" name={t.investorDashboard.netIncome} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* True Cost per Ton */}
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{t.investorDashboard.trueCostPerTon}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">{t.investorDashboard.completeCostAnalysis}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: '3" Chips', opex: costs.opexPerTon.chips_3, capex: costs.capexPerTon.chips_3, total: costs.trueCostPerTon.chips_3 },
              { name: '1" Chips', opex: costs.opexPerTon.chips_1, capex: costs.capexPerTon.chips_1, total: costs.trueCostPerTon.chips_1 },
              { name: 'Crumb Rubber', opex: costs.opexPerTon.crumb, capex: costs.capexPerTon.crumb, total: costs.trueCostPerTon.crumb },
            ].map((product, idx) => (
              <Card key={idx} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t.investorDashboard.opexPerTon}:</span>
                    <span className="font-semibold">{fmt(product.opex, 2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t.investorDashboard.capexPerTon}:</span>
                    <span className="font-semibold">{fmt(product.capex, 2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">{t.investorDashboard.trueCost}:</span>
                    <span className="font-bold text-primary text-lg">{fmt(product.total, 2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenario Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>{t.investorDashboard.activeScenario}:</span>
        <Badge variant="outline" className="capitalize">
          {data.configuration.plantConfig.activeScenario}
        </Badge>
        <span>|</span>
        <span>{t.investorDashboard.market}:</span>
        <Badge variant="outline" className="capitalize">
          {data.configuration.plantConfig.marketSplit}
        </Badge>
      </div>
    </div>
  );
}
