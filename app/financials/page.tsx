'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EquipmentFinancials } from './_components/equipment-financials';
import { RevenueModels } from './_components/revenue-models';
import { PlantConfiguration } from './_components/plant-configuration';
import { TokenModel } from './_components/token-model';
import { InvestorDashboard } from './_components/investor-dashboard';
import { TippingFeeConfig } from './_components/tipping-fee-config';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Building2, DollarSign, Settings, Coins, TrendingUp, Banknote } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function FinancialsPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    if (tabParam && ['dashboard', 'equipment', 'revenue', 'plant', 'tipping', 'token'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumbs />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {t.financials.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t.financials.subtitle}
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t.financials.dashboard}</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t.financials.equipment}</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">{t.financials.revenue}</span>
            </TabsTrigger>
            <TabsTrigger value="plant" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t.financials.plant}</span>
            </TabsTrigger>
            <TabsTrigger value="tipping" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              <span className="hidden sm:inline">{t.financials.tippingFee}</span>
            </TabsTrigger>
            <TabsTrigger value="token" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              <span className="hidden sm:inline">{t.financials.token}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <InvestorDashboard />
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.financials.equipmentTitle}</CardTitle>
                <CardDescription>
                  {t.financials.equipmentDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EquipmentFinancials />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.financials.revenueTitle}</CardTitle>
                <CardDescription>
                  {t.financials.revenueDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueModels />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plant" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.financials.plantTitle}</CardTitle>
                <CardDescription>
                  {t.financials.plantDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlantConfiguration />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tipping" className="space-y-4">
            <TippingFeeConfig />
          </TabsContent>

          <TabsContent value="token" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.financials.tokenTitle}</CardTitle>
                <CardDescription>
                  {t.financials.tokenDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TokenModel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
