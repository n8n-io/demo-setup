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

### Docker Compliance (n8n Stack)
- [ ] All images pinned (no `:latest`) ❌ **4 violations**
- [ ] Health checks for services ✅
- [ ] Networks defined ✅
- [ ] Secrets via env vars ✅
- [ ] Profile configuration (cpu, gpu-nvidia, gpu-amd) ✅

### n8n Workflow Compliance
- [ ] Workflows in proper directory structure ✅
- [ ] JSON syntax validation ✅
- [ ] Credential templates (not actual secrets) ✅
- [ ] Workflow documentation ⚠️ **Could be enhanced**

### Security Compliance  
- [ ] No secrets in code ✅
- [ ] `.env.example` documented ⚠️ **Needs comments**
- [ ] Container vulnerability scanning ⚠️ **Set up with CI**
- [ ] n8n credential security ✅

### Infrastructure Testing & Quality
- [ ] Docker Compose validation ⚠️ **Manual only**
- [ ] Service health check tests ❌ **Missing**
- [ ] n8n workflow import tests ❌ **Missing**
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
1. **Create missing docs** → n8n/Docker-specific templates below
2. **Pin Docker versions** → See docker-compose.yml lines 11, 28, 38, 106
3. **Add infrastructure test suite** → Docker Compose + n8n workflow validation
4. **Add Makefile** → n8n-specific commands (up, down, pull, workflow-import)

### Medium Priority  
1. **Document .env.example** → Add variable comments with n8n context
2. **Enable pre-commit hooks** → Run `pre-commit install`
3. **Enable CI workflows** → Commit .github/workflows/
4. **Enhance workflow documentation** → Document n8n workflow dependencies

---

## 📋 File Templates

### Create ARCHITECTURE.md (n8n-specific)
```bash
# Run this to create n8n-appropriate ARCHITECTURE.md
cat > ARCHITECTURE.md << 'EOF'
# Architecture - n8n AI Automation Platform

## Overview
Self-hosted AI automation platform using Docker Compose with n8n workflows.

## Service Architecture
- **n8n**: Workflow automation platform (port 5678)
  - Web UI for workflow creation/editing
  - Workflow execution engine
  - Credential management
- **Ollama**: Local LLM inference (port 11434)  
  - Supports CPU and GPU profiles
  - Model: llama3.2 (auto-downloaded)
- **Qdrant**: Vector database (port 6333)
  - Vector storage and similarity search
  - HTTP API for n8n integration
- **PostgreSQL**: n8n data persistence (internal only)
  - Workflow definitions
  - Execution history
  - User/credential data

## Data Flow Architecture
```
User/Trigger → n8n Workflow → External APIs/Services
                ↓
        Ollama (LLM Processing)
                ↓  
        Qdrant (Vector Storage) ←→ PostgreSQL (Metadata)
```

## Docker Network Topology
- Network: `demo` (bridge)
- Internal communication between all services
- Only n8n (5678), Qdrant (6333), and Ollama (11434) exposed to host

## Volume Architecture
- `n8n_storage`: Workflow data, logs, temp files
- `postgres_storage`: Database persistence
- `ollama_storage`: Downloaded models (~2GB+)
- `qdrant_storage`: Vector indices and data
- `./shared`: Host-container file sharing for workflows

## Hardware Profiles
- **CPU**: All services on CPU (default)
- **GPU-NVIDIA**: Ollama with NVIDIA GPU acceleration  
- **GPU-AMD**: Ollama with AMD ROCm support

## Workflow Integration Patterns
- HTTP requests to external APIs
- Local LLM processing via Ollama
- Vector operations via Qdrant API
- File operations via shared volume
- Database queries via PostgreSQL connection
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

### Create Makefile (n8n-enhanced)
```bash
# Run this to create n8n-appropriate Makefile
cat > Makefile << 'EOF'
.PHONY: help up up-gpu up-amd down pull logs status clean test workflows health

help:  ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up:  ## Start services (CPU profile)
	docker compose --profile cpu up -d
	@echo "n8n UI available at: http://localhost:5678"

up-gpu:  ## Start services (NVIDIA GPU profile)  
	docker compose --profile gpu-nvidia up -d
	@echo "n8n UI available at: http://localhost:5678"

up-amd:  ## Start services (AMD GPU profile)
	docker compose --profile gpu-amd up -d
	@echo "n8n UI available at: http://localhost:5678"

down:  ## Stop services
	docker compose down

pull:  ## Pull latest images
	docker compose pull

logs:  ## Show logs (optional service name)
	docker compose logs -f $(service)

status:  ## Show service status  
	docker compose ps

health:  ## Check service health
	@echo "Checking service health..."
	@docker compose ps
	@echo "\nn8n health:"
	@curl -s http://localhost:5678/healthz || echo "n8n not ready"
	@echo "\nQdrant health:"  
	@curl -s http://localhost:6333/health || echo "Qdrant not ready"
	@echo "\nOllama health:"
	@curl -s http://localhost:11434/api/tags || echo "Ollama not ready"

workflows:  ## List available workflows
	@echo "Available workflows:"
	@find n8n/demo-data/workflows -name "*.json" -exec basename {} .json \; 2>/dev/null || echo "No workflows found"

test:  ## Run infrastructure tests
	@echo "Validating Docker Compose..."
	docker compose config -q
	@echo "✅ Docker Compose valid"
	@echo "Validating workflow JSON..."
	@find n8n/demo-data/workflows -name "*.json" -exec echo "Checking {}" \; -exec jq empty {} \; 2>/dev/null || echo "⚠️ Install jq for JSON validation"

clean:  ## Remove volumes (DESTRUCTIVE - will lose data)
	@read -p "This will delete all data. Continue? (y/N): " confirm && [ "$$confirm" = "y" ]
	docker compose down -v
	docker volume prune -f
	@echo "⚠️ All data removed"

restart:  ## Restart all services
	docker compose restart

backup:  ## Backup n8n data
	@echo "Creating backup..."
	docker compose exec n8n n8n export:workflow --backup --output=/data/shared/
	@echo "Workflows exported to ./shared/"
EOF
```

---

## 🎯 Compliance Score: 60%

**Next actions**: Complete missing files (40% improvement possible)

Last updated: $(date)