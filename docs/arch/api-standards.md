# API Standards & Contracts

## Philosophy
**"The Contract is Law."**
Backend and Frontend must agree on the schema *before* implementation.

## Protocols

### 1. Internal APIs (App <-> Server)
*   **Protocol**: tRPC
*   **Validation**: Zod
*   **Transport**: HTTP/JSON
*   **Rule**: No manual fetch calls. All internal data fetching must use the typed tRPC client.

### 2. External APIs (Server <-> Third Party)
*   **Protocol**: REST / GraphQL
*   **Validation**: Zod (Response Parsing)
*   **Rule**: All external responses must be parsed through a Zod schema. Never trust `any`.

## Error Handling
All APIs must return standardized error codes:
*   `400 BAD_REQUEST`: Validation failure (Zod error).
*   `401 UNAUTHORIZED`: Missing/Invalid token.
*   `403 FORBIDDEN`: Valid token, insufficient permissions.
*   `500 INTERNAL_SERVER_ERROR`: Unhandled exception (logged to OpenTelemetry).

## Versioning
*   **Internal**: Rolling version (Monorepo guarantees sync).
*   **Public**: Semantic Versioning (v1, v2) via URL prefix `/api/v1/...`.
