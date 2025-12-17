'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2, Save, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/context';

interface TokenModelData {
  id: number;
  plantName: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: number;
  tokenPrice: number;
  totalRaise: number;
  revenueSharePercentage: number;
  distributionFrequency: string;
  payoutCurrency: string;
  spvJurisdiction: string;
  tokenType: string;
}

export function TokenModel() {
  const { t } = useLanguage();
  const [token, setToken] = useState<TokenModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const res = await fetch('/api/financials/token');
      const data = await res.json();
      setToken(data);
    } catch (error) {
      toast.error(t.tokenModel.loadError);
    } finally {
      setLoading(false);
    }
  };

  const saveToken = async () => {
    if (!token) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/financials/token', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(token),
      });
      
      if (res.ok) {
        const updated = await res.json();
        setToken(updated);
        toast.success(t.tokenModel.tokenSaved);
      }
    } catch (error) {
      toast.error(t.tokenModel.saveError);
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof TokenModelData>(field: K, value: TokenModelData[K]) => {
    if (!token) return;
    setToken({ ...token, [field]: value });
  };

  if (loading || !token) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Coins className="h-6 w-6 text-primary" />
            {token.tokenSymbol} - {token.tokenName}
          </CardTitle>
          <CardDescription className="text-base">
            {t.tokenModel.totalRaise}: <span className="font-bold text-lg">${token.totalRaise.toLocaleString()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{token.totalSupply.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t.tokenModel.totalSupply}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">${token.tokenPrice}</div>
              <div className="text-sm text-muted-foreground">{t.tokenModel.pricePerToken}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{(token.revenueSharePercentage * 100).toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">{t.tokenModel.ebitdaDistributed}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary capitalize">
                {token.distributionFrequency === 'monthly' ? t.tokenModel.monthly :
                 token.distributionFrequency === 'quarterly' ? t.tokenModel.quarterly :
                 token.distributionFrequency === 'annually' ? t.tokenModel.annually :
                 token.distributionFrequency}
              </div>
              <div className="text-sm text-muted-foreground">{t.tokenModel.distribution}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Details */}
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">{t.tokenModel.tokenDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plantName">{t.tokenModel.plantName}</Label>
              <Input
                id="plantName"
                value={token.plantName}
                onChange={(e) => updateField('plantName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenName">{t.tokenModel.tokenName}</Label>
              <Input
                id="tokenName"
                value={token.tokenName}
                onChange={(e) => updateField('tokenName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol">{t.tokenModel.tokenSymbol}</Label>
              <Input
                id="symbol"
                value={token.tokenSymbol}
                onChange={(e) => updateField('tokenSymbol', e.target.value.toUpperCase())}
                placeholder="e.g., TRP1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Token Economics */}
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">{t.tokenModel.tokenEconomics}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supply">{t.tokenModel.totalSupply}</Label>
              <Input
                id="supply"
                type="number"
                value={token.totalSupply}
                onChange={(e) => updateField('totalSupply', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t.tokenModel.tokenPriceUsd}</Label>
              <Input
                id="price"
                type="number"
                value={token.tokenPrice}
                onChange={(e) => updateField('tokenPrice', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="raise">{t.tokenModel.totalRaiseCalc}</Label>
              <div className="p-3 bg-muted rounded-md font-bold text-lg">
                ${(token.totalSupply * token.tokenPrice).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Model */}
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">{t.tokenModel.distributionModel}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revShare">
                {t.tokenModel.revenueShare}: {(token.revenueSharePercentage * 100).toFixed(0)}% {t.tokenModel.ofEbitda}
              </Label>
              <Slider
                id="revShare"
                value={[token.revenueSharePercentage * 100]}
                onValueChange={(values) => updateField('revenueSharePercentage', values[0] / 100)}
                min={50}
                max={90}
                step={5}
              />
              <p className="text-sm text-muted-foreground">
                {(100 - token.revenueSharePercentage * 100).toFixed(0)}% {t.tokenModel.retainedForOps}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">{t.tokenModel.distributionFrequency}</Label>
              <Select 
                value={token.distributionFrequency} 
                onValueChange={(value) => updateField('distributionFrequency', value)}
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t.tokenModel.monthly}</SelectItem>
                  <SelectItem value="quarterly">{t.tokenModel.quarterly}</SelectItem>
                  <SelectItem value="annually">{t.tokenModel.annually}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">{t.tokenModel.payoutCurrency}</Label>
              <Select 
                value={token.payoutCurrency} 
                onValueChange={(value) => updateField('payoutCurrency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Legal Structure */}
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">{t.tokenModel.legalStructure}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jurisdiction">{t.tokenModel.spvJurisdiction}</Label>
              <Input
                id="jurisdiction"
                value={token.spvJurisdiction}
                onChange={(e) => updateField('spvJurisdiction', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenType">{t.tokenModel.tokenType}</Label>
              <Select 
                value={token.tokenType} 
                onValueChange={(value) => updateField('tokenType', value)}
              >
                <SelectTrigger id="tokenType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue_share">{t.tokenModel.revenueShareNonEquity}</SelectItem>
                  <SelectItem value="profit_share">{t.tokenModel.profitShare}</SelectItem>
                  <SelectItem value="hybrid">{t.tokenModel.hybrid}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg text-sm">
              <strong>{t.common.error?.split(':')[0] || 'Note'}:</strong> {t.tokenModel.legalNote}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveToken} disabled={saving} size="lg">
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          {t.tokenModel.saveTokenModel}
        </Button>
      </div>
    </div>
  );
}
