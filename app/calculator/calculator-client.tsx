'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Calculator, TrendingUp, Settings, Download } from 'lucide-react';
import ProductSelection from '@/app/calculator/_components/product-selection';
import CostEditor from '@/app/calculator/_components/cost-editor';
import ResultsDashboard from '@/app/calculator/_components/results-dashboard';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

type ProductType = '3-inch' | '1-inch' | 'crumb' | null;

export default function CalculatorClient() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [productType, setProductType] = useState<ProductType>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [customCosts, setCustomCosts] = useState<any>({});
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('selection');

  useEffect(() => {
    const product = searchParams?.get('product') as ProductType;
    if (product && ['3-inch', '1-inch', 'crumb'].includes(product)) {
      setProductType(product);
      loadStages();
      setActiveTab('editor'); // Automatically switch to editor tab when product is pre-selected
    }
  }, [searchParams]);

  const loadStages = async () => {
    try {
      const response = await fetch('/api/stages');
      if (response?.ok) {
        const data = await response.json();
        setStages(data ?? []);
      }
    } catch (error) {
      console.error('Error loading stages:', error);
      toast.error('Failed to load stage data');
    }
  };

  const handleProductSelect = (product: ProductType) => {
    setProductType(product);
    setCustomCosts({});
    setResults(null);
    loadStages();
    setActiveTab('editor');
  };

  const handleCalculate = async () => {
    if (!productType) {
      toast.error('Please select a product type');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productType, customCosts }),
      });

      if (response?.ok) {
        const data = await response.json();
        setResults(data ?? null);
        setActiveTab('results');
        toast.success('Calculation completed successfully');
      } else {
        toast.error('Failed to calculate costs');
      }
    } catch (error) {
      console.error('Error calculating:', error);
      toast.error('An error occurred during calculation');
    } finally {
      setLoading(false);
    }
  };

  const handleCostUpdate = (stageNumber: number, category: string, itemId: number, field: string, value: number) => {
    setCustomCosts((prev: any) => ({
      ...prev,
      [stageNumber]: {
        ...(prev?.[stageNumber] ?? {}),
        [category]: [
          ...((prev?.[stageNumber]?.[category] ?? []) as any[])?.filter((item: any) => item?.id !== itemId) ?? [],
          { id: itemId, [field]: value },
        ],
      },
    }));
  };

  const getProductTitle = () => {
    if (productType) return t.calculator.productTitle[productType];
    return t.calculator.productTitle.select;
  };

  const getStagesForProduct = () => {
    if (productType === '3-inch') return stages?.slice(0, 1) ?? [];
    if (productType === '1-inch') return stages?.slice(0, 2) ?? [];
    if (productType === 'crumb') return stages ?? [];
    return [];
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{getProductTitle()}</CardTitle>
              <CardDescription>
                {productType
                  ? t.calculator.configureCosts
                  : t.calculator.chooseProduct}
              </CardDescription>
            </div>
            {productType && (
              <Button
                onClick={handleCalculate}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Calculator className="mr-2 h-5 w-5" />
                {loading ? t.calculator.calculating : t.calculator.calculate}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="selection" 
            className="flex items-center gap-2"
            onClick={() => setActiveTab('selection')}
          >
            <Package className="h-4 w-4" />
            {t.calculator.selectProduct}
          </TabsTrigger>
          <TabsTrigger 
            value="editor" 
            className="flex items-center gap-2" 
            disabled={!productType}
            onClick={() => productType && setActiveTab('editor')}
          >
            <Settings className="h-4 w-4" />
            {t.calculator.editCosts}
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            className="flex items-center gap-2" 
            disabled={!results}
            onClick={() => results && setActiveTab('results')}
          >
            <TrendingUp className="h-4 w-4" />
            {t.calculator.viewResults}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="selection" className="mt-6">
          <ProductSelection onSelect={handleProductSelect} selectedProduct={productType} />
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          {productType && (
            <CostEditor
              stages={getStagesForProduct()}
              onCostUpdate={handleCostUpdate}
              customCosts={customCosts}
            />
          )}
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {results && <ResultsDashboard results={results} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
