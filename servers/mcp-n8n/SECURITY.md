# Security Guidelines for MCP n8n Server

## ⚠️ Important: Token Exposure

An n8n API token was exposed in the conversation. **This token should be considered compromised and rotated immediately.**

## Securing Your n8n API Token

### 1. Rotate the Exposed Token

**In n8n UI:**
1. Go to Settings → Personal data → API keys
2. Delete the exposed token
3. Create a new API key
4. Store it securely

### 2. Store Token Safely

**DO NOT:**
- ❌ Commit tokens to git
- ❌ Expose tokens in environment files
- ❌ Share tokens in messages or logs
- ❌ Include tokens in .mcp.json configuration

**DO:**
- ✅ Store in `.env` file (which is gitignored)
- ✅ Use environment variables
- ✅ Restrict token permissions in n8n
- ✅ Rotate tokens regularly

### 3. Configure the MCP Server

**Option A: Using Environment Variables (Recommended)**

Set in your `.env` file:
```bash
N8N_API_KEY=your_new_api_key_here
```

The MCP server will automatically use it from the environment.

**Option B: Using System Environment**

Export before running:
```bash
export N8N_API_KEY="your_new_api_key_here"
node servers/mcp-n8n/index.js
```

### 4. Update .env File

Add to `.env`:
```
# n8n Configuration
N8N_HOST=http://localhost:5678
N8N_API_KEY=your_new_secure_token_here
```

### 5. Verify Configuration

The `.claude/mcp.json` uses a placeholder:
```json
"N8N_API_KEY": "${N8N_API_KEY}"
```

This reference will be replaced with the actual value from your environment at runtime.

## Best Practices

1. **Never share tokens** - Treat API keys like passwords
2. **Use minimal permissions** - Give tokens only necessary scopes
3. **Rotate regularly** - Change tokens periodically
4. **Monitor usage** - Check n8n logs for unexpected access
5. **Use .env** - Keep sensitive data out of version control

## If Token Was Compromised

1. ✅ Immediately rotate the token in n8n
2. ✅ Review n8n execution logs for suspicious activity
3. ✅ Check for unauthorized workflow executions
4. ✅ Generate new token with minimal required permissions
5. ✅ Update all references to use new token

## Environment Variable Loading

The MCP n8n server reads from:
1. `N8N_API_KEY` environment variable
2. `N8N_HOST` environment variable (default: http://localhost:5678)

These are set:
- Via `.env` file when running locally
- Via Claude Code configuration when integrated
- Via system environment variables

## Additional Security

- **API Validation**: Only use authenticated n8n endpoints
- **HTTPS**: Use HTTPS in production (not http://localhost)
- **Firewall**: Restrict n8n access to localhost only
- **Audit Logs**: Enable n8n audit logging
- **Rate Limiting**: n8n supports rate limiting - configure it

## Questions?

For more info on n8n security:
- https://docs.n8n.io/hosting/environment-variables/
- https://docs.n8n.io/api/
