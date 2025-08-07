# Authenticate Request

To authenticate every request, include the following headers:

- `apikey`: Your assigned API key.
- `payload`: Base64-encoded string of the request body and timestamp.
- `signature`: HMAC-SHA512 of the payload using your secret.

> ⚠️ These headers must be present in **every request**.

#### Sample Headers

```javascript
const headers = {
  apikey: apiKey,
  payload: payload,
  signature: signature,
};
```

#### Generate payload and signature

You can use the following function to generate the required `payload` and `signature` headers:

```javascript
const CryptoJS = require('crypto-js');

async function generatePayloadAndSignature(secret, body) {
  const timestamp = Date.now().toString();
  const obj = {
    body,
    timestamp
  };
  const payload = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(obj)));
  const signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(payload, secret));
  return { payload, signature };
}
```