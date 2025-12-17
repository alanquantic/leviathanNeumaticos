'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, DollarSign, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

interface ProductRevenue {
  id: number;
  productName: string;
  productType: string;
  localPriceConservative: number;
  localPriceBase: number;
  localPriceAggressive: number;
  exportPriceConservative: number;
  exportPriceBase: number;
  exportPriceAggressive: number;
  primaryMarket: string;
  secondaryMarket: string | null;
  marketNotes: string | null;
}

export function RevenueModels() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<ProductRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/financials/revenues');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error(t.revenueModels.loadError);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, updates: Partial<ProductRevenue>) => {
    setSaving(id);
    try {
      const res = await fetch('/api/financials/revenues', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
        toast.success(`${updated.productName} ${t.revenueModels.updateSuccess}`);
      }
    } catch (error) {
      toast.error(t.revenueModels.updateError);
    } finally {
      setSaving(null);
    }
  };

  const handleInputChange = (id: number, field: keyof ProductRevenue, value: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [field]: parseFloat(value) || 0 };
      }
      return p;
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <Card key={product.id} className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {product.productName}
                  <Badge variant="secondary">{product.productType}</Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  <div><strong>{t.revenueModels.primaryMarket}:</strong> {product.primaryMarket}</div>
                  {product.secondaryMarket && (
                    <div><strong>{t.revenueModels.secondaryMarket}:</strong> {product.secondaryMarket}</div>
                  )}
                </CardDescription>
              </div>
              <Button
                onClick={() => updateProduct(product.id, product)}
                disabled={saving === product.id}
                size="sm"
              >
                {saving === product.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Save className="h-4 w-4 mr-2" />{t.common.save}</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="local" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="local">{t.revenueModels.localMarket}</TabsTrigger>
                <TabsTrigger value="export">{t.revenueModels.exportMarket}</TabsTrigger>
              </TabsList>

              <TabsContent value="local" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Conservative */}
                  <Card className="border-orange-200 dark:border-orange-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                        {t.revenueModels.conservative}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor={`local-cons-${product.id}`}>{t.revenueModels.pricePerTon}</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`local-cons-${product.id}`}
                            type="number"
                            value={product.localPriceConservative}
                            onChange={(e) => handleInputChange(product.id, 'localPriceConservative', e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Base */}
                  <Card className="border-blue-200 dark:border-blue-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Minus className="h-4 w-4 text-blue-500" />
                        {t.revenueModels.base}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor={`local-base-${product.id}`}>{t.revenueModels.pricePerTon}</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`local-base-${product.id}`}
                            type="number"
                            value={product.localPriceBase}
                            onChange={(e) => handleInputChange(product.id, 'localPriceBase', e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Aggressive */}
                  <Card className="border-green-200 dark:border-green-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        {t.revenueModels.aggressive}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor={`local-agg-${product.id}`}>{t.revenueModels.pricePerTon}</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`local-agg-${product.id}`}
                            type="number"
                            value={product.localPriceAggressive}
                            onChange={(e) => handleInputChange(product.id, 'localPriceAggressive', e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="export" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Conservative */}
                  <Card className="border-orange-200 dark:border-orange-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                        {t.revenueModels.conservative}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor={`export-cons-${product.id}`}>{t.revenueModels.pricePerTon}</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`export-cons-${product.id}`}
                            type="number"
                            value={product.exportPriceConservative}
                            onChange={(e) => handleInputChange(product.id, 'exportPriceConservative', e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Base */}
                  <Card className="border-blue-200 dark:border-blue-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Minus className="h-4 w-4 text-blue-500" />
                        {t.revenueModels.base}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor={`export-base-${product.id}`}>{t.revenueModels.pricePerTon}</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`export-base-${product.id}`}
                            type="number"
                            value={product.exportPriceBase}
                            onChange={(e) => handleInputChange(product.id, 'exportPriceBase', e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Aggressive */}
                  <Card className="border-green-200 dark:border-green-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        {t.revenueModels.aggressive}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor={`export-agg-${product.id}`}>{t.revenueModels.pricePerTon}</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`export-agg-${product.id}`}
                            type="number"
                            value={product.exportPriceAggressive}
                            onChange={(e) => handleInputChange(product.id, 'exportPriceAggressive', e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {product.marketNotes && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                <strong>{t.revenueModels.marketNotes}:</strong> {product.marketNotes}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
