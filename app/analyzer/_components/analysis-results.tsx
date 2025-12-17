'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Building2,
  DollarSign,
  Target,
  Upload,
  Download,
  Banknote,
  Scale,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { exportGateReportToPDF } from '@/lib/gate-export';
import { useLanguage } from '@/lib/i18n/context';

interface AnalysisResultsProps {
  data: any;
  onNewAnalysis: () => void;
}

export function AnalysisResults({ data, onNewAnalysis }: AnalysisResultsProps) {
  const { t } = useLanguage();
  
  const handleExportPDF = () => {
    try {
      exportGateReportToPDF(data);
      toast.success(t.analysisResults.pdfSuccess);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(t.analysisResults.pdfError);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: t.analysisResults.premium, variant: 'default' as const, className: 'bg-green-600' };
    if (score >= 70) return { label: t.analysisResults.investable, variant: 'default' as const, className: 'bg-blue-600' };
    if (score >= 50) return { label: t.analysisResults.restructure, variant: 'default' as const, className: 'bg-amber-600' };
    return { label: t.analysisResults.notInvestable, variant: 'destructive' as const };
  };

  const getGateVerdict = (score: number) => {
    if (score >= 70) return {
      text: t.analysisResults.passedGate,
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    };
    if (score >= 50) return {
      text: t.analysisResults.conditionalApproval,
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20'
    };
    return {
      text: t.analysisResults.rejectedGate,
      icon: <XCircle className="h-6 w-6 text-red-600" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.analysisResults.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t.analysisResults.generatedBy}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportPDF}
            variant="outline"
            size="sm"
          >
            <Download className="mr-2 h-4 w-4" />
            {t.analysisResults.exportPdf}
          </Button>
          <Button
            onClick={onNewAnalysis}
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Upload className="mr-2 h-4 w-4" />
            {t.analysisResults.newAnalysis}
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getGateVerdict(data.executiveSummary?.score || 0).icon}
              <div>
                <CardTitle className="text-2xl">{t.analysisResults.executiveSummary}</CardTitle>
                <CardDescription>{data.documentType || t.analysisResults.projectDocument}</CardDescription>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(data.executiveSummary?.score || 0)}`}>
                {data.executiveSummary?.score || 0}
              </div>
              <Badge {...getScoreBadge(data.executiveSummary?.score || 0)} className="mt-2">
                {getScoreBadge(data.executiveSummary?.score || 0).label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Auto-Reject Warning (if triggered) */}
            {data.tippingScoring?.auto_reject_triggered && (
              <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <XCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-900 dark:text-red-200 font-semibold">
                  ⛔ {t.analysisResults.autoRejectTriggered}
                </AlertDescription>
              </Alert>
            )}

            {/* Gate Verdict Badge */}
            <div className={`p-4 rounded-lg ${getGateVerdict(data.executiveSummary?.score || 0).bgColor}`}>
              <div className="flex items-center gap-3">
                {getGateVerdict(data.executiveSummary?.score || 0).icon}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t.analysisResults.gateDecision}</h4>
                  <p className={`text-lg font-bold ${getGateVerdict(data.executiveSummary?.score || 0).color}`}>
                    {getGateVerdict(data.executiveSummary?.score || 0).text}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.analysisResults.originalVerdict}</h4>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {data.executiveSummary?.verdict || t.analysisResults.notAvailable}
              </p>
            </div>
            {data.executiveSummary?.comment && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.analysisResults.comment}</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {data.executiveSummary.comment}
                </p>
              </div>
            )}
            {data.executiveSummary?.tokenizationLevel && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.analysisResults.tokenizationLevel}</h4>
                <Badge variant="outline" className="text-sm">
                  {data.executiveSummary.tokenizationLevel}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">{t.analysisResults.infrastructure}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.scores?.infrastructure || 'N/A'}<span className="text-sm text-gray-500">/30</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">{t.analysisResults.production}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.scores?.production || 'N/A'}<span className="text-sm text-gray-500">/25</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">{t.analysisResults.financials}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.scores?.financials || 'N/A'}<span className="text-sm text-gray-500">/25</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-base">{t.analysisResults.risks}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {data.scores?.risks || 'N/A'}<span className="text-sm text-gray-500">/20</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Red Flags */}
      {data.executiveSummary?.topRisks && data.executiveSummary.topRisks.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {t.analysisResults.topRisks}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.executiveSummary.topRisks.map((risk: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Corrections Needed */}
      {data.executiveSummary?.topCorrections && data.executiveSummary.topCorrections.length > 0 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              {t.analysisResults.topCorrections}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.executiveSummary.topCorrections.map((correction: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{correction}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Key Findings */}
      {data.keyFindings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              {t.analysisResults.keyFindings}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.keyFindings.infrastructure && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.analysisResults.infrastructureMachinery}</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {data.keyFindings.infrastructure}
                  </p>
                </div>
              )}
              {data.keyFindings.production && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.analysisResults.production}</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {data.keyFindings.production}
                  </p>
                </div>
              )}
              {data.keyFindings.financials && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.analysisResults.financials}</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {data.keyFindings.financials}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tipping Fee Summary */}
      {data.tippingFeeSummary && data.tippingFeeSummary.detected && (
        <Card className="border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-indigo-600" />
              {t.analysisResults.tippingFeeSummary}
            </CardTitle>
            <CardDescription>{t.analysisResults.tippingFeeDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t.analysisResults.transparency}</p>
                  <Badge variant={data.tippingFeeSummary.transparency === 'TRANSPARENT' ? 'default' : 'secondary'}>
                    {data.tippingFeeSummary.transparency}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t.analysisResults.tfSharePct}</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {data.tippingFeeSummary.tf_share?.toFixed(1)}%
                  </p>
                </div>
              </div>
              {/* TF_net Values with Assumption Indicator */}
              {data.tippingFeeSummary.is_assumption && (
                <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-900 dark:text-amber-200">
                    ⚠️ {t.analysisResults.tfNetAssumption}
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TF Net (LOW)</p>
                    {data.tippingFeeSummary.is_assumption && (
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-300">
                        {t.analysisResults.assumption}
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${data.tippingFeeSummary.tf_net_low?.toLocaleString()}/ton
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TF Net (BASE)</p>
                    {data.tippingFeeSummary.is_assumption && (
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-300">
                        {t.analysisResults.assumption}
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${data.tippingFeeSummary.tf_net_base?.toLocaleString()}/ton
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">TF Net (HIGH)</p>
                    {data.tippingFeeSummary.is_assumption && (
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-300">
                        {t.analysisResults.assumption}
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${data.tippingFeeSummary.tf_net_high?.toLocaleString()}/ton
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t.analysisResults.contractConfidence}</p>
                  <Badge variant={data.tippingFeeSummary.contract_confidence === 'SIGNED' ? 'default' : 'destructive'}>
                    {data.tippingFeeSummary.contract_confidence}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t.analysisResults.durationYears}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data.tippingFeeSummary.contract_tenor_years || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t.analysisResults.customerConcentration}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {data.tippingFeeSummary.customer_concentration_pct?.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Base Case Comparison */}
      {data.baseCaseComparison && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-600" />
              {t.analysisResults.baseCaseComparison}
            </CardTitle>
            <CardDescription>{t.analysisResults.baseCaseComparisonDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">{t.analysisResults.withTippingFee}</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.analysisResults.revenue}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${data.baseCaseComparison.with_tipping?.revenue?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.investorDashboard.ebitda}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${data.baseCaseComparison.with_tipping?.ebitda?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.analysisResults.ebitdaMargin}</p>
                    <p className="text-2xl font-bold text-green-600">
                      {data.baseCaseComparison.with_tipping?.ebitda_margin_pct?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">{t.analysisResults.withoutTippingFee}</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.analysisResults.revenue}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${data.baseCaseComparison.without_tipping?.revenue?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.investorDashboard.ebitda}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${data.baseCaseComparison.without_tipping?.ebitda?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.analysisResults.ebitdaMargin}</p>
                    <p className={`text-2xl font-bold ${
                      (data.baseCaseComparison.without_tipping?.ebitda_margin_pct || 0) >= 12 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {data.baseCaseComparison.without_tipping?.ebitda_margin_pct?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {(data.baseCaseComparison.without_tipping?.ebitda_margin_pct || 0) < 12 && (
              <Alert className="mt-4 border-red-200 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  ⚠️ {t.analysisResults.baseCaseWarning}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tipping Scoring Impact */}
      {data.tippingScoring && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              {t.analysisResults.tippingScoringImpact}
            </CardTitle>
            <CardDescription>{t.analysisResults.tippingScoringDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t.analysisResults.totalPenaltyPoints}</p>
                  <p className="text-3xl font-bold text-red-600">
                    -{data.tippingScoring.total_penalty_points}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t.analysisResults.autoRejectLabel}</p>
                  <Badge variant={data.tippingScoring.auto_reject_triggered ? 'destructive' : 'default'}>
                    {data.tippingScoring.auto_reject_triggered ? t.common.yes : t.common.no}
                  </Badge>
                </div>
              </div>
              {data.tippingScoring.penalties_applied && data.tippingScoring.penalties_applied.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t.analysisResults.penaltiesApplied}</h4>
                  <ul className="space-y-2">
                    {data.tippingScoring.penalties_applied.map((penalty: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{penalty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.tippingScoring.auto_reject_triggered && (
                <Alert className="border-red-200 dark:border-red-800">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-600 font-semibold">
                    🚨 {t.analysisResults.autoRejectMessage}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Analysis (collapsed) */}
      <Card>
        <CardHeader>
          <CardTitle>{t.analysisResults.fullAnalysis}</CardTitle>
          <CardDescription>{t.analysisResults.fullAnalysisDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {data.fullAnalysis || JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
