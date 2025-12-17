'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

interface TippingFeeProfile {
  id: number;
  name: string;
  description?: string;
  feeLow: number;
  feeBase: number;
  feeHigh: number;
  components: Array<{
    componentName: string;
    amountLow: number;
    amountBase: number;
    amountHigh: number;
    isPassThrough: boolean;
    category: string;
  }>;
}

interface ProjectAssumption {
  id: number;
  tippingFeeEnabled: boolean;
  tippingFeeProfileId: number | null;
  tippingFeeScenario: string;
  tippingFeeApplyPercentage: number;
  contractConfidence: string;
  contractTenorMonths: number | null;
  contractConcentration: number;
  expectedTonnagePerYear: number | null;
}

interface TippingFeeCalculation {
  breakdown: {
    feeTotal: number;
    passThrough: number;
    netToRecycler: number;
  };
  revenue: {
    revenueTF: number;
    revenueSales: number;
    revenueTotal: number;
    tfShare: number;
    includeInBaseCase: boolean;
  };
  baseCase: {
    ebitda: number;
    revenue: number;
    margin: number;
    viability: {
      isViable: boolean;
      status: string;
      message: string;
    };
  };
  withTipping: {
    ebitda: number;
    revenue: number;
    margin: number;
    viability: {
      isViable: boolean;
      status: string;
      message: string;
    };
  };
}

