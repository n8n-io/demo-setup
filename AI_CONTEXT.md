# Rapidify AI Engineering --- Unified Context (Repo Ready)

## Core Principle (Non‑Negotiable)

**AI writes 100% of code. Humans govern.**

Humans may: - Define requirements - Design systems - Review code - Test
and debug - Approve PRs - Instruct AI to modify code

Humans must NOT manually write production code.

------------------------------------------------------------------------

## Standard AI Workflow

### Step 1 --- Human Defines Task

Must include: - Objective - Constraints - Acceptance criteria - Edge
cases - Non‑functional requirements

### Step 2 --- AI Generates Plan

AI outputs: - Architecture plan - Files to change - Test plan - Risk
assessment

### Step 3 --- AI Writes Code

-   Small PR increments only (200--600 LOC target)

### Step 4 --- AI Writes Tests

-   Unit tests mandatory
-   Integration tests where applicable

### Step 5 --- Human Review

Reviewer checks: - Logic correctness - Safety - Maintainability -
Readability - CI status

### Step 6 --- Deploy & Monitor

-   Deploy to staging/prod
-   Monitor logs, metrics, traces

------------------------------------------------------------------------

## Mandatory Prompt Format (7 Sections)

Every AI request MUST include:

1.  Context\
2.  Objective\
3.  Constraints\
4.  Inputs / Outputs\
5.  Acceptance Criteria\
6.  Edge Cases\
7.  Test Requirements

### No‑Guessing Rule

If uncertain → AI must ask questions before coding.

### No‑Magic Rule

AI must NOT introduce: - Random frameworks - Unnecessary abstractions -
New tools without approval

------------------------------------------------------------------------

## Repository Standards

### Required Files

-   README.md\
-   CONTRIBUTING.md\
-   ARCHITECTURE.md\
-   SECURITY.md\
-   RUNBOOK.md\
-   .env.example\
-   Makefile or taskfile.yml\
-   docker-compose.yml (if applicable)

### Recommended Structure

    /src
    /tests
    /docs
    /scripts
    /infra (optional)

------------------------------------------------------------------------

## Naming Conventions

### Files

-   Python → snake_case
-   Config → kebab-case
-   Consistent across repo

### Functions

-   Descriptive names required
-   No single-letter names (except loops)

### Services

Pattern:

    <domain>-<service>

------------------------------------------------------------------------

## Commit Message Standard

    <type>: <short description>

Allowed types: - feat - fix - refactor - test - chore - docs - security

------------------------------------------------------------------------

## Pull Request Requirements

Every PR must include:

-   Summary\
-   What changed\
-   Why\
-   Testing performed\
-   Risks\
-   Rollback plan

### AI Attribution (Mandatory)

PR must state:

-   AI used\
-   Prompt template used

------------------------------------------------------------------------

## Definition of Done

A task is DONE only when:

-   Code merged via PR
-   CI passed
-   Tests exist
-   Docs updated if needed
-   Monitoring updated if needed
-   Rollback possible
-   Security checks passed
-   Feature works
-   Logs are meaningful

------------------------------------------------------------------------

## Quality Gates (Hard Requirement)

All must pass before merge:

-   Linting
-   Formatting
-   Unit tests
-   Integration tests (if applicable)
-   Type checking (if applicable)
-   Security scan (SAST + dependency)
-   Human approval
-   CI success

------------------------------------------------------------------------

## Branch Protection

-   ❌ No direct push to main/master\
-   ✅ All changes via PR\
-   ✅ Human approval required

------------------------------------------------------------------------

## Testing Rules

-   Unit tests mandatory
-   Integration tests where applicable
-   Every bug fix must include regression test
-   No "works on my machine" merges

------------------------------------------------------------------------

## AI Debugging Protocol

When something breaks:

1.  Reproduce issue\
2.  Collect logs + traces\
3.  Identify root cause\
4.  Ask AI for minimal patch\
5.  Add regression test\
6.  Deploy\
7.  Monitor

Humans debug but do NOT manually patch code.

------------------------------------------------------------------------

## Hotfix Policy

Allowed only when:

-   Production is broken
-   Business impact is high
-   Rollback insufficient

Requirements:

-   PR still required
-   Minimum tests required
-   Postmortem within 24--72 hours

------------------------------------------------------------------------

## Rollback Requirements

Every deployment must include:

-   Rollback mechanism
-   Rollback instructions
-   Rollback verification steps

------------------------------------------------------------------------

## Security Requirements

### License Compliance

-   Approved licenses only
-   No GPL contamination
-   License scanning required

### Secrets Policy

Forbidden:

-   Secrets in code
-   Secrets in logs
-   Secrets in PRs/tickets

Required:

-   Secrets vault
-   Secret scanning in git
-   Key rotation schedule

### Privacy / PII

Systems handling user data must:

-   Mask PII in logs
-   Enforce RBAC
-   Follow retention rules
-   Support deletion requests

------------------------------------------------------------------------

## AI Application Guardrails

All AI apps must include:

-   Prompt injection defense
-   Content filtering (when relevant)
-   Model fallback strategy
-   Cost guardrails

------------------------------------------------------------------------

## Knowledge Capture

### ADRs Required When

-   Architecture changes
-   New infra patterns
-   Major tool changes

### Runbooks Required For

-   Production services
-   Monitoring alerts
-   Business‑critical n8n workflows

### Postmortems Required For

-   SEV incidents
-   Security incidents
-   Data loss
-   Major downtime

Must include: - Root cause - Fix - Prevention - Action items - Owner +
deadline

------------------------------------------------------------------------

## Observability (Mandatory)

Every service must emit:

-   Logs → Loki
-   Metrics → Prometheus/Mimir
-   Traces → Tempo
-   Dashboards → Grafana

**If it cannot be monitored, it cannot be production.**

------------------------------------------------------------------------

## Ownership

Every system must have:

-   Owner
-   Backup owner

No orphan services allowed.

------------------------------------------------------------------------

## Tooling Policy

### Allowed by Default

-   Docker
-   Ansible
-   LGTM stack
-   n8n

### Restricted (Needs Approval)

-   New databases
-   New orchestration systems
-   New frameworks
-   New authentication systems

------------------------------------------------------------------------

## Forbidden Anti‑Patterns

AI must NOT:

-   Write code without tests
-   Introduce dependencies casually
-   Create huge PRs
-   Hide complexity behind abstractions
-   Use insecure defaults
-   Log secrets or PII
-   Bypass governance checks
-   Create tooling sprawl

------------------------------------------------------------------------

## Exceptions Policy

Allowed only when:

-   Risk documented
-   Reason clear
-   Explicit approval
-   Time‑bound
-   Follow‑up action created

------------------------------------------------------------------------

## Operating Rhythm

### Weekly

-   Review governance violations
-   Review incidents
-   Review tech debt
-   Review security posture

### Monthly

-   Rotate secrets (as needed)
-   Review model costs

------------------------------------------------------------------------

## Final Rule for AI Agents

Always:

-   Follow 7‑section prompt
-   Never guess
-   Keep PRs small
-   Always write tests
-   Pass all quality gates
-   Maintain observability
-   Preserve rollback safety
-   Protect secrets and PII
-   Require human approval
-   Maintain full traceability
