'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { ProjectUpload } from './_components/project-upload';
import { AnalysisResults } from './_components/analysis-results';
import { useLanguage } from '@/lib/i18n/context';

export default function AnalyzerPage() {
  const { t } = useLanguage();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumbs />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {t.gate.title}
              </h1>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t.gate.tagline}
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            {t.gate.subtitle}
          </p>
        </div>

        {/* Feature Cards */}
        {!analysisData && (
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-600">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{t.gate.technicalTitle}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t.gate.technicalDesc}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-600">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{t.gate.financialTitle}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t.gate.financialDesc}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-600">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{t.gate.riskTitle}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t.gate.riskDesc}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-600">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{t.gate.scoreTitle}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t.gate.scoreDesc}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Section */}
        {!analysisData && (
          <ProjectUpload 
            onAnalysisComplete={setAnalysisData}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
          />
        )}

        {/* Results Section */}
        {analysisData && (
          <AnalysisResults 
            data={analysisData}
            onNewAnalysis={() => setAnalysisData(null)}
          />
        )}
      </div>
    </div>
  );
}
