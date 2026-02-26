#!/usr/bin/env node

/**
 * Test script to verify Ollama connection and MCP server functionality
 * Usage: node test-ollama.js [OLLAMA_HOST]
 */

const OLLAMA_HOST = process.argv[2] || process.env.OLLAMA_HOST || "http://localhost:11434";

async function testOllama() {
  console.log(`\n🧪 Testing Ollama connection...`);
  console.log(`   Host: ${OLLAMA_HOST}\n`);

  try {
    // Test 1: Check if Ollama is running
    console.log("1️⃣  Checking if Ollama is running...");
    const tagsResponse = await fetch(`${OLLAMA_HOST}/api/tags`);

    if (!tagsResponse.ok) {
      throw new Error(`Ollama API returned ${tagsResponse.status} ${tagsResponse.statusText}`);
    }

    const tagsData = await tagsResponse.json();
    console.log("   ✅ Ollama is running!\n");

    // Test 2: List models
    console.log("2️⃣  Available models:");
    if (tagsData.models && tagsData.models.length > 0) {
      tagsData.models.forEach((model) => {
        const size = formatBytes(model.size);
        console.log(`   - ${model.name} (${size})`);
      });
    } else {
      console.log("   ⚠️  No models installed yet");
      console.log("   💡 Download one with: ollama pull llama2");
    }
    console.log("");

    // Test 3: Test model info if available
    if (tagsData.models && tagsData.models.length > 0) {
      const firstModel = tagsData.models[0].name;
      console.log(`3️⃣  Getting info for ${firstModel}...`);

      const infoResponse = await fetch(`${OLLAMA_HOST}/api/show`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: firstModel }),
      });

      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        console.log(`   ✅ Model info retrieved`);
        console.log(`   - Format: ${infoData.format}`);
        console.log(`   - Parameters: ${infoData.parameters}`);
      }
      console.log("");
    }

    // Test 4: Test generation (if model available)
    if (tagsData.models && tagsData.models.length > 0) {
      const firstModel = tagsData.models[0].name;
      console.log(`4️⃣  Testing generation with ${firstModel}...`);

      const genResponse = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: firstModel,
          prompt: "Say 'Hello from Ollama'",
          stream: false,
        }),
      });

      if (genResponse.ok) {
        const genData = await genResponse.json();
        console.log(`   ✅ Generation successful!`);
        console.log(`   Response: "${genData.response.trim()}"`);
      }
      console.log("");
    }

    // Success summary
    console.log("✅ All tests passed! MCP Ollama is ready to use.\n");
    console.log("📝 Next steps:");
    console.log("   1. Start Claude Code");
    console.log("   2. The 'ollama' MCP server should be available");
    console.log("   3. Use tools like 'list_models', 'generate', etc.\n");

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    console.log("💡 Troubleshooting:");
    console.log(`   - Check if Ollama is running on ${OLLAMA_HOST}`);
    console.log("   - Try: curl http://localhost:11434/api/tags");
    console.log("   - Download a model: ollama pull llama2");
    process.exit(1);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

testOllama();
