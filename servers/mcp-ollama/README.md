# MCP Ollama Server

An MCP (Model Context Protocol) server that provides access to local Ollama AI models.

## Prerequisites

- Node.js 18+
- Ollama running locally (typically on `http://localhost:11434`)

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Environment Variables

- `OLLAMA_HOST` - Ollama API endpoint (default: `http://localhost:11434`)

## Available Tools

### list_models
Lists all available models currently on your Ollama instance.

**No parameters required.**

Example response:
```
Available models:
- llama2 (size: 3.8 GB, modified: 2024-01-15T10:30:00Z)
- llama3.2 (size: 4.2 GB, modified: 2024-02-20T15:45:00Z)
```

### generate
Generate text using a specified model.

**Parameters:**
- `model` (required): Model name (e.g., 'llama2', 'llama3.2')
- `prompt` (required): The prompt to send to the model
- `temperature` (optional, default: 0.7): Controls randomness (0.0-2.0)
- `num_predict` (optional, default: 256): Number of tokens to generate
- `stream` (optional, default: false): Stream response

### model_info
Get detailed information about a specific model.

**Parameters:**
- `model` (required): Model name

### pull_model
Download a new model from Ollama registry.

**Parameters:**
- `model` (required): Model name to pull (e.g., 'neural-chat', 'mistral')

## Configuring with Claude Code

Add the following to your Claude Code MCP configuration (`~/.claude/mcp.json` or project's `.claude/mcp.json`):

```json
{
  "mcpServers": {
    "ollama": {
      "command": "node",
      "args": ["/path/to/mcp-ollama/index.js"],
      "env": {
        "OLLAMA_HOST": "http://localhost:11434"
      }
    }
  }
}
```

For Docker environments, use the Docker hostname:
```json
{
  "mcpServers": {
    "ollama": {
      "command": "node",
      "args": ["/path/to/mcp-ollama/index.js"],
      "env": {
        "OLLAMA_HOST": "http://ollama:11434"
      }
    }
  }
}
```

## Example Usage in Claude Code

Once configured, you can interact with your local models:

1. **List available models:**
   - Use the `list_models` tool to see what's installed

2. **Generate text:**
   - Tool: `generate`
   - Model: `llama3.2`
   - Prompt: "Explain quantum computing in simple terms"

3. **Pull a new model:**
   - Tool: `pull_model`
   - Model: `neural-chat`

## Troubleshooting

- **Connection refused**: Ensure Ollama is running and accessible on the configured host
- **Model not found**: Use `list_models` to see available models, or `pull_model` to download
- **Server won't start**: Check Node.js version (requires 18+) and npm dependencies

## Architecture

This MCP server implements the Model Context Protocol, allowing Claude to:
- Discover available Ollama models
- Execute generation requests
- Retrieve model metadata
- Manage model downloads

The server communicates with Ollama's REST API and translates requests into MCP-compatible responses.
