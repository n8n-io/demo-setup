# Security Policy

## Secrets Management

### Environment Variables
All secrets are managed via `.env` file (never committed to version control).

**Required secrets:**
- `POSTGRES_PASSWORD` — Database access password
- `N8N_ENCRYPTION_KEY` — Encrypts n8n credential storage
- `N8N_USER_MANAGEMENT_JWT_SECRET` — Signs n8n authentication tokens

**Generate secure values:**
```bash
# Generate a secure random key
openssl rand -hex 32
```

### n8n Credentials
- Credentials are encrypted at rest using `N8N_ENCRYPTION_KEY`
- Credential JSON files in this repo contain encrypted data only
- Actual credential values must be configured via n8n UI after deployment
- See `n8n/src/workflows/CREDENTIAL_SETUP.md` for setup instructions

### What NOT to Commit
- `.env` file (contains actual secrets)
- Unencrypted API keys or tokens
- Private keys or certificates
- Database connection strings with passwords

## Container Security

### Image Policy
- All Docker images are pinned to specific versions (no `:latest`)
- Images are from official publishers only (n8nio, ollama, qdrant, postgres)
- Regular updates recommended — check for vulnerabilities

### Network Isolation
- All services run on an isolated Docker network (`demo`)
- Only necessary ports are exposed to the host
- PostgreSQL is not exposed externally (internal network only)

### Health Checks
- All services have health checks configured
- Failed services are automatically restarted (`unless-stopped` policy)

## Vulnerability Reporting

If you discover a security vulnerability:

1. **Do not** open a public issue
2. Contact the repository maintainer directly
3. Include: description, reproduction steps, potential impact
4. Allow reasonable time for a fix before public disclosure

## Dependency Scanning

- GitHub Actions workflow (`docker-security-scan.yml`) scans Docker images weekly
- Pre-commit hooks check for accidental secret commits
- Governance rules enforce no secrets in code, logs, or PRs

## Best Practices for Users

1. **Always change default passwords** in `.env` before first use
2. **Rotate secrets periodically** — update `.env` and restart services
3. **Keep images updated** — run `docker compose pull` regularly
4. **Back up volumes** before upgrading services
5. **Review n8n credentials** — ensure no plaintext secrets in workflow exports
