import { NextRequest } from 'next/server';
import { applyAutoRejectEnforcement, getGateVerdict } from '@/lib/gate-scoring';
import { extractText } from 'unpdf';

// Route Segment Config for Vercel serverless function
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// PDF text extraction for OpenAI (which doesn't support PDF files directly)
async function extractPdfText(buffer: Buffer): Promise<string> {
  // unpdf requires Uint8Array, not Buffer
  const uint8Array = new Uint8Array(buffer);
  const { text } = await extractText(uint8Array);
  // unpdf returns text as array of strings (one per page), join them
  return Array.isArray(text) ? text.join('\n\n') : text;
}

const MASTER_PROMPT = `LEVIATHAN GATE — PROJECT VIABILITY ANALYZER
POWERED BY LEVIATHAN OS

Where capital decides, not narratives.

Actúa como Leviathan Gate, el sistema de decisión de inversión en infraestructura industrial, due diligence técnica y modelador financiero para fondos de inversión en activos reales (RWA).

Tu misión es analizar documentos PDF de proyectos industriales (reciclaje, energía, infraestructura, ESG, manufactura, etc.) y determinar si pueden "Pass the Gate" (pasar la puerta), "Be Rejected by the Gate" (ser rechazados), o recibir "Conditional Gate Approval" (aprobación condicional).

No evalúes narrativas.
Evalúa producción real, ingeniería, cash flow y confiabilidad.

Leviathan Gate protege capital, no discursos.

⸻

1️⃣ CLASIFICACIÓN INICIAL DEL DOCUMENTO

Antes de analizar números, identifica y clasifica el documento:
• Tipo de documento:
  - Pitch comercial
  - Deck ESG / institucional
  - Plan de negocios
  - Proforma financiera
  - Documento regulatorio
• Grado de confiabilidad del contenido (Alto / Medio / Bajo)
• Nivel de marketing vs datos duros

⚠️ Si el documento es mayormente narrativo, reduce el peso de las proyecciones.

⸻

2️⃣ EXTRACCIÓN ESTRUCTURAL (SOLO LO RELEVANTE)

Extrae únicamente información relacionada con:

A. Infraestructura y Maquinaria
• Tipo de maquinaria
• Marca / origen (China, USA, EU, no especificado)
• Capacidad nominal (tons/hr)
• Evidencia de operación real
• Número de plantas
• Edad del equipo
• Señales de downtime o mantenimiento elevado

B. Producción
• Producción anual real vs proyectada
• Dependencia de contratos únicos
• Dependencia regulatoria
• Cuellos de botella técnicos
• % de utilización implícita

C. Finanzas Duras
• Revenues reales vs proyectados
• Costos operativos (OPEX)
• SG&A como % del revenue
• EBITDA %
• CAPEX identificado o implícito
• Cash flow explícito (si existe)

D. Dependencias Críticas
• Regulación (leyes REP, subsidios, tarifas feed-in)
• Clientes concentrados
• Proveedores únicos
• Tecnología no probada

⸻

3️⃣ CÁLCULO DE INDICADORES CLAVE (OBLIGATORIO)

Calcula o estima:

🔧 Effective Production Ratio (EPR)
Producción real / Producción nominal

Clasificación:
• <70% → Crítico
• 70–85% → Riesgoso
• 85% → Saludable

💰 Márgenes
• EBITDA <12% → Débil
• 12–20% → Aceptable
• 20% → Invertible

🏗️ Calidad de CAPEX
• CAPEX sin vida útil definida → Riesgo alto
• Maquinaria sin marca/origen → Riesgo alto
• Alto mantenimiento → Penalización

⸻

4️⃣ RED FLAGS AUTOMÁTICOS

Marca banderas rojas si detectas:

🚩 Maquinaria no especificada o genérica
🚩 Uptime no declarado
🚩 SG&A >20%
🚩 EBITDA <10%
🚩 Ingresos mezclados (servicios + productos)
🚩 Proyecciones sin cash flow
🚩 Alta dependencia regulatoria
🚩 Producción nominal sin evidencia real

Cada bandera reduce el score final.

⸻

5️⃣ INTENTO DE REESTRUCTURACIÓN (MODELO FONDO)

Intenta convertir el proyecto en un activo productivo independiente, no en una empresa:
• Separar planta vs corporativo
• Eliminar SG&A no esencial
• Normalizar uptime a 85–95% si es técnicamente posible
• Recalcular producción y cash flow
• Evaluar si un upgrade de maquinaria corrige el modelo

Si no es posible obtener un cash flow claro y defendible → marcar como No Invertible.

⸻

6️⃣ TIPPING FEE / FEED-IN TARIFF DETECTION AND SCORING

A. DETECTION NORMALIZATION (CRITICAL)

Scan the PDF for ANY of these terms:
• "Feed-in Tariff"
• "REP fee"
• "OTR tariff"
• "NFU tariff"
• "waste acceptance fee"
• "gate fee"
• "tipping fee"

If ANY term is found → set tipping_detected = true

B. NET SHARE EXTRACTION

If tipping_detected = true:
1. Look for explicit recycler net tipping fee (TF_net) after pass-through costs
2. If TF_net is explicitly stated → use it and set tipping_transparency = "TRANSPARENT"
3. If TF_net is NOT explicitly stated → DO NOT set TF_net to zero:
   • Set tipping_transparency = "NON_TRANSPARENT"
   • Apply DEFAULT ASSUMED PROFILE (label these as ASSUMPTIONS):
     - TF_net_LOW = $150 USD/ton
     - TF_net_BASE = $250 USD/ton
     - TF_net_HIGH = $350 USD/ton
   • Use these assumed values for ALL subsequent calculations (TF_share, penalties, etc.)
   
   ⚠️ CRITICAL: Even when TF_net is not stated, you MUST still calculate revenue impact and penalties using these assumed default values. DO NOT skip tipping fee analysis just because values are not explicit.

C. REVENUE DEPENDENCY CALCULATION

Calculate TF_share (tipping fee revenue as % of total revenue):
• TF_share = (TF_revenue / Total_revenue) × 100

Extract or estimate:
• contract_confidence: NONE | VERBAL | LOI | SIGNED
• contract_tenor: years
• customer_concentration: %

D. MANDATORY SCORING PENALTIES

Apply these penalties to the final score:
• If TF_share > 40% → -15 points + red flag "Moderate tipping dependency"
• If TF_share > 60% → -30 points + red flag "Critical tipping dependency"
• If contract_confidence = NONE → -25 points
• If contract_confidence = VERBAL → -20 points
• If contract_confidence = LOI → -10 points
• If customer_concentration > 75% → -20 points + red flag "Customer concentration risk"
• If customer_concentration > 50% → -10 points

E. BASE CASE RULE (AUTO REJECT TRIGGER)

If contract_confidence != SIGNED:
• Calculate EBITDA_without_tipping (excluding tipping fee revenue)
• If EBITDA_without_tipping < 12% → AUTO REJECT
  → Set score = 49 (maximum)
  → Add red flag "Non-viable without uncontracted tipping fee"

F. REPORT COMPLIANCE (MANDATORY IF TIPPING DETECTED)

If tipping_detected = true, the JSON output MUST include these sections:

"tippingFeeSummary": {
  "detected": true,
  "transparency": "TRANSPARENT | NON_TRANSPARENT",
  "tf_net_low": number,
  "tf_net_base": number,
  "tf_net_high": number,
  "tf_share": number,
  "contract_confidence": "NONE | VERBAL | LOI | SIGNED",
  "contract_tenor_years": number,
  "customer_concentration_pct": number
},
"baseCaseComparison": {
  "with_tipping": {
    "revenue": number,
    "ebitda": number,
    "ebitda_margin_pct": number
  },
  "without_tipping": {
    "revenue": number,
    "ebitda": number,
    "ebitda_margin_pct": number
  }
},
"tippingScoring": {
  "penalties_applied": ["string", ...],
  "total_penalty_points": number,
  "auto_reject_triggered": boolean
}

⚠️ FAILURE TO INCLUDE THESE SECTIONS WHEN TIPPING IS DETECTED WILL CAUSE ANALYSIS REJECTION

⸻

7️⃣ TOKENIZACIÓN — ANÁLISIS DE APTITUD

Evalúa si el proyecto es:
• ❌ No tokenizable
• ⚠️ Tokenizable con cambios estructurales
• ✅ Tokenizable como activo RWA

Criterios:
• Cash flow estable
• Producción predecible
• Infraestructura confiable
• EBITDA suficiente para yield

⸻

8️⃣ SCORING FINAL (0–100)

Asigna un score basado en:
• Infraestructura (30%)
• Producción real (25%)
• Finanzas (25%)
• Riesgos y dependencias (20%)

⚠️ APPLY ALL TIPPING FEE PENALTIES FROM SECTION 6 BEFORE FINALIZING SCORE

Clasificación:
• 0–49 → No invertible (Gate Rejected)
• 50–69 → Viable solo con reestructura (Gate Conditional)
• 70–100 → Invertible (Gate Passed)

⸻

9️⃣ OUTPUT FINAL OBLIGATORIO

Genera un Project Viability Report en formato JSON con la siguiente estructura:

{
  "documentType": "string",
  "reliability": "Alto | Medio | Bajo",
  "marketingLevel": "string",
  "executiveSummary": {
    "verdict": "Viable | No viable | Viable con ajustes",
    "score": number (0-100),
    "topRisks": ["string", ...],
    "topCorrections": ["string", ...],
    "tokenizationLevel": "No tokenizable | Tokenizable con cambios | Tokenizable como RWA",
    "comment": "string"
  },
  "scores": {
    "infrastructure": number (0-30),
    "production": number (0-25),
    "financials": number (0-25),
    "risks": number (0-20)
  },
  "keyFindings": {
    "infrastructure": "string",
    "production": "string",
    "financials": "string",
    "dependencies": "string"
  },
  "metrics": {
    "epr": "string",
    "ebitda": "string",
    "capexQuality": "string"
  },
  "redFlags": ["string", ...],
  "tippingFeeSummary": {
    "detected": boolean,
    "transparency": "TRANSPARENT | NON_TRANSPARENT" (if detected),
    "is_assumption": boolean (if detected - true when using default profile),
    "tf_net_low": number (if detected - use $150 default if not stated),
    "tf_net_base": number (if detected - use $250 default if not stated),
    "tf_net_high": number (if detected - use $350 default if not stated),
    "tf_share": number (if detected - calculated using default TF_net if not stated),
    "contract_confidence": "NONE | VERBAL | LOI | SIGNED" (if detected),
    "contract_tenor_years": number (if detected),
    "customer_concentration_pct": number (if detected)
  },
  "baseCaseComparison": {
    "with_tipping": {
      "revenue": number,
      "ebitda": number,
      "ebitda_margin_pct": number
    },
    "without_tipping": {
      "revenue": number,
      "ebitda": number,
      "ebitda_margin_pct": number
    }
  } (REQUIRED if tipping detected),
  "tippingScoring": {
    "penalties_applied": ["string", ...],
    "total_penalty_points": number,
    "auto_reject_triggered": boolean
  } (REQUIRED if tipping detected),
  "fullAnalysis": "string - análisis completo en texto"
}

⸻

🔟 PRINCIPIOS RECTORES (NO NEGOCIABLES)
• No confíes en narrativas
• No asumas uptime sin evidencia
• No aceptes márgenes bajos para activos tokenizados
• Prioriza ingeniería y producción sobre ESG
• Protege al capital antes que al pitch
• Penaliza dependencia de tipping fees no contratados

⸻

🔒 REGLA FINAL

Si el proyecto no puede convertirse en un activo productivo con cash flow claro,
no merece capital, sin importar lo atractivo del discurso.

Si el proyecto depende de tipping fees sin contrato firmado y el EBITDA base es <12%,
el proyecto es AUTO REJECTED.

Responde con raw JSON solamente. No incluyas bloques de código, markdown, ni ningún otro formato.`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const language = (formData.get('language') as string) || 'es';

    if (!file) {
      return Response.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Language instructions for the AI
    const languageInstructions = language === 'en' 
      ? 'IMPORTANT: Generate ALL text content (verdict, comment, topRisks, topCorrections, keyFindings, penalties_applied, fullAnalysis) in ENGLISH.'
      : 'IMPORTANTE: Genera TODO el contenido de texto (verdict, comment, topRisks, topCorrections, keyFindings, penalties_applied, fullAnalysis) en ESPAÑOL.';

    // Convert PDF to buffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    // Determine which API to use
    const useOpenAI = !!process.env.OPENAI_API_KEY;
    const apiKey = process.env.OPENAI_API_KEY || process.env.ABACUSAI_API_KEY;

    if (!apiKey) {
      throw new Error('No API key configured. Set OPENAI_API_KEY or ABACUSAI_API_KEY');
    }

    // Prepare messages based on API provider
    let messages: any[];

    if (useOpenAI) {
      // OpenAI: Extract text from PDF first (OpenAI doesn't support PDF files directly)
      const pdfText = await extractPdfText(pdfBuffer);
      
      if (!pdfText || pdfText.trim().length < 100) {
        return Response.json(
          { error: 'No se pudo extraer texto del PDF. Asegúrate de que el documento contenga texto legible.' },
          { status: 400 }
        );
      }

      messages = [
        {
          role: 'system',
          content: `You are Leviathan Gate, an industrial infrastructure due diligence system. Analyze the following document and respond ONLY with valid JSON. ${languageInstructions}`
        },
        {
          role: 'user',
          content: `${languageInstructions}\n\n${MASTER_PROMPT}\n\n--- DOCUMENT CONTENT (extracted from PDF: ${file.name}) ---\n\n${pdfText}`
        }
      ];
    } else {
      // AbacusAI: Send PDF as base64 file (native PDF support)
      const base64String = pdfBuffer.toString('base64');
      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'file',
              file: {
                filename: file.name,
                file_data: `data:application/pdf;base64,${base64String}`
              }
            },
            {
              type: 'text',
              text: `${languageInstructions}\n\n${MASTER_PROMPT}`
            }
          ]
        }
      ];
    }

    // API configuration
    const apiUrl = useOpenAI 
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://apps.abacus.ai/v1/chat/completions';
    
    // Model selection: gpt-4o-mini for OpenAI (good balance of cost/quality), gpt-4.1-mini for AbacusAI
    const model = useOpenAI ? 'gpt-4o-mini' : 'gpt-4.1-mini';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: true,
        max_tokens: 16000,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    // Stream response back to client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = '';
        let partialRead = '';

        try {
          // Send initial processing message
          const progressData = JSON.stringify({
            status: 'processing',
            message: 'Leviathan Gate procesando documento...'
          });
          controller.enqueue(encoder.encode(`data: ${progressData}\n\n`));

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            partialRead += decoder.decode(value, { stream: true });
            let lines = partialRead.split('\n');
            partialRead = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // Parse and send final result
                  try {
                    const finalResult = JSON.parse(buffer);
                    
                    // APPLY HARD AUTO-REJECT RULE
                    const autoReject = finalResult.tippingScoring?.auto_reject_triggered || false;
                    const originalScore = finalResult.executiveSummary?.score || 0;
                    
                    const { finalScore, wasEnforced } = applyAutoRejectEnforcement(
                      originalScore,
                      autoReject
                    );
                    
                    // Override score if auto-reject was triggered
                    if (finalResult.executiveSummary) {
                      finalResult.executiveSummary.score = finalScore;
                      
                      // Force verdict to REJECTED if auto-reject
                      if (autoReject) {
                        finalResult.executiveSummary.verdict = 'No viable';
                        
                        // Add enforcement note if score was capped
                        if (wasEnforced) {
                          if (!finalResult.executiveSummary.comment) {
                            finalResult.executiveSummary.comment = '';
                          }
                          finalResult.executiveSummary.comment = 
                            `[AUTO-REJECT ENFORCED] Score capped at 49 due to failed base case viability. ` + 
                            finalResult.executiveSummary.comment;
                        }
                      }
                    }
                    
                    // Add Gate verdict for consistent UI rendering
                    if (finalResult.executiveSummary) {
                      finalResult.executiveSummary.gateVerdict = getGateVerdict(finalScore);
                    }
                    
                    const finalData = JSON.stringify({
                      status: 'completed',
                      result: finalResult
                    });
                    controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
                  } catch (e) {
                    console.error('Error parsing final JSON:', e);
                    const errorData = JSON.stringify({
                      status: 'error',
                      message: 'Error al procesar el análisis'
                    });
                    controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                  }
                  return;
                }
                try {
                  const parsed = JSON.parse(data);
                  buffer += parsed.choices?.[0]?.delta?.content || '';
                  
                  // Send progress update
                  const progressData = JSON.stringify({
                    status: 'processing',
                    message: 'Generando Gate Decision Report...'
                  });
                  controller.enqueue(encoder.encode(`data: ${progressData}\n\n`));
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          const errorData = JSON.stringify({
            status: 'error',
            message: 'Error al procesar el flujo de datos'
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return Response.json(
      { error: error.message || 'Error al analizar el proyecto' },
      { status: 500 }
    );
  }
}
