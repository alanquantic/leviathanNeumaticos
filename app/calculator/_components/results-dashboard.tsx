'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Package, Download, FileText, Printer } from 'lucide-react';
import { exportToPDF, exportToCSV, printResults, type ExportData } from '@/lib/export-utils';
import { toast } from 'sonner';
import CostBreakdownChart from './cost-breakdown-chart';
import StageCostChart from './stage-cost-chart';
import { useLanguage } from '@/lib/i18n/context';

interface ResultsDashboardProps {
  results: any;
}

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  const { t } = useLanguage();
  const getProductName = () => {
    if (results?.productType === '3-inch') return '3" Nominal Chips';
    if (results?.productType === '1-inch') return '1" Chips';
    if (results?.productType === 'crumb') return 'Crumb Rubber';
    return 'Product';
  };

  const totalUtilities = results?.stages?.reduce(
    (sum: number, stage: any) => sum + (stage?.calculatedTotalUtilities ?? 0),
    0
  ) ?? 0;

  const totalProduction = results?.stages?.reduce(
    (sum: number, stage: any) => sum + (stage?.calculatedTotalProduction ?? 0),
    0
  ) ?? 0;

  const totalMaintenance = results?.stages?.reduce(
    (sum: number, stage: any) => sum + (stage?.calculatedTotalMaintenance ?? 0),
    0
  ) ?? 0;

  const handleExportPDF = () => {
    try {
      const exportData: ExportData = {
        productType: results?.productType ?? '',
        productName: getProductName(),
        stages: (results?.stages ?? []).map((stage: any) => ({
          stageNumber: stage?.stageNumber ?? 0,
          stageName: stage?.stageName ?? '',
          totalCostPerTon: stage?.calculatedTotalCost ?? 0,
          utilitiesCost: stage?.calculatedTotalUtilities ?? 0,
          productionLaborCost: stage?.calculatedTotalProduction ?? 0,
          maintenanceLaborCost: stage?.calculatedTotalMaintenance ?? 0,
        })),
        totalCostPerTon: results?.totalCostPerTon ?? 0,
        calculationDate: new Date().toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
      exportToPDF(exportData);
      toast.success(t.resultsDashboard.pdfSuccess);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error(t.resultsDashboard.pdfError);
    }
  };

  const handleExportCSV = () => {
    try {
      const exportData: ExportData = {
        productType: results?.productType ?? '',
        productName: getProductName(),
        stages: (results?.stages ?? []).map((stage: any) => ({
          stageNumber: stage?.stageNumber ?? 0,
          stageName: stage?.stageName ?? '',
          totalCostPerTon: stage?.calculatedTotalCost ?? 0,
          utilitiesCost: stage?.calculatedTotalUtilities ?? 0,
          productionLaborCost: stage?.calculatedTotalProduction ?? 0,
          maintenanceLaborCost: stage?.calculatedTotalMaintenance ?? 0,
        })),
        totalCostPerTon: results?.totalCostPerTon ?? 0,
        calculationDate: new Date().toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
      exportToCSV(exportData);
      toast.success(t.resultsDashboard.csvSuccess);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error(t.resultsDashboard.csvError);
    }
  };

  const handlePrint = () => {
    toast.info(t.resultsDashboard.openingPrintView);
    printResults();
  };

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <Card className="no-print bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t.resultsDashboard.exportResults}
          </CardTitle>
          <CardDescription>
            {t.resultsDashboard.exportDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExportPDF} variant="default" className="bg-red-600 hover:bg-red-700">
              <FileText className="mr-2 h-4 w-4" />
              {t.resultsDashboard.exportPdf}
            </Button>
            <Button onClick={handleExportCSV} variant="default" className="bg-green-600 hover:bg-green-700">
              <FileText className="mr-2 h-4 w-4" />
              {t.resultsDashboard.exportCsv}
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              {t.resultsDashboard.print}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.resultsDashboard.totalCostPerTon}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-700">
                ${((results?.totalCostPerTon ?? 0))?.toFixed?.(2) ?? '0.00'}
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.resultsDashboard.utilitiesCost}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
              ${totalUtilities?.toFixed?.(2) ?? '0.00'}
            </div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              {((totalUtilities / (results?.totalCostPerTon ?? 1)) * 100)?.toFixed?.(1) ?? '0.0'}% {t.resultsDashboard.ofTotal}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.resultsDashboard.productionLabor}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              ${totalProduction?.toFixed?.(2) ?? '0.00'}
            </div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              {((totalProduction / (results?.totalCostPerTon ?? 1)) * 100)?.toFixed?.(1) ?? '0.0'}% {t.resultsDashboard.ofTotal}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.resultsDashboard.maintenance}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              ${totalMaintenance?.toFixed?.(2) ?? '0.00'}
            </div>
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              {((totalMaintenance / (results?.totalCostPerTon ?? 1)) * 100)?.toFixed?.(1) ?? '0.0'}% {t.resultsDashboard.ofTotal}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">{t.resultsDashboard.costBreakdownByCategory}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">{t.resultsDashboard.costBreakdownDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <CostBreakdownChart
              utilities={totalUtilities}
              production={totalProduction}
              maintenance={totalMaintenance}
            />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">{t.resultsDashboard.costByStage}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">{t.resultsDashboard.costByStageDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <StageCostChart stages={results?.stages ?? []} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">{t.resultsDashboard.detailedStageBreakdown}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">{t.resultsDashboard.completeCostAnalysis} {getProductName()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {results?.stages?.map((stage: any, index: number) => (
            <div key={stage?.id} className="rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t.common.stage} {stage?.stageNumber}: {stage?.stageName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{stage?.machineName}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${((stage?.calculatedTotalCost ?? 0))?.toFixed?.(2) ?? '0.00'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.resultsDashboard.perTon}</div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900 p-3">
                  <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">{t.resultsDashboard.utilities}</div>
                  <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                    ${((stage?.calculatedTotalUtilities ?? 0))?.toFixed?.(2) ?? '0.00'}
                  </div>
                  <div className="mt-2 space-y-1">
                    {stage?.utilityCosts?.map((util: any) => (
                      <div key={util?.id} className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">{util?.name}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">${((util?.costPerTon ?? 0))?.toFixed?.(4) ?? '0.0000'}</span>
                      </div>
                    )) ?? []}
                  </div>
                </div>

                <div className="rounded-lg bg-green-100 dark:bg-green-900 p-3">
                  <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">{t.resultsDashboard.productionLabor}</div>
                  <div className="text-xl font-bold text-green-700 dark:text-green-400">
                    ${((stage?.calculatedTotalProduction ?? 0))?.toFixed?.(2) ?? '0.00'}
                  </div>
                  <div className="mt-2 space-y-1">
                    {stage?.productionLabor?.map((labor: any) => (
                      <div key={labor?.id} className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">{labor?.name}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">${((labor?.costPerTon ?? 0))?.toFixed?.(4) ?? '0.0000'}</span>
                      </div>
                    )) ?? []}
                  </div>
                </div>

                <div className="rounded-lg bg-orange-100 dark:bg-orange-900 p-3">
                  <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">{t.resultsDashboard.maintenance}</div>
                  <div className="text-xl font-bold text-orange-700 dark:text-orange-400">
                    ${((stage?.calculatedTotalMaintenance ?? 0))?.toFixed?.(2) ?? '0.00'}
                  </div>
                  <div className="mt-2 space-y-1">
                    {stage?.maintenanceLabor?.slice?.(0, 3)?.map?.((maint: any) => (
                      <div key={maint?.id} className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300 truncate">{maint?.name}:</span>
                        <span className="font-medium text-gray-900 dark:text-white ml-1">${((maint?.costPerTon ?? 0))?.toFixed?.(4) ?? '0.0000'}</span>
                      </div>
                    )) ?? []}
                  </div>
                </div>
              </div>
            </div>
          )) ?? []}
        </CardContent>
      </Card>
    </div>
  );
}
