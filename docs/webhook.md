
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

```javascript
{
  "message": "transactionUpdated",
  "payload": {
    "transaction": {
      "fromAmount": "100.00",
      "toAmount": "100.00",
      "fromCurrency": "USDC",
      "toCurrency": "USD",
      "chain": "erc20",
      "travelRuleData": {
        "originatorVASPId": "89e7b5d7-80f0-496f-a2f4-b82421cf7fc6",
        "beneficiaryVASPId": "0830a077-ef4f-42d2-8416-1122f9b98fd8",
        "originator": {
          "originatorPerson": {
            "naturalPerson": {
              "name": [
                {
                  "nameIdentifier": [{}]
                }
              ]
            }
          },
          "accountNumber": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
        },
        "beneficiary": {
          "beneficiaryPerson": {
            "naturalPerson": {
              "name": [
                {
                  "nameIdentifier": [{}]
                }
              ]
            }
          },
          "accountNumber": "0xd9bf52aEf73A9e97E94b64eF6993A1D8db63a559"
        }
      },
      "withdrawalInfo": {
        "accNo": "1234567890",
        "address": null,
        "asset": "USDC",
        "bankCode": "BANK123",
        "ccy": "USD",
        "network": "erc20",
        "qty": 100,
        "remitChannel": "FPS",
        "swiftCode": "SWIFT123"
      },
      "status": "SENT",
      "transactionHash": null,
      "createdTime": "2025-08-07T09:00:00Z",
      "updatedTime": "2025-08-07T10:30:00Z",
      "transactionId": "8cdd5b98-86d3-4921-8bb3-a2920f9bb350"
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
