# 🎯 Governance Dashboard

Track repository compliance with AI_CONTEXT.md rules.

---

## 📊 Current Status

### Repository Standards
- [ ] `README.md` ✅
- [ ] `CONTRIBUTING.md` ✅  
- [ ] `ARCHITECTURE.md` ❌ **Missing**
- [ ] `SECURITY.md` ❌ **Missing**
- [ ] `RUNBOOK.md` ❌ **Missing**
- [ ] `.env.example` ✅
- [ ] `Makefile` or `taskfile.yml` ❌ **Missing**
- [ ] `docker-compose.yml` ✅

### Docker Compliance
- [ ] All images pinned (no `:latest`) ❌ **4 violations**
- [ ] Health checks for services ✅
- [ ] Networks defined ✅
- [ ] Secrets via env vars ✅

### Security Compliance  
- [ ] No secrets in code ✅
- [ ] `.env.example` documented ⚠️ **Needs comments**
- [ ] License compliance ✅
- [ ] Dependency scanning ⚠️ **Set up with CI**

### Testing & Quality
- [ ] Test directory exists ❌ **Missing**
- [ ] CI/CD pipeline ⚠️ **In progress**
- [ ] Pre-commit hooks ⚠️ **Set up available**
- [ ] PR template ✅

---

## 🔄 Weekly Checklist

Per `repo-self-hosted-ai-starter.mdc` operating rhythm:

### Weekly Reviews
- [ ] Review governance violations (this dashboard)
- [ ] Review incidents (check issues/discussions)  
- [ ] Review tech debt (check backlog)
- [ ] Review security posture (check CI scans)

### Monthly Reviews
- [ ] Rotate secrets (update .env.example guidance)
- [ ] Review model costs (Ollama resource usage)
- [ ] Update dependency versions
- [ ] Review rule effectiveness

---

## 🚀 Quick Fixes

### High Priority (Must Fix)
1. **Create missing docs** → Templates available below
2. **Pin Docker versions** → See docker-compose.yml lines 11, 28, 38, 106
3. **Add test infrastructure** → Basic Docker Compose tests
4. **Add Makefile** → Common commands (up, down, pull)

### Medium Priority  
1. **Document .env.example** → Add variable comments
2. **Enable pre-commit hooks** → Run `pre-commit install`
3. **Enable CI workflows** → Commit .github/workflows/

---

## 📋 File Templates

### Create ARCHITECTURE.md
```bash
# Run this to create ARCHITECTURE.md template
cat > ARCHITECTURE.md << 'EOF'
# Architecture

## Overview
Self-hosted AI starter kit using Docker Compose.

## Components
- **n8n**: Workflow automation (port 5678)
- **Ollama**: Local LLM inference (port 11434)  
- **Qdrant**: Vector database (port 6333)
- **PostgreSQL**: Persistence (internal)

## Data Flow
User → n8n → Ollama (LLM) → Qdrant (vectors) → PostgreSQL (storage)

## Networking
All services communicate via `demo` Docker network.

## Volumes
- `n8n_storage`: n8n data persistence
- `postgres_storage`: Database data
- `ollama_storage`: Model storage
- `qdrant_storage`: Vector data
EOF
```

### Create SECURITY.md
```bash
# Run this to create SECURITY.md template
cat > SECURITY.md << 'EOF'
# Security Policy

## Secrets Management
- Use `.env` file for secrets (never commit)
- Reference `.env.example` for required variables
- Rotate keys regularly

## Reporting Vulnerabilities
Report security issues to [maintainer contact].

## Container Security
- Images scanned by CI pipeline
- No secrets in container layers
- Services run with minimal privileges
EOF
```

### Create RUNBOOK.md  
```bash
# Run this to create RUNBOOK.md template
cat > RUNBOOK.md << 'EOF'
# Runbook

## Starting Services
```bash
# CPU only
docker compose --profile cpu up -d

# With NVIDIA GPU
docker compose --profile gpu-nvidia up -d
```

## Stopping Services
```bash
docker compose down
```

## Troubleshooting
- Check logs: `docker compose logs [service]`
- Verify health: `docker compose ps`
- Reset: `docker compose down -v && docker compose up`

## Backup
- n8n data: Backup `n8n_storage` volume
- Workflows: Export from n8n UI
EOF
```

### Create Makefile
```bash
# Run this to create Makefile
cat > Makefile << 'EOF'
.PHONY: help up down pull logs status clean

help:  ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

up:  ## Start services (CPU profile)
	docker compose --profile cpu up -d

up-gpu:  ## Start services (GPU profile)  
	docker compose --profile gpu-nvidia up -d

down:  ## Stop services
	docker compose down

pull:  ## Pull latest images
	docker compose pull

logs:  ## Show logs
	docker compose logs -f

status:  ## Show service status
	docker compose ps

clean:  ## Remove volumes (DESTRUCTIVE)
	docker compose down -v
	docker volume prune -f
EOF
```

---

## 🎯 Compliance Score: 60%

**Next actions**: Complete missing files (40% improvement possible)

Last updated: $(date)