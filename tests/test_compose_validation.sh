#!/bin/bash
# Test: Docker Compose configuration validation
# Rule: docker-rules.mdc, docker-compose-rules.mdc

set -e

PASS=0
FAIL=0
COMPOSE_FILE="docker-compose.yml"

pass() { echo "  ✅ $1"; PASS=$((PASS + 1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL + 1)); }

echo "=== Docker Compose Validation ==="
echo ""

# Test 1: Compose file exists
echo "1. Compose file exists"
if [[ -f "$COMPOSE_FILE" ]]; then
    pass "$COMPOSE_FILE found"
else
    fail "$COMPOSE_FILE not found"
fi

# Test 2: Compose file is valid YAML
echo "2. Compose file syntax"
TEMP_ENV=0
if [[ ! -f ".env" ]]; then
    cp .env.example .env
    TEMP_ENV=1
fi
if docker compose config -q 2>/dev/null; then
    pass "Valid Docker Compose syntax"
else
    fail "Invalid Docker Compose syntax"
fi
if [[ "$TEMP_ENV" -eq 1 ]]; then
    rm -f .env
fi

# Test 3: No :latest tags
echo "3. Image version pinning"
if grep -q ":latest" "$COMPOSE_FILE" 2>/dev/null; then
    fail "Found :latest tag — pin image versions"
    grep -n ":latest" "$COMPOSE_FILE" | sed 's/^/    /'
else
    pass "No :latest tags found"
fi

# Test 4: No untagged images
echo "4. All images have tags"
UNTAGGED=$(grep "image:" "$COMPOSE_FILE" | grep -v ":" | grep -v "rocm" || true)
if [[ -z "$UNTAGGED" ]]; then
    pass "All images have version tags"
else
    fail "Found untagged images"
    echo "$UNTAGGED" | sed 's/^/    /'
fi

# Test 5: Health checks exist
echo "5. Health checks defined"
HEALTH_COUNT=$(grep -c "healthcheck:" "$COMPOSE_FILE" || true)
if [[ "$HEALTH_COUNT" -ge 3 ]]; then
    pass "Found $HEALTH_COUNT health checks"
else
    fail "Only $HEALTH_COUNT health checks (need at least 3: postgres, n8n, qdrant)"
fi

# Test 6: Networks defined
echo "6. Networks defined"
if grep -q "networks:" "$COMPOSE_FILE"; then
    pass "Network configuration found"
else
    fail "No network configuration"
fi

# Test 7: Volumes defined
echo "7. Named volumes defined"
VOLUME_COUNT=$(grep -cE "^\s+\w+_storage:" "$COMPOSE_FILE" || true)
if [[ "$VOLUME_COUNT" -ge 4 ]]; then
    pass "Found $VOLUME_COUNT named volumes"
else
    fail "Only $VOLUME_COUNT volumes (expected at least 4)"
fi

# Test 8: .env.example exists
echo "8. .env.example exists"
if [[ -f ".env.example" ]]; then
    pass ".env.example found"
else
    fail ".env.example missing"
fi

# Test 9: .env.example has comments
echo "9. .env.example documented"
COMMENT_COUNT=$(grep -c "^#" ".env.example" 2>/dev/null || true)
if [[ "$COMMENT_COUNT" -ge 5 ]]; then
    pass ".env.example has $COMMENT_COUNT comment lines"
else
    fail ".env.example lacks documentation (only $COMMENT_COUNT comments)"
fi

# Test 10: No hardcoded secrets in compose
echo "10. No hardcoded secrets in compose"
if grep -qE "(password|secret|key|token)\s*[:=]\s*['\"]?[a-zA-Z0-9]" "$COMPOSE_FILE" 2>/dev/null; then
    fail "Potential hardcoded secrets in compose file"
else
    pass "No hardcoded secrets in compose file"
fi

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[[ "$FAIL" -eq 0 ]] && exit 0 || exit 1
