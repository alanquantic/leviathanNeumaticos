'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

interface Equipment {
  id: number;
  machineName: string;
  stageNumber: number;
  purchasePrice: number;
  installationCost: number;
  totalCapex: number;
  usefulLifeYears: number;
  usefulLifeHours: number;
  annualMaintenanceRate: number;
  insuranceRate: number;
  financingType: string;
}

export function EquipmentFinancials() {
  const { t } = useLanguage();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await fetch('/api/financials/equipment');
      const data = await res.json();
      setEquipment(data);
    } catch (error) {
      toast.error(t.equipmentFinancials.loadError);
    } finally {
      setLoading(false);
    }
  };

  const updateEquipment = async (id: number, updates: Partial<Equipment>) => {
    setSaving(id);
    try {
      const res = await fetch('/api/financials/equipment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (res.ok) {
        const updated = await res.json();
        setEquipment(prev => prev.map(eq => eq.id === id ? updated : eq));
        toast.success(`${updated.machineName} ${t.equipmentFinancials.updateSuccess}`);
      }
    } catch (error) {
      toast.error(t.equipmentFinancials.updateError);
    } finally {
      setSaving(null);
    }
  };

  const handleInputChange = (id: number, field: keyof Equipment, value: string) => {
    setEquipment(prev => prev.map(eq => {
      if (eq.id === id) {
        const numValue = parseFloat(value) || 0;
        return { ...eq, [field]: numValue };
      }
      return eq;
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalCapex = equipment.reduce((sum, eq) => sum + eq.totalCapex, 0);
  const totalAnnualDepreciation = equipment.reduce(
    (sum, eq) => sum + eq.totalCapex / eq.usefulLifeYears,
    0
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.equipmentFinancials.totalCapexInvestment}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalCapex.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.equipmentFinancials.annualDepreciation}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalAnnualDepreciation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.equipmentFinancials.equipmentCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{equipment.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Details */}
      {equipment.map((eq) => {
        const annualDepreciation = eq.totalCapex / eq.usefulLifeYears;
        const annualMaintenance = eq.totalCapex * eq.annualMaintenanceRate;
        const annualInsurance = eq.totalCapex * eq.insuranceRate;
        const totalAnnualCost = annualDepreciation + annualMaintenance + annualInsurance;

        return (
          <Card key={eq.id} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {eq.machineName}
                    <Badge variant="outline">{t.common.stage} {eq.stageNumber}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {t.equipmentFinancials.totalAnnualCapexCost}: ${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => updateEquipment(eq.id, eq)}
                  disabled={saving === eq.id}
                  size="sm"
                >
                  {saving === eq.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <><Save className="h-4 w-4 mr-2" />{t.common.save}</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Purchase Price */}
                <div className="space-y-2">
                  <Label htmlFor={`purchase-${eq.id}`}>{t.equipmentFinancials.purchasePrice}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`purchase-${eq.id}`}
                      type="number"
                      value={eq.purchasePrice}
                      onChange={(e) => handleInputChange(eq.id, 'purchasePrice', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Installation Cost */}
                <div className="space-y-2">
                  <Label htmlFor={`install-${eq.id}`}>{t.equipmentFinancials.installationCost}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`install-${eq.id}`}
                      type="number"
                      value={eq.installationCost}
                      onChange={(e) => handleInputChange(eq.id, 'installationCost', e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Total CAPEX (Read-only) */}
                <div className="space-y-2">
                  <Label>{t.equipmentFinancials.totalCapex}</Label>
                  <div className="p-3 bg-muted rounded-md font-semibold">
                    ${(eq.purchasePrice + eq.installationCost).toLocaleString()}
                  </div>
                </div>

                {/* Useful Life Years */}
                <div className="space-y-2">
                  <Label htmlFor={`life-years-${eq.id}`}>{t.equipmentFinancials.usefulLifeYears}</Label>
                  <Input
                    id={`life-years-${eq.id}`}
                    type="number"
                    value={eq.usefulLifeYears}
                    onChange={(e) => handleInputChange(eq.id, 'usefulLifeYears', e.target.value)}
                  />
                </div>

                {/* Useful Life Hours */}
                <div className="space-y-2">
                  <Label htmlFor={`life-hours-${eq.id}`}>{t.equipmentFinancials.usefulLifeHours}</Label>
                  <Input
                    id={`life-hours-${eq.id}`}
                    type="number"
                    value={eq.usefulLifeHours}
                    onChange={(e) => handleInputChange(eq.id, 'usefulLifeHours', e.target.value)}
                  />
                </div>

                {/* Annual Maintenance Rate */}
                <div className="space-y-2">
                  <Label htmlFor={`maint-${eq.id}`}>{t.equipmentFinancials.maintenanceRate}</Label>
                  <Input
                    id={`maint-${eq.id}`}
                    type="number"
                    step="0.01"
                    value={eq.annualMaintenanceRate * 100}
                    onChange={(e) => handleInputChange(eq.id, 'annualMaintenanceRate', (parseFloat(e.target.value) / 100).toString())}
                  />
                </div>

                {/* Insurance Rate */}
                <div className="space-y-2">
                  <Label htmlFor={`ins-${eq.id}`}>{t.equipmentFinancials.insuranceRate}</Label>
                  <Input
                    id={`ins-${eq.id}`}
                    type="number"
                    step="0.01"
                    value={eq.insuranceRate * 100}
                    onChange={(e) => handleInputChange(eq.id, 'insuranceRate', (parseFloat(e.target.value) / 100).toString())}
                  />
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">{t.equipmentFinancials.annualCostBreakdown}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">{t.equipmentFinancials.depreciation}</div>
                    <div className="font-semibold">${annualDepreciation.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{t.equipmentFinancials.maintenance}</div>
                    <div className="font-semibold">${annualMaintenance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{t.equipmentFinancials.insurance}</div>
                    <div className="font-semibold">${annualInsurance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{t.equipmentFinancials.totalAnnual}</div>
                    <div className="font-semibold text-primary">${totalAnnualCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
