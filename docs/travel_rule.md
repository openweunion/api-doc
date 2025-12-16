# Travel Rule Compliance

The Travel Rule requires Virtual Asset Service Providers (VASPs) to collect and share customer information for transactions above certain thresholds. This guide explains how to implement Travel Rule compliance with the WeUnion API.

## Overview

The Financial Action Task Force (FATF) Travel Rule requires VASPs to exchange:
- Originator information (sender)
- Beneficiary information (recipient)
- Transaction details

This data must be transmitted securely between VASPs before or during the transfer of virtual assets.

---

## When is Travel Rule Data Required?

Travel Rule data is required for transactions that:
- Exceed jurisdiction-specific thresholds (commonly USD 1,000 or USD 3,000)
- Involve cross-border transfers
- Are flagged for enhanced due diligence

> **Note:** Even for transactions below thresholds, providing Travel Rule data is recommended for compliance best practices.

---

## Data Structure

### TravelRuleData Object

```json
{
  "originatorVASPId": "550e8400-e29b-41d4-a716-446655440000",
  "beneficiaryVASPId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "originator": { ... },
  "beneficiary": { ... }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `originatorVASPId` | string | Yes | VASP ID of the originating institution |
| `beneficiaryVASPId` | string | Yes | VASP ID of the beneficiary institution |
| `originator` | object | Yes | Originator (sender) information |
| `beneficiary` | object | Yes | Beneficiary (recipient) information |

---

## Originator Information

The originator is the party initiating the transfer of digital assets.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `originatorPerson` | array | Personal information (at least 1 person) |
| `accountNumber` | array | Blockchain wallet address(es) |

### Example

```json
{
  "originatorPerson": [
    {
      "naturalPerson": {
        "name": [
          {
            "nameIdentifier": [
              {
                "primaryIdentifier": "Santos",
                "secondaryIdentifier": "Maria"
              }
            ]
          }
        ],
        "geographicAddress": [
          {
            "addressLine": ["123 Main Street"],
            "country": "AE"
          }
        ],
        "nationalIdentification": {
          "nationalIdentifier": "784-1234-5678901-1",
          "nationalIdentifierType": "NATIONAL_ID"
        },
        "dateAndPlaceOfBirth": {
          "dateOfBirth": "1985-06-15",
          "placeOfBirth": "Dubai"
        }
      }
    }
  ],
  "accountNumber": [
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  ]
}
```

---

## Beneficiary Information

The beneficiary is the party receiving the fiat currency after the offramp conversion.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `beneficiaryPerson` | array | Personal information (at least 1 person) |
| `accountNumber` | array | Wallet or account identifier(s) |

### Example

```json
{
  "beneficiaryPerson": [
    {
      "naturalPerson": {
        "name": [
          {
            "nameIdentifier": [
              {
                "primaryIdentifier": "Chan",
                "secondaryIdentifier": "Peter"
              }
            ]
          }
        ],
        "geographicAddress": [
          {
            "addressLine": ["456 Harbor Road"],
            "country": "HK"
          }
        ]
      }
    }
  ],
  "accountNumber": [
    "0x8765432109abcdef8765432109abcdef87654321"
  ]
}
```

---

## Person Object Structure

### Natural Person

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | array | Yes | Full name(s) of the person |
| `geographicAddress` | array | No | Physical address(es) |
| `nationalIdentification` | object | No | Government-issued ID |
| `dateAndPlaceOfBirth` | object | No | Birth information |

### Name Identifier

| Field | Type | Description |
|-------|------|-------------|
| `primaryIdentifier` | string | Family name / surname |
| `secondaryIdentifier` | string | Given name / first name |
| `nameIdentifierType` | string | Type: `LEGAL`, `SHORT`, `TRADING` |

### Geographic Address

| Field | Type | Description |
|-------|------|-------------|
| `addressLine` | array | Street address lines |
| `country` | string | ISO 3166-1 alpha-2 country code |
| `townName` | string | City or town |
| `postCode` | string | Postal code |

### National Identification

| Field | Type | Description |
|-------|------|-------------|
| `nationalIdentifier` | string | ID number |
| `nationalIdentifierType` | string | Type: `PASSPORT`, `NATIONAL_ID`, `DRIVERS_LICENSE`, `TAX_ID` |
| `countryOfIssue` | string | ISO 3166-1 alpha-2 country code |

### Date and Place of Birth

| Field | Type | Description |
|-------|------|-------------|
| `dateOfBirth` | string | ISO 8601 date (YYYY-MM-DD) |
| `placeOfBirth` | string | City or country of birth |

---

## Wallet Address Validation

Blockchain wallet addresses must match the pattern:

```
^0x[a-fA-F0-9]{40}$
```

**Examples:**
- Valid: `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`
- Invalid: `742d35Cc6634C0532925a3b844Bc454e4438f44e` (missing 0x prefix)
- Invalid: `0x742d35Cc6634C0532925a3b844Bc454e4438f44` (too short)

---

## Complete Example

```json
{
  "travelRuleData": {
    "originatorVASPId": "550e8400-e29b-41d4-a716-446655440000",
    "beneficiaryVASPId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "originator": {
      "originatorPerson": [
        {
          "naturalPerson": {
            "name": [
              {
                "nameIdentifier": [
                  {
                    "primaryIdentifier": "Santos",
                    "secondaryIdentifier": "Maria",
                    "nameIdentifierType": "LEGAL"
                  }
                ]
              }
            ],
            "geographicAddress": [
              {
                "addressLine": ["123 Main Street", "Apt 4B"],
                "townName": "Dubai",
                "country": "AE",
                "postCode": "12345"
              }
            ],
            "nationalIdentification": {
              "nationalIdentifier": "784-1234-5678901-1",
              "nationalIdentifierType": "NATIONAL_ID",
              "countryOfIssue": "AE"
            },
            "dateAndPlaceOfBirth": {
              "dateOfBirth": "1985-06-15",
              "placeOfBirth": "Dubai"
            }
          }
        }
      ],
      "accountNumber": [
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
      ]
    },
    "beneficiary": {
      "beneficiaryPerson": [
        {
          "naturalPerson": {
            "name": [
              {
                "nameIdentifier": [
                  {
                    "primaryIdentifier": "Chan",
                    "secondaryIdentifier": "Peter",
                    "nameIdentifierType": "LEGAL"
                  }
                ]
              }
            ],
            "geographicAddress": [
              {
                "addressLine": ["456 Harbor Road"],
                "townName": "Hong Kong",
                "country": "HK"
              }
            ]
          }
        }
      ],
      "accountNumber": [
        "0x8765432109abcdef8765432109abcdef87654321"
      ]
    }
  }
}
```

---

## Best Practices

1. **Collect Complete Data** - Gather all required fields upfront to avoid delays
2. **Validate Addresses** - Verify wallet addresses match the expected pattern
3. **Use Legal Names** - Use government-issued ID names, not nicknames
4. **Keep Records** - Retain Travel Rule data for regulatory compliance (typically 5+ years)
5. **Encrypt in Transit** - All API communications use HTTPS encryption
6. **Handle Sensitive Data** - Follow data protection regulations (GDPR, etc.)

---

## Related Documentation

- [Getting Started](./getting_started.md) - Quick start guide
- [Authentication](./authentication.md) - API authentication
- [Error Codes](./error_codes.md) - Error handling
