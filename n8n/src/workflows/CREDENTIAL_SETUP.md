# ScraperAPI Credential Setup Guide

## Important: Manual Credential Setup Required

The Price Comparison Workflow requires ScraperAPI credentials to be configured manually in n8n. **Credentials cannot be pre-imported** because they must be encrypted with your specific n8n instance's encryption key.

## Step-by-Step Setup

### 1. Start n8n

```bash
docker compose --profile cpu up -d
```

### 2. Open n8n

Navigate to: `http://localhost:5678`

### 3. Create ScraperAPI Credential

1. Click on **"Credentials"** in the left sidebar
2. Click **"+ Add Credential"** button
3. Search for and select **"Query Auth"**
4. Configure as follows:

   **Credential Name:**
   ```
   ScraperAPI Service
   ```

   **Credential Data:**
   - **Name**: `api_key`
   - **Value**: `00bb58d3ac1b0f2443d7ddfdcda08caa`

5. Click **"Save"** button

### 4. Verify Credential ID

After saving, n8n will assign a credential ID. You need to update the workflow to use this ID.

1. Open the credential you just created
2. Check the URL - it will look like: `http://localhost:5678/credentials/[CREDENTIAL-ID]`
3. Copy the credential ID

### 5. Update Workflow

You have two options:

#### Option A: Update via n8n UI (Recommended)

1. Open the **"Price Comparison Workflow"**
2. Click on the **"Query Amazon"** node
3. Under **Authentication**, select **"Generic Credential Type"**
4. For **Generic Auth Type**, select **"Query Auth"**
5. Select your **"ScraperAPI Service"** credential from the dropdown
6. Repeat for the **"Query Flipkart"** node
7. Click **"Save"** on the workflow

#### Option B: Update JSON Manually

If you prefer to update the workflow JSON directly:

1. Open `n8n/demo-data/workflows/price-comparison.json`
2. Find both HTTP nodes (Amazon and Flipkart)
3. Update the credential ID:

```json
"credentials": {
  "httpQueryAuth": {
    "id": "YOUR-ACTUAL-CREDENTIAL-ID-HERE",
    "name": "ScraperAPI Service"
  }
}
```

4. Save and re-import the workflow

### 6. Test the Workflow

1. Open the Price Comparison Workflow
2. Click the **"Chat"** button
3. Enter a test product: `iPhone 15 128GB`
4. Verify results are returned

## Alternative: Using Environment Variables

If you prefer to avoid credential setup entirely, you can use environment variables:

### 1. Update `.env` file

```bash
# Add to .env
SCRAPERAPI_KEY=00bb58d3ac1b0f2443d7ddfdcda08caa
```

### 2. Update Workflow Nodes

In both HTTP nodes, change the URL to:

```
https://api.scraperapi.com?api_key={{ $env.SCRAPERAPI_KEY }}&url=...
```

### 3. Restart n8n

```bash
docker compose --profile cpu down
docker compose --profile cpu up -d
```

## Why Can't Credentials Be Pre-Imported?

n8n encrypts all credential data using the `N8N_ENCRYPTION_KEY` from your `.env` file. Each n8n instance has a unique encryption key, so:

- ❌ Pre-encrypted credentials won't work on your instance
- ❌ Plain-text credentials in JSON files are insecure
- ✅ Credentials must be added through the n8n UI or API after installation

## Troubleshooting

### Error: "Credentials not found"

**Solution:** Make sure you've created the credential in n8n and updated the workflow to reference it.

### Error: "Authentication failed"

**Solution:** 
1. Verify your ScraperAPI key is valid
2. Check https://www.scraperapi.com/dashboard for your actual API key
3. Ensure you haven't exceeded your monthly request limit

### Workflow imports but nodes show credential warning

**Solution:** This is expected. Follow the setup steps above to connect the credentials.

## Security Best Practices

✅ **Do This:**
- Store API keys in n8n credentials (encrypted at rest)
- Use environment variables for sensitive values
- Rotate API keys regularly

❌ **Don't Do This:**
- Hardcode API keys in workflow JSON
- Commit credentials to version control
- Share unencrypted credential files

## API Key Information

**Current Key (for demo):** `00bb58d3ac1b0f2443d7ddfdcda08caa`

⚠️ **Important:** This is a demo key. For production use:
1. Sign up at https://www.scraperapi.com
2. Get your own API key
3. Replace the demo key with your production key

## ScraperAPI Query Auth Format

ScraperAPI expects the API key as a URL query parameter:

```
https://api.scraperapi.com?api_key=YOUR_KEY&url=TARGET_URL&render=true
```

The Query Auth credential in n8n automatically appends the `api_key` parameter to all requests.

## Questions?

- n8n Credentials Docs: https://docs.n8n.io/credentials/
- ScraperAPI Docs: https://docs.scraperapi.com/
- Query Auth Setup: https://docs.n8n.io/integrations/builtin/credentials/httprequestauth/#query-auth
