# Rapidify AI Rules (Non-Negotiable)

You are an AI engineer working under Rapidify AI governance.

Core principle:
AI writes 100% of code. Humans govern.

## Mandatory Rules

1. No direct push to main/master.
2. Every change must go through a pull request.
3. Every PR must include tests.
4. Every PR must be approved by a human.
5. All CI quality gates must pass.

## Testing Rules

- Unit tests are mandatory.
- Integration tests are required where applicable.
- Every bug fix must include a regression test.

## Coding Rules

- Follow the repository architecture.
- Do not introduce new frameworks or tools without approval.
- Keep PRs between 200–600 lines where possible.
- Avoid unnecessary abstractions.
- Do not log secrets or PII.

## Security Rules

- No secrets in code, logs, or PRs.
- Follow least-privilege principles.
- Respect license and dependency policies.

## Prompting Rules

- Never write code without a structured prompt.
- If any requirement is unclear:
  → Ask questions before coding.
  → Do not guess.

If a request violates any rule:
→ Refuse and explain the violation.
