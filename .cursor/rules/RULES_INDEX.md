# Cursor Rules Index

Rules are organized into categories. All rules use `alwaysApply: true` or file-specific `globs` and are enforced by Cursor IDE.

## Category 1: Common Rules (Reusable)

Technology-agnostic rules applicable to any repository (all with `alwaysApply: true`):

| Rule | Purpose |
|------|---------|
| `common-governance-core.mdc` | Core principle, 6-step workflow, 7-section prompt, branching |
| `common-quality-and-dod.mdc` | Quality gates, Definition of Done |
| `common-pr-and-testing.mdc` | PR format template, AI attribution, testing rules, quality checklist |
| `common-security.mdc` | Secrets, PII, license, AI guardrails, security coding standards |
| `common-anti-patterns.mdc` | Forbidden patterns, exceptions policy, final rule for AI agents |
| `common-debugging.mdc` | Debugging protocol, hotfix policy, rollback requirements, postmortems |
| `common-coding-standards.mdc` | Repo structure, naming conventions, commit format |

## Category 2: Repository-Specific Rules

Rules for self-hosted-ai-starter-kit only:

| Rule | Purpose |
|------|---------|
| `repo-self-hosted-ai-starter.mdc` | Stack (n8n, Ollama, Qdrant), tooling policy, observability, knowledge capture, operating rhythm |

## Category 3: File-Specific Rules

Rules that apply when working with specific file types:

| Rule | Globs | Purpose |
|------|-------|---------|
| `testing-rules.mdc` | `**/tests/**`, `**/test_*`, `**/*_test.*`, etc. | Test standards, naming, pytest |
| `python-rules.mdc` | `**/*.py` | Python style, type hints, imports, error handling |
| `docker-rules.mdc` | `**/Dockerfile`, `**/docker-compose*.yml` | Image pinning, health checks, security |

## Category 4: Workflow Templates

Detailed templates and workflows:

| Rule | Purpose |
|------|---------|
| `prompt-workflow.mdc` | Structured prompt templates (A-E), 6-step workflow details |

## Summary

- **Total rules:** 12 (was 18, removed 6 redundant)
- **Always applied:** 8 common rules + 1 repo rule
- **File-specific:** 3 rules with globs
- **Templates:** 1 workflow guide

## Source

Rules consolidated from `AI_CONTEXT.md` (Rapidify AI Engineering — Unified Context). Old redundant Rapidify rules removed to eliminate duplication.
