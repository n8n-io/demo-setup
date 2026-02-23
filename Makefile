.PHONY: help up up-gpu up-amd down pull logs status clean test health workflows restart backup validate

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Start services (CPU profile)
	docker compose --profile cpu up -d
	@echo "\n✅ Services starting. n8n UI: http://localhost:5678"

up-gpu: ## Start services (NVIDIA GPU profile)
	docker compose --profile gpu-nvidia up -d
	@echo "\n✅ Services starting. n8n UI: http://localhost:5678"

up-amd: ## Start services (AMD GPU profile)
	docker compose --profile gpu-amd up -d
	@echo "\n✅ Services starting. n8n UI: http://localhost:5678"

down: ## Stop all services
	docker compose down

restart: ## Restart all services
	docker compose restart

pull: ## Pull latest pinned images
	docker compose pull

logs: ## Show logs (usage: make logs or make logs service=n8n)
	docker compose logs -f $(service)

status: ## Show service status
	docker compose ps

health: ## Check health of all services
	@echo "🔍 Checking service health...\n"
	@echo "n8n:"
	@curl -sf http://localhost:5678/healthz > /dev/null && echo "  ✅ Healthy" || echo "  ❌ Not responding"
	@echo "Qdrant:"
	@curl -sf http://localhost:6333/healthz > /dev/null && echo "  ✅ Healthy" || echo "  ❌ Not responding"
	@echo "Ollama:"
	@curl -sf http://localhost:11434/api/tags > /dev/null && echo "  ✅ Healthy" || echo "  ❌ Not responding"
	@echo "PostgreSQL:"
	@docker compose exec -T postgres pg_isready -U root > /dev/null 2>&1 && echo "  ✅ Healthy" || echo "  ❌ Not responding"

workflows: ## List available workflows
	@echo "📋 Available workflows:"
	@find n8n -name "*.json" -path "*/workflows/*" -exec basename {} .json \; 2>/dev/null || echo "  No workflows found"

validate: ## Validate Docker Compose and workflow JSON files
	@echo "🔍 Validating configuration...\n"
	@echo "Docker Compose:"
	@docker compose config -q 2>&1 && echo "  ✅ Valid" || echo "  ❌ Invalid"
	@echo "Workflow JSON:"
	@for f in $$(find n8n -name "*.json" -path "*/workflows/*" 2>/dev/null); do \
		python3 -m json.tool "$$f" > /dev/null 2>&1 && echo "  ✅ $$f" || echo "  ❌ $$f"; \
	done
	@echo "Credential JSON:"
	@for f in $$(find n8n -name "*.json" -path "*/credentials/*" 2>/dev/null); do \
		python3 -m json.tool "$$f" > /dev/null 2>&1 && echo "  ✅ $$f" || echo "  ❌ $$f"; \
	done

test: ## Run all infrastructure tests
	@echo "🧪 Running infrastructure tests...\n"
	@bash tests/test_compose_validation.sh
	@bash tests/test_workflow_json.sh

backup: ## Export n8n workflows to ./shared/
	@echo "💾 Backing up workflows..."
	docker compose exec n8n n8n export:workflow --backup --output=/data/shared/
	@echo "✅ Workflows exported to ./shared/"

clean: ## Remove all volumes (DESTRUCTIVE)
	@echo "⚠️  This will delete ALL data (volumes, workflows, models)."
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || (echo "Cancelled." && exit 1)
	docker compose down -v
	@echo "🗑️  All data removed."
