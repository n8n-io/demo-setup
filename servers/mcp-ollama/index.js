import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";

const server = new Server(
  {
    name: "mcp-ollama",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

async function callOllama(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${OLLAMA_HOST}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_models",
        description: "List all available Ollama models on the local system",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "generate",
        description: "Generate text using a specified Ollama model",
        inputSchema: {
          type: "object",
          properties: {
            model: {
              type: "string",
              description: "The model name to use (e.g., 'llama2', 'llama3.2')",
            },
            prompt: {
              type: "string",
              description: "The prompt to send to the model",
            },
            stream: {
              type: "boolean",
              description: "Whether to stream the response (default: false)",
              default: false,
            },
            temperature: {
              type: "number",
              description: "Temperature for generation (0.0 to 2.0, default: 0.7)",
              default: 0.7,
            },
            num_predict: {
              type: "number",
              description: "Number of tokens to predict (default: 256)",
              default: 256,
            },
          },
          required: ["model", "prompt"],
        },
      },
      {
        name: "model_info",
        description: "Get detailed information about a specific model",
        inputSchema: {
          type: "object",
          properties: {
            model: {
              type: "string",
              description: "The model name",
            },
          },
          required: ["model"],
        },
      },
      {
        name: "pull_model",
        description: "Download a model from Ollama registry",
        inputSchema: {
          type: "object",
          properties: {
            model: {
              type: "string",
              description: "The model name to pull (e.g., 'llama2', 'neural-chat')",
            },
          },
          required: ["model"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "list_models": {
        const data = await callOllama("/api/tags");
        const models = data.models || [];
        return {
          content: [
            {
              type: "text",
              text: `Available models:\n${models
                .map(
                  (m) =>
                    `- ${m.name} (size: ${formatBytes(m.size)}, modified: ${m.modified_at})`
                )
                .join("\n") || "No models found"}`,
            },
          ],
        };
      }

      case "generate": {
        const { model, prompt, stream = false, temperature = 0.7, num_predict = 256 } = args;

        const response = await callOllama("/api/generate", "POST", {
          model,
          prompt,
          stream: false,
          temperature,
          num_predict,
        });

        return {
          content: [
            {
              type: "text",
              text: response.response || "No response from model",
            },
          ],
        };
      }

      case "model_info": {
        const { model } = args;
        const data = await callOllama("/api/show", "POST", { name: model });

        return {
          content: [
            {
              type: "text",
              text: `Model: ${data.name}\nDetails:\n${JSON.stringify(data, null, 2)}`,
            },
          ],
        };
      }

      case "pull_model": {
        const { model } = args;
        const response = await callOllama("/api/pull", "POST", { name: model });

        return {
          content: [
            {
              type: "text",
              text: `Model pull initiated for ${model}\nStatus: ${response.status || "pulling"}`,
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

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Ollama server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
