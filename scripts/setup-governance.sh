#!/bin/bash
# Setup governance enforcement for self-hosted-ai-starter-kit

set -e

echo "🎯 Setting up governance enforcement..."

# Check if we're in the right directory
if [[ ! -f "docker-compose.yml" ]]; then
    echo "❌ Please run this script from the repository root"
    exit 1
fi

# Install pre-commit if not available
if ! command -v pre-commit &> /dev/null; then
    echo "📦 Installing pre-commit..."
    pip install pre-commit || {
        echo "⚠️  Could not install pre-commit. Install manually: pip install pre-commit"
    }
fi

# Setup pre-commit hooks
if [[ -f ".pre-commit-config.yaml" ]]; then
    echo "🔗 Installing pre-commit hooks..."
    pre-commit install || echo "⚠️  Could not install hooks. Run 'pre-commit install' manually"
    echo "✅ Pre-commit hooks installed"
else
    echo "⚠️  .pre-commit-config.yaml not found. Create it first."
fi

# Check current compliance
echo ""
echo "📊 Current governance status:"

# Required files check
echo "Checking required files..."
required_files=("README.md" "CONTRIBUTING.md" "ARCHITECTURE.md" "SECURITY.md" "RUNBOOK.md" ".env.example")
missing_files=()

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
        missing_files+=("$file")
    fi
done

# Check Makefile
if [[ -f "Makefile" || -f "taskfile.yml" ]]; then
    echo "  ✅ Build tool (Makefile/taskfile.yml)"
else
    echo "  ❌ Makefile or taskfile.yml (missing)"
    missing_files+=("Makefile")
fi

# Docker version check
echo ""
echo "Checking Docker image pinning..."
if grep -q ":latest\|image:.*[^:v0-9]$" docker-compose.yml 2>/dev/null; then
    echo "  ❌ Found unpinned Docker images:"
    grep -n ":latest\|image:.*[^:v0-9]$" docker-compose.yml | sed 's/^/    /'
else
    echo "  ✅ All Docker images are pinned"
fi

# Summary
echo ""
if [[ ${#missing_files[@]} -gt 0 ]]; then
    echo "📋 To achieve full compliance, create:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    echo ""
    echo "💡 Use templates in GOVERNANCE_DASHBOARD.md"
else
    echo "🎉 Repository is governance compliant!"
fi

echo ""
echo "🚀 Next steps:"
echo "  1. Fix any violations above"
echo "  2. Commit your changes - pre-commit will validate"
echo "  3. GitHub Actions will enforce rules on PRs"
echo "  4. Use GOVERNANCE_DASHBOARD.md for ongoing tracking"

echo ""
echo "✅ Governance setup complete!"