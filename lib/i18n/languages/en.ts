import { TranslationKeys } from './es';

export const en: TranslationKeys = {
  // Navigation
  nav: {
    home: 'Home',
    calculator: 'Calculator',
    financial: 'Financial Engine',
    gate: 'Leviathan Gate',
    tagline: 'Infrastructure-Grade Intelligence',
    openMenu: 'Open menu',
  },

  // Home Page
  home: {
    tagline: 'The most complete financial platform for tire recycling',
    title: 'Financial Model for',
    titleHighlight: 'Tire Recycling Plants',
    subtitle: 'Complete platform with CAPEX analysis, NPV/IRR cash flow projections, and tokenization framework for institutional investors',
    
    // Calculator Card
    calculatorTitle: 'Operational Cost Calculator',
    calculatorDesc: 'Detailed cost estimation by processing stage with utilities, labor, and maintenance analysis',
    calculateButton: 'Calculate Costs',
    
    // Financial Engine Card
    financialTitle: 'Recycling Plant Financial Engine',
    financialDesc: 'Complete financial model for tire recycling plants with NPV/IRR analysis, cash flow projections, and tokenization framework for institutional investors',
    viewEngineButton: 'Open Financial Dashboard',
    
    // Gate Card
    gateTitle: 'Leviathan Gate',
    gateTagline: 'Where capital decides, not narratives.',
    gateDesc: 'Infrastructure-grade project vetting for Real World Assets (RWA) investment',
    gateButton: 'Enter the Gate',
    gateCriteria: 'Gate Decision Criteria:',
    gateMetrics: [
      '✓ Infrastructure & industrial machinery quality',
      '✓ Real vs projected production capacity',
      '✓ Financial viability (EBITDA, NPV, IRR)',
      '✓ Critical risks & dependencies',
      '✓ RWA tokenization aptitude',
    ],
    
    // Gate Stats
    gateStats: {
      score: 'Score 0-100',
      gateRating: 'Gate Rating',
      redFlags: 'Red Flags',
      autoDetection: 'Auto-Detection',
      aiAnalysis: 'AI Analysis',
      deepVetting: 'Deep Vetting',
      tokenization: 'Tokenization',
      rwaRating: 'RWA Rating',
    },
    
    // Products Section
    productsTitle: 'Tire Recycling Derived Products',
    
    // Features Section
    featuresTitle: 'Key Features',
    features: {
      customizable: {
        title: 'Customizable Parameters',
        description: 'Edit utility rates, labor costs, and maintenance schedules according to your operational conditions',
      },
      visual: {
        title: 'Visual Analysis',
        description: 'Interactive charts and detailed reports showing real-time cost distribution',
      },
      projections: {
        title: 'NPV/IRR Projections',
        description: 'Advanced calculations of net present value, internal rate of return, and payback period',
      },
      tokenization: {
        title: 'RWA Tokenization',
        description: 'Complete framework to tokenize real-world assets and distribute returns to investors',
      },
    },
    
    // Stats
    stats: {
      processingStages: 'Processing Stages',
      totalCapex: 'Total CAPEX',
      projectionYears: 'Projection Years',
      priceScenarios: 'Price Scenarios',
      projections: 'Projections',
      scenarios: 'Scenarios',
      priceModels: 'Price Models',
      tokenReady: 'Token Ready',
      rwaPlat: 'RWA Platform',
      years: 'Years',
    },
    
    // Financial Buttons
    capexButton: 'CAPEX Analysis',
    revenueButton: 'Revenue Scenarios',
    cashFlowButton: 'Cash Flow',
    tokenButton: 'Tokenization',
    
    // Footer
    modules: 'Modules',
    information: 'Information',
    copyright: '© 2024 Leviathan OS - Financial Model for Tire Recycling Plants. All estimates should be adjusted according to facility configuration.',
    footerDesc: 'Infrastructure-grade financial intelligence for tire recycling operations',
    footerInfo: {
      npv: 'NPV/IRR Analysis',
      capex: 'CAPEX Management',
      token: 'Token Framework',
    },
  },

  // Calculator
  calculator: {
    title: 'Cost Calculator',
    pageTitle: 'Operational Cost Calculator',
    subtitle: 'Analyze operational costs by product with detailed breakdown of utilities, labor, and maintenance',
    loading: 'Loading calculator...',
    selectProduct: 'Product Selection',
    productSelection: 'Product Selection',
    editCosts: 'Cost Editor',
    costEditor: 'Cost Editor',
    viewResults: 'Results',
    results: 'Results',
    calculate: 'Calculate Costs',
    calculating: 'Calculating...',
    export: 'Export',
    totalCost: 'Total Cost per Ton',
    utilities: 'Utilities',
    productionLabor: 'Production Labor',
    maintenanceLabor: 'Maintenance Labor',
    chooseProduct: 'Choose your target product to begin',
    configureCosts: 'Configure costs and calculate your operating expenses',
    productTitle: {
      '3-inch': '3" Nominal Chips',
      '1-inch': '1" Chips',
      'crumb': 'Crumb Rubber',
      'select': 'Select Product',
    },
    // Product descriptions
    products: {
      '3-inch': {
        title: '3" Nominal Chips',
        description: 'Stage 1 - TC-500 Processing',
        details: 'Whole car & truck tires processed through 3" screen to produce rough-edge chips',
        stages: 'Single stage processing',
        opex: 'OPEX Cost:',
      },
      '1-inch': {
        title: '1" Chips',
        description: 'Stage 1 + 2 - Full Processing',
        details: '3" chips processed through TG-500 to produce 1-1/8" screened chips',
        stages: 'Two stage processing',
        opex: 'OPEX Cost:',
      },
      'crumb': {
        title: 'Crumb Rubber',
        description: 'All 3 Stages - Complete Processing',
        details: '1/2" wire-free material processed through cracker mill to produce 10-minus crumb',
        stages: 'Three stage processing',
        opex: 'OPEX Cost:',
      },
    },
    selectButton: 'Select',
    selectedButton: 'Selected',
    calculateCosts: 'Calculate Costs',
  },

  // Financials
  financials: {
    title: 'Industrial Financial Engine',
    subtitle: 'Complete financial model platform for tire recycling plants and tokenization',
    dashboard: 'Dashboard',
    equipment: 'Equipment',
    revenue: 'Revenue',
    plant: 'Plant',
    tippingFee: 'Tipping Fee',
    token: 'Token',
    npv: 'NPV (Net Present Value)',
    irr: 'IRR (Internal Rate of Return)',
    ebitda: 'Annual EBITDA',
    payback: 'Payback Period',
    years: 'years',
    equipmentTitle: 'Equipment Financials (CAPEX)',
    equipmentDesc: 'Manage capital expenditure, depreciation, and equipment lifecycle costs',
    revenueTitle: 'Product Revenue Models',
    revenueDesc: 'Configure pricing scenarios (Conservative / Base / Aggressive) for each product',
    plantTitle: 'Plant Configuration',
    plantDesc: 'Set operational parameters, product mix, and financial assumptions',
    tokenTitle: 'Tokenization Model',
    tokenDesc: 'Configure revenue-share token structure and distribution parameters',
  },

  // Leviathan Gate
  gate: {
    title: 'Leviathan Gate',
    tagline: 'Where capital decides, not narratives.',
    subtitle: 'Infrastructure-grade project vetting for Real World Assets (RWA) investment',
    
    // Feature Cards
    technicalTitle: 'Technical Analysis',
    technicalDesc: 'Infrastructure, machinery and real production',
    financialTitle: 'Financial Viability',
    financialDesc: 'EBITDA, NPV, IRR and projected cash flow',
    riskTitle: 'Risk Detection',
    riskDesc: 'Automatic red flag identification',
    scoreTitle: 'Investment Score',
    scoreDesc: '0-100 rating for investment decision',
    
    // Upload
    uploadTitle: 'Project Analysis',
    uploadDesc: 'Upload a PDF document with industrial project information (business plan, financial proforma, pitch deck, etc.)',
    uploadButton: 'Select PDF',
    analyzing: 'Analyzing...',
    dragDrop: 'Drag a PDF file here or click to select',
    maxSize: 'Maximum 4MB',
    
    // Results
    reportTitle: 'Leviathan Gate — Project Viability Report',
    generatedBy: 'Generated by Leviathan OS',
    exportPDF: 'Export PDF',
    newAnalysis: 'New Analysis',
    executiveSummary: 'Executive Summary',
    gateDecision: 'Gate Decision',
    originalVerdict: 'Original Verdict',
    scoreBreakdown: 'Score Breakdown',
    topRisks: 'Top 5 Identified Risks',
    topCorrections: 'Top 5 Necessary Corrections',
    tokenizationLevel: 'Tokenization Level',
    keyFindings: 'Key Findings',
    infrastructure: 'Infrastructure',
    production: 'Production',
    financials: 'Financials',
    
    // Gate Verdicts
    passed: 'Passed the Gate',
    conditional: 'Conditional Gate Approval',
    rejected: 'Rejected by the Gate',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    confirm: 'Confirm',
    remove: 'Remove',
    stage: 'Stage',
    perTon: 'per ton',
    years: 'years',
    months: 'months',
    annual: 'annual',
    total: 'Total',
    notAvailable: 'N/A',
    yes: 'YES',
    no: 'NO',
  },

  // Investor Dashboard
  investorDashboard: {
    loading: 'Running financial simulation...',
    exportTitle: 'Export Financial Report',
    exportDesc: 'Download the complete financial analysis with projections, investment metrics and tokenomics',
    exportPDF: 'Export PDF',
    exportCSV: 'Export CSV',
    refreshData: 'Refresh Data',
    pdfSuccess: 'PDF report generated successfully',
    pdfError: 'Error generating PDF',
    csvSuccess: 'CSV report generated successfully',
    csvError: 'Error generating CSV',
    loadError: 'Failed to load financial simulation',
    
    // Tipping Fee Notice
    tippingFeeEnabled: 'Tipping Fee Revenue Enabled',
    tippingFeeDesc: 'Annual revenue includes {amount} from tipping fees ({share}% of total revenue)',
    excludedFromBaseCase: '(Excluded from Base Case - contract not signed)',
    
    // KPI Cards
    annualRevenue: 'Annual Revenue',
    tonsYear: 'tons/year',
    ebitda: 'EBITDA',
    margin: 'Margin',
    npv: 'NPV',
    discountRate: 'discount rate',
    irr: 'IRR',
    irrFull: 'Internal Rate of Return',
    totalCapex: 'Total CAPEX',
    paybackPeriod: 'Payback Period',
    grossMargin: 'Gross Margin',
    annualOpex: 'Annual OPEX',
    
    // Token Metrics
    tokenMetrics: 'Token Metrics',
    tokenMetricsDesc: 'Revenue-share tokenization model for institutional investors',
    totalSupply: 'Total Supply',
    tokenPrice: 'Token Price',
    totalRaise: 'Total Raise',
    annualYield: 'Annual Yield',
    distributionPerToken: 'Distribution/Token',
    breakEven: 'Break-even',
    distributionModel: 'Distribution Model',
    ofEbitda: 'of EBITDA distributed',
    in: 'in',
    
    // Charts
    revenueByProduct: 'Revenue by Product',
    revenueDistribution: 'Annual revenue distribution',
    costStructure: 'Annual Cost Structure',
    opexVsCapex: 'OPEX vs CAPEX (depreciation)',
    cashFlowProjection: 'Cash Flow Projection',
    yearForecast: '{years}-year financial forecast',
    ebitdaProgression: 'EBITDA & Net Income Progression',
    profitabilityMetrics: 'Annual profitability metrics',
    trueCostPerTon: 'True Cost per Ton (OPEX + CAPEX Amortized)',
    completeCostAnalysis: 'Complete cost analysis including capital expenditure',
    opexPerTon: 'OPEX/ton',
    capexPerTon: 'CAPEX/ton',
    trueCost: 'True Cost/ton',
    
    // Chart labels
    revenue: 'Revenue',
    cashFlow: 'Cash Flow',
    cumulativeCF: 'Cumulative CF',
    netIncome: 'Net Income',
    tippingFee: 'Tipping Fee',
    opex: 'OPEX',
    capexAnnual: 'CAPEX (Annual)',
    
    // Scenario
    activeScenario: 'Active Scenario',
    market: 'Market',
  },

  // Equipment Financials
  equipmentFinancials: {
    totalCapexInvestment: 'Total CAPEX Investment',
    annualDepreciation: 'Annual Depreciation',
    equipmentCount: 'Equipment Count',
    totalAnnualCapexCost: 'Total Annual CAPEX Cost',
    purchasePrice: 'Purchase Price',
    installationCost: 'Installation Cost',
    totalCapex: 'Total CAPEX',
    usefulLifeYears: 'Useful Life (Years)',
    usefulLifeHours: 'Useful Life (Hours)',
    maintenanceRate: 'Maintenance Rate (%)',
    insuranceRate: 'Insurance Rate (%)',
    annualCostBreakdown: 'Annual Cost Breakdown',
    depreciation: 'Depreciation',
    maintenance: 'Maintenance',
    insurance: 'Insurance',
    totalAnnual: 'Total Annual',
    loadError: 'Failed to load equipment data',
    updateSuccess: 'updated successfully',
    updateError: 'Failed to update equipment',
  },

  // Revenue Models
  revenueModels: {
    primaryMarket: 'Primary Market',
    secondaryMarket: 'Secondary Market',
    localMarket: 'Local Market',
    exportMarket: 'Export Market',
    conservative: 'Conservative',
    base: 'Base',
    aggressive: 'Aggressive',
    pricePerTon: 'Price per Ton',
    marketNotes: 'Market Notes',
    loadError: 'Failed to load revenue models',
    updateSuccess: 'updated successfully',
    updateError: 'Failed to update product revenue',
  },

  // Plant Configuration
  plantConfig: {
    defaultPlantName: 'Default Plant Configuration',
    annualProduction: 'Annual Production',
    tonsYear: 'tons/year',
    operationalParams: 'Operational Parameters',
    tonsPerDay: 'Tons per Day',
    operatingDays: 'Operating Days per Year',
    uptimePercentage: 'Uptime Percentage',
    effective: 'Effective',
    tonsDay: 'tons/day',
    productMix: 'Product Mix',
    mustEqual100: 'Must equal 100%',
    chips3: '3" Chips',
    chips1: '1" Chips',
    crumbRubber: 'Crumb Rubber',
    pricingScenario: 'Pricing Scenario & Market',
    activePricingScenario: 'Active Pricing Scenario',
    marketSplit: 'Market Split',
    local: 'Local Market',
    export: 'Export Market',
    mixed: 'Mixed (Local + Export)',
    localExportRatio: 'Local/Export Ratio',
    localPercentage: '% Local',
    financialParams: 'Financial Parameters',
    discountRateWacc: 'Discount Rate (WACC)',
    projectionPeriod: 'Projection Period (Years)',
    saveConfiguration: 'Save Configuration',
    configSaved: 'Configuration saved successfully',
    loadError: 'Failed to load plant configuration',
    saveError: 'Failed to save configuration',
    mixWarning: 'Product mix must equal 100% before saving.',
  },

  // Token Model
  tokenModel: {
    totalRaise: 'Total Raise',
    totalSupply: 'Total Supply',
    pricePerToken: 'Price per Token',
    ebitdaDistributed: 'EBITDA Distributed',
    distribution: 'Distribution',
    tokenDetails: 'Token Details',
    plantName: 'Plant Name',
    tokenName: 'Token Name',
    tokenSymbol: 'Token Symbol',
    tokenEconomics: 'Token Economics',
    tokenPriceUsd: 'Token Price (USD)',
    totalRaiseCalc: 'Total Raise (Calculated)',
    distributionModel: 'Distribution Model',
    revenueShare: 'Revenue Share',
    ofEbitda: 'of EBITDA',
    retainedForOps: 'retained for operations',
    distributionFrequency: 'Distribution Frequency',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    annually: 'Annually',
    payoutCurrency: 'Payout Currency',
    legalStructure: 'Legal Structure',
    spvJurisdiction: 'SPV Jurisdiction',
    tokenType: 'Token Type',
    revenueShareNonEquity: 'Revenue Share (Non-Equity)',
    profitShare: 'Profit Share',
    hybrid: 'Hybrid',
    legalNote: 'This token represents economic rights to cash flows, not equity ownership.',
    saveTokenModel: 'Save Token Model',
    tokenSaved: 'Token model saved successfully',
    loadError: 'Failed to load token model',
    saveError: 'Failed to save token model',
  },

  // Tipping Fee Config
  tippingFeeConfig: {
    title: 'Tipping Fee Configuration',
    description: 'Configure tipping fee revenue from waste tire collection contracts',
    enableTippingFee: 'Enable Tipping Fee Revenue',
    enableDesc: 'Include gate fees in revenue projections',
    profile: 'Tipping Fee Profile',
    selectProfile: 'Select profile',
    scenario: 'Scenario',
    lowConservative: 'Low (Conservative)',
    baseCase: 'Base Case',
    highAggressive: 'High (Aggressive)',
    off: 'Off',
    applyToVolume: 'Apply to Volume (%)',
    applyToVolumeDesc: 'Percentage of total throughput receiving tipping fee',
    contractConfidence: 'Contract Confidence',
    none: 'None',
    verbal: 'Verbal Agreement',
    loi: 'Letter of Intent',
    signed: 'Signed Contract',
    contractTenor: 'Contract Tenor (months)',
    customerConcentration: 'Customer Concentration (%)',
    expectedTonnage: 'Expected Tonnage/Year',
    baseCaseExclusion: 'Base Case Exclusion',
    baseCaseExclusionDesc: 'Tipping fee revenue will be excluded from Base Case investor metrics. Only SIGNED contracts are included in conservative projections.',
    saveConfiguration: 'Save Configuration',
    configSaved: 'Tipping fee configuration saved',
    saveError: 'Failed to save configuration',
    loadError: 'Error loading tipping fee data',
    
    // KPI Display
    revenueAnalysis: 'Revenue Analysis',
    retainedShare: 'Retained Share',
    keptByRecycler: '% kept by recycler',
    tfNet: 'TF_net',
    usdPerTon: 'USD per ton',
    componentBased: 'COMPONENT-BASED',
    componentBreakdown: 'Component Breakdown',
    netToRecycler: 'Net to Recycler',
    passThrough: 'Pass-Through',
    totalFee: 'Total Fee',
    productSales: 'Product Sales',
    tippingFeeRev: 'Tipping Fee',
    totalRevenue: 'Total Revenue',
    tfShare: 'Tipping Fee Share',
    tfShareDesc: 'Percentage of total revenue from tipping fees',
    highTfDependency: 'High TF dependency ({share}%) will trigger Leviathan Gate scoring penalties',
    baseCaseWoTf: 'Base Case (w/o TF)',
    withTippingFee: 'With Tipping Fee',
    ebitdaMargin: 'Margin',
    viable: 'VIABLE',
    notViable: 'NOT VIABLE',
  },

  // Project Upload (Analyzer)
  projectUpload: {
    title: 'Upload Project for Analysis',
    description: 'Upload a PDF document with industrial project information (business plan, financial proforma, pitch deck, etc.)',
    onlyPdf: 'Only PDF files are allowed',
    maxSizeError: 'File must not exceed 4MB',
    preparing: 'Preparing analysis...',
    analyzing: 'Analyzing...',
    analysisComplete: 'Analysis completed successfully',
    analysisError: 'Error analyzing the project',
    clickToSelect: 'Click to select or drag a PDF file',
    maxSize: 'Maximum 4MB',
    remove: 'Remove',
    processingTime: 'This may take a few minutes...',
    startAnalysis: 'Start Viability Analysis',
    analyzingProject: 'Analyzing Project...',
  },

  // Analysis Results
  analysisResults: {
    title: 'Leviathan Gate — Project Viability Report',
    generatedBy: 'Generated by Leviathan OS',
    exportPdf: 'Export PDF',
    newAnalysis: 'New Analysis',
    pdfSuccess: 'PDF report generated successfully',
    pdfError: 'Error generating PDF',
    
    // Executive Summary
    executiveSummary: 'Executive Summary',
    projectDocument: 'Project Document',
    gateDecision: 'Gate Decision',
    originalVerdict: 'Original Verdict',
    notAvailable: 'Not available',
    comment: 'Comment',
    tokenizationLevel: 'Tokenization Level',
    
    // Score Badges
    premium: 'Premium',
    investable: 'Investable',
    restructure: 'Restructure',
    notInvestable: 'Not Investable',
    
    // Gate Verdicts
    passedGate: 'Passed the Gate',
    conditionalApproval: 'Conditional Gate Approval',
    rejectedGate: 'Rejected by the Gate',
    
    // Auto Reject
    autoRejectTriggered: 'AUTO-REJECT TRIGGERED: Project rejected due to insufficient base case viability (EBITDA margin < 12%) without signed tipping fee contract.',
    
    // Metrics
    infrastructure: 'Infrastructure',
    production: 'Production',
    financials: 'Financials',
    risks: 'Risks',
    
    // Findings
    topRisks: 'Top 5 Identified Risks',
    topCorrections: 'Top 5 Necessary Corrections',
    keyFindings: 'Key Findings',
    infrastructureMachinery: 'Infrastructure and Machinery',
    
    // Tipping Fee Summary
    tippingFeeSummary: 'Tipping Fee Summary',
    tippingFeeDesc: 'Gate fee dependency analysis',
    transparency: 'Transparency',
    tfSharePct: 'TF Share (%)',
    tfNetAssumption: 'TF_net values are ASSUMPTIONS (not explicitly stated in document). Default profile applied: $150 / $250 / $350 per ton.',
    assumption: 'ASSUMPTION',
    tfNetLow: 'TF Net (LOW)',
    tfNetBase: 'TF Net (BASE)',
    tfNetHigh: 'TF Net (HIGH)',
    contractConfidence: 'Contract Confidence',
    durationYears: 'Duration (years)',
    customerConcentration: 'Customer Concentration (%)',
    
    // Base Case Comparison
    baseCaseComparison: 'Base Case vs With-Tipping Comparison',
    baseCaseComparisonDesc: 'Viability comparison with and without tipping fee',
    withTippingFee: 'With Tipping Fee',
    withoutTippingFee: 'Without Tipping Fee (Base Case)',
    revenue: 'Revenue',
    ebitdaMargin: 'EBITDA Margin',
    baseCaseWarning: 'Base case EBITDA below 12% - Project not viable without contracted tipping fee',
    
    // Tipping Scoring Impact
    tippingScoringImpact: 'Tipping Scoring Impact',
    tippingScoringDesc: 'Impact of tipping fees on final score',
    totalPenaltyPoints: 'Total Penalty Points',
    autoRejectLabel: 'Auto Reject Triggered',
    penaltiesApplied: 'Penalties Applied',
    autoRejectMessage: 'AUTO REJECT: Project not viable without contracted tipping fee and base EBITDA < 12%',
    
    // Full Analysis
    fullAnalysis: 'Full Analysis',
    fullAnalysisDesc: 'Detailed analysis generated by the system',
  },

  // Results Dashboard (Calculator)
  resultsDashboard: {
    exportResults: 'Export Results',
    exportDescription: 'Download or print the cost report in different formats',
    exportPdf: 'Export PDF',
    exportCsv: 'Export CSV',
    print: 'Print',
    pdfSuccess: 'PDF report generated successfully',
    pdfError: 'Error generating PDF',
    csvSuccess: 'CSV report generated successfully',
    csvError: 'Error generating CSV',
    openingPrintView: 'Opening print view...',
    
    // Cards
    totalCostPerTon: 'Total Cost per Ton',
    utilitiesCost: 'Utilities Cost',
    productionLabor: 'Production Labor',
    maintenance: 'Maintenance',
    ofTotal: 'of total',
    
    // Charts
    costBreakdownByCategory: 'Cost Breakdown by Category',
    costBreakdownDesc: 'Distribution of costs across utilities, labor, and maintenance',
    costByStage: 'Cost by Processing Stage',
    costByStageDesc: 'Breakdown of costs across each stage',
    
    // Detailed Breakdown
    detailedStageBreakdown: 'Detailed Stage Breakdown',
    completeCostAnalysis: 'Complete cost analysis for',
    perTon: 'per ton',
    utilities: 'Utilities',
  },

  // Cost Editor
  costEditor: {
    throughput: 'Throughput',
    tonsHour: 'tons/hour',
    utilityCosts: 'Utility Costs',
    pricePerUnit: 'Price per Unit ($)',
    usePerHour: 'Use per Hour',
    costTon: 'Cost/Ton',
    productionLabor: 'Production Labor',
    costPerHour: 'Cost per Hour ($)',
    usePerHourRange: 'Use per Hour (0-1)',
    maintenanceLabor: 'Maintenance Labor',
    productionHours: 'Production Hours',
    productionTons: 'Production Tons',
    stageTotalCost: 'Stage Total Cost per Ton',
  },

  // Breadcrumbs
  breadcrumbs: {
    home: 'Home',
    calculator: 'Cost Calculator',
    financials: 'Industrial Financial Engine',
    analyzer: 'Leviathan Gate',
  },
};
