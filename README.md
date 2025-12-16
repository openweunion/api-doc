# WeUnion API Documentation

WeUnion API provides secure and programmable **offramp services**, allowing users to convert digital assets (e.g., USDC) into fiat currency and withdraw funds to their linked bank accounts.

## Quick Start

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x

### Installation

```bash
npm install
```

### Development

```bash
# Lint OpenAPI specification
npm run lint

# Build documentation
npm run build

# Preview locally (build then open dist/index.html)
npx redocly build-docs openapi.yaml -o dist/index.html && open dist/index.html
```

## Project Structure

```
WeUnion/
├── openapi.yaml              # Main OpenAPI 3.1 specification
├── redocly.yaml              # Redocly CLI configuration
├── paths/                    # API endpoint definitions
│   ├── transactions*.yaml    # Transaction endpoints
│   ├── quotes*.yaml          # Quote endpoints
│   └── vasps*.yaml           # VASP endpoints
├── components/
│   ├── schemas/              # Data models (33 schemas)
│   ├── parameters/           # Shared parameters
│   └── responses/            # Error responses (RFC 7807)
├── docs/                     # Documentation guides
│   ├── getting_started.md    # Quick start guide
│   ├── overview.md           # API overview with diagrams
│   ├── authentication.md     # HMAC-SHA512 authentication
│   ├── status_transitions.md # Transaction state machine
│   ├── error_codes.md        # Error handling guide
│   ├── travel_rule.md        # FATF compliance
│   ├── webhook.md            # Webhook notifications
│   └── bfi_quote.md          # BFI integration
└── .github/workflows/        # CI/CD pipelines
```

## Documentation

| Guide | Description |
|-------|-------------|
| [Getting Started](docs/getting_started.md) | Quick integration guide |
| [Overview](docs/overview.md) | API concepts and flow diagrams |
| [Authentication](docs/authentication.md) | HMAC-SHA512 signature guide |
| [Status Transitions](docs/status_transitions.md) | Transaction lifecycle |
| [Error Codes](docs/error_codes.md) | HTTP status codes and handling |
| [Travel Rule](docs/travel_rule.md) | FATF compliance requirements |
| [Webhooks](docs/webhook.md) | Event notifications |

## Deployment

Documentation is automatically deployed to GitHub Pages:

| Branch | URL |
|--------|-----|
| main | https://openweunion.github.io/api-doc/ |
| develop | https://openweunion.github.io/api-doc/develop/ |

## API Version

Current version: **0.1.0**

## License

Apache 2.0
