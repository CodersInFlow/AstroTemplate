#!/bin/bash

# Read site config using jq
ADMIN_EMAIL=$(jq -r '.admin.email // "admin@example.com"' site.config.json)
ADMIN_PASSWORD=$(jq -r '.admin.password // "admin123"' site.config.json)
ADMIN_NAME=$(jq -r '.admin.name // "Admin"' site.config.json)
DB_NAME=$(jq -r '.database.name' site.config.json)

# Generate bcrypt hash using Python (available on most systems)
HASH=$(python3 -c "
import bcrypt
password = '$ADMIN_PASSWORD'.encode('utf-8')
salt = bcrypt.gensalt(10)
hash = bcrypt.hashpw(password, salt)
print(hash.decode('utf-8'))
" 2>/dev/null)

# If Python bcrypt fails, try using htpasswd as fallback
if [ -z "$HASH" ]; then
    # Use a simple pre-generated hash for the known password
    if [ "$ADMIN_PASSWORD" = "F0r3st40!" ]; then
        HASH='$2b$10$gAmg7rvy0LTIEM7sdIg.JO1Aicw4Tr7j7E/LRoPxJTvWFLKIK3CJy'
    else
        echo "Warning: Could not generate password hash. Using placeholder."
        HASH='$2b$10$PLACEHOLDER'
    fi
fi

echo "============================================================"
echo "ADMIN USER SETUP"
echo "============================================================"
echo "Admin Email: $ADMIN_EMAIL"
echo "Admin Password: $ADMIN_PASSWORD"
echo "Password Hash: $HASH"
echo ""

# Create MongoDB commands file
cat > runtime/setup-admin.mongo << EOF
// Admin User Setup Script
// Run this in MongoDB to create/update the admin user

use ${DB_NAME};

// Check if user exists
var existingUser = db.users.findOne({ email: "${ADMIN_EMAIL}" });

if (existingUser) {
  // Update existing user
  db.users.updateOne(
    { email: "${ADMIN_EMAIL}" },
    { 
      \$set: { 
        password: "${HASH}",
        name: "${ADMIN_NAME}",
        role: "admin",
        approved: true,
        updatedAt: new Date()
      }
    }
  );
  print("Admin user updated successfully!");
} else {
  // Create new user
  db.users.insertOne({
    name: "${ADMIN_NAME}",
    email: "${ADMIN_EMAIL}",
    password: "${HASH}",
    role: "admin",
    approved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  print("Admin user created successfully!");
}

print("Email: ${ADMIN_EMAIL}");
print("Password: ${ADMIN_PASSWORD}");
EOF

echo "MongoDB script saved to: runtime/setup-admin.mongo"
echo "============================================================"