# Leviathan Neumáticos - Motor Financiero Industrial

Plataforma de inteligencia financiera de grado institucional para operaciones de reciclaje de neumáticos. Incluye modelado financiero completo, análisis de viabilidad de proyectos y tokenización de activos del mundo real (RWA).

## 🚀 Características Principales

### Motor de Costos (Calculator)
- Análisis detallado de costos por etapa de procesamiento
- Costos de utilidades, mano de obra de producción y mantenimiento
- Visualización de breakdown de costos por tonelada
- Exportación a PDF y CSV

### Motor Financiero (Financials)
- **Dashboard de Inversión**: KPIs financieros (NPV, IRR, EBITDA, Payback)
- **Finanzas de Equipos**: Gestión de CAPEX, depreciación y ciclo de vida
- **Modelos de Ingresos**: Escenarios de precios (Conservador/Base/Agresivo)
- **Configuración de Planta**: Parámetros operacionales y mezcla de productos
- **Tipping Fee**: Configuración de tarifas de entrada
- **Modelo de Tokenización**: Estructura de tokens de reparto de ingresos (RWA)

### Leviathan Gate (Analyzer)
- Análisis de viabilidad de proyectos mediante IA
- Evaluación técnica, financiera y de riesgos
- Score de inversión (0-100)
- Identificación automática de red flags
- Exportación de reportes

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Frontend** | React 18, TypeScript |
| **Estilos** | Tailwind CSS, shadcn/ui |
| **Base de Datos** | SQLite + Prisma ORM |
| **Gráficos** | Recharts |
| **i18n** | Sistema propio (ES/EN) |
| **Exportación** | jsPDF, CSV |

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd leviathan-neumaticos
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tu configuración:
```env
DATABASE_URL="file:./dev.db"
```

4. **Configurar base de datos**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run db:generate` | Genera cliente Prisma |
| `npm run db:push` | Sincroniza schema con BD |
| `npm run db:seed` | Pobla BD con datos iniciales |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run db:reset` | Resetea y re-puebla BD |

## 📁 Estructura del Proyecto

```
leviathan-neumaticos/
├── app/
│   ├── analyzer/           # Leviathan Gate - Análisis de viabilidad
│   ├── calculator/         # Motor de costos por etapa
│   ├── financials/         # Motor financiero completo
│   ├── api/                # API Routes
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   ├── global-nav.tsx      # Navegación global
│   └── ...
├── lib/
│   ├── i18n/               # Sistema de internacionalización
│   ├── db.ts               # Cliente Prisma
│   ├── financial-calcs.ts  # Cálculos financieros
│   └── ...
├── prisma/
│   └── schema.prisma       # Schema de base de datos
├── scripts/
│   ├── seed.ts             # Script de seed
│   └── structured_data.json
└── public/
```

## 🌐 Internacionalización

La aplicación soporta Español e Inglés. Los archivos de traducción se encuentran en:
- `lib/i18n/languages/es.ts` - Español
- `lib/i18n/languages/en.ts` - English

## 📊 Modelos de Datos

### Etapas de Procesamiento
- TC-500: Trituración inicial
- TG-500: Granulado
- Cracker Mill: Producción de crumb rubber

### Productos
- 3" Nominal Chips (TDF, Ingeniería Civil)
- 1" Chips (Superficies de juego, Pistas atléticas)
- Crumb Rubber (Productos moldeados, Asfalto modificado)

### Token Model (RWA)
- Tokens de reparto de ingresos
- Distribución de EBITDA configurable
- Soporte para USDC como moneda de pago

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.
