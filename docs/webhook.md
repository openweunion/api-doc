# Webhook Usage

This document describes how to receive real-time notifications about transaction events via webhooks.

## Setup

To receive asynchronous status updates, **VASPs** must provide a valid API endpoint for webhook notifications during registration.

### Endpoint Requirements

| Requirement | Description |
|-------------|-------------|
| Protocol | HTTPS (TLS 1.2+) |
| Method | POST |
| Response Time | < 30 seconds |
| Availability | 99.9% uptime recommended |

---

## Event Types

WeUnion sends webhook notifications for the following events:

### Transaction Events

| Event | Message Type | Description | Recipient |
|-------|--------------|-------------|-----------|
| Transaction Created | `transactionCreated` | New transaction initiated | Beneficiary VASP |
| Transaction Approved | `transactionApproved` | Approved by Originator VASP | Beneficiary VASP |
| Transaction Accepted | `transactionAccepted` | Accepted by Beneficiary VASP | Originator VASP |
| Transaction Rejected | `transactionRejected` | Rejected by Beneficiary VASP | Originator VASP |
| Transaction Cancelled | `transactionCancelled` | Cancelled by Originator VASP | Beneficiary VASP |
| Transfer Initiated | `transactionTransfer` | On-chain transfer started | Beneficiary VASP |
| Transfer Completed | `transactionTransferred` | Transaction hash submitted | Beneficiary VASP |
| Transaction Completed | `transactionCompleted` | Fiat withdrawal completed | Originator VASP |

### Status Change Summary

| Status Transition | Notification Recipient |
|-------------------|----------------------|
| `NEW` -> `APPROVED` | Beneficiary VASP |
| `APPROVED` -> `ACCEPTED` | Originator VASP |
| `APPROVED` -> `REJECTED` | Originator VASP |
| `ACCEPTED` -> `PENDING_TRANSFER` | Beneficiary VASP |
| `PENDING_TRANSFER` -> `TRANSFERRED` | Beneficiary VASP |
| `TRANSFERRED` -> `COMPLETED` | Originator VASP |
| Any -> `CANCELLED` | Beneficiary VASP |

---

## Request Format

### Request Body

| Field     | Type   | Description                                                                       |
| --------- | ------ | --------------------------------------------------------------------------------- |
| `message` | string | Event type identifier (see Event Types above) |
| `payload` | object | Event-specific data |
| `version` | string | Webhook schema version (e.g., `"1.0.0"`) |

### Example: Transaction Status Update

```json
{
  "message": "transactionApproved",
  "payload": {
    "transaction": {
      "id": "8cdd5b98-86d3-4921-8bb3-a2920f9bb350",
      "status": "APPROVED",
      "originatorVASPId": "550e8400-e29b-41d4-a716-446655440000",
      "beneficiaryVASPId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "createdTime": "2025-08-07T09:00:00Z",
      "updatedTime": "2025-08-07T10:30:00Z"
    }
  },
  "version": "1.0.0"
}
```

### Example: Transaction Completed

```json
{
  "message": "transactionCompleted",
  "payload": {
    "transaction": {
      "id": "8cdd5b98-86d3-4921-8bb3-a2920f9bb350",
      "status": "COMPLETED",
      "transactionHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "referenceId": "BANK-REF-12345",
      "createdTime": "2025-08-07T09:00:00Z",
      "updatedTime": "2025-08-07T12:00:00Z"
    }
  },
  "version": "1.0.0"
}
```

> **Note:** See the `WebhookNotification` schema for the complete structure definition.

---

## Expected Response

Your webhook endpoint should return a **2xx status code** (e.g., `200 OK`) to acknowledge receipt of the notification.

#### Success Response

```json
{
  "status": "ok"
}
```

Any non-2xx response or timeout will trigger a retry.

---

### Retry Policy

If the webhook delivery fails, the system will retry with **exponential backoff**:

| Attempt | Delay |
|---------|-------|
| 1st retry | 1 minute |
| 2nd retry | 5 minutes |
| 3rd retry | 30 minutes |
| 4th retry | 2 hours |
| 5th retry | 12 hours |

After **5 failed attempts**, the notification will be marked as failed and no further retries will occur.

**Failure conditions:**
- HTTP status code is not 2xx
- Connection timeout (30 seconds)
- Network error

---

### Security

For webhook authentication and signature verification, see the [Webhook Authentication](./webhook_auth.md) documentation.