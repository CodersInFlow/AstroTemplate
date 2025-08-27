db.users.deleteMany({});
db.users.insertOne({
  email: 'sales@codersinflow.com',
  passwordHash: '$2b$10$Zq0YmanrwzHgnNTdJ5wRlOs2Ar72JsSN1GY8xZkOGi4Tf8dESoEDy',
  name: 'Admin',
  isAdmin: true,
  approved: true,
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
});
print('Admin user created with correct password hash');
printjson(db.users.findOne({email: 'sales@codersinflow.com'}));