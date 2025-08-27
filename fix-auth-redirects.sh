#!/bin/bash

# List of files to fix
files=(
  "src/pages/blog/editor/posts/index.astro"
  "src/pages/blog/editor/posts/new.astro"
  "src/pages/blog/editor/posts/edit/[id].astro"
  "src/pages/blog/editor/categories/index.astro"
  "src/pages/blog/editor/users/index.astro"
  "src/pages/blog/editor/users/new.astro"
  "src/pages/blog/editor/users/edit/[id].astro"
  "src/pages/blog/editor/change-password.astro"
)

for file in "${files[@]}"; do
  echo "Fixing $file..."
  
  # Check if the file has the auth check pattern
  if grep -q "if (!userResponse.ok) {" "$file" 2>/dev/null; then
    # Add cookie deletion before redirect
    sed -i '' '/if (!userResponse.ok) {/a\
  // Clear invalid token before redirecting\
  Astro.cookies.delete('"'"'auth-token'"'"', { path: '"'"'/'"'"' });
' "$file"
    echo "  ✅ Fixed $file"
  else
    echo "  ⏭️  Skipped $file (no auth check found or already fixed)"
  fi
done

echo "Done!"
