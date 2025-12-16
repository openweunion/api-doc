# Transaction Status Transitions

This document describes the complete lifecycle of an offramp transaction, including all possible status transitions, allowed operations, and edge cases.

## Status Overview

| Status | Description | Terminal |
|--------|-------------|----------|
| `NEW` | Transaction created, awaiting originator approval | No |
| `APPROVED` | Approved by Originator VASP, awaiting beneficiary decision | No |
| `ACCEPTED` | Accepted by Beneficiary VASP, ready for transfer | No |
| `REJECTED` | Rejected by Beneficiary VASP | Yes |
| `PENDING_TRANSFER` | On-chain transfer initiated | No |
| `TRANSFERRED` | On-chain transfer confirmed, hash submitted | No |
| `COMPLETED` | Fiat withdrawal completed | Yes |
| `CANCELLED` | Cancelled by Originator VASP | Yes |

---

## Status Flow Diagram

```
                    ┌─────────────┐
                    │    NEW      │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            │            ▼
        ┌──────────┐       │      ┌───────────┐
        │ APPROVED │       │      │ CANCELLED │ (Terminal)
        └────┬─────┘       │      └───────────┘
             │             │
    ┌────────┼────────┐    │
    │        │        │    │
    ▼        │        ▼    │
┌────────┐   │   ┌──────────┐
│ACCEPTED│   │   │ REJECTED │ (Terminal)
└───┬────┘   │   └──────────┘
    │        │
    │        │
    ▼        │
┌─────────────────┐
│ PENDING_TRANSFER│
└────────┬────────┘
         │
         ▼
   ┌───────────┐
   │TRANSFERRED│
   └─────┬─────┘
         │
         ▼
   ┌───────────┐
   │ COMPLETED │ (Terminal)
   └───────────┘
```

---

## Detailed Status Transitions

### NEW

**Description:** Initial state when a transaction is created.

| Action | API Endpoint | Actor | Result Status |
|--------|--------------|-------|---------------|
| Approve | `POST /transactions/approve` | Originator VASP | `APPROVED` |
| Cancel | `POST /transactions/cancel` | Originator VASP | `CANCELLED` |

**Business Rules:**
- Only the Originator VASP can perform actions on a `NEW` transaction
- Quote must still be valid (not expired)

---

### APPROVED

**Description:** Transaction approved by Originator VASP, awaiting Beneficiary VASP decision.

| Action | API Endpoint | Actor | Result Status |
|--------|--------------|-------|---------------|
| Accept | `POST /transactions/accept` | Beneficiary VASP | `ACCEPTED` |
| Reject | `POST /transactions/reject` | Beneficiary VASP | `REJECTED` |
| Cancel | `POST /transactions/cancel` | Originator VASP | `CANCELLED` |

**Business Rules:**
- Beneficiary VASP should review Travel Rule data before accepting
- Originator VASP can still cancel at this stage

**Webhook Notifications:**
- Beneficiary VASP receives notification when status changes to `APPROVED`

---

### ACCEPTED

**Description:** Transaction accepted by Beneficiary VASP, ready for on-chain transfer.

| Action | API Endpoint | Actor | Result Status |
|--------|--------------|-------|---------------|
| Transfer | `POST /transactions/transfer` | Originator VASP | `PENDING_TRANSFER` |
| Cancel | `POST /transactions/cancel` | Originator VASP | `CANCELLED` |

**Business Rules:**
- Originator VASP should initiate transfer promptly
- Beneficiary VASP deposit address is now committed

**Webhook Notifications:**
- Originator VASP receives notification when status changes to `ACCEPTED`

---

### REJECTED

**Description:** Transaction rejected by Beneficiary VASP. This is a terminal state.

| Action | API Endpoint | Actor | Result Status |
|--------|--------------|-------|---------------|
| (none) | - | - | - |

**Business Rules:**
- No further actions are allowed
- Originator VASP should inform the end user
- A new transaction must be created to retry

**Common Rejection Reasons:**
- Insufficient Travel Rule data
- Compliance concerns
- Beneficiary not found
- Unsupported withdrawal destination

**Webhook Notifications:**
- Originator VASP receives notification when status changes to `REJECTED`

---

### PENDING_TRANSFER

**Description:** On-chain transfer has been initiated.

