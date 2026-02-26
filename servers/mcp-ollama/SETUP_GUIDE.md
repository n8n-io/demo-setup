# MCP Ollama Setup Guide

## What You Now Have

✅ A fully functional MCP server that bridges Claude Code with your local Ollama instance!

## Step 1: Verify Ollama is Running

Before using the MCP server, make sure Ollama is running:

### Option A: Docker (using docker-compose)
```bash
cd /c/Users/Traxe/self-hosted-ai-starter-kit
docker-compose --profile cpu up ollama-cpu
# or for GPU:
docker-compose --profile gpu-nvidia up ollama-gpu
```

### Option B: Local Ollama
```bash
ollama serve
```

Verify Ollama is running:
```bash
curl http://localhost:11434/api/tags
```

## Step 2: Configure Claude Code

The MCP configuration is already set up in `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "ollama": {
      "command": "node",
      "args": [
        "/c/Users/Traxe/self-hosted-ai-starter-kit/.claude/worktrees/vigilant-pascal/mcp-ollama/index.js"
      ],
      "env": {
        "OLLAMA_HOST": "http://localhost:11434"
      }
    }
  }
}
```

### Configuration Notes

- **OLLAMA_HOST for local Ollama**: `http://localhost:11434`
- **OLLAMA_HOST for Docker**: `http://ollama:11434`
- The path must be absolute (not relative)

If you're using Docker and Ollama is in a container, update the config:
```json
{
  "mcpServers": {
    "ollama": {
      "command": "node",
      "args": [
        "/c/Users/Traxe/self-hosted-ai-starter-kit/.claude/worktrees/vigilant-pascal/mcp-ollama/index.js"
      ],
      "env": {
        "OLLAMA_HOST": "http://ollama:11434"
      }
    }
  }
}
```

## Step 3: Restart Claude Code

The MCP server loads when Claude Code starts. If you made configuration changes, restart Claude Code.

## Step 4: Use the Ollama Tools

Once configured, you can use these tools in Claude Code:

### List Models
```
Tool: list_models
(no parameters)
```

Response shows all installed models with their sizes.

### Generate Text
```
Tool: generate
Model: llama3.2
Prompt: "Explain how machine learning works"
Temperature: 0.7 (optional)
Num Predict: 256 (optional)
```

### Get Model Info
```
Tool: model_info
Model: llama3.2
```

### Pull a New Model
```
Tool: pull_model
Model: neural-chat
```

## Troubleshooting

### Error: "Connection refused"
- **Check**: Is Ollama running? Run `curl http://localhost:11434/api/tags`
- **Fix**: Start Ollama or docker-compose

### Error: "Model not found"
- **Check**: Run `list_models` to see what's installed
- **Fix**: Use `pull_model` to download a model

### Error: "Cannot find module..."
- **Check**: Are dependencies installed? Look for `node_modules/` in `mcp-ollama/`
- **Fix**: Run `npm install` in the `mcp-ollama/` directory

### Server doesn't start
- **Check**: Node.js version (need 18+): `node --version`
- **Fix**: Update Node.js if needed

### Docker hostname issues
- If using Docker, make sure `OLLAMA_HOST` is set to `http://ollama:11434` (not localhost)

## Example Workflow

1. Pull a model:
   - Tool: `pull_model`
   - Model: `llama3.2`

2. Wait for download to complete

3. List available models:
   - Tool: `list_models`

4. Generate text:
   - Tool: `generate`
   - Model: `llama3.2`
   - Prompt: Your question or request

5. Use model info to check parameters:
   - Tool: `model_info`
   - Model: `llama3.2`

## Advanced: Using Docker

If you want the MCP server to also run in Docker (for consistency):

1. Create a Dockerfile in `mcp-ollama/`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY index.js .
CMD ["node", "index.js"]
```

2. Add to docker-compose.yml:
```yaml
mcp-ollama:
  build: ./mcp-ollama
  container_name: mcp-ollama
  networks: ['demo']
  environment:
    - OLLAMA_HOST=http://ollama:11434
```

3. Update `.claude/mcp.json` to use docker:
```json
{
  "mcpServers": {
    "ollama": {
      "command": "docker",
      "args": ["run", "--rm", "--network", "demo", "mcp-ollama"]
    }
  }
}
```

## Next Steps

1. Start using the Ollama tools in your Claude Code workflows
2. Experiment with different models and prompts
3. Consider adding more tools as needed (streaming, batch processing, etc.)
4. Check the MCP specification for more advanced features

For more info, see the main README.md in the mcp-ollama directory.
