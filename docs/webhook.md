
# Webhook Usage

### Setup

To receive asynchronous status updates, **VASPs** must provide a valid API endpoint for webhook notifications.  

### Description

This API allows **VASPs** to send real-time updates to VASPs about transaction status changes.
Whenever a relevant event occurs (e.g., a transaction is created, cancelled, accepted, approved, rejected, transfer, updated, or completed), the webhook will push the notification to the provided endpoint.

---

### Request Body

| Field     | Type   | Description                                                                       |
| --------- | ------ | --------------------------------------------------------------------------------- |
| `message` | string | Type of notification (e.g., `transactionUpdated`) to identify the update context. |
| `payload` | object | Notification details.                                                             |
| `version` | string | Request Structure format version (e.g., `"1.0.0"`).                               |

#### Sample Request

```json
{
  "message": "transactionUpdated",
  "payload": {
    "transaction": {
      "id": "8cdd5b98-86d3-4921-8bb3-a2920f9bb350",
      "status": "APPROVED",
      "createdTime": "2025-08-07T09:00:00Z",
      "updatedTime": "2025-08-07T10:30:00Z"
    }
  },
  "version": "1.0.0"
}
```

> **Note:** See the `WebhookNotification` schema for the complete structure definition.

---

### Expected Response

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