db.users.deleteMany({});
db.users.insertOne({
  email: 'sales@codersinflow.com',
  passwordHash: '$2b$10$1Oae/qlRBPU.VEuJ5/msy.VQ3q9/Aii2kYTdZuCbSsZFe2a4Oaw/2',
  name: 'Admin',
  isAdmin: true,
  approved: true,
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
});
print('Admin user created:');
printjson(db.users.findOne({email: 'sales@codersinflow.com'}));