import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const dataPath = path.join(__dirname, 'structured_data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const stagesData = JSON.parse(rawData);

  await prisma.processingStage.deleteMany();
  await prisma.utilityCost.deleteMany();
  await prisma.productionLabor.deleteMany();
  await prisma.maintenanceLabor.deleteMany();
  console.log('Cleared existing data');

  for (let i = 0; i < stagesData.length; i++) {
    const stageData = stagesData[i];
    const stageNumber = i + 1;

    console.log(`Creating stage ${stageNumber}: ${stageData?.stageName ?? ''}`);

    const stage = await prisma.processingStage.create({
      data: {
        stageNumber,
        stageName: stageData?.stageName ?? '',
        machineName: stageData?.machineName ?? '',
        inputProduct: stageData?.inputProduct ?? '',
        finishProduct: stageData?.finishProduct ?? '',
        tonsPerHour: stageData?.tonsPerHour ?? 0,
        totalUtilitiesCostPerTon: stageData?.totalUtilitiesCostPerTon ?? 0,
        totalProductionLaborCostPerTon: stageData?.totalProductionLaborCostPerTon ?? 0,
        totalMaintenanceLaborCostPerTon: stageData?.totalMaintenanceLaborCostPerTon ?? 0,
        totalCostPerTon: stageData?.totalCostPerTon ?? 0,
      },
    });

    if (stageData?.utilityCosts && Array.isArray(stageData.utilityCosts)) {
      for (const util of stageData.utilityCosts) {
        await prisma.utilityCost.create({
          data: {
            stageId: stage?.id ?? 0,
            name: util?.name ?? '',
            pricePerUnit: util?.pricePerUnit ?? 0,
            usePerHour: util?.usePerHour ?? 0,
            costPerHour: util?.costPerHour ?? 0,
            costPerTon: util?.costPerTon ?? 0,
          },
        });
      }
    }

    if (stageData?.productionLabor && Array.isArray(stageData.productionLabor)) {
      for (const labor of stageData.productionLabor) {
        await prisma.productionLabor.create({
          data: {
            stageId: stage?.id ?? 0,
            name: labor?.name ?? '',
            costPerHour: labor?.costPerHour ?? 0,
            usePerHour: labor?.usePerHour ?? 0,
            totalCostPerHour: labor?.totalCostPerHour ?? 0,
            costPerTon: labor?.costPerTon ?? 0,
          },
        });
      }
    }

    if (stageData?.maintenanceLabor && Array.isArray(stageData.maintenanceLabor)) {
      for (const maint of stageData.maintenanceLabor) {
        await prisma.maintenanceLabor.create({
          data: {
            stageId: stage?.id ?? 0,
            name: maint?.name ?? '',
            productionHours: maint?.productionHours ?? 0,
            productionTons: maint?.productionTons ?? 0,
            leadMechanic: maint?.leadMechanic ?? 0,
            mechanic: maint?.mechanic ?? 0,
            laborer: maint?.laborer ?? 0,
            costPerTon: maint?.costPerTon ?? 0,
          },
        });
      }
    }

    console.log(`Stage ${stageNumber} created successfully`);
  }

  // ===============================================
  // SEED FINANCIAL DATA
  // ===============================================

  console.log('\n=== Seeding Financial Data ===\n');

  // Clear existing financial data
  await prisma.equipmentFinancial.deleteMany();
  await prisma.productRevenue.deleteMany();
  await prisma.plantConfiguration.deleteMany();
  await prisma.tokenModel.deleteMany();
  console.log('Cleared existing financial data');

  // MÓDULO A: Equipment Financials (CAPEX)
  console.log('Creating Equipment Financials...');
  
  const equipment = [
    {
      machineName: 'TC-500',
      stageNumber: 1,
      purchasePrice: 850000,
      installationCost: 150000,
      totalCapex: 1000000,
      usefulLifeYears: 15,
      usefulLifeHours: 60000, // 15 years * 4000 hours/year
      depreciationMethod: 'straight_line',
      annualMaintenanceRate: 0.05,
      insuranceRate: 0.02,
      financingType: 'cash',
      debtInterestRate: null,
      debtTermYears: null,
    },
    {
      machineName: 'TG-500',
      stageNumber: 2,
      purchasePrice: 680000,
      installationCost: 120000,
      totalCapex: 800000,
      usefulLifeYears: 15,
      usefulLifeHours: 60000,
      depreciationMethod: 'straight_line',
      annualMaintenanceRate: 0.05,
      insuranceRate: 0.02,
      financingType: 'cash',
      debtInterestRate: null,
      debtTermYears: null,
    },
    {
      machineName: 'Cracker Mill',
      stageNumber: 3,
      purchasePrice: 1200000,
      installationCost: 200000,
      totalCapex: 1400000,
      usefulLifeYears: 20,
      usefulLifeHours: 80000, // 20 years * 4000 hours/year
      depreciationMethod: 'straight_line',
      annualMaintenanceRate: 0.04,
      insuranceRate: 0.02,
      financingType: 'cash',
      debtInterestRate: null,
      debtTermYears: null,
    },
  ];

  for (const eq of equipment) {
    await prisma.equipmentFinancial.create({ data: eq });
    console.log(`  ✓ ${eq.machineName}: $${eq.totalCapex.toLocaleString()} CAPEX`);
  }

  // MÓDULO B: Product Revenue Models
  console.log('\nCreating Product Revenue Models...');
  
  const products = [
    {
      productName: '3" Nominal Chips',
      productType: 'chips_3',
      // Precios locales (USD/ton)
      localPriceConservative: 25,
      localPriceBase: 35,
      localPriceAggressive: 45,
      // Precios export (USD/ton)
      exportPriceConservative: 30,
      exportPriceBase: 40,
      exportPriceAggressive: 55,
      primaryMarket: 'TDF (Tire Derived Fuel)',
      secondaryMarket: 'Civil Engineering',
      marketNotes: 'High demand for TDF in cement kilns and power plants. Civil engineering uses for drainage and embankment fill.',
    },
    {
      productName: '1" Chips',
      productType: 'chips_1',
      localPriceConservative: 45,
      localPriceBase: 60,
      localPriceAggressive: 75,
      exportPriceConservative: 50,
      exportPriceBase: 65,
      exportPriceAggressive: 85,
      primaryMarket: 'Playground Surfaces',
      secondaryMarket: 'Athletic Tracks',
      marketNotes: 'Premium market for safety surfaces. Growing demand in recreational facilities and schools.',
    },
    {
      productName: 'Crumb Rubber',
      productType: 'crumb',
      localPriceConservative: 180,
      localPriceBase: 220,
      localPriceAggressive: 280,
      exportPriceConservative: 200,
      exportPriceBase: 250,
      exportPriceAggressive: 320,
      primaryMarket: 'Molded Products',
      secondaryMarket: 'Asphalt Modification',
      marketNotes: 'Highest value product. Used in automotive parts, mats, and modified asphalt. Strong export demand.',
    },
  ];

  for (const prod of products) {
    await prisma.productRevenue.create({ data: prod });
    console.log(`  ✓ ${prod.productName}: $${prod.localPriceBase}/ton (base)`);
  }

  // MÓDULO C: Plant Configuration (Default)
  console.log('\nCreating Default Plant Configuration...');
  
  const plantConfig = {
    name: 'Default Plant Configuration',
    tonsPerDay: 100,
    operatingDaysPerYear: 330,
    uptimePercentage: 0.85,
    productMixChips3: 30,
    productMixChips1: 40,
    productMixCrumb: 30,
    activeScenario: 'base',
    marketSplit: 'local',
    localExportRatio: 0.80,
    discountRate: 0.12,
    projectionYears: 15,
  };

  await prisma.plantConfiguration.create({ data: plantConfig });
  console.log(`  ✓ Plant: ${plantConfig.tonsPerDay} tons/day, ${plantConfig.operatingDaysPerYear} days/year`);

  // MÓDULO D: Token Model (Default)
  console.log('\nCreating Token Model...');
  
  const tokenModel = {
    plantName: 'Tire Recycling Plant #1',
    tokenName: 'TRP1 Revenue Share Token',
    tokenSymbol: 'TRP1',
    totalSupply: 1000000, // 1 million tokens
    tokenPrice: 10, // $10 per token
    totalRaise: 10000000, // $10M total raise
    revenueSharePercentage: 0.70, // 70% of EBITDA distributed
    distributionFrequency: 'quarterly',
    payoutCurrency: 'USDC',
    spvJurisdiction: 'Delaware',
    tokenType: 'revenue_share',
    expectedAnnualYield: null, // calculated
    breakEvenMonths: null, // calculated
  };

  await prisma.tokenModel.create({ data: tokenModel });
  console.log(`  ✓ Token: ${tokenModel.tokenSymbol} - ${tokenModel.totalSupply.toLocaleString()} tokens @ $${tokenModel.tokenPrice}`);

  // ===============================================
  // MÓDULO E: TIPPING FEE
  // ===============================================
  console.log('\n=== Seeding Tipping Fee Module ===');

  // Crear perfil por defecto
  const defaultTippingFeeProfile = {
    name: 'Default Tipping Fee Profile',
    description: 'Standard tipping fee structure for municipal waste tire collection',
    feeLow: 75,    // Conservative: $75/ton
    feeBase: 100,  // Base case: $100/ton
    feeHigh: 125,  // Aggressive: $125/ton
    isActive: true,
    isDefault: true,
  };

  const tippingProfile = await prisma.tippingFeeProfile.create({
    data: defaultTippingFeeProfile,
  });
  console.log(`  ✓ Profile: ${tippingProfile.name}`);

  // Crear componentes del tipping fee
  const tippingComponents = [
    {
      profileId: tippingProfile.id,
      componentName: 'Base Gate Fee',
      amountLow: 50,
      amountBase: 65,
      amountHigh: 80,
      isPassThrough: false,
      category: 'disposal',
      notes: 'Core revenue from tire acceptance',
    },
    {
      profileId: tippingProfile.id,
      componentName: 'Municipal Tax',
      amountLow: 15,
      amountBase: 20,
      amountHigh: 25,
      isPassThrough: true,
      category: 'tax',
      notes: 'Pass-through to municipal government',
    },
    {
      profileId: tippingProfile.id,
      componentName: 'Transportation Fee',
      amountLow: 8,
      amountBase: 10,
      amountHigh: 12,
      isPassThrough: false,
      category: 'transport',
      notes: 'Collection and transportation costs',
    },
    {
      profileId: tippingProfile.id,
      componentName: 'Administrative Fee',
      amountLow: 2,
      amountBase: 5,
      amountHigh: 8,
      isPassThrough: false,
      category: 'admin',
      notes: 'Processing and documentation',
    },
  ];

  for (const comp of tippingComponents) {
    await prisma.tippingFeeComponent.create({ data: comp });
    console.log(`  ✓ Component: ${comp.componentName} (${comp.isPassThrough ? 'Pass-through' : 'Net to Recycler'})`);
  }

  // Crear assumption por defecto
  const defaultProjectAssumption = {
    projectName: 'Current Project',
    tippingFeeEnabled: false,
    tippingFeeProfileId: tippingProfile.id,
    tippingFeeScenario: 'OFF',
    tippingFeeApplyPercentage: 100,
    contractConfidence: 'NONE',
    contractTenorMonths: null,
    contractConcentration: 0,
    expectedTonnagePerYear: null,
    overrideSellingPrices: false,
  };

  await prisma.projectRevenueAssumption.create({ data: defaultProjectAssumption });
  console.log('  ✓ Default project revenue assumption created');

  console.log('\n=== Financial Data Seeded Successfully ===\n');
  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
