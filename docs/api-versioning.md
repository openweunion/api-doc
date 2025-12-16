# API Versioning

This document describes WeUnion API's versioning strategy, backward compatibility guarantees, and deprecation policy.

## Versioning Scheme

WeUnion API follows [Semantic Versioning](https://semver.org/) (SemVer):

```
MAJOR.MINOR.PATCH
```

| Component | When Incremented |
|-----------|------------------|
| **MAJOR** | Breaking changes that require client updates |
| **MINOR** | New features, backward-compatible additions |
| **PATCH** | Bug fixes, documentation updates |

**Current Version:** `0.1.0`

> **Note:** While in version `0.x.x`, the API is considered pre-release. Minor versions may contain breaking changes.

---

## Version in URL

The API version is included in the base URL path:

```
https://weunion.eight-art.com/v1/offramp
                              ^^
                              version
```

---

## Backward Compatibility

### What We Consider Backward Compatible

These changes do **NOT** require a major version bump:

- Adding new endpoints
- Adding new optional request parameters
- Adding new response fields
- Adding new enum values (where documented as extensible)
- Adding new webhook event types
- Relaxing validation constraints
- Improving error messages

### What We Consider Breaking Changes

These changes **REQUIRE** a major version bump:

- Removing or renaming endpoints
- Removing or renaming request/response fields
- Changing field types (e.g., string to number)
- Adding new required request parameters
- Changing authentication mechanisms
- Changing error response structure
- Removing enum values
- Tightening validation constraints

---

## Deprecation Policy

When deprecating API features, we follow this process:

### Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| **Announcement** | Day 0 | Deprecation notice in changelog and documentation |
| **Warning Period** | 90 days | Deprecated features still functional, warnings returned |
| **Sunset** | Day 90+ | Feature removed in next major version |

### Deprecation Indicators

1. **Documentation** - Marked with deprecation notice
2. **Response Headers** - `Deprecation` header with sunset date
3. **Changelog** - Listed under "Deprecated" section

### Example Deprecation Header

```http
HTTP/1.1 200 OK
Deprecation: Sun, 01 Jan 2026 00:00:00 GMT
Sunset: Sun, 01 Apr 2026 00:00:00 GMT
Link: <https://docs.weunion.com/migration>; rel="deprecation"
```

---

## Migration Guide

When upgrading between major versions:

1. **Review Changelog** - Check breaking changes section
2. **Update Client** - Modify API calls as needed
3. **Test in Sandbox** - Verify integration before production
4. **Monitor Deprecations** - Address warnings promptly

---

## Version Negotiation

Currently, version is specified only in the URL path. Future versions may support:

- `Accept-Version` header
- Query parameter `?version=`

---

## Support Policy

| Version | Status | Support |
|---------|--------|---------|
| v1 (current) | Active | Full support |
| v0 (pre-release) | Deprecated | Bug fixes only |

---

## Related Documentation

- [Getting Started](./getting_started.md) - Quick start guide
- [Error Codes](./error_codes.md) - Error handling
- [Webhooks](./webhook.md) - Event notifications
