
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

```javascript
{
  "message": "transactionUpdated",
  "payload": {
    "transaction": {
      "id": "8cdd5b98-86d3-4921-8bb3-a2920f9bb350"
      "status": "APPROVED",
      "createdTime": "2025-08-07T09:00:00Z",
      "updatedTime": "2025-08-07T10:30:00Z"
    }
  },
  "version": "1.0.0"
}
```