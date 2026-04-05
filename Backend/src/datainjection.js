
const FinancialRecord = require('./models/financialRecord');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const {connectDB} = require('./utils/mongodb');

connectDB();
async function seedAll() {
const hashPassword = await bcrypt.hash("password123", 10);
const users = [
  {
    username: "Admin Naveen",
    email: "admin@test.com",
    password: hashPassword,
    role: "admin"
  },
  {
    username: "Analyst Naveen",
    email: "analyst@test.com",
    password: hashPassword,
    role: "analyst"
  },
  {
    username: "Normal User Naveen",
    email: "user@test.com",
    password: hashPassword,

  }
];

  await User.deleteMany({});
  await FinancialRecord.deleteMany({});


  const createdUsers = await User.insertMany(users);

  const adminId = createdUsers[0]._id;
  const analystId = createdUsers[1]._id;
  const userId = createdUsers[2]._id;
const sampleData = [
  // Jan
  { amount: 50000, type: "income", category: "salary", date: new Date("2026-01-01"), createdBy: adminId },
  { amount: 3000, type: "expense", category: "food", date: new Date("2026-01-03"), createdBy: adminId },
  { amount: 1500, type: "expense", category: "transport", date: new Date("2026-01-05"), createdBy: adminId },

  // Feb
  { amount: 52000, type: "income", category: "salary", date: new Date("2026-02-01"), createdBy: adminId },
  { amount: 4000, type: "expense", category: "food", date: new Date("2026-02-04"), createdBy: adminId },
  { amount: 2000, type: "expense", category: "shopping", date: new Date("2026-02-10"), createdBy: adminId },

  // Mar
  { amount: 55000, type: "income", category: "salary", date: new Date("2026-03-01"), createdBy: adminId },
  { amount: 8000, type: "income", category: "freelance", date: new Date("2026-03-15"), createdBy: adminId },
  { amount: 3500, type: "expense", category: "food", date: new Date("2026-03-06"), createdBy: adminId },
  { amount: 2500, type: "expense", category: "bills", date: new Date("2026-03-20"), createdBy: adminId },

  // Apr
  { amount: 50000, type: "income", category: "salary", date: new Date("2026-04-01"), createdBy: adminId },
  { amount: 4500, type: "expense", category: "food", date: new Date("2026-04-02"), createdBy: adminId },
  { amount: 3000, type: "expense", category: "shopping", date: new Date("2026-04-10"), createdBy: adminId },

  // May
  { amount: 53000, type: "income", category: "salary", date: new Date("2026-05-01"), createdBy: adminId },
  { amount: 7000, type: "expense", category: "travel", date: new Date("2026-05-12"), createdBy: adminId },

  // Jun
  { amount: 60000, type: "income", category: "salary", date: new Date("2026-06-01"), createdBy: adminId },
  { amount: 5000, type: "expense", category: "food", date: new Date("2026-06-03"), createdBy: adminId },
  { amount: 3000, type: "expense", category: "bills", date: new Date("2026-06-15"), createdBy: adminId },

  // Some deleted records (important for testing)
  { amount: 10000, type: "expense", category: "shopping", date: new Date("2026-03-10"), createdBy: adminId, isDeleted: true },
];

  
  const records = sampleData.map(item => ({
    ...item,
    createdBy: adminId
  }));

  await FinancialRecord.insertMany(records);

  console.log(" Users + Records seeded successfully");

  process.exit();
}
    seedAll().then(() => process.exit()).catch(err => {
        console.error("Error seeding data:", err);
        process.exit(1);
    });

