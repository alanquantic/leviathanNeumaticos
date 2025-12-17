export const es = {
  // Navigation
  nav: {
    home: 'Inicio',
    calculator: 'Calculadora',
    financial: 'Motor Financiero',
    gate: 'Leviathan Gate',
    tagline: 'Inteligencia de Grado Institucional',
    openMenu: 'Abrir menú',
  },

  // Home Page
  home: {
    tagline: 'La plataforma financiera más completa para reciclaje de neumáticos',
    title: 'Modelo Financiero de',
    titleHighlight: 'Plantas de Reciclaje de Neumáticos',
    subtitle: 'Plataforma completa con análisis CAPEX, proyecciones de cash flow NPV/IRR, y framework de tokenización para inversionistas institucionales',
    
    // Calculator Card
    calculatorTitle: 'Calculadora de Costos Operativos',
    calculatorDesc: 'Estimación detallada de costos por etapa de procesamiento con análisis de utilities, mano de obra y mantenimiento',
    calculateButton: 'Calcular Costos',
    
    // Financial Engine Card
    financialTitle: 'Motor Financiero de Plantas de Reciclaje',
    financialDesc: 'Modelo financiero completo para plantas de reciclaje de neumáticos con análisis NPV/IRR, proyecciones de flujo de caja y framework de tokenización para inversionistas institucionales',
    viewEngineButton: 'Abrir Dashboard Financiero',
    
    // Gate Card
    gateTitle: 'Leviathan Gate',
    gateTagline: 'Donde el capital decide, no las narrativas.',
    gateDesc: 'Evaluación de proyectos de grado institucional para inversión en Activos del Mundo Real (RWA)',
    gateButton: 'Entrar al Gate',
    gateCriteria: 'Criterios de Decisión del Gate:',
    gateMetrics: [
      '✓ Calidad de infraestructura y maquinaria industrial',
      '✓ Capacidad de producción real vs proyectada',
      '✓ Viabilidad financiera (EBITDA, NPV, IRR)',
      '✓ Riesgos críticos y dependencias',
      '✓ Aptitud para tokenización RWA',
    ],
    
    // Gate Stats
    gateStats: {
      score: 'Puntuación 0-100',
      gateRating: 'Calificación Gate',
      redFlags: 'Alertas Rojas',
      autoDetection: 'Detección Automática',
      aiAnalysis: 'Análisis IA',
      deepVetting: 'Evaluación Profunda',
      tokenization: 'Tokenización',
      rwaRating: 'Calificación RWA',
    },
    
    // Products Section
    productsTitle: 'Productos derivados del Reciclaje de Neumáticos',
    
    // Features Section
    featuresTitle: 'Características Principales',
    features: {
      customizable: {
        title: 'Parámetros Personalizables',
        description: 'Edita tarifas de servicios, costos laborales y programas de mantenimiento según tus condiciones operativas',
      },
      visual: {
        title: 'Análisis Visual',
        description: 'Gráficos interactivos y reportes detallados mostrando distribución de costos en tiempo real',
      },
      projections: {
        title: 'Proyecciones NPV/IRR',
        description: 'Cálculos avanzados de valor presente neto, tasa interna de retorno y período de recuperación',
      },
      tokenization: {
        title: 'Tokenización RWA',
        description: 'Framework completo para tokenizar activos reales y distribuir rendimientos a inversionistas',
      },
    },
    
    // Stats
    stats: {
      processingStages: 'Etapas de Procesamiento',
      totalCapex: 'CAPEX Total',
      projectionYears: 'Años Proyección',
      priceScenarios: 'Escenarios Precio',
      projections: 'Proyecciones',
      scenarios: 'Escenarios',
      priceModels: 'Modelos de Precio',
      tokenReady: 'Token Listo',
      rwaPlat: 'Plataforma RWA',
      years: 'Años',
    },
    
    // Financial Buttons
    capexButton: 'Análisis CAPEX',
    revenueButton: 'Escenarios Ingresos',
    cashFlowButton: 'Flujo de Caja',
    tokenButton: 'Tokenización',
    
    // Footer
    modules: 'Módulos',
    information: 'Información',
    copyright: '© 2024 Leviathan OS - Modelo Financiero de Plantas de Reciclaje de Neumáticos. Todos los estimados deben ajustarse según la configuración de la instalación.',
    footerDesc: 'Inteligencia financiera de grado institucional para operaciones de reciclaje de neumáticos',
    footerInfo: {
      npv: 'Análisis NPV/IRR',
      capex: 'Gestión de CAPEX',
      token: 'Framework de Token',
    },
  },

  // Calculator
  calculator: {
    title: 'Calculadora de Costos',
    pageTitle: 'Calculadora de Costos Operativos',
    subtitle: 'Analiza costos operativos por producto con desglose detallado de utilidades, mano de obra y mantenimiento',
    loading: 'Cargando calculadora...',
    selectProduct: 'Selección de Producto',
    productSelection: 'Product Selection',
    editCosts: 'Editor de Costos',
    costEditor: 'Cost Editor',
    viewResults: 'Resultados',
    results: 'Results',
    calculate: 'Calcular Costos',
    calculating: 'Calculando...',
    export: 'Exportar',
    totalCost: 'Costo Total por Tonelada',
    utilities: 'Utilities',
    productionLabor: 'Mano de Obra Producción',
    maintenanceLabor: 'Mano de Obra Mantenimiento',
    chooseProduct: 'Elige tu producto objetivo para comenzar',
    configureCosts: 'Configura los costos y calcula tus gastos operativos',
    productTitle: {
      '3-inch': '3" Nominal Chips',
      '1-inch': '1" Chips',
      'crumb': 'Crumb Rubber',
      'select': 'Seleccionar Producto',
    },
    // Product descriptions
    products: {
      '3-inch': {
        title: '3" Nominal Chips',
        description: 'Etapa 1 - Procesamiento TC-500',
        details: 'Neumáticos completos procesados a través de tamiz de 3" para producir chips de borde rugoso',
        stages: 'Procesamiento de una etapa',
        opex: 'Costo OPEX:',
      },
      '1-inch': {
        title: '1" Chips',
        description: 'Etapa 1 + 2 - Procesamiento Completo',
        details: 'Chips de 3" procesados a través de TG-500 para producir chips tamizados de 1-1/8"',
        stages: 'Procesamiento de dos etapas',
        opex: 'Costo OPEX:',
      },
      'crumb': {
        title: 'Crumb Rubber',
        description: '3 Etapas - Procesamiento Total',
        details: 'Material libre de alambre de 1/2" procesado a través de molino para producir crumb de 10-menos',
        stages: 'Procesamiento de tres etapas',
        opex: 'Costo OPEX:',
      },
    },
    selectButton: 'Seleccionar',
    selectedButton: 'Seleccionado',
    calculateCosts: 'Calcular Costos',
  },

  // Financials
  financials: {
    title: 'Motor Financiero Industrial',
    subtitle: 'Plataforma completa de modelo financiero de plantas de reciclaje de neumáticos y tokenización',
    dashboard: 'Panel',
    equipment: 'Equipos',
    revenue: 'Ingresos',
    plant: 'Planta',
    tippingFee: 'Tarifa de Entrada',
    token: 'Token',
    npv: 'VPN (Valor Presente Neto)',
    irr: 'TIR (Tasa Interna de Retorno)',
    ebitda: 'EBITDA Anual',
    payback: 'Período de Recuperación',
    years: 'años',
    equipmentTitle: 'Finanzas de Equipos (CAPEX)',
    equipmentDesc: 'Gestiona gastos de capital, depreciación y costos del ciclo de vida del equipo',
    revenueTitle: 'Modelos de Ingresos por Producto',
    revenueDesc: 'Configura escenarios de precios (Conservador / Base / Agresivo) para cada producto',
    plantTitle: 'Configuración de Planta',
    plantDesc: 'Establece parámetros operacionales, mezcla de productos y supuestos financieros',
    tokenTitle: 'Modelo de Tokenización',
    tokenDesc: 'Configura la estructura de tokens de reparto de ingresos y parámetros de distribución',
  },

  // Leviathan Gate
  gate: {
    title: 'Leviathan Gate',
    tagline: 'Donde el capital decide, no las narrativas.',
    subtitle: 'Evaluación de proyectos de grado institucional para inversión en Activos del Mundo Real (RWA)',
    
    // Feature Cards
    technicalTitle: 'Análisis Técnico',
    technicalDesc: 'Infraestructura, maquinaria y producción real',
    financialTitle: 'Viabilidad Financiera',
    financialDesc: 'EBITDA, NPV, IRR y cash flow proyectado',
    riskTitle: 'Detección de Riesgos',
    riskDesc: 'Identificación automática de red flags',
    scoreTitle: 'Score de Inversión',
    scoreDesc: 'Calificación 0-100 para decisión de inversión',
    
    // Upload
    uploadTitle: 'Análisis de Proyecto',
    uploadDesc: 'Sube un documento PDF con información del proyecto industrial (plan de negocios, proforma financiera, pitch deck, etc.)',
    uploadButton: 'Seleccionar PDF',
    analyzing: 'Analizando...',
    dragDrop: 'Arrastra un archivo PDF aquí o haz click para seleccionar',
    maxSize: 'Máximo 10MB',
    
    // Results
    reportTitle: 'Leviathan Gate — Project Viability Report',
    generatedBy: 'Generated by Leviathan OS',
    exportPDF: 'Exportar PDF',
    newAnalysis: 'Nuevo Análisis',
    executiveSummary: 'Resumen Ejecutivo',
    gateDecision: 'Gate Decision',
    originalVerdict: 'Veredicto Original',
    scoreBreakdown: 'Desglose de Puntuación',
    topRisks: 'Top 5 Riesgos Identificados',
    topCorrections: 'Top 5 Correcciones Necesarias',
    tokenizationLevel: 'Nivel de Tokenización',
    keyFindings: 'Hallazgos Clave',
    infrastructure: 'Infraestructura',
    production: 'Producción',
    financials: 'Finanzas',
    
    // Gate Verdicts
    passed: 'Passed the Gate',
    conditional: 'Conditional Gate Approval',
    rejected: 'Rejected by the Gate',
  },

  // Common
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    confirm: 'Confirmar',
    remove: 'Remover',
    stage: 'Etapa',
    perTon: 'por tonelada',
    years: 'años',
    months: 'meses',
    annual: 'anual',
    total: 'Total',
    notAvailable: 'N/A',
    yes: 'SÍ',
    no: 'NO',
  },

  // Investor Dashboard
  investorDashboard: {
    loading: 'Ejecutando simulación financiera...',
    exportTitle: 'Exportar Reporte Financiero',
    exportDesc: 'Descarga el análisis financiero completo con proyecciones, métricas de inversión y tokenomics',
    exportPDF: 'Exportar PDF',
    exportCSV: 'Exportar CSV',
    refreshData: 'Actualizar Datos',
    pdfSuccess: 'Reporte PDF generado exitosamente',
    pdfError: 'Error al generar el PDF',
    csvSuccess: 'Reporte CSV generado exitosamente',
    csvError: 'Error al generar el CSV',
    loadError: 'Error al cargar simulación financiera',
    
    // Tipping Fee Notice
    tippingFeeEnabled: 'Ingresos por Tipping Fee Habilitados',
    tippingFeeDesc: 'Los ingresos anuales incluyen {amount} de tipping fees ({share}% del ingreso total)',
    excludedFromBaseCase: '(Excluido del Caso Base - contrato no firmado)',
    
    // KPI Cards
    annualRevenue: 'Ingresos Anuales',
    tonsYear: 'toneladas/año',
    ebitda: 'EBITDA',
    margin: 'Margen',
    npv: 'VPN',
    discountRate: 'tasa de descuento',
    irr: 'TIR',
    irrFull: 'Tasa Interna de Retorno',
    totalCapex: 'CAPEX Total',
    paybackPeriod: 'Período de Recuperación',
    grossMargin: 'Margen Bruto',
    annualOpex: 'OPEX Anual',
    
    // Token Metrics
    tokenMetrics: 'Métricas del Token',
    tokenMetricsDesc: 'Modelo de tokenización de reparto de ingresos para inversionistas institucionales',
    totalSupply: 'Suministro Total',
    tokenPrice: 'Precio del Token',
    totalRaise: 'Recaudación Total',
    annualYield: 'Rendimiento Anual',
    distributionPerToken: 'Distribución/Token',
    breakEven: 'Punto de Equilibrio',
    distributionModel: 'Modelo de Distribución',
    ofEbitda: 'del EBITDA distribuido',
    in: 'en',
    
    // Charts
    revenueByProduct: 'Ingresos por Producto',
    revenueDistribution: 'Distribución anual de ingresos',
    costStructure: 'Estructura de Costos Anual',
    opexVsCapex: 'OPEX vs CAPEX (depreciación)',
    cashFlowProjection: 'Proyección de Flujo de Caja',
    yearForecast: 'pronóstico financiero a {years} años',
    ebitdaProgression: 'Progresión de EBITDA e Ingreso Neto',
    profitabilityMetrics: 'Métricas de rentabilidad anual',
    trueCostPerTon: 'Costo Real por Tonelada (OPEX + CAPEX Amortizado)',
    completeCostAnalysis: 'Análisis completo de costos incluyendo gastos de capital',
    opexPerTon: 'OPEX/ton',
    capexPerTon: 'CAPEX/ton',
    trueCost: 'Costo Real/ton',
    
    // Chart labels
    revenue: 'Ingresos',
    cashFlow: 'Flujo de Caja',
    cumulativeCF: 'FC Acumulado',
    netIncome: 'Ingreso Neto',
    tippingFee: 'Tipping Fee',
    opex: 'OPEX',
    capexAnnual: 'CAPEX (Anual)',
    
    // Scenario
    activeScenario: 'Escenario Activo',
    market: 'Mercado',
  },

  // Equipment Financials
  equipmentFinancials: {
    totalCapexInvestment: 'Inversión Total CAPEX',
    annualDepreciation: 'Depreciación Anual',
    equipmentCount: 'Cantidad de Equipos',
    totalAnnualCapexCost: 'Costo Anual CAPEX Total',
    purchasePrice: 'Precio de Compra',
    installationCost: 'Costo de Instalación',
    totalCapex: 'CAPEX Total',
    usefulLifeYears: 'Vida Útil (Años)',
    usefulLifeHours: 'Vida Útil (Horas)',
    maintenanceRate: 'Tasa de Mantenimiento (%)',
    insuranceRate: 'Tasa de Seguro (%)',
    annualCostBreakdown: 'Desglose de Costos Anuales',
    depreciation: 'Depreciación',
    maintenance: 'Mantenimiento',
    insurance: 'Seguro',
    totalAnnual: 'Total Anual',
    loadError: 'Error al cargar datos de equipos',
    updateSuccess: 'actualizado exitosamente',
    updateError: 'Error al actualizar equipo',
  },

  // Revenue Models
  revenueModels: {
    primaryMarket: 'Mercado Primario',
    secondaryMarket: 'Mercado Secundario',
    localMarket: 'Mercado Local',
    exportMarket: 'Mercado de Exportación',
    conservative: 'Conservador',
    base: 'Base',
    aggressive: 'Agresivo',
    pricePerTon: 'Precio por Tonelada',
    marketNotes: 'Notas de Mercado',
    loadError: 'Error al cargar modelos de ingresos',
    updateSuccess: 'actualizado exitosamente',
    updateError: 'Error al actualizar ingreso del producto',
  },

  // Plant Configuration
  plantConfig: {
    defaultPlantName: 'Configuración de Planta por Defecto',
    annualProduction: 'Producción Anual',
    tonsYear: 'toneladas/año',
    operationalParams: 'Parámetros Operacionales',
    tonsPerDay: 'Toneladas por Día',
    operatingDays: 'Días Operativos por Año',
    uptimePercentage: 'Porcentaje de Disponibilidad',
    effective: 'Efectivo',
    tonsDay: 'toneladas/día',
    productMix: 'Mezcla de Productos',
    mustEqual100: 'Debe sumar 100%',
    chips3: 'Chips de 3"',
    chips1: 'Chips de 1"',
    crumbRubber: 'Caucho Molido',
    pricingScenario: 'Escenario de Precios y Mercado',
    activePricingScenario: 'Escenario de Precios Activo',
    marketSplit: 'División de Mercado',
    local: 'Mercado Local',
    export: 'Mercado de Exportación',
    mixed: 'Mixto (Local + Exportación)',
    localExportRatio: 'Ratio Local/Exportación',
    localPercentage: '% Local',
    financialParams: 'Parámetros Financieros',
    discountRateWacc: 'Tasa de Descuento (WACC)',
    projectionPeriod: 'Período de Proyección (Años)',
    saveConfiguration: 'Guardar Configuración',
    configSaved: 'Configuración guardada exitosamente',
    loadError: 'Error al cargar configuración de planta',
    saveError: 'Error al guardar configuración',
    mixWarning: 'La mezcla de productos debe sumar 100% antes de guardar.',
  },

  // Token Model
  tokenModel: {
    totalRaise: 'Recaudación Total',
    totalSupply: 'Suministro Total',
    pricePerToken: 'Precio por Token',
    ebitdaDistributed: 'EBITDA Distribuido',
    distribution: 'Distribución',
    tokenDetails: 'Detalles del Token',
    plantName: 'Nombre de la Planta',
    tokenName: 'Nombre del Token',
    tokenSymbol: 'Símbolo del Token',
    tokenEconomics: 'Economía del Token',
    tokenPriceUsd: 'Precio del Token (USD)',
    totalRaiseCalc: 'Recaudación Total (Calculado)',
    distributionModel: 'Modelo de Distribución',
    revenueShare: 'Participación de Ingresos',
    ofEbitda: 'del EBITDA',
    retainedForOps: 'retenido para operaciones',
    distributionFrequency: 'Frecuencia de Distribución',
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    annually: 'Anual',
    payoutCurrency: 'Moneda de Pago',
    legalStructure: 'Estructura Legal',
    spvJurisdiction: 'Jurisdicción del SPV',
    tokenType: 'Tipo de Token',
    revenueShareNonEquity: 'Participación de Ingresos (No-Capital)',
    profitShare: 'Participación de Ganancias',
    hybrid: 'Híbrido',
    legalNote: 'Este token representa derechos económicos sobre flujos de caja, no propiedad accionaria.',
    saveTokenModel: 'Guardar Modelo de Token',
    tokenSaved: 'Modelo de token guardado exitosamente',
    loadError: 'Error al cargar modelo de token',
    saveError: 'Error al guardar modelo de token',
  },

  // Tipping Fee Config
  tippingFeeConfig: {
    title: 'Configuración de Tipping Fee',
    description: 'Configurar ingresos por tipping fee de contratos de recolección de neumáticos usados',
    enableTippingFee: 'Habilitar Ingresos por Tipping Fee',
    enableDesc: 'Incluir tarifas de entrada en proyecciones de ingresos',
    profile: 'Perfil de Tipping Fee',
    selectProfile: 'Seleccionar perfil',
    scenario: 'Escenario',
    lowConservative: 'Bajo (Conservador)',
    baseCase: 'Caso Base',
    highAggressive: 'Alto (Agresivo)',
    off: 'Apagado',
    applyToVolume: 'Aplicar a Volumen (%)',
    applyToVolumeDesc: 'Porcentaje del throughput total que recibe tipping fee',
    contractConfidence: 'Confianza del Contrato',
    none: 'Ninguno',
    verbal: 'Acuerdo Verbal',
    loi: 'Carta de Intención',
    signed: 'Contrato Firmado',
    contractTenor: 'Duración del Contrato (meses)',
    customerConcentration: 'Concentración de Clientes (%)',
    expectedTonnage: 'Tonelaje Esperado/Año',
    baseCaseExclusion: 'Exclusión del Caso Base',
    baseCaseExclusionDesc: 'Los ingresos por tipping fee serán excluidos de las métricas del Caso Base para inversionistas. Solo contratos FIRMADOS se incluyen en proyecciones conservadoras.',
    saveConfiguration: 'Guardar Configuración',
    configSaved: 'Configuración de tipping fee guardada',
    saveError: 'Error al guardar configuración',
    loadError: 'Error al cargar datos de tipping fee',
    
    // KPI Display
    revenueAnalysis: 'Análisis de Ingresos',
    retainedShare: 'Participación Retenida',
    keptByRecycler: '% retenido por reciclador',
    tfNet: 'TF_net',
    usdPerTon: 'USD por tonelada',
    componentBased: 'BASADO EN COMPONENTES',
    componentBreakdown: 'Desglose de Componentes',
    netToRecycler: 'Neto para Reciclador',
    passThrough: 'Pass-Through',
    totalFee: 'Tarifa Total',
    productSales: 'Ventas de Productos',
    tippingFeeRev: 'Tipping Fee',
    totalRevenue: 'Ingresos Totales',
    tfShare: 'Participación Tipping Fee',
    tfShareDesc: 'Porcentaje del ingreso total de tipping fees',
    highTfDependency: 'Alta dependencia de TF ({share}%) activará penalizaciones de scoring en Leviathan Gate',
    baseCaseWoTf: 'Caso Base (sin TF)',
    withTippingFee: 'Con Tipping Fee',
    ebitdaMargin: 'Margen',
    viable: 'VIABLE',
    notViable: 'NO VIABLE',
  },

  // Project Upload (Analyzer)
  projectUpload: {
    title: 'Subir Proyecto para Análisis',
    description: 'Sube un documento PDF con información del proyecto industrial (plan de negocios, proforma financiera, pitch deck, etc.)',
    onlyPdf: 'Solo se permiten archivos PDF',
    maxSizeError: 'El archivo no debe superar 10MB',
    preparing: 'Preparando análisis...',
    analyzing: 'Analizando...',
    analysisComplete: 'Análisis completado exitosamente',
    analysisError: 'Error al analizar el proyecto',
    clickToSelect: 'Haz clic para seleccionar o arrastra un archivo PDF',
    maxSize: 'Máximo 10MB',
    remove: 'Remover',
    processingTime: 'Esto puede tomar algunos minutos...',
    startAnalysis: 'Iniciar Análisis de Viabilidad',
    analyzingProject: 'Analizando Proyecto...',
  },

  // Analysis Results
  analysisResults: {
    title: 'Leviathan Gate — Reporte de Viabilidad del Proyecto',
    generatedBy: 'Generado por Leviathan OS',
    exportPdf: 'Exportar PDF',
    newAnalysis: 'Nuevo Análisis',
    pdfSuccess: 'Reporte PDF generado exitosamente',
    pdfError: 'Error al generar el PDF',
    
    // Executive Summary
    executiveSummary: 'Resumen Ejecutivo',
    projectDocument: 'Documento de Proyecto',
    gateDecision: 'Decisión del Gate',
    originalVerdict: 'Veredicto Original',
    notAvailable: 'No disponible',
    comment: 'Comentario',
    tokenizationLevel: 'Nivel de Tokenización',
    
    // Score Badges
    premium: 'Premium',
    investable: 'Invertible',
    restructure: 'Reestructura',
    notInvestable: 'No Invertible',
    
    // Gate Verdicts
    passedGate: 'Aprobado por el Gate',
    conditionalApproval: 'Aprobación Condicional del Gate',
    rejectedGate: 'Rechazado por el Gate',
    
    // Auto Reject
    autoRejectTriggered: 'AUTO-RECHAZO ACTIVADO: Proyecto rechazado por viabilidad insuficiente del caso base (margen EBITDA < 12%) sin contrato de tipping fee firmado.',
    
    // Metrics
    infrastructure: 'Infraestructura',
    production: 'Producción',
    financials: 'Finanzas',
    risks: 'Riesgos',
    
    // Findings
    topRisks: 'Top 5 Riesgos Identificados',
    topCorrections: 'Top 5 Correcciones Necesarias',
    keyFindings: 'Hallazgos Clave',
    infrastructureMachinery: 'Infraestructura y Maquinaria',
    
    // Tipping Fee Summary
    tippingFeeSummary: 'Resumen de Tipping Fee',
    tippingFeeDesc: 'Análisis de dependencia de tarifas de entrada',
    transparency: 'Transparencia',
    tfSharePct: 'TF Share (%)',
    tfNetAssumption: 'Los valores de TF_net son SUPUESTOS (no indicados explícitamente en el documento). Perfil por defecto aplicado: $150 / $250 / $350 por tonelada.',
    assumption: 'SUPUESTO',
    tfNetLow: 'TF Net (BAJO)',
    tfNetBase: 'TF Net (BASE)',
    tfNetHigh: 'TF Net (ALTO)',
    contractConfidence: 'Confianza del Contrato',
    durationYears: 'Duración (años)',
    customerConcentration: 'Concentración Cliente (%)',
    
    // Base Case Comparison
    baseCaseComparison: 'Comparación Caso Base vs Con-Tipping',
    baseCaseComparisonDesc: 'Comparación de viabilidad con y sin tipping fee',
    withTippingFee: 'Con Tipping Fee',
    withoutTippingFee: 'Sin Tipping Fee (Caso Base)',
    revenue: 'Revenue',
    ebitdaMargin: 'Margen EBITDA',
    baseCaseWarning: 'EBITDA base case inferior al 12% - Proyecto no viable sin tipping fee contratado',
    
    // Tipping Scoring Impact
    tippingScoringImpact: 'Impacto del Scoring de Tipping',
    tippingScoringDesc: 'Impacto de tipping fees en el score final',
    totalPenaltyPoints: 'Puntos de Penalización Total',
    autoRejectLabel: 'Auto Rechazo Activado',
    penaltiesApplied: 'Penalizaciones Aplicadas',
    autoRejectMessage: 'AUTO RECHAZO: Proyecto no viable sin tipping fee contratado y EBITDA base < 12%',
    
    // Full Analysis
    fullAnalysis: 'Análisis Completo',
    fullAnalysisDesc: 'Análisis detallado generado por el sistema',
  },

  // Results Dashboard (Calculator)
  resultsDashboard: {
    exportResults: 'Exportar Resultados',
    exportDescription: 'Descarga o imprime el reporte de costos en diferentes formatos',
    exportPdf: 'Exportar PDF',
    exportCsv: 'Exportar CSV',
    print: 'Imprimir',
    pdfSuccess: 'Reporte PDF generado exitosamente',
    pdfError: 'Error al generar el PDF',
    csvSuccess: 'Reporte CSV generado exitosamente',
    csvError: 'Error al generar el CSV',
    openingPrintView: 'Abriendo vista de impresión...',
    
    // Cards
    totalCostPerTon: 'Costo Total por Tonelada',
    utilitiesCost: 'Costo de Utilidades',
    productionLabor: 'Mano de Obra Producción',
    maintenance: 'Mantenimiento',
    ofTotal: 'del total',
    
    // Charts
    costBreakdownByCategory: 'Desglose de Costos por Categoría',
    costBreakdownDesc: 'Distribución de costos en utilidades, mano de obra y mantenimiento',
    costByStage: 'Costo por Etapa de Procesamiento',
    costByStageDesc: 'Desglose de costos en cada etapa',
    
    // Detailed Breakdown
    detailedStageBreakdown: 'Desglose Detallado por Etapa',
    completeCostAnalysis: 'Análisis completo de costos para',
    perTon: 'por tonelada',
    utilities: 'Utilidades',
  },

  // Cost Editor
  costEditor: {
    throughput: 'Rendimiento',
    tonsHour: 'toneladas/hora',
    utilityCosts: 'Costos de Utilidades',
    pricePerUnit: 'Precio por Unidad ($)',
    usePerHour: 'Uso por Hora',
    costTon: 'Costo/Ton',
    productionLabor: 'Mano de Obra de Producción',
    costPerHour: 'Costo por Hora ($)',
    usePerHourRange: 'Uso por Hora (0-1)',
    maintenanceLabor: 'Mano de Obra de Mantenimiento',
    productionHours: 'Horas de Producción',
    productionTons: 'Toneladas de Producción',
    stageTotalCost: 'Costo Total de Etapa por Tonelada',
  },

  // Breadcrumbs
  breadcrumbs: {
    home: 'Inicio',
    calculator: 'Calculadora de Costos',
    financials: 'Motor Financiero Industrial',
    analyzer: 'Leviathan Gate',
  },
};

export type TranslationKeys = typeof es;
