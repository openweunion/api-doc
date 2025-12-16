# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- API versioning documentation (`docs/api-versioning.md`)
- Comprehensive webhook event catalog
- Enhanced linting configuration with recommended rules
- Auto-generated code samples (curl, JavaScript, Python)
- Multi-branch deployment support (main, develop, feature/*)
- Mermaid diagram rendering in documentation

### Changed
- Improved README with project structure and quick start guide
- Enhanced webhook documentation with event types and examples
- Upgraded documentation structure with learning path organization

### Fixed
- React hydration errors by downgrading Redocly CLI to 1.20.0

---

## [0.1.0] - 2025-12-16

### Added

#### Documentation
- Getting Started guide (`docs/getting_started.md`)
- API Overview with sequence diagrams (`docs/overview.md`)
- Authentication guide with HMAC-SHA512 examples (`docs/authentication.md`)
- Transaction status transitions (`docs/status_transitions.md`)
- Error codes and handling guide (`docs/error_codes.md`)
- Travel Rule compliance documentation (`docs/travel_rule.md`)
- Webhook usage and authentication (`docs/webhook.md`, `docs/webhook_auth.md`)
- BFI Quote integration guide (`docs/bfi_quote.md`)

#### API Endpoints
- **VASP Endpoints**
  - `GET /vasps/{id}` - Get VASP details
  - `POST /vasps/list` - List all VASPs
  - `POST /vasps/webhook` - Receive webhook notifications
  - `POST /vasps/quote` - Request BFI quote

- **Quote Endpoints**
  - `GET /quotes/{id}` - Get quote details
  - `POST /quotes/list` - List and request quotes

- **Transaction Endpoints**
  - `POST /transactions` - Create transaction
  - `GET /transactions/{id}` - Get transaction details
  - `POST /transactions/list` - List transactions
  - `POST /transactions/approve` - Approve transaction
  - `POST /transactions/accept` - Accept transaction
  - `POST /transactions/reject` - Reject transaction
  - `POST /transactions/cancel` - Cancel transaction
  - `POST /transactions/transfer` - Initiate transfer
  - `POST /transactions/complete` - Complete transaction

#### Schemas
- Transaction, Quote, VASP data models
- Travel Rule data structures (Originator, Beneficiary, Person)
- Withdrawal information schema
- Webhook notification schema
- RFC 7807 Problem response format

#### Infrastructure
- OpenAPI 3.1.0 specification
- Redocly-based documentation generation
- GitHub Actions CI/CD pipeline
- GitHub Pages deployment

### Security
- HMAC-SHA512 request signature authentication
- Webhook signature verification
- 5-minute timestamp validation window

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 0.1.0 | 2025-12-16 | Initial release |

[Unreleased]: https://github.com/openweunion/api-doc/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/openweunion/api-doc/releases/tag/v0.1.0
