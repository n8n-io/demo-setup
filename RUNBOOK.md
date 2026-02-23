# Runbook — Self-Hosted AI Starter Kit

## Starting Services

```bash
# CPU only (default)
docker compose --profile cpu up -d

# NVIDIA GPU
docker compose --profile gpu-nvidia up -d

# AMD GPU
docker compose --profile gpu-amd up -d

# Mac users with local Ollama (set OLLAMA_HOST in .env first)
docker compose up -d
```

## Stopping Services

```bash
# Stop all services (preserves data)
docker compose down

# Stop and remove volumes (DESTRUCTIVE — loses all data)
docker compose down -v
```

## Checking Service Health

```bash
# View all service statuses
docker compose ps

# Check individual service logs
docker compose logs n8n
docker compose logs ollama
docker compose logs qdrant
docker compose logs postgres

# Follow logs in real-time
docker compose logs -f
```

### Health Check Endpoints

| Service | URL | Expected |
|---------|-----|----------|
| n8n | http://localhost:5678/healthz | 200 OK |
| Qdrant | http://localhost:6333/healthz | 200 OK |
| Ollama | http://localhost:11434/api/tags | JSON with models list |

## Upgrading Services

```bash
# Pull latest pinned images
docker compose pull

# Recreate containers with new images
docker compose create && docker compose --profile cpu up -d
```

**Before upgrading:**
1. Back up volumes (see Backup section)
2. Check release notes for breaking changes
3. Update pinned versions in `docker-compose.yml`
4. Test in isolation before production use

## Backup and Restore

### Backup Volumes

```bash
# Backup n8n data
docker run --rm -v self-hosted-ai-starter-kit_n8n_storage:/data -v $(pwd):/backup \
  alpine tar czf /backup/n8n-backup.tar.gz -C /data .

# Backup PostgreSQL
docker compose exec postgres pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > db-backup.sql

# Export workflows from n8n
docker compose exec n8n n8n export:workflow --backup --output=/data/shared/
```

### Restore Volumes

```bash
# Restore n8n data
docker run --rm -v self-hosted-ai-starter-kit_n8n_storage:/data -v $(pwd):/backup \
  alpine tar xzf /backup/n8n-backup.tar.gz -C /data

# Restore PostgreSQL
cat db-backup.sql | docker compose exec -T postgres psql -U ${POSTGRES_USER} ${POSTGRES_DB}
```

## Troubleshooting

### n8n won't start
```bash
# Check if PostgreSQL is healthy
docker compose ps postgres
# Check n8n logs for errors
docker compose logs n8n --tail 50
# Verify .env file exists and has required variables
cat .env
```

### Ollama model download stuck
```bash
# Check download progress
docker compose logs ollama-pull-llama-cpu --tail 20
# Restart the pull container
docker compose restart ollama-pull-llama-cpu
# Manually pull a model
docker compose exec ollama ollama pull llama3.2
```

### Qdrant not responding
```bash
# Check health
curl http://localhost:6333/healthz
# Check logs
docker compose logs qdrant --tail 20
# Restart service
docker compose restart qdrant
```

### Port conflicts
```bash
# Check what's using a port
lsof -i :5678  # n8n
lsof -i :6333  # qdrant
lsof -i :11434 # ollama
```

### Reset everything
```bash
# Nuclear option — removes all data and starts fresh
docker compose down -v
docker volume prune -f
docker compose --profile cpu up -d
```

## Common Operations

### Import a workflow
```bash
# Copy workflow JSON to demo-data and restart import
cp my-workflow.json n8n/demo-data/workflows/
docker compose restart n8n-import
```

### Access n8n shell
```bash
docker compose exec n8n /bin/sh
```

### Check Ollama models
```bash
docker compose exec ollama ollama list
```

### Restart a single service
```bash
docker compose restart <service-name>
```
