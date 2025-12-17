'use client';

import { Suspense } from 'react';
import CalculatorClient from './calculator-client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useLanguage } from '@/lib/i18n/context';

export default function CalculatorPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.calculator.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t.calculator.subtitle}</p>
        </div>
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t.calculator.loading}</p>
          </div>
        }>
          <CalculatorClient />
        </Suspense>
      </main>
    </div>
  );
}
