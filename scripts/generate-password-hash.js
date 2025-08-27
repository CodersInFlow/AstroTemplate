// Generate bcrypt hash for password
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
    console.error('Usage: node generate-password-hash.js <password>');
    process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log(hash);