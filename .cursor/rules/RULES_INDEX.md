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
| `testing-rules.mdc` | `**/tests/**`, `**/docker-compose*.yml`, `**/workflows/**` | Infrastructure testing, Docker Compose validation, n8n workflow tests |
| `python-rules.mdc` | `**/*.py`, `**/scripts/**/*.py` | Python style (conditional - only when Python files exist) |
| `docker-rules.mdc` | `**/Dockerfile`, `**/docker-compose*.yml` | Image pinning, health checks, security |
| `docker-compose-rules.mdc` | `**/docker-compose*.yml`, `**/.env.example` | n8n-specific Docker Compose standards |
| `n8n-workflow-rules.mdc` | `**/workflows/**/*.json`, `**/n8n/**` | n8n workflow JSON standards, credentials, validation |

## Category 4: Workflow Templates

Detailed templates and workflows:

| Rule | Purpose |
|------|---------|
| `prompt-workflow.mdc` | Structured prompt templates (A-E), 6-step workflow details |

## Summary

- **Total rules:** 14 (optimized for n8n automation repository)
- **Always applied:** 7 common rules + 1 repo rule  
- **File-specific:** 5 rules with globs (Docker, n8n workflows, Python conditional)
- **Templates:** 1 workflow guide

## Repository Type: n8n Automation Platform

These rules are tailored for Docker Compose + n8n workflow repositories, not traditional application development.

**Key Differences from Application Rules:**
- Infrastructure testing instead of unit tests
- Workflow validation instead of code quality
- Docker service governance instead of application deployment
- Configuration management instead of source code compilation

## Source

Rules derived from `AI_CONTEXT.md` and adapted for n8n automation/Docker Compose repositories. Removed application-specific requirements that don't apply to infrastructure-as-code repos.
