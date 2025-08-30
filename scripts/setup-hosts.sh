#!/bin/bash

# Setup local development domains
set -e

echo "🌐 Setting up local development domains"
echo "======================================="

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
else
    echo "❌ Unsupported OS: $OSTYPE"
    exit 1
fi

echo "📍 Detected OS: $OS"

# Note: .localhost domains work without /etc/hosts on modern browsers!
# But we'll add them for compatibility

# Read sites from sites-config.json
if [ -f "sites-config.json" ]; then
    echo ""
    echo "📝 Found sites in sites-config.json:"
    DOMAINS=$(grep -o '"[^"]*\.com"' sites-config.json | tr -d '"' | sed 's/\.com/.localhost/g')
    
    for domain in $DOMAINS; do
        echo "   • $domain"
    done
    
    echo ""
    echo "✅ Good news! Domains ending in .localhost work automatically!"
    echo "   No /etc/hosts changes needed on modern browsers."
    echo ""
    echo "📍 You can access your sites at:"
    for domain in $DOMAINS; do
        original=$(echo $domain | sed 's/\.localhost/.com/g')
        echo "   • http://$domain:4321 (for $original)"
    done
else
    echo "❌ sites-config.json not found"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo "   Run ./scripts/dev.sh to start the development server"