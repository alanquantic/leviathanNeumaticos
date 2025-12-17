'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Users, Wrench } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface CostEditorProps {
  stages: any[];
  onCostUpdate: (stageNumber: number, category: string, itemId: number, field: string, value: number) => void;
  customCosts: any;
}

export default function CostEditor({ stages, onCostUpdate, customCosts }: CostEditorProps) {
  const { t } = useLanguage();
  const getCustomValue = (stageNumber: number, category: string, itemId: number, field: string, defaultValue: number) => {
    const stageCustom = customCosts?.[stageNumber];
    const categoryCustom = stageCustom?.[category];
    const itemCustom = categoryCustom?.find?.((item: any) => item?.id === itemId);
    return itemCustom?.[field] ?? defaultValue;
  };

  return (
    <div className="space-y-8">
      {stages?.map((stage) => (
        <Card key={stage?.id} className="border-2">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="text-xl">
              {t.common.stage} {stage?.stageNumber}: {stage?.stageName}
            </CardTitle>
            <CardDescription>
              {stage?.machineName} | {stage?.inputProduct} → {stage?.finishProduct}
            </CardDescription>
            <div className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.costEditor.throughput}: {stage?.tonsPerHour} {t.costEditor.tonsHour}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold">{t.costEditor.utilityCosts}</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {stage?.utilityCosts?.map((util: any) => (
                  <Card key={util?.id} className="bg-yellow-50/50 dark:bg-yellow-900/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{util?.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor={`util-price-${util?.id}`} className="text-xs">
                          {t.costEditor.pricePerUnit}
                        </Label>
                        <Input
                          id={`util-price-${util?.id}`}
                          type="number"
                          step="0.01"
                          defaultValue={util?.pricePerUnit ?? 0}
                          onChange={(e) =>
                            onCostUpdate?.(
                              stage?.stageNumber ?? 0,
                              'utilities',
                              util?.id ?? 0,
                              'pricePerUnit',
                              parseFloat(e?.target?.value ?? '0') || 0
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`util-use-${util?.id}`} className="text-xs">
                          {t.costEditor.usePerHour}
                        </Label>
                        <Input
                          id={`util-use-${util?.id}`}
                          type="number"
                          step="0.01"
                          defaultValue={util?.usePerHour ?? 0}
                          onChange={(e) =>
                            onCostUpdate?.(
                              stage?.stageNumber ?? 0,
                              'utilities',
                              util?.id ?? 0,
                              'usePerHour',
                              parseFloat(e?.target?.value ?? '0') || 0
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                      <div className="pt-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                        {t.costEditor.costTon}: ${((util?.costPerTon ?? 0))?.toFixed?.(4) ?? '0.0000'}
                      </div>
                    </CardContent>
                  </Card>
                )) ?? []}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">{t.costEditor.productionLabor}</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {stage?.productionLabor?.map((labor: any) => (
                  <Card key={labor?.id} className="bg-blue-50/50 dark:bg-blue-900/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{labor?.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor={`labor-cost-${labor?.id}`} className="text-xs">
                          {t.costEditor.costPerHour}
                        </Label>
                        <Input
                          id={`labor-cost-${labor?.id}`}
                          type="number"
                          step="0.01"
                          defaultValue={labor?.costPerHour ?? 0}
                          onChange={(e) =>
                            onCostUpdate?.(
                              stage?.stageNumber ?? 0,
                              'production',
                              labor?.id ?? 0,
                              'costPerHour',
                              parseFloat(e?.target?.value ?? '0') || 0
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`labor-use-${labor?.id}`} className="text-xs">
                          {t.costEditor.usePerHourRange}
                        </Label>
                        <Input
                          id={`labor-use-${labor?.id}`}
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          defaultValue={labor?.usePerHour ?? 0}
                          onChange={(e) =>
                            onCostUpdate?.(
                              stage?.stageNumber ?? 0,
                              'production',
                              labor?.id ?? 0,
                              'usePerHour',
                              parseFloat(e?.target?.value ?? '0') || 0
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                      <div className="pt-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                        {t.costEditor.costTon}: ${((labor?.costPerTon ?? 0))?.toFixed?.(4) ?? '0.0000'}
                      </div>
                    </CardContent>
                  </Card>
                )) ?? []}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold">{t.costEditor.maintenanceLabor}</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {stage?.maintenanceLabor?.map((maint: any) => (
                  <Card key={maint?.id} className="bg-orange-50/50 dark:bg-orange-900/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{maint?.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600 dark:text-gray-300">{t.costEditor.productionHours}:</span>
                          <div className="font-medium">{maint?.productionHours ?? 0}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-300">{t.costEditor.productionTons}:</span>
                          <div className="font-medium">{maint?.productionTons ?? 0}</div>
                        </div>
                      </div>
                      <div className="pt-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                        {t.costEditor.costTon}: ${((maint?.costPerTon ?? 0))?.toFixed?.(4) ?? '0.0000'}
                      </div>
                    </CardContent>
                  </Card>
                )) ?? []}
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.resultsDashboard.utilities}</div>
                  <div className="text-xl font-bold text-blue-700">
                    ${((stage?.totalUtilitiesCostPerTon ?? 0))?.toFixed?.(2) ?? '0.00'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.costEditor.productionLabor}</div>
                  <div className="text-xl font-bold text-green-700">
                    ${((stage?.totalProductionLaborCostPerTon ?? 0))?.toFixed?.(2) ?? '0.00'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.resultsDashboard.maintenance}</div>
                  <div className="text-xl font-bold text-orange-700">
                    ${((stage?.totalMaintenanceLaborCostPerTon ?? 0))?.toFixed?.(2) ?? '0.00'}
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-300 pt-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-300">{t.costEditor.stageTotalCost}</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${((stage?.totalCostPerTon ?? 0))?.toFixed?.(2) ?? '0.00'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )) ?? []}
    </div>
  );
}
