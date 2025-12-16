# Error Codes

All error responses follow the [RFC 7807](https://tools.ietf.org/html/rfc7807) Problem Details format with `Content-Type: application/problem+json`.

## Error Response Format

```json
{
  "type": "urn:example:errors:bad-request",
  "title": "Bad Request",
  "status": 400,
  "detail": "The request could not be understood or was missing required parameters."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | A URI reference that identifies the problem type |
| `title` | string | A short, human-readable summary of the problem |
| `status` | number | The HTTP status code |
| `detail` | string | A human-readable explanation specific to this occurrence |

---

## HTTP Status Codes

### 400 Bad Request

**Type:** `urn:example:errors:bad-request`

The request could not be understood or was missing required parameters.

**Common Causes:**
- Missing required fields in request body
- Invalid field format (e.g., invalid UUID, malformed JSON)
- Invalid parameter values (e.g., negative amount, expired quote)
- Invalid currency code or chain identifier

**Resolution:**
- Check the request body against the API schema
- Ensure all required fields are provided
- Validate field formats before sending

---

### 401 Unauthorized

**Type:** `urn:example:errors:unauthorized`

Authentication failed due to missing or invalid credentials.

**Common Causes:**
- Missing `X-Payload` or `X-Signature` header
- Invalid API key
- Invalid or expired signature
- Timestamp outside acceptable window (5 minutes)

**Resolution:**
- Verify your API key and secret are correct
- Ensure the signature is calculated correctly (see [Authentication](./authentication.md))
- Check that the timestamp is within 5 minutes of server time

---

### 403 Forbidden

**Type:** `urn:example:errors:forbidden`

You do not have permission to perform this action on the resource.

**Common Causes:**
- Attempting to approve/cancel a transaction you did not create (not the Originator VASP)
- Attempting to accept/reject/complete a transaction not assigned to you (not the Beneficiary VASP)
- Attempting to access another VASP's resources

**Resolution:**
- Verify you are the correct VASP for this operation
- Check the transaction's `originatorVASPId` and `beneficiaryVASPId` fields

---

### 404 Not Found

**Type:** `urn:example:errors:not-found`

The requested resource could not be found.

**Common Causes:**
- Invalid transaction ID
- Invalid quote ID
- Invalid VASP ID
- Resource has been deleted

**Resolution:**
- Verify the resource ID is correct
- Ensure the resource exists before performing operations

---

### 409 Conflict

**Type:** `urn:example:errors:conflict`

The request could not be completed due to a conflict with the current state of the resource.

**Common Causes:**
- Transaction status does not allow the requested operation
- Attempting to approve a transaction that is not in `NEW` status
- Attempting to accept a transaction that is not in `APPROVED` status
- Attempting to transfer when status is not `ACCEPTED`

**Resolution:**
- Check the current transaction status before performing operations
- Follow the correct status transition flow:

| Current Status | Allowed Operations |
|----------------|-------------------|
| `NEW` | approve, cancel |
| `APPROVED` | accept, reject, cancel |
| `ACCEPTED` | transfer, cancel |
| `PENDING_TRANSFER` | update tx-hash |
| `TRANSFERRED` | complete |

---

### 500 Internal Server Error

**Type:** `urn:example:errors:internal-server-error`

An unexpected error occurred on the server.

**Common Causes:**
- Server-side issue
- Temporary service unavailability
- Database connection issues

**Resolution:**
- Retry the request after a short delay
- If the problem persists, contact support
- Check the [Webhook Retry Policy](./webhook.md#retry-policy) for async operations

---

## Error Handling Best Practices

1. **Always check the `status` field** to determine the error category
2. **Log the full error response** including `type` and `detail` for debugging
3. **Implement retry logic** for 500 errors with exponential backoff
4. **Validate inputs client-side** to avoid 400 errors
5. **Check transaction status** before operations to avoid 409 errors
6. **Handle 401 errors** by refreshing credentials or re-authenticating
