# MCP n8n Server

An MCP (Model Context Protocol) server that provides comprehensive access to n8n workflow automation.

## Prerequisites

- Node.js 18+
- n8n running locally (typically on `http://localhost:5678`)
- n8n API key (optional, for enhanced security)

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

- `N8N_HOST` - n8n API endpoint (default: `http://localhost:5678`)
- `N8N_API_KEY` - n8n API key for authentication (optional)

## Available Tools

### list_workflows
Lists all workflows in your n8n instance with optional filtering.

**Parameters:**
- `filter` (optional): Filter by workflow name or tag

**Example Response:**
```
Found 3 workflows:
- Process Data (ID: 1, Active: true, Nodes: 5)
- Send Email (ID: 2, Active: false, Nodes: 3)
- API Integration (ID: 3, Active: true, Nodes: 8)
```

### get_workflow
Get detailed information about a specific workflow.

**Parameters:**
- `workflow_id` (required): The workflow ID

### execute_workflow
Execute a workflow and get results.

**Parameters:**
- `workflow_id` (required): The workflow ID to execute
- `data` (optional): Input data for the workflow

### get_execution_history
Get execution history for a workflow.

**Parameters:**
- `workflow_id` (required): The workflow ID
- `limit` (optional, default: 10): Number of executions to return

### get_execution_details
Get detailed information about a specific execution.

**Parameters:**
- `execution_id` (required): The execution ID

### create_webhook
Create a webhook endpoint for triggering workflows.

**Parameters:**
- `workflow_id` (required): The workflow ID to attach the webhook to
- `name` (optional): Name for the webhook

### activate_workflow
Activate a workflow to make it executable.

**Parameters:**
- `workflow_id` (required): The workflow ID to activate

### deactivate_workflow
Deactivate a workflow to stop it from executing.

**Parameters:**
- `workflow_id` (required): The workflow ID to deactivate

### get_workflow_stats
Get statistics about workflow executions (success rate, failures, average duration).

**Parameters:**
- `workflow_id` (required): The workflow ID

## Configuring with Claude Code

Add the following to your Claude Code MCP configuration (`~/.claude/mcp.json` or project's `.claude/mcp.json`):

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["/path/to/servers/mcp-n8n/index.js"],
      "env": {
        "N8N_HOST": "http://localhost:5678",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Example Usage in Claude Code

1. **List all workflows:**
   - Tool: `list_workflows`

2. **Execute a workflow:**
   - Tool: `execute_workflow`
   - Workflow ID: `1`
   - Data: `{"name": "test", "value": 123}`

3. **Check workflow status:**
   - Tool: `get_workflow_stats`
   - Workflow ID: `1`

4. **Get execution details:**
   - Tool: `get_execution_details`
   - Execution ID: `12345`

## API Authentication

If your n8n instance requires authentication:

1. Generate an API key in n8n settings
2. Set the `N8N_API_KEY` environment variable
3. The server will automatically include it in request headers

## Troubleshooting

- **Connection refused**: Ensure n8n is running on the configured host
- **Unauthorized**: Check that your API key is correct (if using authentication)
- **Workflow not found**: Use `list_workflows` to verify the workflow ID
- **Execution failed**: Check `get_execution_details` to see error messages

## Architecture

This MCP server implements the Model Context Protocol, allowing Claude to:
- Discover and list workflows
- Execute workflows with input data
- Monitor workflow executions
- Manage workflow activation states
- Create webhook endpoints
- Retrieve statistics and execution history

The server communicates with n8n's REST API and translates requests into MCP-compatible responses.
