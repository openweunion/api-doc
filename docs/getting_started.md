# Getting Started

This guide will help you integrate with the WeUnion Offramp API to convert digital assets to fiat currency.

## Prerequisites

Before you begin, ensure you have:

1. **VASP Registration** - Contact WeUnion to register as a VASP and obtain your credentials
2. **API Credentials** - You will receive:
   - `apiKey` - Your unique API key
   - `secret` - Your secret key for signing requests
   - `vaspId` - Your VASP identifier

---

## Base URL

```
https://weunion.eight-art.com/v1/offramp
```

---

## Authentication

All API requests require HMAC-SHA512 signature authentication.

### Required Headers

| Header | Description |
|--------|-------------|
| `X-Payload` | Base64 encoded JSON payload containing `timestamp` and `body` |
| `X-Signature` | HMAC-SHA512 signature of the payload using your secret |

### Example Payload

```json
{
  "timestamp": 1699900800000,
  "body": {
    "fromCurrency": "USDC",
    "toCurrency": "HKD",
    "fromAmount": "100",
    "chain": "eip155:1"
  }
}
```

For detailed authentication instructions, see [Authentication](./authentication.md).

---

## Quick Start: Complete Offramp Flow

### Step 1: Get Available Quotes

Request quotes from available BFI VASPs.

```bash
POST /quotes/list
```

**Request Body:**
```json
{
  "fromCurrency": "USDC",
  "toCurrency": "HKD",
  "fromAmount": "100",
  "chain": "eip155:1"
}
```

**Response:**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "quote-uuid-1234",
      "fromAmount": "100",
      "fromCurrency": "USDC",
      "toCurrency": "HKD",
      "rate": "7.80",
      "expiredTime": "2025-08-08T15:04:05Z",
      "fee": {
        "type": "fiat",
        "currency": "HKD",
        "amount": "15.00"
      }
    }
  ]
}
```

---

### Step 2: Create Transaction

Create a new offramp transaction using a selected quote.

```bash
POST /transactions
```

**Request Body:**
```json
{
  "originatorVASPId": "your-vasp-id",
  "beneficiaryVASPId": "bfi-vasp-id",
  "originatorCustomerId": "customer-123",
  "quoteId": "quote-uuid-1234",
  "withdrawalInfo": {
    "bankName": "HSBC",
    "bankCode": "004",
    "accountNumber": "123456789012",
    "accountName": "John Doe"
  },
  "travelRuleData": {
    "originator": {
      "name": "Maria Santos",
      "accountNumber": "0x1234...5678"
    },
    "beneficiary": {
      "name": "Peter Chan",
      "accountNumber": "123456789012"
    }
  }
}
```

**Response:**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "tx-uuid-5678",
    "status": "NEW",
    "originatorVASPId": "your-vasp-id",
    "beneficiaryVASPId": "bfi-vasp-id",
    "createdTime": "2025-08-07T09:00:00Z"
  }
}
```

---

### Step 3: Approve Transaction (Originator VASP)

Approve the transaction to proceed.

```bash
POST /transactions/approve
```

**Request Body:**
```json
{
  "id": "tx-uuid-5678"
}
```

**Response:** Transaction status changes to `APPROVED`

---

### Step 4: Accept Transaction (Beneficiary VASP)

The Beneficiary VASP accepts the transaction.

```bash
POST /transactions/accept
```

**Request Body:**
```json
{
  "id": "tx-uuid-5678"
}
```

**Response:** Transaction status changes to `ACCEPTED`

---

### Step 5: Initiate Transfer (Originator VASP)

Signal intent to transfer USDC.

```bash
POST /transactions/transfer
```

**Request Body:**
```json
{
  "id": "tx-uuid-5678"
}
```

**Response:** Transaction status changes to `PENDING_TRANSFER`

---

### Step 6: Execute On-Chain Transfer

Transfer USDC to the Beneficiary VASP's deposit address (off-API).

---

### Step 7: Submit Transaction Hash (Originator VASP)

Submit the blockchain transaction hash.

```bash
PUT /transactions
```

**Request Body:**
```json
{
  "id": "tx-uuid-5678",
  "transactionHash": "0x1234567890abcdef..."
}
```

**Response:** Transaction status changes to `TRANSFERRED`

---

### Step 8: Complete Transaction (Beneficiary VASP)

After verifying the on-chain transfer and completing fiat withdrawal:

```bash
POST /transactions/complete
```

**Request Body:**
```json
{
  "id": "tx-uuid-5678",
  "referenceId": "bank-ref-12345"
}
```

**Response:** Transaction status changes to `COMPLETED`

---

## Transaction Status Flow

```
NEW → APPROVED → ACCEPTED → PENDING_TRANSFER → TRANSFERRED → COMPLETED
 ↓       ↓          ↓
CANCELLED  REJECTED
```

For detailed status transitions, see [Overview](./overview.md).

---

## Webhooks

Configure your webhook URL during VASP registration to receive real-time notifications:

- Transaction created
- Transaction status changes
- Transfer confirmations

See [Webhook Documentation](./webhook.md) for details.

---

## Error Handling

All errors follow RFC 7807 format. See [Error Codes](./error_codes.md) for:

- HTTP status codes (400, 401, 403, 404, 409, 500)
- Common causes and resolutions
- Best practices for error handling

---

## Next Steps

1. **Test in Sandbox** - Use the sandbox environment for integration testing
2. **Implement Webhooks** - Set up webhook handlers for async notifications
3. **Handle Edge Cases** - Implement proper error handling and retry logic
4. **Go Live** - Contact WeUnion to move to production