export function TippingFeeConfig() {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<TippingFeeProfile[]>([]);
  const [assumption, setAssumption] = useState<ProjectAssumption | null>(null);
  const [calculation, setCalculation] = useState<TippingFeeCalculation | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [enabled, setEnabled] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [scenario, setScenario] = useState<string>('BASE');
  const [applyPercentage, setApplyPercentage] = useState<number>(100);
  const [contractConfidence, setContractConfidence] = useState<string>('NONE');
  const [contractTenorMonths, setContractTenorMonths] = useState<number | null>(null);
  const [contractConcentration, setContractConcentration] = useState<number>(0);
  const [expectedTonnage, setExpectedTonnage] = useState<number | null>(null);
  
  // Feed-in model state
  const [feedInValue, setFeedInValue] = useState<number | null>(null);
  const [retainedShareLow, setRetainedShareLow] = useState<number>(30);
  const [retainedShareBase, setRetainedShareBase] = useState<number>(45);
  const [retainedShareHigh, setRetainedShareHigh] = useState<number>(60);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load profiles
      const profilesRes = await fetch('/api/tipping-fee/profiles');
      const profilesData = await profilesRes.json();
      setProfiles(profilesData);

      // Load current assumption
      const assumptionRes = await fetch('/api/tipping-fee/assumptions');
      const assumptionData = await assumptionRes.json();
      setAssumption(assumptionData);

      // Set form values
      setEnabled(assumptionData.tippingFeeEnabled);
      setSelectedProfileId(assumptionData.tippingFeeProfileId);
      setScenario(assumptionData.tippingFeeScenario);
      setApplyPercentage(assumptionData.tippingFeeApplyPercentage);
      setContractConfidence(assumptionData.contractConfidence);
      setContractTenorMonths(assumptionData.contractTenorMonths);
      setContractConcentration(assumptionData.contractConcentration);
      setExpectedTonnage(assumptionData.expectedTonnagePerYear);

      // Calculate initial values if enabled
      if (assumptionData.tippingFeeEnabled && assumptionData.tippingFeeProfileId) {
        await calculateTippingFee();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error(t.tippingFeeConfig.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const body = {
        tippingFeeEnabled: enabled,
        tippingFeeProfileId: selectedProfileId,
        tippingFeeScenario: enabled ? scenario : 'OFF',
        tippingFeeApplyPercentage: applyPercentage,
        contractConfidence,
        contractTenorMonths,
        contractConcentration,
        expectedTonnagePerYear: expectedTonnage,
      };

      const res = await fetch('/api/tipping-fee/assumptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(t.tippingFeeConfig.configSaved);
        await calculateTippingFee();
      } else {
        toast.error(t.tippingFeeConfig.saveError);
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error(t.tippingFeeConfig.saveError);
    }
  };

  const calculateTippingFee = async () => {
    if (!enabled || !selectedProfileId || scenario === 'OFF') {
      setCalculation(null);
      return;
    }

    try {
      // Get plant config for throughput
      const plantRes = await fetch('/api/financials/plant-config');
      const plantData = await plantRes.json();
      const throughput = plantData[0]?.tonsPerDay * plantData[0]?.operatingDaysPerYear || 33000;

      // Simplified revenue calculation (would use actual product prices in real scenario)
      const revenueSales = 3000000; // Placeholder
      const totalCosts = 2000000; // Placeholder

      const res = await fetch('/api/tipping-fee/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: selectedProfileId,
          scenario,
          applyPercentage,
          contractConfidence,
          throughputTonsPerYear: throughput,
          revenueSales,
          totalCosts,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCalculation(data);
      }
    } catch (error) {
      console.error('Error calculating:', error);
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      NONE: { color: 'bg-gray-200 text-gray-700', label: 'None' },
      VERBAL: { color: 'bg-yellow-200 text-yellow-800', label: 'Verbal' },
      LOI: { color: 'bg-blue-200 text-blue-800', label: 'LOI' },
      SIGNED: { color: 'bg-green-200 text-green-800', label: 'Signed' },
    };
    const conf = variants[confidence] || variants.NONE;
    return <Badge className={conf.color}>{conf.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            {t.tippingFeeConfig.title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            {t.tippingFeeConfig.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enabled" className="text-base font-medium">
                {t.tippingFeeConfig.enableTippingFee}
              </Label>
              <p className="text-sm text-gray-500">{t.tippingFeeConfig.enableDesc}</p>
            </div>
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          {enabled && (
            <>
              {/* Profile Selector */}
              <div className="space-y-2">
                <Label>{t.tippingFeeConfig.profile}</Label>
                <Select
                  value={selectedProfileId?.toString()}
                  onValueChange={(val) => setSelectedProfileId(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.tippingFeeConfig.selectProfile} />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id.toString()}>
                        {profile.name} (${profile.feeBase}/ton base)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scenario Selector */}
              <div className="space-y-2">
                <Label>{t.tippingFeeConfig.scenario}</Label>
                <Select value={scenario} onValueChange={setScenario}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">{t.tippingFeeConfig.lowConservative}</SelectItem>
                    <SelectItem value="BASE">{t.tippingFeeConfig.baseCase}</SelectItem>
                    <SelectItem value="HIGH">{t.tippingFeeConfig.highAggressive}</SelectItem>
                    <SelectItem value="OFF">{t.tippingFeeConfig.off}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Apply Percentage Slider */}
              <div className="space-y-2">
                <Label>{t.tippingFeeConfig.applyToVolume}</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[applyPercentage]}
                    onValueChange={(vals) => setApplyPercentage(vals[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">{applyPercentage}%</span>
                </div>
                <p className="text-xs text-gray-500">
                  {t.tippingFeeConfig.applyToVolumeDesc}
                </p>
              </div>

              {/* Contract Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.tippingFeeConfig.contractConfidence}</Label>
                  <Select value={contractConfidence} onValueChange={setContractConfidence}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">{t.tippingFeeConfig.none}</SelectItem>
                      <SelectItem value="VERBAL">{t.tippingFeeConfig.verbal}</SelectItem>
                      <SelectItem value="LOI">{t.tippingFeeConfig.loi}</SelectItem>
                      <SelectItem value="SIGNED">{t.tippingFeeConfig.signed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t.tippingFeeConfig.contractTenor}</Label>
                  <Input
                    type="number"
                    value={contractTenorMonths || ''}
                    onChange={(e) => setContractTenorMonths(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="24"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.tippingFeeConfig.customerConcentration}</Label>
                  <Input
                    type="number"
                    value={contractConcentration}
                    onChange={(e) => setContractConcentration(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.tippingFeeConfig.expectedTonnage}</Label>
                  <Input
                    type="number"
                    value={expectedTonnage || ''}
                    onChange={(e) => setExpectedTonnage(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="10000"
                  />
                </div>
              </div>

              {/* Warning for non-SIGNED contracts */}
              {contractConfidence !== 'SIGNED' && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">
                      {t.tippingFeeConfig.baseCaseExclusion}
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      {t.tippingFeeConfig.baseCaseExclusionDesc}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          <Button onClick={handleSave} className="w-full">
            {t.tippingFeeConfig.saveConfiguration}
          </Button>
        </CardContent>
      </Card>

      {/* KPI Display */}
      {enabled && calculation && (
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">{t.tippingFeeConfig.revenueAnalysis}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fee Breakdown - New Semantics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-700 mb-1">{t.tippingFeeConfig.retainedShare}</p>
                <p className="text-3xl font-bold text-green-700">
                  {calculation.breakdown.feeTotal > 0 
                    ? ((calculation.breakdown.netToRecycler / calculation.breakdown.feeTotal) * 100).toFixed(1)
                    : '0.0'}%
                </p>
                <p className="text-xs text-gray-600 mt-1">{t.tippingFeeConfig.keptByRecycler}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-700 mb-1">{t.tippingFeeConfig.tfNet} ({scenario})</p>
                <p className="text-3xl font-bold text-blue-700">
                  ${calculation.breakdown.netToRecycler.toFixed(0)}
                </p>
                <p className="text-xs text-gray-600 mt-1">{t.tippingFeeConfig.usdPerTon}</p>
                {!feedInValue && (
                  <Badge variant="outline" className="mt-2 text-xs bg-amber-50 text-amber-700 border-amber-300">
                    {t.tippingFeeConfig.componentBased}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Component Breakdown (collapsible details) */}
            <details className="bg-gray-50 rounded-lg p-3">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                {t.tippingFeeConfig.componentBreakdown} ({t.common.total}: ${calculation.breakdown.feeTotal.toFixed(2)}/ton)
              </summary>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.tippingFeeConfig.netToRecycler}:</span>
                  <span className="font-medium text-green-700">${calculation.breakdown.netToRecycler.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.tippingFeeConfig.passThrough}:</span>
                  <span className="font-medium text-red-700">${calculation.breakdown.passThrough.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-700 font-medium">{t.tippingFeeConfig.totalFee}:</span>
                  <span className="font-bold text-gray-900">${calculation.breakdown.feeTotal.toFixed(2)}</span>
                </div>
              </div>
            </details>

            {/* Revenue Comparison */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 border-2 rounded-lg">
                <p className="text-sm text-gray-600">{t.tippingFeeConfig.productSales}</p>
                <p className="text-xl font-bold text-gray-900">
                  ${(calculation.revenue.revenueSales / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="text-center p-4 border-2 rounded-lg">
                <p className="text-sm text-gray-600">{t.tippingFeeConfig.tippingFeeRev}</p>
                <p className="text-xl font-bold text-gray-900">
                  ${(calculation.revenue.revenueTF / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="text-center p-4 border-2 border-indigo-500 rounded-lg">
                <p className="text-sm text-indigo-600">{t.tippingFeeConfig.totalRevenue}</p>
                <p className="text-xl font-bold text-indigo-700">
                  ${(calculation.revenue.revenueTotal / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>

            {/* TF Share */}
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-900">{t.tippingFeeConfig.tfShare}</p>
                  <p className="text-xs text-indigo-600 mt-1">
                    {t.tippingFeeConfig.tfShareDesc}
                  </p>
                </div>
                <p className="text-3xl font-bold text-indigo-700">
                  {calculation.revenue.tfShare.toFixed(1)}%
                </p>
              </div>
              {calculation.revenue.tfShare > 40 && (
                <div className="mt-3 flex items-start gap-2 p-2 bg-amber-100 rounded">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    {t.tippingFeeConfig.highTfDependency.replace('{share}', calculation.revenue.tfShare.toFixed(0))}
                  </p>
                </div>
              )}
            </div>

            {/* Base Case vs With-Tipping Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-sm">{t.tippingFeeConfig.baseCaseWoTf}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t.investorDashboard.ebitda}</span>
                    <span className="font-medium">${(calculation.baseCase.ebitda / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t.tippingFeeConfig.ebitdaMargin}</span>
                    <span className="font-medium">{calculation.baseCase.margin.toFixed(1)}%</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    {calculation.baseCase.viability.isViable ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-medium">{t.tippingFeeConfig.viable}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">{t.tippingFeeConfig.notViable}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-indigo-300">
                <CardHeader>
                  <CardTitle className="text-sm text-indigo-700">{t.tippingFeeConfig.withTippingFee}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t.investorDashboard.ebitda}</span>
                    <span className="font-medium">${(calculation.withTipping.ebitda / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t.tippingFeeConfig.ebitdaMargin}</span>
                    <span className="font-medium">{calculation.withTipping.margin.toFixed(1)}%</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    {calculation.withTipping.viability.isViable ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-medium">{t.tippingFeeConfig.viable}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">{t.tippingFeeConfig.notViable}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
