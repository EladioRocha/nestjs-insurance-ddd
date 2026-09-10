# NestJS Insurance DDD

A practical **NestJS modular monolith** demonstrating domain-driven design through two insurance business contexts:

1. `insurance-quotes`: create and manage vehicle insurance quotes.
2. `policy-issuance`: issue a policy from a valid quote.

Repositories store data **in memory**, so you can explore the example without a database server. Data is lost when the application restarts.

## Requirements and setup

- Node.js 20 or later, as declared in `package.json`.
- npm.

```sh
npm install
npm run start:dev
```

The API is available at **http://localhost:3000/api**.

## Architecture

DDD starts by identifying business concepts and their rules. Quotes, policy issuance, renewals, cancellations, claims, payments, and endorsements can each define distinct contexts. This example implements the first two:

```text
src/modules
├── insurance-quotes
└── policy-issuance
```

Each module separates responsibilities:

```text
module
├── domain          # Business rules, independent of NestJS, HTTP, and storage.
├── usecase         # Application intentions and entity/repository orchestration.
├── application     # Controllers, DTOs, presenters, and public ports.
└── infrastructure  # Repository implementations, integrations, and event handlers.
```

Controllers receive HTTP requests, use cases coordinate an operation, the domain enforces business rules, and infrastructure persists data or connects to external systems.

### Quote creation

```text
POST /api/insurance-quotes
  → InsuranceQuotesController
  → CreateInsuranceQuoteUseCase
  → InsuranceQuote entity
  → InsuranceQuoteRepository interface
  → InMemoryInsuranceQuoteRepository
```

### Policy issuance

```text
POST /api/policies/issue
  → PolicyIssuanceController
  → IssuePolicyUseCase
  → QuoteReader public port
  → Policy entity
  → PolicyRepository interface
  → InMemoryPolicyRepository
```

The `policy-issuance` module accesses quotes through the public `QUOTE_READER` port instead of importing the quote module's internal repository. This keeps the dependency between business contexts explicit.

## API walkthrough

The following cURL examples use POSIX shell quoting. On Windows, use a compatible shell or adapt JSON quoting for PowerShell. See also [requests.http](requests.http).

### 1. Create a quote

```sh
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

Illustrative response; generated identifiers and dates vary:

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

Save the returned quote `id`.

### 2. Issue a policy

Replace `QUOTE_ID` with the quote identifier:

```sh
curl -X POST http://localhost:3000/api/policies/issue \
  -H "Content-Type: application/json" \
  -d '{
    "quoteId": "QUOTE_ID",
    "paymentReference": "PAY-123456"
  }'
```

Illustrative response:

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

### 3. List quotes and policies

```sh
curl http://localhost:3000/api/insurance-quotes
curl http://localhost:3000/api/policies
```

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/insurance-quotes` | Create a quote. |
| GET | `/api/insurance-quotes` | List quotes. |
| GET | `/api/insurance-quotes/:id` | Retrieve a quote. |
| POST | `/api/policies/issue` | Issue a policy from a quote. |
| GET | `/api/policies` | List policies. |
| GET | `/api/policies/:id` | Retrieve a policy. |

## Tests and build

```sh
npm test
npm run build
```

The unit test demonstrates running a use case without starting the HTTP server or connecting to a database. `npm run start:prod` runs the compiled application after a successful build.

## Extending the example

For persistent storage, replace `InMemoryInsuranceQuoteRepository` and `InMemoryPolicyRepository` with implementations backed by the database of your choice. Keep the repository contracts intact so the domain and use cases require minimal changes.

This is an educational architecture example, not a production insurance platform. Its in-memory persistence and illustrative premium calculation need application-specific validation before real use.
