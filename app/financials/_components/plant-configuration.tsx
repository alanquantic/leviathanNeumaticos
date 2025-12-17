'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2, Save, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

interface PlantConfig {
  id: number;
  name: string;
  tonsPerDay: number;
  operatingDaysPerYear: number;
  uptimePercentage: number;
  productMixChips3: number;
  productMixChips1: number;
  productMixCrumb: number;
  activeScenario: string;
  marketSplit: string;
  localExportRatio: number;
  discountRate: number;
  projectionYears: number;
}

export function PlantConfiguration() {
  const { t } = useLanguage();
  const [config, setConfig] = useState<PlantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/financials/plant-config');
      const data = await res.json();
      setConfig(data);
    } catch (error) {
      toast.error(t.plantConfig.loadError);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/financials/plant-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      
      if (res.ok) {
        const updated = await res.json();
        setConfig(updated);
        toast.success(t.plantConfig.configSaved);
      }
    } catch (error) {
      toast.error(t.plantConfig.saveError);
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof PlantConfig>(field: K, value: PlantConfig[K]) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalMix = config.productMixChips3 + config.productMixChips1 + config.productMixCrumb;
  const effectiveTons = config.tonsPerDay * config.uptimePercentage;
  const annualTons = effectiveTons * config.operatingDaysPerYear;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {config.name === 'Default Plant Configuration' ? t.plantConfig.defaultPlantName : config.name}
          </CardTitle>
          <CardDescription>
            {t.plantConfig.annualProduction}: {annualTons.toLocaleString(undefined, { maximumFractionDigits: 0 })} {t.plantConfig.tonsYear}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.plantConfig.operationalParams}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tonsPerDay">{t.plantConfig.tonsPerDay}</Label>
              <Input
                id="tonsPerDay"
                type="number"
                value={config.tonsPerDay}
                onChange={(e) => updateField('tonsPerDay', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingDays">{t.plantConfig.operatingDays}</Label>
              <Input
                id="operatingDays"
                type="number"
                value={config.operatingDaysPerYear}
                onChange={(e) => updateField('operatingDaysPerYear', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uptime">
                {t.plantConfig.uptimePercentage}: {(config.uptimePercentage * 100).toFixed(0)}%
              </Label>
              <Slider
                id="uptime"
                value={[config.uptimePercentage * 100]}
                onValueChange={(values) => updateField('uptimePercentage', values[0] / 100)}
                min={50}
                max={100}
                step={1}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground">
                {t.plantConfig.effective}: {effectiveTons.toFixed(1)} {t.plantConfig.tonsDay}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Product Mix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.plantConfig.productMix}</CardTitle>
            <CardDescription>
              {t.common.total}: {totalMix.toFixed(0)}% {totalMix !== 100 && (
                <span className="text-destructive font-semibold">({t.plantConfig.mustEqual100})</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mix3">
                {t.plantConfig.chips3}: {config.productMixChips3.toFixed(0)}%
              </Label>
              <Slider
                id="mix3"
                value={[config.productMixChips3]}
                onValueChange={(values) => updateField('productMixChips3', values[0])}
                min={0}
                max={100}
                step={1}
              />
              <p className="text-sm text-muted-foreground">
                {(annualTons * config.productMixChips3 / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })} {t.plantConfig.tonsYear}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mix1">
                {t.plantConfig.chips1}: {config.productMixChips1.toFixed(0)}%
              </Label>
              <Slider
                id="mix1"
                value={[config.productMixChips1]}
                onValueChange={(values) => updateField('productMixChips1', values[0])}
                min={0}
                max={100}
                step={1}
              />
              <p className="text-sm text-muted-foreground">
                {(annualTons * config.productMixChips1 / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })} {t.plantConfig.tonsYear}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mixCrumb">
                {t.plantConfig.crumbRubber}: {config.productMixCrumb.toFixed(0)}%
              </Label>
              <Slider
                id="mixCrumb"
                value={[config.productMixCrumb]}
                onValueChange={(values) => updateField('productMixCrumb', values[0])}
                min={0}
                max={100}
                step={1}
              />
              <p className="text-sm text-muted-foreground">
                {(annualTons * config.productMixCrumb / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })} {t.plantConfig.tonsYear}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scenario & Market */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.plantConfig.pricingScenario}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scenario">{t.plantConfig.activePricingScenario}</Label>
              <Select 
                value={config.activeScenario} 
                onValueChange={(value) => updateField('activeScenario', value)}
              >
                <SelectTrigger id="scenario">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">{t.revenueModels.conservative}</SelectItem>
                  <SelectItem value="base">{t.revenueModels.base}</SelectItem>
                  <SelectItem value="aggressive">{t.revenueModels.aggressive}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="market">{t.plantConfig.marketSplit}</Label>
              <Select 
                value={config.marketSplit} 
                onValueChange={(value) => updateField('marketSplit', value)}
              >
                <SelectTrigger id="market">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">{t.plantConfig.local}</SelectItem>
                  <SelectItem value="export">{t.plantConfig.export}</SelectItem>
                  <SelectItem value="mixed">{t.plantConfig.mixed}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.marketSplit === 'mixed' && (
              <div className="space-y-2">
                <Label htmlFor="ratio">
                  {t.plantConfig.localExportRatio}: {(config.localExportRatio * 100).toFixed(0)}% {t.plantConfig.localPercentage}
                </Label>
                <Slider
                  id="ratio"
                  value={[config.localExportRatio * 100]}
                  onValueChange={(values) => updateField('localExportRatio', values[0] / 100)}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.plantConfig.financialParams}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discount">
                {t.plantConfig.discountRateWacc}: {(config.discountRate * 100).toFixed(1)}%
              </Label>
              <Slider
                id="discount"
                value={[config.discountRate * 100]}
                onValueChange={(values) => updateField('discountRate', values[0] / 100)}
                min={5}
                max={20}
                step={0.5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years">{t.plantConfig.projectionPeriod}</Label>
              <Input
                id="years"
                type="number"
                value={config.projectionYears}
                onChange={(e) => updateField('projectionYears', parseInt(e.target.value) || 15)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveConfig} disabled={saving || totalMix !== 100} size="lg">
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          {t.plantConfig.saveConfiguration}
        </Button>
      </div>

      {totalMix !== 100 && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
          <strong>{t.common.error}:</strong> {t.plantConfig.mixWarning}
        </div>
      )}
    </div>
  );
}
