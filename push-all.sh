#!/bin/bash
# Push to both GitHub and GitLab repositories

echo "🚀 Pushing to both GitHub and GitLab..."
git push origin main
echo "✅ Push complete!"

# Show status
echo ""
echo "📊 Repository status:"
git remote -v | grep push