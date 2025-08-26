import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read site config
const configPath = path.join(__dirname, '..', 'site.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const adminEmail = config.admin?.email || 'admin@example.com';
const adminPassword = config.admin?.password || 'admin123';
const adminName = config.admin?.name || 'Admin';

// Generate password hash
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(adminPassword, salt);

// Generate MongoDB command
const mongoCommand = `
// Admin User Setup Script
// Run this in MongoDB to create/update the admin user

use ${config.database.name};

// Check if user exists
var existingUser = db.users.findOne({ email: "${adminEmail}" });

if (existingUser) {
  // Update existing user
  db.users.updateOne(
    { email: "${adminEmail}" },
    { 
      $set: { 
        password: "${hash}",
        name: "${adminName}",
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
    name: "${adminName}",
    email: "${adminEmail}",
    password: "${hash}",
    role: "admin",
    approved: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  print("Admin user created successfully!");
}

print("Email: ${adminEmail}");
print("Password: ${adminPassword}");
`;

console.log('='.repeat(60));
console.log('ADMIN USER SETUP');
console.log('='.repeat(60));
console.log(`\nAdmin Email: ${adminEmail}`);
console.log(`Admin Password: ${adminPassword}`);
console.log(`Password Hash: ${hash}`);
console.log('\n' + '='.repeat(60));
console.log('MONGODB COMMANDS:');
console.log('='.repeat(60));
console.log(mongoCommand);

// Save to file for easy execution
const outputPath = path.join(__dirname, '..', 'runtime', 'setup-admin.mongo');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, mongoCommand);
console.log('\n' + '='.repeat(60));
console.log(`MongoDB script saved to: runtime/setup-admin.mongo`);
console.log('='.repeat(60));