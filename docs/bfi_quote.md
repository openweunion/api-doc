# BFI Quote Usage

### Setup

To enable real-time off-ramp quotes, each **BFI VASP** must provide a valid API endpoint.  

### Description

This API returns a real-time off-ramp quote from a BFI.
WeUnion will query multiple **BFIs**, aggregate their quotes, and return the result to the **OFI**.

---

### Request Body

| Field          | Type   | Description                                                    |
| -------------- | ------ | -------------------------------------------------------------- |
| `fromAmount`   | string | The amount being sold in the fromCurrency.                     |
| `fromCurrency` | string | The source currency to convert from (e.g., `USDC`).            |
| `toCurrency`   | string | The target currency to convert to (e.g., `HKD`).               |
| `chain`        | string | Blockchain identifier (e.g., `eip155:1` for Ethereum Mainnet). |

#### Sample Request
```javascript
{
  "fromAmount": "100",
  "fromCurrency": "USDC",
  "toCurrency": "HKD",
  "chain": "eip155:1"
}
```

---

### Response

#### Status Codes

| Code | Type        | Description                                   |
| ---- | ----------- | --------------------------------------------- |
| 0    | success     | Quote retrieved successfully.                 |
| -1   | unsupported | Unsupported request (chain or currency pair). |

#### Success Response

| Field                 | Type   | Description                                   |
| --------------------- | ------ | --------------------------------------------- |
| `message`             | string | Status message (`success`).                   |
| `code`                | number | Status code (`0` for success).                |
| `data.paymentCompany` | string | Settlement/payment company name.              |
| `data.fromAmount`     | string | From amount being sold.                       |
| `data.fromCurrency`   | string | Source currency (e.g., `USDC`).               |
| `data.toCurrency`     | string | Target currency (e.g., `HKD`).                |
| `data.chain`          | string | Blockchain identifier.                        |
| `data.rate`           | string | Conversion rate applied.                      |
| `data.expiredTime`    | string | Quote expiration timestamp (ISO 8601 format). |
| `data.fee`            | object | Fee breakdown.                                |
| `data.fee.type`       | string | Fee type (e.g., `fiat`).                      |
| `data.fee.currency`   | string | Fee currency (e.g., `HKD`).                   |
| `data.fee.amount`     | string | Total fee amount.                             |

#### Sample Response
```javascript
{
  "message": "success",
  "code": 0,
  "data": {
    "paymentCompany": "BFI Company",
    "fromAmount": "100",
    "fromCurrency": "USDC",
    "toCurrency": "HKD",
    "chain": "eip155:1",
    "rate": "7.80",
    "expiredTime": "2025-08-08T15:04:05Z",
    "fee": {
      "type": "fiat",
      "currency": "HKD",
      "amount": "15.00"
    }
  }
}
```

---

#### Error Response

| Field     | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| `message` | string | Error message (e.g., `"unsupported"`). |
| `code`    | number | Error code (`-1` for unsupported).     |

#### Error Cases
- Unsupported **chain**  
- Unsupported **currency pair** (e.g., `USDC` → `HKD`)  

#### Sample Response
```javascript
{
  "message": "unsupported",
  "code": -1
}
```
