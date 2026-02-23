#!/bin/bash
# Test: n8n workflow and credential JSON validation
# Rule: n8n-workflow-rules.mdc

set -e

PASS=0
FAIL=0
WORKFLOW_DIR="n8n/src/workflows"
CREDENTIAL_DIR="n8n/src/credentials"

pass() { echo "  ✅ $1"; PASS=$((PASS + 1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL + 1)); }

echo "=== n8n Workflow & Credential Validation ==="
echo ""

# Test 1: Workflow directory exists
echo "1. Workflow directory exists"
if [[ -d "$WORKFLOW_DIR" ]]; then
    pass "$WORKFLOW_DIR found"
else
    fail "$WORKFLOW_DIR not found"
fi

# Test 2: Validate all workflow JSON files
echo "2. Workflow JSON syntax"
for f in $(find "$WORKFLOW_DIR" -name "*.json" 2>/dev/null); do
    if python3 -m json.tool "$f" > /dev/null 2>&1; then
        pass "$(basename $f) — valid JSON"
    else
        fail "$(basename $f) — invalid JSON"
    fi
done

# Test 3: Credential directory exists
echo "3. Credential directory exists"
if [[ -d "$CREDENTIAL_DIR" ]]; then
    pass "$CREDENTIAL_DIR found"
else
    fail "$CREDENTIAL_DIR not found"
fi

# Test 4: Validate all credential JSON files
echo "4. Credential JSON syntax"
for f in $(find "$CREDENTIAL_DIR" -name "*.json" 2>/dev/null); do
    if python3 -m json.tool "$f" > /dev/null 2>&1; then
        pass "$(basename $f) — valid JSON"
    else
        fail "$(basename $f) — invalid JSON"
    fi
done

# Test 5: Credentials contain encrypted data only (no plaintext secrets)
echo "5. Credential security"
for f in $(find "$CREDENTIAL_DIR" -name "*.json" 2>/dev/null); do
    if grep -q '"data":' "$f" 2>/dev/null; then
        DATA=$(python3 -c "import json; d=json.load(open('$f')); print(d.get('data',''))" 2>/dev/null)
        if echo "$DATA" | grep -qE "^U2FsdGVkX1"; then
            pass "$(basename $f) — data is encrypted"
        else
            fail "$(basename $f) — data may not be encrypted"
        fi
    fi
done

# Test 6: No plaintext API keys in workflow files
echo "6. No plaintext secrets in workflows"
for f in $(find "$WORKFLOW_DIR" -name "*.json" 2>/dev/null); do
    if grep -qiE "(api_key|apikey|password|secret|token)\s*[:=]\s*['\"]?[a-zA-Z0-9]{16,}" "$f" 2>/dev/null; then
        fail "$(basename $f) — potential plaintext secret found"
    else
        pass "$(basename $f) — no plaintext secrets"
    fi
done

# Test 7: Workflow documentation exists
echo "7. Workflow documentation"
if [[ -f "$WORKFLOW_DIR/README.md" ]]; then
    pass "Workflow README.md exists"
else
    fail "Workflow README.md missing"
fi
if [[ -f "$WORKFLOW_DIR/TESTING.md" ]]; then
    pass "Workflow TESTING.md exists"
else
    fail "Workflow TESTING.md missing"
fi

# Test 8: Required repo files exist
echo "8. Required repository files"
REQUIRED_FILES=("README.md" "CONTRIBUTING.md" "ARCHITECTURE.md" "SECURITY.md" "RUNBOOK.md" ".env.example" "Makefile")
for f in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$f" ]]; then
        pass "$f present"
    else
        fail "$f missing"
    fi
done

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[[ "$FAIL" -eq 0 ]] && exit 0 || exit 1
