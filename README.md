# Insurance DDD NestJS Example

Ejemplo práctico de **NestJS + DDD + Modular Monolith** para una empresa de seguros.

Incluye dos contextos de negocio:

1. `insurance-quotes`: cotizaciones de seguros de auto.
2. `policy-issuance`: emisión de pólizas a partir de una cotización vigente.

La base de datos es **en memoria** para que puedas probarlo rápido sin Docker, PostgreSQL ni Firestore.

---

## Idea para explicárselo a un colega

DDD no empieza preguntando: “¿qué controller o service hago?”

DDD pregunta primero:

> ¿Qué partes del negocio existen y qué reglas tiene cada una?

En seguros, por ejemplo:

- Cotización
- Emisión
- Renovación
- Cancelación
- Siniestros
- Pagos
- Endosos

Cada una puede ser un módulo o bounded context.

En este proyecto usamos:

```txt
src/modules
├── insurance-quotes
└── policy-issuance
```

Cada módulo se organiza así:

```txt
module
├── domain          # Reglas del negocio. No sabe de Nest, HTTP ni DB.
├── usecase        # Casos de uso. Orquesta entidades y repositorios.
├── application    # Controllers, DTOs, presenters y puertos públicos.
└── infrastructure # Repositorios reales, APIs externas, event handlers.
```

La frase clave:

> El controller recibe HTTP. El use case ejecuta una intención. El domain protege las reglas. La infrastructure guarda o conecta con cosas externas.

---

## Requisitos

- Node.js 20 o superior
- npm

---

## Instalación

```bash
npm install
```

---

## Ejecutar

```bash
npm run start:dev
```

La API queda disponible en:

```txt
http://localhost:3000/api
```

---

## Probar con cURL

### 1. Crear una cotización

```bash
curl -X POST http://localhost:3000/api/insurance-quotes \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUS-001",
    "insuredName": "Eladio Rocha",
    "insuredAge": 27,
    "vehicle": {
      "brand": "Volkswagen",
      "model": "Jetta",
      "year": 2021,
      "usage": "personal"
    },
    "packageType": "PLUS"
  }'
```

Respuesta esperada aproximada:

```json
{
  "id": "uuid",
  "customerId": "CUS-001",
  "insured": {
    "name": "Eladio Rocha",
    "age": 27
  },
  "vehicle": {
    "brand": "Volkswagen",
    "model": "Jetta",
    "year": 2021,
    "usage": "personal"
  },
  "package": {
    "type": "PLUS",
    "coverages": [
      "Civil liability",
      "Legal assistance",
      "Total theft",
      "Material damage"
    ]
  },
  "premium": {
    "subtotal": 5670,
    "tax": 907.2,
    "total": 6577.2,
    "currency": "MXN"
  },
  "status": "CREATED",
  "validUntil": "date",
  "createdAt": "date"
}
```

Guarda el `id` de la cotización.

---

### 2. Emitir una póliza

Reemplaza `QUOTE_ID` con el `id` de la cotización.

```bash
curl -X POST http://localhost:3000/api/policies/issue \
  -H "Content-Type: application/json" \
  -d '{
    "quoteId": "QUOTE_ID",
    "paymentReference": "PAY-123456"
  }'
```

Respuesta esperada aproximada:

```json
{
  "id": "uuid",
  "policyNumber": "POL-20260622-123456",
  "quoteId": "uuid",
  "customerId": "CUS-001",
  "insuredName": "Eladio Rocha",
  "packageType": "PLUS",
  "premium": {
    "total": 6577.2,
    "currency": "MXN"
  },
  "paymentReference": "PAY-123456",
  "status": "ACTIVE",
  "issuedAt": "date",
  "startsAt": "date",
  "endsAt": "date"
}
```

---

### 3. Listar cotizaciones

```bash
curl http://localhost:3000/api/insurance-quotes
```

---

### 4. Listar pólizas

```bash
curl http://localhost:3000/api/policies
```

---

## Ejecutar prueba unitaria

```bash
npm run test
```

La prueba demuestra que el caso de uso puede ejecutarse sin levantar HTTP, sin Nest completo y sin base de datos real.

---

## Cómo leer el ejemplo

### Cotización

Flujo:

```txt
POST /insurance-quotes
        ↓
InsuranceQuotesController
        ↓
CreateInsuranceQuoteUseCase
        ↓
InsuranceQuote Entity
        ↓
InsuranceQuoteRepository interface
        ↓
InMemoryInsuranceQuoteRepository
```

### Emisión

Flujo:

```txt
POST /policies/issue
        ↓
PolicyIssuanceController
        ↓
IssuePolicyUseCase
        ↓
QuoteReader public port
        ↓
Policy Entity
        ↓
PolicyRepository interface
        ↓
InMemoryPolicyRepository
```

`policy-issuance` no importa directamente el repositorio interno de cotizaciones. Usa `QUOTE_READER`, que es la interfaz pública del módulo de cotizaciones.

Eso es importante porque evita que los módulos se vuelvan un plato de espagueti con casco de programador.

---

## Qué cambiarías en un proyecto real

En producción cambiarías:

```txt
InMemoryInsuranceQuoteRepository
InMemoryPolicyRepository
```

por implementaciones reales, por ejemplo:

```txt
PostgresInsuranceQuoteRepository
FirestoreInsuranceQuoteRepository
PrismaPolicyRepository
```

El dominio y los casos de uso deberían cambiar poco o nada.

---

## Endpoints incluidos

```txt
POST /api/insurance-quotes
GET  /api/insurance-quotes
GET  /api/insurance-quotes/:id

POST /api/policies/issue
GET  /api/policies
GET  /api/policies/:id
```
