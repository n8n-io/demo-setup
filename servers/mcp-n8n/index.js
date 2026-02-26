import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const N8N_HOST = process.env.N8N_HOST || "http://localhost:5678";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

const server = new Server(
  {
    name: "mcp-n8n",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

async function callN8n(endpoint, method = "GET", body = null, headers = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (N8N_API_KEY) {
    defaultHeaders["X-N8N-API-KEY"] = N8N_API_KEY;
  }

  const options = {
    method,
    headers: defaultHeaders,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${N8N_HOST}${endpoint}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `n8n API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_workflows",
        description: "List all available workflows in n8n",
        inputSchema: {
          type: "object",
          properties: {
            filter: {
              type: "string",
              description: "Optional filter by workflow name or tag",
            },
          },
          required: [],
        },
      },
      {
        name: "get_workflow",
        description: "Get detailed information about a specific workflow",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID",
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "execute_workflow",
        description: "Execute a workflow and get results",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID to execute",
            },
            data: {
              type: "object",
              description: "Optional input data for the workflow",
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "get_execution_history",
        description: "Get execution history for a workflow",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID",
            },
            limit: {
              type: "number",
              description: "Maximum number of executions to return (default: 10)",
              default: 10,
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "get_execution_details",
        description: "Get detailed information about a specific execution",
        inputSchema: {
          type: "object",
          properties: {
            execution_id: {
              type: "string",
              description: "The execution ID",
            },
          },
          required: ["execution_id"],
        },
      },
      {
        name: "create_webhook",
        description: "Create a webhook endpoint for triggering workflows",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID to attach the webhook to",
            },
            name: {
              type: "string",
              description: "Name for the webhook",
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "activate_workflow",
        description: "Activate a workflow to make it executable",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID to activate",
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "deactivate_workflow",
        description: "Deactivate a workflow to stop it from executing",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID to deactivate",
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "get_workflow_stats",
        description: "Get statistics about workflow executions",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID",
            },
          },
          required: ["workflow_id"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "list_workflows": {
        const data = await callN8n("/rest/workflows");
        const workflows = Array.isArray(data) ? data : data.data || [];

        const filtered = args.filter
          ? workflows.filter(
              (w) =>
                w.name?.includes(args.filter) ||
                w.tags?.some((t) => t.includes(args.filter))
            )
          : workflows;

        return {
          content: [
            {
              type: "text",
              text: `Found ${filtered.length} workflows:\n${filtered
                .map(
                  (w) =>
                    `- ${w.name} (ID: ${w.id}, Active: ${w.active}, Nodes: ${w.nodes?.length || 0})`
                )
                .join("\n") || "No workflows found"}`,
            },
          ],
        };
      }

      case "get_workflow": {
        const data = await callN8n(`/rest/workflows/${args.workflow_id}`);
        return {
          content: [
            {
              type: "text",
              text: `Workflow: ${data.name}\nID: ${data.id}\nActive: ${data.active}\nNodes: ${data.nodes?.length || 0}\nCreated: ${data.createdAt}\nUpdated: ${data.updatedAt}`,
            },
          ],
        };
      }

      case "execute_workflow": {
        const payload = args.data || {};
        const response = await callN8n(
          `/webhook/exec/${args.workflow_id}`,
          "POST",
          payload
        );
        return {
          content: [
            {
              type: "text",
              text: `Workflow executed successfully:\n${JSON.stringify(response, null, 2)}`,
            },
          ],
        };
      }

      case "get_execution_history": {
        const limit = args.limit || 10;
        const data = await callN8n(
          `/rest/executions?workflowId=${args.workflow_id}&limit=${limit}`
        );
        const executions = Array.isArray(data) ? data : data.data || [];

        return {
          content: [
            {
              type: "text",
              text: `Execution history for workflow ${args.workflow_id}:\n${executions
                .map(
                  (e) =>
                    `- ID: ${e.id}, Status: ${e.status}, Started: ${e.startedAt}, Duration: ${e.stoppedAt ? new Date(e.stoppedAt).getTime() - new Date(e.startedAt).getTime() : "running"}ms`
                )
                .join("\n") || "No executions found"}`,
            },
          ],
        };
      }

      case "get_execution_details": {
        const data = await callN8n(`/rest/executions/${args.execution_id}`);
        return {
          content: [
            {
              type: "text",
              text: `Execution Details:\nID: ${data.id}\nStatus: ${data.status}\nStarted: ${data.startedAt}\nStopped: ${data.stoppedAt}\nData:\n${JSON.stringify(data.data, null, 2)}`,
            },
          ],
        };
      }

      case "create_webhook": {
        const webhookBody = {
          name: args.name || `Webhook for ${args.workflow_id}`,
          url: `${N8N_HOST}/webhook/${args.workflow_id}`,
        };
        const response = await callN8n(
          `/rest/webhooks`,
          "POST",
          webhookBody
        );
        return {
          content: [
            {
              type: "text",
              text: `Webhook created:\nURL: ${N8N_HOST}/webhook/${args.workflow_id}\nID: ${response.id}`,
            },
          ],
        };
      }

      case "activate_workflow": {
        await callN8n(
          `/rest/workflows/${args.workflow_id}`,
          "PATCH",
          { active: true }
        );
        return {
          content: [
            {
              type: "text",
              text: `Workflow ${args.workflow_id} activated successfully`,
            },
          ],
        };
      }

      case "deactivate_workflow": {
        await callN8n(
          `/rest/workflows/${args.workflow_id}`,
          "PATCH",
          { active: false }
        );
        return {
          content: [
            {
              type: "text",
              text: `Workflow ${args.workflow_id} deactivated successfully`,
            },
          ],
        };
      }

      case "get_workflow_stats": {
        const data = await callN8n(
          `/rest/executions?workflowId=${args.workflow_id}&limit=100`
        );
        const executions = Array.isArray(data) ? data : data.data || [];

        const stats = {
          total: executions.length,
          successful: executions.filter((e) => e.status === "success").length,
          failed: executions.filter((e) => e.status === "error").length,
          running: executions.filter((e) => e.status === "running").length,
        };

        const avgDuration =
          executions.length > 0
            ? executions.reduce((sum, e) => {
                const duration =
                  new Date(e.stoppedAt || new Date()).getTime() -
                  new Date(e.startedAt).getTime();
                return sum + duration;
              }, 0) / executions.length
            : 0;

        return {
          content: [
            {
              type: "text",
              text: `Workflow Statistics:\nTotal Executions: ${stats.total}\nSuccessful: ${stats.successful}\nFailed: ${stats.failed}\nRunning: ${stats.running}\nAverage Duration: ${Math.round(avgDuration)}ms`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP n8n server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
