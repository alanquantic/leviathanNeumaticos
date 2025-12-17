'use client';

import Link from 'next/link';
import { Calculator, Package, Settings, TrendingUp, DollarSign, Coins, BarChart3, Zap, Shield, Globe, Building2, FileSearch, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/context';

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
            <Zap className="h-4 w-4" />
            {t.home.tagline}
          </div>
          <h2 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
            {t.home.title} <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{t.home.titleHighlight}</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t.home.subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/calculator">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-6">
                <Calculator className="mr-2 h-5 w-5" />
                {t.home.calculateButton}
              </Button>
            </Link>
            <Link href="/financials">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <DollarSign className="mr-2 h-5 w-5" />
                {t.nav.financial}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-lg p-4 border">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t.home.stats?.processingStages}</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-lg p-4 border">
              <div className="text-3xl font-bold text-green-600">$3.2M</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t.home.stats?.totalCapex}</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-lg p-4 border">
              <div className="text-3xl font-bold text-purple-600">15</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t.home.stats?.projectionYears}</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-lg p-4 border">
              <div className="text-3xl font-bold text-amber-600">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t.home.stats?.priceScenarios}</div>
            </div>
          </div>
        </div>

        {/* Financial System CTA */}
        <div className="mb-12">
          <Card className="border-4 border-indigo-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                    <Coins className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="mt-4 text-3xl font-bold text-gray-900">
                    {t.home.financialTitle}
                  </CardTitle>
                  <CardDescription className="mt-2 text-base text-gray-700">
                    {t.home.financialDesc}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-lg bg-white/60 p-3 text-center">
                    <div className="text-2xl font-bold text-indigo-600">$3.2M</div>
                    <div className="text-xs text-gray-600">{t.home.stats?.totalCapex}</div>
                  </div>
                  <div className="rounded-lg bg-white/60 p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">15 {t.home.stats?.years || t.common?.years}</div>
                    <div className="text-xs text-gray-600">{t.home.stats?.projections}</div>
                  </div>
                  <div className="rounded-lg bg-white/60 p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">3 {t.home.stats?.scenarios}</div>
                    <div className="text-xs text-gray-600">{t.home.stats?.priceModels}</div>
                  </div>
                  <div className="rounded-lg bg-white/60 p-3 text-center">
                    <div className="text-2xl font-bold text-amber-600">{t.home.stats?.tokenReady}</div>
                    <div className="text-xs text-gray-600">{t.home.stats?.rwaPlat}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/financials" className="flex-1">
                    <Button size="lg" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold shadow-lg">
                      <DollarSign className="mr-2 h-5 w-5" />
                      {t.home.viewEngineButton}
                    </Button>
                  </Link>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/financials?tab=equipment">
                      <Button variant="secondary" size="sm" className="text-xs">
                        <Building2 className="mr-1 h-3 w-3" />
                        {t.home.capexButton}
                      </Button>
                    </Link>
                    <Link href="/financials?tab=revenue">
                      <Button variant="secondary" size="sm" className="text-xs">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {t.home.revenueButton}
                      </Button>
                    </Link>
                    <Link href="/financials?tab=dashboard">
                      <Button variant="secondary" size="sm" className="text-xs">
                        <BarChart3 className="mr-1 h-3 w-3" />
                        {t.home.cashFlowButton}
                      </Button>
                    </Link>
                    <Link href="/financials?tab=token">
                      <Button variant="secondary" size="sm" className="text-xs">
                        <Coins className="mr-1 h-3 w-3" />
                        {t.home.tokenButton}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Cards */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.home.productsTitle}</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-2 transition-all hover:border-blue-400 hover:shadow-xl hover:scale-105">
              <CardHeader>
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Package className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">{t.calculator.products['3-inch'].title}</CardTitle>
                <CardDescription>{t.calculator.products['3-inch'].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.calculator.products['3-inch'].details}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t.calculator.products['3-inch'].opex}</span>
                    <span className="font-semibold text-blue-600">$9.33/ton</span>
                  </div>
                  <Link href="/calculator?product=3-inch" className="block">
                    <Button className="mt-2 w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      <Calculator className="mr-2 h-4 w-4" />
                      {t.calculator.calculateCosts}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-green-400 hover:shadow-xl hover:scale-105">
              <CardHeader>
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Package className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">{t.calculator.products['1-inch'].title}</CardTitle>
                <CardDescription>{t.calculator.products['1-inch'].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.calculator.products['1-inch'].details}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t.calculator.products['1-inch'].opex}</span>
                    <span className="font-semibold text-green-600">$23.88/ton</span>
                  </div>
                  <Link href="/calculator?product=1-inch" className="block">
                    <Button className="mt-2 w-full bg-green-600 hover:bg-green-700" size="lg">
                      <Calculator className="mr-2 h-4 w-4" />
                      {t.calculator.calculateCosts}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-purple-400 hover:shadow-xl hover:scale-105">
              <CardHeader>
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <Package className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">{t.calculator.products['crumb'].title}</CardTitle>
                <CardDescription>{t.calculator.products['crumb'].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.calculator.products['crumb'].details}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t.calculator.products['crumb'].opex}</span>
                    <span className="font-semibold text-purple-600">$132.30/ton</span>
                  </div>
                  <Link href="/calculator?product=crumb" className="block">
                    <Button className="mt-2 w-full bg-purple-600 hover:bg-purple-700" size="lg">
                      <Calculator className="mr-2 h-4 w-4" />
                      {t.calculator.calculateCosts}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{t.home.featuresTitle}</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 shadow-md">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{t.home.features.customizable.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t.home.features.customizable.description}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 shadow-md">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{t.home.features.visual.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t.home.features.visual.description}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 shadow-md">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{t.home.features.projections.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t.home.features.projections.description}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600 shadow-md">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{t.home.features.tokenization.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t.home.features.tokenization.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Leviathan Gate CTA */}
        <div className="mb-16">
          <Card className="border-4 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-xl dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="mt-4 text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {t.home.gateTitle}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.home.gateTagline}
                  </CardDescription>
                  <CardDescription className="mt-2 text-base text-gray-700 dark:text-gray-300">
                    {t.home.gateDesc}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-lg bg-white/60 dark:bg-gray-800/60 p-3 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{t.home.gateStats?.score}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{t.home.gateStats?.gateRating}</div>
                  </div>
                  <div className="rounded-lg bg-white/60 dark:bg-gray-800/60 p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{t.home.gateStats?.redFlags}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{t.home.gateStats?.autoDetection}</div>
                  </div>
                  <div className="rounded-lg bg-white/60 dark:bg-gray-800/60 p-3 text-center">
                    <div className="text-2xl font-bold text-pink-600">{t.home.gateStats?.aiAnalysis}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{t.home.gateStats?.deepVetting}</div>
                  </div>
                  <div className="rounded-lg bg-white/60 dark:bg-gray-800/60 p-3 text-center">
                    <div className="text-2xl font-bold text-amber-600">{t.home.gateStats?.tokenization}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{t.home.gateStats?.rwaRating}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/analyzer" className="flex-1">
                    <Button size="lg" className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-lg font-semibold shadow-lg">
                      <Shield className="mr-2 h-5 w-5" />
                      {t.home.gateButton}
                    </Button>
                  </Link>
                </div>

                <div className="bg-white/40 dark:bg-gray-800/40 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
                    {t.home.gateCriteria}
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {t.home.gateMetrics.map((metric, idx) => (
                      <li key={idx}>{metric}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-16 border-t bg-gray-50 dark:bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">Leviathan OS</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.home.footerDesc}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t.home.modules}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/calculator" className="hover:text-blue-600 dark:hover:text-blue-400">{t.breadcrumbs?.calculator}</Link></li>
                <li><Link href="/financials" className="hover:text-blue-600 dark:hover:text-blue-400">{t.nav.financial}</Link></li>
                <li><Link href="/analyzer" className="hover:text-indigo-600 dark:hover:text-indigo-400">{t.nav.gate}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t.home.information}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>{t.home.footerInfo?.npv}</li>
                <li>{t.home.footerInfo?.capex}</li>
                <li>{t.home.footerInfo?.token}</li>
              </ul>
            </div>
          </div>
          <div className="border-t dark:border-gray-800 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>{t.home.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
