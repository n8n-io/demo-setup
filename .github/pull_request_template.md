# Pull Request

## Summary
What changed? (Brief description of the change)

## Why
Why was this change necessary? (Business/technical justification)

## Testing
- Unit tests: [describe what's tested]
- Integration tests: [describe what's tested, or N/A]
- Manual tests: [any manual verification done]

## Risks
What could break? (Dependencies, side effects, edge cases)

## Rollback Plan
How to revert if needed? (Specific steps)

## AI Attribution
- AI used: [tool name — Cursor, Claude, etc.]
- Prompt template used: [Template A/B/C/D/E]

---

## PR Quality Checklist

Before submitting, confirm:

### Logic
- [ ] Feature or fix works as expected
- [ ] Edge cases handled

### Tests
- [ ] Unit tests added (or N/A for config-only changes)
- [ ] Integration tests added (if applicable)
- [ ] Regression test added (for bug fixes)

### Quality
- [ ] Linting passes
- [ ] Formatting passes
- [ ] Type checks pass (if applicable)

### Security
- [ ] No secrets in code
- [ ] No insecure defaults
- [ ] Dependencies are approved

### Architecture
- [ ] Follows repo structure
- [ ] No new frameworks introduced without approval
- [ ] Naming conventions followed

### Size
- [ ] Change is small and focused
- [ ] Ideally under 600 lines

**If any item fails → Fix before submitting PR.**

---

*This template enforces `.cursor/rules/common-pr-and-testing.mdc`*