| Action | API Endpoint | Actor | Result Status |
|--------|--------------|-------|---------------|
| Update Hash | `PUT /transactions` | Originator VASP | `TRANSFERRED` |

**Business Rules:**
- Originator VASP must execute the actual blockchain transfer
- Transaction hash must be submitted once confirmed
- No cancellation allowed after this point

**Important:**
- The on-chain transfer should be executed immediately after calling `/transactions/transfer`
- Monitor blockchain for confirmation before submitting hash

**Webhook Notifications:**
- Beneficiary VASP receives notification when status changes to `PENDING_TRANSFER`

---

### TRANSFERRED

**Description:** On-chain transfer confirmed, transaction hash submitted.

| Action | API Endpoint | Actor | Result Status |
|--------|--------------|-------|---------------|
| Complete | `POST /transactions/complete` | Beneficiary VASP | `COMPLETED` |

**Business Rules:**
- Beneficiary VASP should verify the on-chain transaction
- Beneficiary VASP executes fiat withdrawal to beneficiary's bank account
- Bank reference ID should be submitted with completion

**Verification Steps:**
1. Verify transaction hash on blockchain
2. Confirm amount received matches expected amount
3. Execute fiat withdrawal
4. Record bank reference ID
5. Call complete endpoint

**Webhook Notifications:**
- Beneficiary VASP receives notification when status changes to `TRANSFERRED`

---

### COMPLETED

**Description:** Fiat withdrawal completed successfully. This is a terminal state.

| Action | API Endpoint | Actor | Result Status |
|--------|--------------|-------|---------------|
| (none) | - | - | - |

**Business Rules:**
- No further actions are allowed
- Transaction is finalized
- All parties should retain records for compliance

**Webhook Notifications:**
- Originator VASP receives notification when status changes to `COMPLETED`

---

### CANCELLED

**Description:** Transaction cancelled by Originator VASP. This is a terminal state.

| Action | API Endpoint | Actor | Result Status |
|--------|--------------|-------|---------------|
| (none) | - | - | - |

**Cancellation Rules:**
- Can only be cancelled by Originator VASP
- Cannot cancel after `PENDING_TRANSFER` status
- Allowed from: `NEW`, `APPROVED`, `ACCEPTED`

**Webhook Notifications:**
- Beneficiary VASP receives notification when status changes to `CANCELLED`

---

## Edge Cases and Error Handling

### Quote Expiration

| Scenario | Result |
|----------|--------|
| Create transaction with expired quote | 400 Bad Request |
| Quote expires after transaction created | Transaction continues normally |

### Duplicate Operations

| Scenario | Result |
|----------|--------|
| Approve already approved transaction | 409 Conflict |
| Cancel already cancelled transaction | 409 Conflict |
| Accept already accepted transaction | 409 Conflict |

### Permission Errors

| Scenario | Result |
|----------|--------|
| Beneficiary VASP tries to approve | 403 Forbidden |
| Originator VASP tries to accept | 403 Forbidden |
| Third-party VASP tries any action | 403 Forbidden |

### Network Issues

| Scenario | Recommendation |
|----------|----------------|
| API timeout during status change | Query transaction status and retry if needed |
| Webhook delivery failure | WeUnion retries with exponential backoff |
| Blockchain confirmation delay | Wait for confirmation before submitting hash |

---

## Timeout and Expiration

| Stage | Recommended Timeout | Action if Exceeded |
|-------|--------------------|--------------------|
| `NEW` → `APPROVED` | 24 hours | Cancel transaction |
| `APPROVED` → `ACCEPTED/REJECTED` | 24 hours | Cancel transaction |
| `ACCEPTED` → `PENDING_TRANSFER` | 1 hour | Cancel transaction |
| `PENDING_TRANSFER` → `TRANSFERRED` | 1 hour | Contact support |
| `TRANSFERRED` → `COMPLETED` | 24 hours | Contact support |

> **Note:** These are recommended timeouts. Actual implementation may vary.

---

## Related Documentation

- [Overview](./overview.md) - Transaction flow diagrams
- [Getting Started](./getting_started.md) - Quick start guide
- [Error Codes](./error_codes.md) - Error handling
- [Webhook](./webhook.md) - Webhook notifications
