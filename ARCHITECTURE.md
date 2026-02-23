# Architecture — Self-Hosted AI Starter Kit

## Overview

Docker Compose-based local AI automation platform combining n8n workflow automation with local LLMs, vector storage, and persistent database.

## Service Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Docker Network: demo                     │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────────┐ │
│  │   n8n    │───▶│  Ollama  │    │  Qdrant  │    │ PostgreSQL│ │
│  │  :5678   │    │  :11434  │    │  :6333   │    │ (internal)│ │
│  └──────────┘    └──────────┘    └──────────┘    └───────────┘ │
│       │                                               ▲         │
│       └───────────────────────────────────────────────┘         │
│                        (stores workflow data)                    │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### n8n (Workflow Automation) — Port 5678
- Web UI for creating and managing workflows
- Workflow execution engine with 400+ integrations
- Credential management (encrypted at rest)
- Connects to all other services for AI workflows

### Ollama (Local LLM Inference) — Port 11434
- Runs local language models (default: llama3.2)
- Supports CPU and GPU acceleration profiles
- REST API for n8n integration
- Model storage persisted in `ollama_storage` volume

### Qdrant (Vector Database) — Port 6333
- Vector storage and similarity search
- HTTP/gRPC API for n8n integration
- Persisted in `qdrant_storage` volume

### PostgreSQL (n8n Data Store) — Internal Only
- Stores n8n workflow definitions, execution history, and user data
- Not exposed to host (internal network only)
- Persisted in `postgres_storage` volume

## Data Flow

```
User Input
    │
    ▼
n8n Workflow (Chat Trigger)
    │
    ├──▶ Ollama (LLM processing — summarize, classify, generate)
    │
    ├──▶ Qdrant (vector search — embeddings, similarity)
    │
    ├──▶ External APIs (HTTP requests — scraping, third-party services)
    │
    └──▶ PostgreSQL (metadata, execution logs)
    │
    ▼
Formatted Output → User
```

## Hardware Profiles

| Profile | Command | Ollama Runtime |
|---------|---------|----------------|
| CPU | `docker compose --profile cpu up` | CPU inference |
| NVIDIA GPU | `docker compose --profile gpu-nvidia up` | CUDA acceleration |
| AMD GPU | `docker compose --profile gpu-amd up` | ROCm acceleration |

## Volume Architecture

| Volume | Purpose | Backup Priority |
|--------|---------|-----------------|
| `n8n_storage` | Workflow data, logs, temp files | High |
| `postgres_storage` | Database (workflows, credentials, history) | High |
| `ollama_storage` | Downloaded models (~2GB+) | Low (re-downloadable) |
| `qdrant_storage` | Vector indices and data | Medium |
| `./shared` | Host-container file sharing | N/A (bind mount) |

## Service Dependencies

```
postgres (health check) ──▶ n8n-import (runs once) ──▶ n8n (main service)
ollama-{cpu|gpu} ──▶ ollama-pull-llama (downloads model)
qdrant (independent startup)
```

## Network Topology

- **Network:** `demo` (bridge mode)
- **Exposed ports:** n8n (5678), Qdrant (6333), Ollama (11434)
- **Internal only:** PostgreSQL (5432)
- All services communicate via Docker DNS (service names as hostnames)
