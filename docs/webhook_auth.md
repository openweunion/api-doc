
# Webhook Usage

### Webhook Setup

To receive asynchronous status updates, VASPs must provide a valid API endpoint for webhook notifications.

#### Webhook Request Structure

Each webhook request includes the following fields:

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

### Authentication

Webhook requests are signed using HMAC-SHA512 to ensure integrity and authenticity.

#### Verification Process

1. JSON-stringify and base64-encode the request body → `X-PAYLOAD`.
2. Sign the payload using HMAC-SHA512 with your `API_SECRET` → `X-SIGNATURE`.
3. The server should verify that:
   - `X-PAYLOAD` matches locally encoded payload.
   - HMAC signature matches `X-SIGNATURE`.

**Note:** Use compact JSON formatting for consistency. Support both lowercase and uppercase header keys (e.g., `x-signature` and `X-SIGNATURE`).

### Headers

| Header        | Type   | Description                      |
| ------------- | ------ | -------------------------------- |
| `X-PAYLOAD`   | string | Base64-encoded JSON request body |
| `X-SIGNATURE` | string | HMAC-SHA512 signature            |

---

### Sample Verification (Node.js)

```javascript
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
dotenv.config({ path: 'YOUR_.ENV_PATH' });

exports.authenticateWebhook = (req, res, next) => {
  try {
    const data = req.body;
    const receivedSignature = req.headers['x-signature'] || req.headers['X-SIGNATURE'];
    const receivedPayload = req.headers['x-payload'] || req.headers['X-PAYLOAD'];

    const encodedPayload = Buffer.from(JSON.stringify(data)).toString('base64');
    const generatedSignature = CryptoJS.HmacSHA512(encodedPayload, process.env.ONRAMP_API_SECRET).toString(CryptoJS.enc.Hex);

    if (encodedPayload === receivedPayload && generatedSignature === receivedSignature) {
      return next();
    } else {
      return res.status(401).send({ status: 0, error: 'Invalid signature' });
    }
  } catch (err) {
    return res.status(500).send({ status: 0, error: 'Internal error' });
  }
};
```
