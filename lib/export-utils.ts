import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportData {
  productType: string;
  productName: string;
  stages: Array<{
    stageNumber: number;
    stageName: string;
    totalCostPerTon: number;
    utilitiesCost: number;
    productionLaborCost: number;
    maintenanceLaborCost: number;
  }>;
  totalCostPerTon: number;
  calculationDate: string;
}

export function exportToPDF(data: ExportData) {
  const doc = new jsPDF();
  
  // Encabezado
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text('Reporte de Costos - Tire Recycling', 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text(`Producto: ${data.productName}`, 14, 30);
  doc.text(`Fecha: ${data.calculationDate}`, 14, 37);
  
  // Línea separadora
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.line(14, 42, 196, 42);
  
  // Resumen ejecutivo
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55); // gray-800
  doc.text('Resumen Ejecutivo', 14, 52);
  
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99); // gray-600
  doc.text(`Costo Total por Tonelada: $${data.totalCostPerTon.toFixed(2)}`, 14, 60);
  doc.text(`Etapas de Procesamiento: ${data.stages.length}`, 14, 67);
  
  // Tabla de costos por etapa
  const tableData = data.stages.map((stage) => [
    `Etapa ${stage.stageNumber}`,
    stage.stageName,
    `$${stage.utilitiesCost.toFixed(2)}`,
    `$${stage.productionLaborCost.toFixed(2)}`,
    `$${stage.maintenanceLaborCost.toFixed(2)}`,
    `$${stage.totalCostPerTon.toFixed(2)}`,
  ]);
  
  autoTable(doc, {
    startY: 75,
    head: [['Etapa', 'Nombre', 'Utilidades', 'Mano Obra', 'Mantenimiento', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235], // blue-600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    footStyles: {
      fillColor: [243, 244, 246], // gray-100
      textColor: [31, 41, 55], // gray-800
      fontStyle: 'bold',
    },
    foot: [[
      'TOTAL',
      '',
      `$${data.stages.reduce((sum, s) => sum + s.utilitiesCost, 0).toFixed(2)}`,
      `$${data.stages.reduce((sum, s) => sum + s.productionLaborCost, 0).toFixed(2)}`,
      `$${data.stages.reduce((sum, s) => sum + s.maintenanceLaborCost, 0).toFixed(2)}`,
      `$${data.totalCostPerTon.toFixed(2)}`,
    ]],
  });
  
  // Distribución de costos
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('Distribución de Costos', 14, finalY + 15);
  
  const totalUtilities = data.stages.reduce((sum, s) => sum + s.utilitiesCost, 0);
  const totalProduction = data.stages.reduce((sum, s) => sum + s.productionLaborCost, 0);
  const totalMaintenance = data.stages.reduce((sum, s) => sum + s.maintenanceLaborCost, 0);
  
  const utilitiesPercent = ((totalUtilities / data.totalCostPerTon) * 100).toFixed(1);
  const productionPercent = ((totalProduction / data.totalCostPerTon) * 100).toFixed(1);
  const maintenancePercent = ((totalMaintenance / data.totalCostPerTon) * 100).toFixed(1);
  
  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  doc.text(`Utilidades: $${totalUtilities.toFixed(2)} (${utilitiesPercent}%)`, 14, finalY + 25);
  doc.text(`Mano de Obra Producción: $${totalProduction.toFixed(2)} (${productionPercent}%)`, 14, finalY + 32);
  doc.text(`Mano de Obra Mantenimiento: $${totalMaintenance.toFixed(2)} (${maintenancePercent}%)`, 14, finalY + 39);
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175); // gray-400
  doc.text('Tire Recycling Calculator - Industrial Financial Engine', 14, 285);
  doc.text('© 2024 Todos los derechos reservados', 14, 290);
  
  // Descargar
  doc.save(`reporte-costos-${data.productType}-${Date.now()}.pdf`);
}

export function exportToCSV(data: ExportData) {
  const headers = ['Etapa', 'Nombre', 'Utilidades', 'Mano Obra Producción', 'Mano Obra Mantenimiento', 'Total por Tonelada'];
  const rows = data.stages.map((stage) => [
    `Etapa ${stage.stageNumber}`,
    stage.stageName,
    stage.utilitiesCost.toFixed(2),
    stage.productionLaborCost.toFixed(2),
    stage.maintenanceLaborCost.toFixed(2),
    stage.totalCostPerTon.toFixed(2),
  ]);
  
  // Agregar totales
  rows.push([
    'TOTAL',
    '',
    data.stages.reduce((sum, s) => sum + s.utilitiesCost, 0).toFixed(2),
    data.stages.reduce((sum, s) => sum + s.productionLaborCost, 0).toFixed(2),
    data.stages.reduce((sum, s) => sum + s.maintenanceLaborCost, 0).toFixed(2),
    data.totalCostPerTon.toFixed(2),
  ]);
  
  const csvContent = [
    `Reporte de Costos - ${data.productName}`,
    `Fecha: ${data.calculationDate}`,
    '',
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `reporte-costos-${data.productType}-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printResults() {
  window.print();
}
